<template>
    <div class="align-self-end align-self-sm-start d-sm-flex flex-column pb-sm-0 mr-n3 position-relative">
        <a
            class="btn m-0"
            title="Upravit píseň"
            target="_blank"
            :href="[song_lyric ? adminUrl + '/song/' + song_lyric.id + '/edit' : '']"
        >
            <i class="fas fa-pen p-0"></i>
        </a>
        <!-- <a
            class="btn btn-secondary m-0"
            :title="[
                !starred
                    ? 'Označit píseň hvězdičkou'
                    : 'Zrušit hvězdičku'
            ]"
            @click="toggleStar"
            ><i class="fa-star" :class="[starred ? 'fas' : 'far']"></i
        ></a> -->
        <a
            class="btn btn-secondary m-0"
            :title="[
                !fullscreen
                    ? 'Zobrazit na celou obrazovku'
                    : 'Zrušit zobrazení na celou obrazovku'
            ]"
            @click="toggleFullscreen"
            ><i
                class="fas"
                :class="[fullscreen ? 'fa-compress' : 'fa-expand']"
            ></i
        ></a>
        <!-- <nuxt-link
            class="btn btn-secondary m-0"
            title="Aktivovat režim promítání"
            :to="'/promitat' + song_lyric.public_route"
            ><i class="fas fa-desktop"></i
        ></nuxt-link>
        <a
            class="btn btn-secondary m-0"
            :title="[
                !columns
                    ? 'Zobrazit text ve sloupcích'
                    : 'Zrušit zobrazení ve sloupcích'
            ]"
            @click="toggleColumns"
            ><i
                class="fas"
                :class="[columns ? 'fa-align-justify' : 'fa-columns']"
            ></i
        ></a> -->
        <a
            class="btn btn-secondary m-0 nosleep"
            :title="[
                !nosleep
                    ? 'Blokovat zhasínání displeje'
                    : 'Přestat blokovat zhasínání displeje'
            ]"
            @click="toggleNosleep"
            ><i class="fa-sun" :class="[nosleep ? 'far' : 'fas']"></i
        ></a>
        <a class="btn btn-secondary nosleep-caption">{{
            !nosleep
                ? 'zhasínání&nbsp;displeje není&nbsp;blokováno'
                : 'zhasínání&nbsp;displeje je&nbsp;blokováno'
        }}</a>
    </div>
</template>

<script>
import NoSleep from 'nosleep.js';

export default {
    props: ['song_lyric'],

    data() {
        return {
            fullscreen: false,
            nosleep: false,
            noSleeper: process.client ? new NoSleep() : null,
            adminUrl: process.env.adminUrl
        };
    },

    methods: {
        toggleFullscreen() {
            if (process.client) {
                var element = document.documentElement;
                var isFullscreen =
                    document.webkitIsFullScreen ||
                    document.mozFullScreen ||
                    false;
                element.requestFullScreen =
                    element.requestFullScreen ||
                    element.webkitRequestFullScreen ||
                    element.mozRequestFullScreen ||
                    function() {
                        return false;
                    };
                document.cancelFullScreen =
                    document.cancelFullScreen ||
                    document.webkitCancelFullScreen ||
                    document.mozCancelFullScreen ||
                    function() {
                        return false;
                    };
                if (isFullscreen) {
                    document.cancelFullScreen();
                } else {
                    element.requestFullScreen();
                }
            }
        },

        toggleNosleep() {
            this.nosleep = !this.nosleep;

            if (this.nosleep) {
                this.noSleeper.enable();
            } else {
                this.noSleeper.disable();
            }
        },

        fullscreenChanged() {
            this.fullscreen = !this.fullscreen;
        }
    },

    mounted() {
        if (process.client) {
            document.addEventListener(
                'fullscreenchange',
                this.fullscreenChanged
            );
            document.addEventListener(
                'mozfullscreenchange',
                this.fullscreenChanged
            );
            document.addEventListener(
                'webkitfullscreenchange',
                this.fullscreenChanged
            );
            document.addEventListener(
                'msfullscreenchange',
                this.fullscreenChanged
            );
        }
    }
};
</script>
