<template>
    <div>
        <div class="tools mb-4 mx-n4 py-1 px-4 bg-light clearfix">
            <a
                v-if="renderTranslations"
                class="btn btn-secondary"
                href="#preklady"
                @click.prevent="scrollTo('#preklady')"
            >
                <i class="fas fa-language"></i><span class="d-none d-sm-inline pl-2">Překlady</span>
            </a>
            <a
                v-if="song_lyric.arrangements.length"
                class="btn btn-secondary"
                href="#aranze"
                @click.prevent="scrollTo('#aranze')"
            >
                <i class="fas fa-edit"></i><span class="d-none d-sm-inline pl-2">Aranže</span>
            </a>
            <a
                v-if="scores.length || currentSource.lilypond_svg"
                class="btn btn-secondary"
                href="#noty"
                @click.prevent="scrollTo('#noty')"
            >
                <i class="fas fa-file-alt"></i><span class="d-none d-sm-inline pl-2">Noty</span>
            </a>
            <a
                v-if="recordings.length"
                class="btn btn-secondary"
                href="#nahravky"
                @click.prevent="scrollTo('#nahravky')"
            >
                <i class="fas fa-headphones"></i><span class="d-none d-sm-inline pl-2">Nahrávky</span>
            </a>
            <a
                v-if="otherExternals.length"
                class="btn btn-secondary"
                href="#dalsi"
                @click.prevent="scrollTo('#dalsi')"
            >
                <i class="fas fa-link"></i><span class="d-none d-sm-inline pl-2">Další materiály</span>
            </a>
            <a
                v-if="song_lyric.lyrics_no_chords"
                class="btn btn-secondary"
                href="#text"
                @click.prevent="scrollTo('#text')"
            >
                <i class="fas fa-align-left"></i><span class="d-none d-sm-inline pl-2">Text</span>
            </a>
            <a
                v-if="song_lyric.has_chords"
                class="btn btn-secondary"
                :href="[song_lyric ? song_lyric.public_url : '']"
            >
                <i class="fas fa-guitar"></i><span class="d-none d-sm-inline pl-2">Akordy</span>
            </a>
            <div class="float-right">
                <a
                    class="btn btn-secondary"
                    title="Nahlásit"
                    :href="[
                        song_lyric
                            ? 'https://docs.google.com/forms/d/e/1FAIpQLSdTaOCzzlfZmyoCB0I_S2kSPiSZVGwDhDovyxkWB7w2LfH0IA/viewform?entry.2038741493=' +
                            encodeURI(song_lyric.name) + '%20(Regenschori)'
                            : ''
                    ]"
                >
                    <i class="fas fa-exclamation-triangle"></i>
                </a>
                <a
                    class="btn btn-secondary"
                    title="Upravit"
                    :href="[song_lyric ? adminUrl + '/song/' + song_lyric.id + '/edit' : '']"
                >
                    <i class="fas fa-pen"></i>
                </a>
                <a
                    v-if="!song_lyric.only_regenschori"
                    class="btn btn-secondary"
                    title="Otevřít ve Zpěvníku ProScholy.cz"
                    :href="[song_lyric ? song_lyric.public_url : '']"
                >
                    <i class="fas fa-guitar"></i>
                </a>
            </div>
        </div>
        <div v-if="renderTranslations">
            <div id="preklady" class="anchor"></div>
            <h2 class="h4">Překlady</h2>
            <table class="table border">
                <tbody>
                    <translation-line
                        v-for="(translation,
                        index) in song_lyric.song.song_lyrics.filter(
                            lyric => lyric.type == 0
                        )"
                        :translation="translation"
                        :original_name="song_lyric.name"
                        :key="index + '0'"
                    >
                    </translation-line>
                    <translation-line
                        v-for="(translation,
                        index) in song_lyric.song.song_lyrics.filter(
                            lyric => lyric.type == 2
                        )"
                        :translation="translation"
                        :original_name="song_lyric.name"
                        :key="index + '1'"
                    >
                    </translation-line>
                    <translation-line
                        v-for="(translation,
                        index) in song_lyric.song.song_lyrics.filter(
                            lyric => lyric.type == 1
                        )"
                        :translation="translation"
                        :original_name="song_lyric.name"
                        :key="index + '2'"
                    >
                    </translation-line>
                </tbody>
            </table>
        </div>
        <div v-if="song_lyric.arrangements.length">
            <div id="aranze" class="anchor"></div>
            <h2 class="h4">Aranže</h2>
            <div class="mt-3 mx-n4">
                <ul class="nav nav-tabs pr-4">
                    <li class="nav-item" :key="song_lyric.id">
                        <button
                            type="button"
                            :class="['nav-link ml-4', {active: song_lyric.id === currentSource.id}]"
                            @click="currentSource = song_lyric"
                        >Originál ({{ song_lyric.name }})</button>
                    </li>
                    <li class="nav-item" v-for="arrangement in song_lyric.arrangements" :key="arrangement.id">
                        <button
                            type="button"
                            :class="['nav-link', {active: arrangement.id === currentSource.id}]"
                            @click="currentSource = arrangement"
                        >{{ arrangement.name }}</button>
                    </li>
                </ul>
            </div>
            <div v-if="song_lyric.id !== currentSource.id" class="my-3">
                <span v-if="currentSource.authors_pivot.length == 0">Autor aranže neznámý</span>
                <span v-else>
                    <span v-if="currentSource.authors_pivot.length == 1">Autor aranže:</span>
                    <span v-else>Autoři aranže:</span>
                    <span v-for="(ap, key) in currentSource.authors_pivot" :key="key3">
                        <span v-if="key">,</span> <nuxt-link :to="ap.author.public_route">{{ ap.author.name }}</nuxt-link>
                    </span>
                </span>
            </div>
        </div>
        <div v-if="scores.length || currentSource.lilypond_svg">
            <div id="noty" class="anchor"></div>
            <h2 class="h4">Noty</h2>
            <div>
                <div class="row">
                    <div
                        class="col-md-6"
                        v-for="(external, index) in scores"
                        :key="index"
                    >
                        <external
                            :is-regenschori="true"
                            :index="index"
                            :external="external"
                            :song-name="song_lyric.name"
                        ></external>
                    </div>
                </div>
                <div
                    v-if="currentSource.lilypond_svg"
                    v-html="currentSource.lilypond_svg"
                    class="pt-3 w-100 text-center lilypond-container"
                    style="pointer-events:none"
                ></div>
            </div>
        </div>
        <div v-if="recordings.length">
            <div id="nahravky" class="anchor"></div>
            <h2 class="h4">Nahrávky</h2>
            <div class="row">
                <div
                    class="col-md-6"
                    v-for="(external, index) in recordings"
                    :key="index"
                >
                    <external
                        :is-regenschori="true"
                        :index="index"
                        :external="external"
                        :song-name="song_lyric.name"
                    ></external>
                </div>
            </div>
        </div>
        <div v-if="otherExternals.length">
            <div id="dalsi" class="anchor"></div>
            <h2 class="h4">Další materiály</h2>
            <div class="row">
                <div
                    class="col-md-6"
                    v-for="(external, index) in otherExternals"
                    :key="index"
                >
                    <external
                        :is-regenschori="true"
                        :index="index"
                        :external="external"
                        :song-name="song_lyric.name"
                    ></external>
                </div>
            </div>
        </div>
        <div v-if="song_lyric.lyrics_no_chords">
            <div id="text" class="anchor"></div>
            <h2 class="h4">Text</h2>
            <div class="d-inline-block border py-3 px-4" style="white-space:pre">{{ song_lyric.lyrics_no_chords }}</div>
        </div>
    </div>
