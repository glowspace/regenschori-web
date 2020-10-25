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
                v-if="scores.length"
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
                v-if="song_lyric.lyrics_no_chords"
                class="btn btn-secondary"
                href="#text"
                @click.prevent="scrollTo('#text')"
            >
                <i class="fas fa-align-left"></i><span class="d-none d-sm-inline pl-2">Text</span>
            </a>
            <div class="float-right">
                <a
                    class="btn btn-secondary"
                    target="_blank"
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
                    target="_blank"
                    title="Upravit"
                    :href="[song_lyric ? adminUrl + '/song/' + song_lyric.id + '/edit' : '']"
                >
                    <i class="fas fa-pen"></i>
                </a>
                <a
                    v-if="!song_lyric.only_regenschori"
                    class="btn btn-secondary"
                    target="_blank"
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
        <!-- arrangements -->
        <div v-if="scores.length">
            <div id="noty" class="anchor"></div>
            <h2 class="h4">Noty</h2>
            <div class="row mx-0">
                <table class="table border">
                    <tbody>
                        <external
                            v-for="(external, index) in scores"
                            :key="index"
                            :line="true"
                            :index="index"
                            :external="external"
                            :song-name="song_lyric.name"
                        ></external>
                    </tbody>
                </table>
                <div
                    v-if="song_lyric.lilypond_svg"
                    v-html="song_lyric.lilypond_svg"
                    class="pt-3 w-100 text-center"
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
                        :line="false"
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

import TranslationLine from '@bit/proscholy.utilities.translation-line/TranslationLine.vue';
import External from '@bit/proscholy.utilities.external/External.vue';

export default {
    name: 'SongBox',

    components: {
        TranslationLine,
        External
    },

    props: ['song_lyric'],

    data() {
        return {
            adminUrl: process.env.adminUrl
        };
    },

    computed: {
       recordings: {
            get() {
                return this.song_lyric.externals.filter(ext =>
                    ext.content_type == "RECORDING"
                );
            }
        },

        scores: {
            get() {
                return this.song_lyric.externals.filter(ext =>
                    ext.content_type == "SCORE"
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
