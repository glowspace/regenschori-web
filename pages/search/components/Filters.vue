<template>
    <div class="song-tags card py-1" v-if="$apollo.loading || !tags_generic">
        <template v-for="(x, key2) in [1.3, 1.2, 1.4, 1.1, 1.2, 1.3]">
            <v-skeleton-loader type="heading" class="my-3" />
            <div
                class="tag d-inline-block"
                v-for="(w, key) in [400, 200, 300, 350, 250, 350, 400, 250, 200, 450]"
                :key="key + '.' + key2"
                :style="'width:' + (w/3)*x + 'px'"
            >&nbsp;</div>
        </template>
    </div>
    <div class="song-tags filters card py-1" v-else>
        <div class="btn-group m-0 my-2 bg-light" role="group">
            <a
                class="btn btn-secondary"
                :class="{ chosen: !localShowAuthors }"
                @click="localShowAuthors = false"
                ><i class="fas fa-music"></i>písně</a
            >
            <a
                class="btn btn-secondary"
                :class="{ chosen: localShowAuthors }"
                @click="localShowAuthors = true"
                ><i class="fas fa-user"></i>autoři</a
            >
        </div><br>
        <div
            v-if="!localShowAuthors"
            class="btn-group m-0 my-2 bg-light btn-group--icons"
            role="group"
            :title="[searchString ? 'Písně jsou řazeny podle vyhledávání.' : '']"
        >
            <a
                :class="[{ chosen: !localSort }, { disabled: searchString }, 'btn btn-secondary']"
                title="řadit náhodně"
                @click="refreshSeed(); localSort = 0; localDescending = false;"
                ><i class="fas fa-random"></i>náhodně</a
            >
            <a
                :class="[{ chosen: localSort == 1 }, { disabled: searchString }, 'btn btn-secondary']"
                :title="'řadit podle abecedy ' + (localSort == 1 ? (localDescending ? 'vzestupně' : 'sestupně') : 'vzestupně')"
                @click="if (localSort == 1) {localDescending = !localDescending;} else {localSort = 1; localDescending = false;}"
                ><i :class="[ (localSort == 1) ? (!localDescending ? 'fa-sort-alpha-up' : 'fa-sort-alpha-down-alt') : 'fa-sort-alpha-up', 'fas' ]"></i
                >{{ (localSort == 1) ? (!localDescending ? 'A–Z' : 'Z–A') : 'A–Z' }}</a
            >
            <a
                :class="[{ chosen: localSort == 2 }, { disabled: searchString }, 'btn btn-secondary']"
                :title="'řadit podle čísla ' + (localSort == 2 ? (localDescending ? 'vzestupně' : 'sestupně') : 'vzestupně')"
                @click="if (localSort == 2) {localDescending = !localDescending;} else {localSort = 2; localDescending = false;}"
                ><i :class="[ (localSort == 2) ? (!localDescending ? 'fa-sort-numeric-up' : 'fa-sort-numeric-down-alt') : 'fa-sort-numeric-up', 'fas' ]"></i
                >{{ (localSort == 2) ? (!localDescending ? '1–9' : '9–1') : '1–9' }}</a
            >
        </div>
        <!-- todo: make component -->
        <div v-if="!localShowAuthors">
            <h4>Liturgie – mše svatá</h4>
            <a
                v-bind:class="[
                    'tag',
                    'tag-blue',
                    isSelectedTag(tag) ? 'tag-selected' : ''
                ]"
                v-for="tag in tags_liturgy_part"
                v-bind:key="'tag-' + tag.id"
                v-on:click="selectTag(tag)"
                >{{ tag.name }}</a
            >

            <h4>Liturgický rok</h4>
            <a
                v-bind:class="[
                    'tag',
                    'tag-blue',
                    isSelectedTag(tag) ? 'tag-selected' : ''
                ]"
                v-for="tag in tags_liturgy_period"
                v-bind:key="'tag-' + tag.id"
                v-on:click="selectTag(tag)"
                >{{ tag.name }}</a
            >

            <h4>Příležitosti</h4>
            <a
                v-bind:class="[
                    'tag',
                    'tag-green',
                    isSelectedTag(tag) ? 'tag-selected' : ''
                ]"
                v-for="tag in tags_generic"
                v-bind:key="'tag-' + tag.id"
                v-on:click="selectTag(tag)"
                >{{ tag.name }}</a
            >

            <h4>Ke svatým</h4>
            <a
                v-bind:class="[
                    'tag',
                    'tag-green',
                    isSelectedTag(tag) ? 'tag-selected' : ''
                ]"
                v-for="tag in tags_saints"
                v-bind:key="'tag-' + tag.id"
                v-on:click="selectTag(tag)"
                >{{ tag.name }}</a
            >

            <h4>Zpěvníky</h4>
            <a
                v-bind:class="[
                    'tag',
                    'tag-yellow',
                    isSelectedSongbook(songbook) ? 'tag-selected' : ''
                ]"
                v-for="songbook in songbooks"
                v-bind:key="'songbook-' + songbook.id"
                v-on:click="selectSongbook(songbook)"
                >{{ songbook.name }}</a
            >

            <h4>Jazyky</h4>
            <a
                v-bind:class="[
                    'tag',
                    'tag-red',
                    isSelectedLanguage(lang_code) ? 'tag-selected' : ''
                ]"
                v-for="(lang_name, lang_code) in all_languages"
                v-bind:key="'lang-' + lang_code"
                v-on:click="selectLanguage(lang_code)"
                >{{ lang_name }}</a
            >
        </div>
    </div>