</template>

<script>
import { clone } from 'lodash';

import SongAuthorLabel from './SongAuthorLabel';
import TranslationLine from '@bit/proscholy.utilities.translation-line/TranslationLine.vue';
import External from '@bit/proscholy.utilities.external/External.vue';

export default {
    name: 'SongBox',

    components: {
        SongAuthorLabel,
        TranslationLine,
        External
    },

    props: ['song_lyric'],

    data() {
        return {
            adminUrl: process.env.adminUrl,
            currentSource: this.song_lyric
        };
    },

    computed: {
       recordings: {
            get() {
                return this.currentSource.externals.filter(ext =>
                    ext.content_type == "RECORDING"
                );
            }
        },

        scores: {
            get() {
                return this.currentSource.externals.filter(ext =>
                    ext.content_type == "SCORE"
                );
            }
        },

        otherExternals: {
            get() {
                return this.currentSource.externals.filter(ext =>
                    ext.content_type != "RECORDING" && ext.content_type != "SCORE"
                );
            }
        },

        renderTranslations: {
            get() {
                // if SongLyric is an arrangement, then .song property is undefined
                return (this.song_lyric.song && this.song_lyric.song.song_lyrics.length > 1);
            }
        },

        mediaTypes: {
            get() {
                var arrayOfTypes = ["spotify", "soundcloud", "youtube", "file/mp3", "file/wav", "file/aac", "file/flac"];
                var returnArray = [];
                for (let i = 0; i < arrayOfTypes.length; i++) {
                    returnArray[i] = this.recordings.filter(ext => ext.media_type == arrayOfTypes[i]).length;
                }
                return returnArray;
            }
        }
    },

    mounted() {
        if (this.$route.hash) {
            this.scrollTo(this.$route.hash);
        }
    },

    methods: {
        scrollTo(el) {
            var element = document.querySelector(el);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
            if (el.charAt(0) == '#') {
                history.pushState(null, null, el);
            }
        }
    }
};
</script>
