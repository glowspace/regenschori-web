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
                v-if="true"
                class="btn btn-secondary"
                href="#noty"
            >
                <i class="fas fa-file-alt"></i><span class="d-none d-sm-inline pl-2">Noty</span>
            </a>
            <a
                v-if="true"
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
            v-if="true"
        >
            <h2 class="h4">Noty</h2>
        </div>
        <div
            id="nahravky"
            v-if="true"
        >
            <h2 class="h4">Nahrávky</h2>
        </div>
    </div>
</template>

<script>
import TranslationLine from '@bit/proscholy.utilities.translation-line/TranslationLine.vue';

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
        renderTranslations: {
            get() {
                // if SongLyric is an arrangement, then .song property is undefined
                return (this.song_lyric.song && this.song_lyric.song.song_lyrics.length > 1);
            }
        }
    }
};
</script>
