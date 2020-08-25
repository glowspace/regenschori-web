<template>
    <div :class="[{'song-tags--init-filters--visible': !$apollo.loading}, 'song-tags song-tags--init-filters']">
        <a
            v-show="randomTags.length"
            class="tag tag--filter-icon px-1"
            @click="$emit('input', null);"
        ><i class="fa fa-filter text-white"></i></a>
        <client-only>
            <span>
                <a
                    class="tag border-0"
                    v-for="tag in randomTags"
                    :key="'tag-' + tag.id"
                    @click="selectTag(tag)"
                    >{{ tag.name }}</a
                >
            </span>
        </client-only>
    </div>
</template>

<script>
import gql from 'graphql-tag';
import Vue from 'vue'
import fetchFiltersQuery from './fetchFiltersQuery.graphql';

export default {
    props: ['selected-tags'],

    data() {
        return {
            selected_tags: {}
        };
    },

    apollo: {
        tags_generic: {
            query: fetchFiltersQuery,
            prefetch: false
        },
        tags_liturgy_part: {
            query: fetchFiltersQuery,
            prefetch: false
        },
        tags_liturgy_period: {
            query: fetchFiltersQuery,
            prefetch: false
        },
        tags_saints: {
            query: fetchFiltersQuery,
            prefetch: false
        }
    },

    computed: {
        usefulTags() {
            // do not include regenschori tag types
            return [
                ...this.tags_generic,
                ...this.tags_liturgy_part,
                ...this.tags_liturgy_period,
                ...this.tags_saints
            ];
        },

        randomTags() {
            if (process.client && this.$apollo.loading === false) {
                return this.shuffleArray(this.usefulTags).slice(0, 10);
            } else {
                return [];
            }
        }
    },

    methods: {
        selectTag(tag) {
            Vue.set(this.selected_tags, tag.id, true);

            // notify the parent that sth has changed
            this.$emit('update:selected-tags', this.selected_tags);
            this.$emit('input', null);
        },

        shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
    }
};
</script>
