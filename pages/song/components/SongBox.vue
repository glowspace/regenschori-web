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
            <div class="float-right">
                <a
                    class="btn btn-secondary"
                    target="_blank"
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
                    :href="[song_lyric ? adminUrl + '/song/' + song_lyric.id + '/edit' : '']"
                >
                    <i class="fas fa-pen"></i>
                </a>
            </div>
        </div>
        <div
            id="preklady"
            v-if="renderTranslations"
        >
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
        <div
            id="noty"
            v-if="renderScores"
        >
            <h2 class="h4">Noty</h2>
        </div>
        <div
            id="nahravky"
            v-if="renderMedia"
        >
            <h2 class="h4">Nahrávky</h2>
        </div>
    </div>
</template>

<script>
import TranslationLine from './TranslationLine';

export default {
    name: 'SongBox',

    components: {
        TranslationLine
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
    }
};
</script>
