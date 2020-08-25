<template>
    <span>
        <template v-if="link">
            <a v-if="type == 'BLANK'" :href="link" target="_blank" :class="classes">
                <slot></slot>
            </a>
            <nuxt-link v-else-if="type == 'NUXTLINK'" :to="link" :class="classes">
                <slot></slot>
            </nuxt-link>
            <a
                v-else-if="['IMAGE', 'YOUTUBE', 'VIDEO', 'IFRAME', 'PDF'].includes(type)"
                :href="link" target="_blank" @click.prevent="openBP($event, link, type)" :class="classes"
            >
                <slot></slot>
            </a>
            <a v-else :href="link" :class="classes">
                <slot></slot>
            </a>
        </template>
        <span v-else :class="classes">
            <slot></slot>
        </span>
    </span>
</template>

<script>

// SUPPORTED MEDIA TYPES

// see https://github.com/proscholy/api.regenschori.cz/blob/development/graphql/news.graphql
// respectively the enum LinkType in the graphql schema

// todo import bigimage
import BigPicture from 'bigpicture';
import Bowser from 'bowser';

export default {
    props: {
        type: {
            type: String,
            default: 'NORMAL'
        },
        link: String,
        classes: String,
    },

    data() {
        return {
            browser: process.client
                ? Bowser.getParser(window.navigator.userAgent)
                : null,
            supportPdfIframesCondition: {
                mobile: {
                    chrome: '>1000'
                },
                desktop: {
                    chrome: '>70',
                    firefox: '>60'
                }
            }
        };
    },

    methods: {
        openBP(e, link, type) {
            switch (type) {
                case 'IMAGE':
                    BigPicture({el: e.target, imgSrc: link});
                    break;

                case 'YOUTUBE':
                    BigPicture({el: e.target, ytSrc: link.replace(/.*(([?&]v=)|(\/))([^?&]+).*/g, '$4')});
                    break;

                case 'VIDEO':
                    BigPicture({el: e.target, vidSrc: link});
                    break;

                case 'PDF':
                    if (this.browser.satisfies(this.supportPdfIframesCondition)) {
                        BigPicture({el: e.target, iframeSrc: link});
                    } else {
                        BigPicture({el: e.target, iframeSrc: 'https://docs.google.com/viewer?embedded=true&url=' + link});
                    }
                    break;

                default:
                    BigPicture({el: e.target, iframeSrc: link});
                    break;
            }
        }
    }
};
</script>
