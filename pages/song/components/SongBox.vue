<template>
    <div>
        <div class="tools mb-4 mx-n4 py-1 px-4 bg-light clearfix">
            <a
                v-if="renderTranslations"
                class="btn btn-secondary"
                href="#preklady"
            >
                <i class="fas fa-language"></i><span class="d-none d-sm-inline pl-2">Překlady</span>
            </a>
            <a
                v-if="renderScores"
                class="btn btn-secondary"
                href="#noty"
            >
                <i class="fas fa-file-alt"></i><span class="d-none d-sm-inline pl-2">Noty</span>
            </a>
            <a
                v-if="renderMedia"
                class="btn btn-secondary"
                href="#nahravky"
            >
                <i class="fas fa-headphones"></i><span class="d-none d-sm-inline pl-2">Nahrávky</span>
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
        <div v-if="renderScores">
            <div id="noty" class="anchor"></div>
            <h2 class="h4">Noty</h2>
            <div class="row mx-0">
                <table class="table border">
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
        </div>
        <div v-if="renderMedia">
            <div id="nahravky" class="anchor"></div>
            <h2 class="h4">Nahrávky</h2>
            <div class="row">
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
        </div>
    </div>
</template>

<script>
import { clone } from 'lodash';

import TranslationLine from '@bit/proscholy.utilities.translation-line/TranslationLine.vue';
import ExternalView from '@bit/proscholy.utilities.external-view/ExternalView.vue';
import ExternalLine from '@bit/proscholy.utilities.external-line/ExternalLine.vue';

export default {
    name: 'SongBox',

    components: {
        TranslationLine,
        ExternalView,
        ExternalLine
    },

    props: ['song_lyric'],

    data() {
        return {
            adminUrl: process.env.adminUrl
        };
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
                // if SongLyric is an arrangement, then .song property is undefined
                return (this.song_lyric.song && this.song_lyric.song.song_lyrics.length > 1);
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
        fileTypeConvert: function(type) {
            const mapping = {
                1: 8,
                2: 9,
                3: 4,
                4: 7
            };

            return mapping[type] || type;
        }
    }
};
</script>