</template>

<script>
import gql from 'graphql-tag';
import Vue from 'vue'
import fetchFiltersQuery from './fetchFiltersQuery.graphql';

export default {
    props: ['selected-tags', 'selected-songbooks', 'selected-languages', 'show-authors', 'sort', 'descending', 'search-string'],

    data() {
        return {
            selected_tags: {},
            selected_songbooks: {},
            selected_languages: {},
            all_languages: {
                cs: 'čeština',
                sk: 'slovenština',
                en: 'angličtina',
                la: 'latina',
                pl: 'polština',
                de: 'němčina',
                fr: 'francouzština',
                es: 'španělština',
                it: 'italština',
                sv: 'svahilština',
                he: 'hebrejština',
                cu: 'staroslověnština',
                mixed: 'vícejazyčná píseň'
            }
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
        },
        songbooks: {
            query: fetchFiltersQuery,
            prefetch: false
        }
    },

    computed: {
        localShowAuthors: {
            get() {
                return this.showAuthors;
            },
            set(val) {
                this.$emit('update:show-authors', val);
                this.$emit('input', null);
            }
        },

        localSort: {
            get() {
                return this.sort;
            },
            set(val) {
                this.$emit('update:sort', val);
                this.$emit('input', null);
            }
        },

        localDescending: {
            get() {
                return this.descending;
            },
            set(val) {
                this.$emit('update:descending', val);
                this.$emit('input', null);
            }
        }
    },

    methods: {
        selectTag(tag) {
            if (!this.isSelectedTag(tag)) {
                Vue.set(this.selected_tags, tag.id, true);
            } else {
                Vue.delete(this.selected_tags, tag.id);
            }

            // notify the parent that sth has changed
            this.$emit('update:selected-tags', this.selected_tags);
            this.$emit('input', null);
        },

        selectSongbook(songbook) {
            if (!this.isSelectedSongbook(songbook)) {
                Vue.set(this.selected_songbooks, songbook.id, true);
            } else {
                Vue.delete(this.selected_songbooks, songbook.id);
            }

            // notify the parent that sth has changed
            this.$emit('update:selected-songbooks', this.selected_songbooks);
            this.$emit('input', null);
        },

        selectLanguage(language) {
            if (!this.isSelectedLanguage(language)) {
                Vue.set(this.selected_languages, language, true);
            } else {
                Vue.delete(this.selected_languages, language);
            }

            // notify the parent that sth has changed
            this.$emit('update:selected-languages', this.selected_languages);
            this.$emit('input', null);
        },

        isSelectedTag(tag) {
            return this.selected_tags[tag.id];
        },

        isSelectedSongbook(songbook) {
            return this.selected_songbooks[songbook.id];
        },

        isSelectedLanguage(language) {
            return this.selected_languages[language];
        },

        refreshSeed() {
            this.$emit('refresh-seed', null);
        },

        // https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
        fallbackCopyTextToClipboard(text) {
            var textArea = document.createElement("textarea");
            textArea.value = text;

            // Avoid scrolling to bottom
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.position = "fixed";

            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
            } catch (err) {}

            document.body.removeChild(textArea);
        },
        copyUrl() {
            let text = window.location.href;
            if (!navigator.clipboard) {
                fallbackCopyTextToClipboard(text);
                return;
            }
            navigator.clipboard.writeText(text).then(function() {}, function(err) {});
        }
    },

    watch: {
        tags_generic(val, prev) {
            if (val && !prev) {
                this.$emit('tags-loaded', null);
            }
        },

        // watch props for changes
        selectedTags(val, prev) {
            this.selected_tags = val;
        },

        selectedSongbooks(val, prev) {
            this.selected_songbooks = val;
        },

        selectedLanguages(val, prev) {
            this.selected_languages = val;
        }
    }
};
</script>
