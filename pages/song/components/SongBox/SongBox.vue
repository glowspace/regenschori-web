<template>
    <div class="row">
        <div class="col-lg-9">
            <div class="card card-lyrics" id="cardLyrics">
                <div class="card-header p-1 song-links">
                    <div class="d-inline-block">
                        <a
                            v-if="renderScores"
                            class="btn btn-secondary"
                            :class="{ chosen: topMode == 1 }"
                            @click="topMode = topMode == 1 ? 0 : 1"
                        >
                            <i class="fas fa-file-alt"></i>
                            <span class="d-none d-sm-inline">Noty</span>
                        </a>
                        <a
                            v-if="renderTranslations"
                            class="btn btn-secondary"
                            :class="{ chosen: topMode == 2 }"
                            @click="topMode = topMode == 2 ? 0 : 2"
                        >
                            <i class="fas fa-language"></i>
                            <span class="d-none d-sm-inline">Překlady</span>
                        </a>
                    </div>
                    <div class="float-right">
                        <!-- <a class="btn btn-secondary">
                            <i class="fas fa-folder-plus"></i>
                            <span class="d-none d-sm-inline">Do seznamu</span>
                        </a>
                        <a class="btn btn-secondary">
                            <i class="fas fa-file-export"></i>
                            <span class="d-none d-sm-inline">Export</span>
                        </a>
                        <a class="btn btn-secondary">
                            <i class="fas fa-share-alt"></i>
                            <span class="d-none d-sm-inline">Sdílet</span>
                        </a> -->
                        <a
                            class="btn"
                            title="Nahlásit"
                            target="_blank"
                            :href="[
                                song_lyric
                                    ? 'https://docs.google.com/forms/d/e/1FAIpQLSdTaOCzzlfZmyoCB0I_S2kSPiSZVGwDhDovyxkWB7w2LfH0IA/viewform?entry.2038741493=' +
                                    encodeURI(song_lyric.name)
                                    : ''
                            ]"
                        >
                            <i class="fas fa-exclamation-triangle p-0"></i>
                        </a>
                    </div>

                    <!-- scores -->
                    <div v-show="topMode === 1">
                        <div class="overflow-auto toolbox toolbox-u">
                            <a
                                class="btn btn-secondary float-right fixed-top position-sticky cross"
                                v-on:click="topMode = 0"
                            >
                                <i class="fas fa-times pr-0"></i>
                            </a>
                            <div class="row ml-0" v-if="!$apollo.loading">
                                <table class="table m-0 w-auto">
                                    <tbody>
                                        <external-line
                                            v-for="(score, index) in scores"
                                            v-bind:key="index"
                                            :index="index"
                                            :url="score.url"
                                            :download-url="score.download_url"
                                            :song-name="song_lyric.name"
                                            :name="score.public_name"
                                            :type="score.type"
                                            :authors="score.authors"
                                        ></external-line>
                                    </tbody>
                                </table>
                            </div>
                            <div class="row" v-else>
                                <span v-if="$apollo.loading">
                                    <i>Načítám...</i>
                                </span>

                                <span v-else>
                                    <i>Žádné noty nebyly nalezeny.</i>
                                </span>
                            </div>
                        </div>
                    </div>
                    <!-- translations -->
                    <div v-show="topMode === 2">
                        <div class="overflow-auto toolbox toolbox-u">
                            <a
                                class="btn btn-secondary float-right fixed-top position-sticky cross"
                                v-on:click="topMode = 0"
                            >
                                <i class="fas fa-times pr-0"></i>
                            </a>
                            <div class="row ml-0" v-if="!$apollo.loading">
                                <table class="table m-0 w-auto">
                                    <tbody>
                                        <tr>
                                            <th></th>
                                            <th>Název</th>
                                            <th>Typ</th>
                                            <th>Autor (překladu)</th>
                                        </tr>
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

                            <div class="row" v-else>
                                <span v-if="$apollo.loading">
                                    <i>Načítám...</i>
                                </span>
                                <span v-else>
                                    <i>Žádné překlady nebyly nalezeny.</i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="card-body py-2 pl-3 overflow-hidden">
                        <div
                            class="d-flex align-items-start justify-content-between flex-column-reverse flex-sm-row"
                        >
                            <div
                                id="song-lyrics"
                                :class="{
                                    'p-1': true,
                                    'song-lyrics-extended':
                                        chordSharedStore.chordMode == 2
                                }"
                            >
                                <span v-if="song_lyric.has_lyrics">
                                    <a
                                        class="btn btn-secondary bg-transparent p-0 mb-3"
                                        v-if="
                                            chordSharedStore.nChordModes != 1 &&
                                                chordSharedStore.chordMode == 0
                                        "
                                        @click="chordSharedStore.chordMode = 2"
                                        >Zobrazit akordy</a
                                    >
                                    <a
                                        class="btn btn-secondary bg-transparent p-0 mb-3"
                                        v-if="chordSharedStore.chordMode != 0"
                                        @click="chordSharedStore.chordMode = 0"
                                        >Skrýt akordy</a
                                    >
                                    <div
                                        v-if="
                                            !$apollo.loading &&
                                                song_lyric.capo > 0 &&
                                                chordSharedStore.chordMode != 0
                                        "
                                        class="mb-2"
                                    >
                                        <i>capo: {{ song_lyric.capo }}</i>
                                    </div>
                                    <!-- here goes the song lyrics -->
                                    <song-lyric-parts
                                        :song-id="song_lyric.id"
                                        :font-size-percent="chordSharedStore.fontSizePercent"
                                        @loaded="isScrollable(true);"
                                    ></song-lyric-parts>
                                </span>
                                <span v-else :style="{ fontSize: chordSharedStore.fontSizePercent + '%' }">Text písně připravujeme.</span>
                            </div>
                            <right-controls :song_lyric="song_lyric"></right-controls>
                        </div>
                    </div>

                    <div
                        class="controls fixed-bottom position-sticky p-1 clearfix"
                        v-bind:class="{ 'card-footer': controlsDisplay }"
                    >
                        <div v-show="bottomMode == 1 && controlsDisplay">
                            <div class="overflow-auto toolbox">
                                <a
                                    class="btn btn-secondary float-right"
                                    v-on:click="bottomMode = 0"
                                >
                                    <i class="fas fa-times pr-0"></i>
                                </a>
                                <div
                                    class="toolbox-item"
                                    v-if="chordSharedStore.nChordModes != 1"
                                    :class="{
                                        'hidden-toolbox-item':
                                            chordSharedStore.chordMode == 0
                                    }"
                                >
                                    <transposition
                                        v-model="chordSharedStore.transposition"
                                    ></transposition>
                                </div>

                                <div
                                    class="toolbox-item"
                                    v-if="chordSharedStore.nChordModes != 1"
                                    :class="{
                                        'hidden-toolbox-item':
                                            chordSharedStore.chordMode == 0
                                    }"
                                >
                                    <chord-sharp-flat
                                        v-model="chordSharedStore.useFlatScale"
                                    ></chord-sharp-flat>
                                </div>

                                <div
                                    class="toolbox-item"
                                    v-if="chordSharedStore.nChordModes != 1"
                                >
                                    <chord-mode
                                        v-model="chordSharedStore.chordMode"
                                        :n-chord-modes="
                                            chordSharedStore.nChordModes
                                        "
                                    ></chord-mode>
                                </div>

                                <div class="toolbox-item">
                                    <font-sizer
                                        v-model="chordSharedStore.fontSizePercent"
                                    ></font-sizer>
                                </div>
                            </div>
                        </div>
                        <!-- media -->
                        <div v-show="bottomMode == 2 && controlsDisplay">
                            <div class="overflow-auto media-card toolbox">
                                <a
                                    class="btn btn-secondary float-right fixed-top position-sticky cross"
                                    v-on:click="bottomMode = 0"
                                >
                                    <i class="fas fa-times pr-0"></i>
                                </a>
                                <div
                                    class="row ml-0 pt-2"
                                    v-if="hasExternalsOrFiles && !$apollo.loading"
                                >
                                    <div
                                        class="col-md-6"
                                        v-for="external in mediaExternals"
                                        v-bind:key="external.id"
                                    >
                                        <external-view
                                            :url="external.url"
                                            :media-id="external.media_id"
                                            :type="external.type"
                                            :authors="external.authors"
                                        ></external-view>
                                    </div>
                                    <div
                                        class="col-md-6"
                                        v-for="file in mediaFiles"
                                        v-bind:key="file.id"
                                    >
                                        <external-view
                                            :url="file.url"
                                            :download-url="file.download_url"
                                            :media-id="file.media_id"
                                            :type="fileTypeConvert(file.type)"
                                            :authors="file.authors"
                                        ></external-view>
                                    </div>
                                </div>
                                <div v-else>
                                    <span v-if="$apollo.loading">
                                        <i>Načítám...</i>
                                    </span>
                                    <span v-else>
                                        <i>Žádná nahrávka nebyla nalezena.</i>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <!-- control buttons -->
                        <span v-show="controlsDisplay">
                            <a
                                class="btn btn-secondary"
                                v-bind:class="{ chosen: bottomMode === 1 }"
                                v-on:click="bottomMode = bottomMode === 1 ? 0 : 1"
                            >
                                <i class="fas fa-sliders-h"></i>
                                <span class="d-none d-sm-inline">Nástroje</span>
                            </a>
                            <a
                                class="btn btn-secondary"
                                v-if="renderMedia"
                                v-bind:class="{ chosen: bottomMode == 2 }"
                                v-on:click="bottomMode = bottomMode == 2 ? 0 : 2"
                            >
                                <i class="fas fa-headphones"></i>
                                <span class="d-none d-sm-inline">Nahrávky</span>
                            </a>
                            <div
                                class="d-inline-block btn-group m-0"
                                role="group"
                                v-bind:class="{ chosen: autoscroll }"
                                v-if="scrollable"
                            >
                                <a
                                    class="btn btn-secondary"
                                    v-on:click="autoscroll = !autoscroll"
                                >
                                    <i
                                        class="fas"
                                        v-bind:class="[
                                            autoscroll
                                                ? 'pr-0 fa-stop-circle'
                                                : 'fa-arrow-circle-down'
                                        ]"
                                    ></i>
                                    <span
                                        class="d-none d-sm-inline"
                                        v-if="!autoscroll"
                                        >Rolovat</span
                                    > </a
                                ><a
                                    class="btn btn-secondary"
                                    v-if="autoscroll"
                                    @click="autoscrollNum--"
                                    :class="{ disabled: autoscrollNum == 1 }"
                                    >&minus;</a
                                ><a
                                    class="btn btn-secondary"
                                    v-if="autoscroll"
                                    @click="autoscrollNum++"
                                    :class="{ disabled: autoscrollNum == 20 }"
                                    >&plus;</a
                                >
                            </div>
                        </span>
                        <a
                            class="btn btn-secondary float-right"
                            :title="[
                                controlsDisplay ? 'Skrýt lišty' : 'Zobrazit lišty'
                            ]"
                            v-on:click="controlsToggle"
                        >
                            <i
                                class="fas pr-0"
                                v-bind:class="[
                                    controlsDisplay
                                        ? 'fa-chevron-right'
                                        : 'fa-chevron-left'
                                ]"
                            ></i>
                        </a>
                    </div>
                </div>
                <div class="card-footer p-1 song-links">
                    <div class="px-3 py-2 d-inline-block">Regenschori <img
                    src="/img/logo_v2.png" width="20px" /> {{ new Date().getFullYear() }}</div>
                    <div class="float-right">
                        <a
                            class="btn btn-secondary"
                            target="_blank"
                            :href="[
                                song_lyric
                                    ? 'https://docs.google.com/forms/d/e/1FAIpQLSdTaOCzzlfZmyoCB0I_S2kSPiSZVGwDhDovyxkWB7w2LfH0IA/viewform?entry.2038741493=' +
                                    encodeURI(song_lyric.name)
                                    : ''
                            ]"
                        >Nahlásit</a>
                        <a
                            class="btn btn-secondary"
                            target="_blank"
                            :href="[song_lyric ? adminUrl + '/song/' + song_lyric.id + '/edit' : '']"
                        >Upravit</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-3">
            <div
                class="card card-blue mb-3 d-none d-lg-flex"
                v-on:click="topMode = 1"
                v-if="renderScores"
            >
                <div class="card-header media-opener py-2 rounded"><i class="fas fa-file-alt"></i> Zobrazit notové zápisy</div>
            </div>
            <div
                class="card card-green mb-3 d-none d-lg-flex"
                v-on:click="bottomMode = 2"
                v-if="renderMedia"
            >
                <div class="card-header media-opener py-2"><i class="fas fa-headphones"></i> Dostupné nahrávky<span class="d-none d-xl-inline"> a videa</span></div>
                <div class="media-opener" v-if="mediaTypes[0]"><i class="fab fa-spotify text-success"></i> Spotify</div>
                <div class="media-opener" v-if="mediaTypes[1]"><i class="fab fa-soundcloud" style="color: orangered;"></i> SoundCloud</div>
                <div class="media-opener" v-if="mediaTypes[3]"><i class="fas fa-music"></i> MP3</div>
                <div class="media-opener" v-if="mediaTypes[2]"><i class="fab fa-youtube text-danger"></i> YouTube</div>
            </div>
            <div class="card mb-3 d-none d-lg-flex" v-on:click="bottomMode = 1">
                <div class="card-header media-opener py-2 rounded bg-secondary text-white"><i class="fas fa-sliders-h"></i> Nastavit zobrazení</div>
                <div
                    class="media-opener"
                    v-if="chordSharedStore.nChordModes != 1"
                >
                    <i class="fas fa-angle-right"></i> Transpozice: <span class="float-right">{{
                        chordSharedStore.transposition
                    }}</span>
                </div>
                <div
                    class="media-opener"
                    v-if="chordSharedStore.nChordModes != 1"
                >
                    <i class="fas fa-angle-right"></i> Posuvky: <span class="float-right">{{
                        chordSharedStore.useFlatScale ? '♭' : '#'
                    }}</span>
                </div>
                <div
                    class="media-opener"
                    v-if="chordSharedStore.nChordModes != 1"
                >
                    <i class="fas fa-angle-right"></i> Akordy: <span class="float-right">{{
                        chordSharedStore.chordMode ? '+' : '–'
                    }}</span>
                </div>
                <div class="media-opener">
                    <i class="fas fa-angle-right"></i> Velikost písma: <span class="float-right">{{
                        (chordSharedStore.fontSizePercent - 100) / 10
                    }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { store } from '../../store.js';
import { clone } from 'lodash';

import FontSizer from './FontSizer';
import ChordMode from './ChordMode';
import ChordSharpFlat from './ChordSharpFlat';
import RightControls from './RightControls';
import Transposition from './Transposition';
import TranslationLine from './TranslationLine.vue';
import SongLyricParts from '../Renderer/SongLyricParts.vue';
import ExternalView from '@bit/proscholy.utilities.external-view/ExternalView.vue';
import ExternalLine from '@bit/proscholy.utilities.external-line/ExternalLine.vue';

/**
 * This component renders white box on song detail page.
 *
 * It contains lyrics and another stuff.
 */
export default {
    props: [
        'song_lyric'
    ],

    components: {
        FontSizer,
        ChordMode,
        ChordSharpFlat,
        ExternalView,
        ExternalLine,
        RightControls,
        Transposition,
        TranslationLine,
        SongLyricParts
    },

    data() {
        // use this only in SongBox and Chord component
        // use v-model to bind data from every other component
        return {
            controlsDisplay: true,
            bottomMode: 0,
            topMode: 0,
            autoscroll: false,
            autoscrollNum: 10,
            scrolldelay: null,
            fullscreen: false,
            selectedScoreIndex: 0,
            scrollable: true,

            chordSharedStore: store,
            adminUrl: process.env.adminUrl
        };
    },

    watch: {
        autoscroll: function() {
            this.setScroll(this.autoscrollNum, this.autoscroll);
        },
        autoscrollNum: function() {
            this.setScroll(this.autoscrollNum, this.autoscroll);
        }
    },

    destroyed() {
        this.setScroll(this.autoscrollNum, false);
    },

    computed: {
        hasExternalsOrFiles: {
            get() {
                return (
                    this.song_lyric &&
                    (this.song_lyric.externals || this.song_lyric.files) &&
                    (this.song_lyric.externals.length ||
                        this.song_lyric.files.length)
                );
            }
        },

        mediaExternals: {
            get() {
                if (!this.hasExternalsOrFiles) return [];

                return this.song_lyric.externals.filter(ext =>
                    [1, 2, 3, 7].includes(ext.type)
                );
            }
        },

        mediaFiles: {
            get() {
                if (!this.hasExternalsOrFiles) return [];

                return this.song_lyric.files.filter(file =>
                    [1, 2, 3, 7].includes(this.fileTypeConvert(file.type))
                );
            }
        },

        scores: {
            get() {
                // File => File with unified type
                const mapFile = file => {
                    const copy = clone(file);
                    copy.type = this.fileTypeConvert(copy.type);
                    return copy;
                };

                const filteredExternals = this.song_lyric.externals.filter(
                    ext => [4, 8, 9].includes(ext.type)
                );
                const filteredFiles = this.song_lyric.files
                    .map(mapFile)
                    .filter(file => [4, 8, 9].includes(file.type));

                return [...filteredExternals, ...filteredFiles];
            }
        },

        renderTranslations: {
            get() {
                return (this.song_lyric.song.song_lyrics.length > 1);
            }
        },

        renderMedia: {
            get() {
                return this.mediaExternals.length + this.mediaFiles.length > 0;
            }
        },

        renderScores: {
            get() {
                return this.scores.length > 0;
            }
        },

        mediaTypes: {
            get() {
                var arrayOfTypes = [1, 2, 3, 7];
                var returnArray = [];
                for (let i = 0; i < arrayOfTypes.length; i++) {
                    returnArray[i] = this.mediaExternals.filter(ext => ext.type == arrayOfTypes[i]).length
                    + this.mediaFiles.filter(file => this.fileTypeConvert(file.type) == arrayOfTypes[i]).length;
                }
                return returnArray;
            }
        }
    },

    methods: {
        controlsToggle: function() {
            if (process.client) {
                this.controlsDisplay = !this.controlsDisplay;
                document
                    .querySelector('.navbar.fixed-top')
                    .classList.toggle('d-none');
            }
        },

        fileTypeConvert: function(type) {
            const mapping = {
                1: 8,
                2: 9,
                3: 4,
                4: 7
            };

            return mapping[type] || type;
        },

        setScroll: function(num, condition) {
            clearInterval(this.scrolldelay);
            if (process.client && num > 0 && num < 21 && condition) {
                this.scrolldelay = setInterval(function() {
                    window.scrollBy(0, 1);
                    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
                        // we're at the bottom of the page
                        this.autoscroll = false;
                    }
                }.bind(this), (21 - num) * 10);
            }
        },

        isScrollable: function(initial) {
            if (process.client && document.body.scrollHeight == document.body.clientHeight) {
                // the page isn't scrollable
                this.scrollable = false;

                if (initial === true) {
                    this.bottomMode = 1;
                }
            } else {
                this.scrollable = true;
            }
        },

        keyUp: function(e) {
            if (e.key == '+') {
                if (this.autoscroll && this.autoscrollNum < 20) {
                        this.autoscrollNum++;
                }
                this.autoscroll = true;
            } else if (e.key == 'Escape') {
                this.autoscroll = false;
            } else if (e.key == '-' && this.autoscrollNum > 1) {
                this.autoscrollNum--;
            }
        }
    },

    mounted() {
        if (!this.song_lyric.has_lyrics) {
            if (this.renderMedia) {
                this.bottomMode = 2;
            }
            if (this.renderScores) {
                this.topMode = 1;
            } else if (this.renderTranslations) {
                this.topMode = 2;
            }
            this.scrollable = false;
        } else {
            window.addEventListener('resize', this.isScrollable);
            this.isScrollable(true);
            window.addEventListener('keyup', this.keyUp);
        }

        this.chordSharedStore.transposition = 0;
    }
};
</script>
