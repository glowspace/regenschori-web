<template>
    <div class="song-tags card px-3 py-1" v-if="$apollo.loading || !tags_generic">
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
    <div class="song-tags filters card px-3 py-1" v-else>
        <div v-if="!isLiturgy"><button type="button" class="btn btn-primary mr-2" @click="$emit('enter', null)">
            <i class="fas fa-search"></i>
        </button><div class="btn-group m-0 my-2 bg-light" role="group">
            <a
                class="btn btn-secondary"
                :class="{ chosen: !localShowAuthors && !init }"
                @click="localShowAuthors = false"
                ><i class="fas fa-music"></i>písně</a
            >
            <a
                class="btn btn-secondary"
                :class="{ chosen: localShowAuthors }"
                @click="localShowAuthors = true"
                ><i class="fas fa-user"></i>autoři</a
            >
        </div></div>
        <div
            v-if="!localShowAuthors && !isLiturgy"
            class="btn-group m-0 my-2 bg-light btn-group--icons"
            role="group"
            :title="[searchString ? 'Písně jsou řazeny podle vyhledávání.' : '']"
        >
            <a
                :class="[{ chosen: !localSort && !init }, { disabled: searchString }, 'btn btn-secondary']"
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
            <a
                v-if="searchString"
                :class="[{ chosen: searchString }, 'btn btn-secondary']"
                ><i class="fas fa-search mr-0"></i></a
            >
        </div>
        <nuxt-link v-if="!isLiturgy" class="mt-3 tag tag-blue" to="/liturgie/aktualne">Co hrát na mši</nuxt-link>
        <div v-if="!localShowAuthors">
            <tag-category
                v-if="!isLiturgy"
                heading="Liturgie – mše svatá"
                color="blue"
                :tags-in-category="tags_liturgy_part"
                :selected-tags="selected_tags"
                @selectTag="selectTag"
            ></tag-category>
            <tag-category
                heading="Liturgický rok"
                color="red"
                :tags-in-category="tags_liturgy_period"
                :selected-tags="selected_tags"
                @selectTag="selectTag"
            ></tag-category>
            <tag-category
                heading="Příležitosti"
                color="green"
                :tags-in-category="tags_generic"
                :selected-tags="selected_tags"
                @selectTag="selectTag"
            ></tag-category>
            <tag-category
                heading="Ke svatým"
                color="green"
                :tags-in-category="tags_saints"
                :selected-tags="selected_tags"
                @selectTag="selectTag"
            ></tag-category>
            <tag-category
                heading="Historické období"
                color="red"
                :tags-in-category="tags_history_period"
                :selected-tags="selected_tags"
                @selectTag="selectTag"
            ></tag-category>
            <tag-category
                heading="Hudební forma"
                color="green"
                :tags-in-category="tags_musical_form"
                :selected-tags="selected_tags"
                @selectTag="selectTag"
            ></tag-category>
            <tag-category
                heading="Zpěvníky"
                color="yellow"
                :tags-in-category="songbooks"
                :selected-tags="selected_songbooks"
                @selectTag="selectSongbook"
            ></tag-category>
            <tag-category
                heading="Jazyky"
                color="red"
                :tags-in-category="all_languages"
                :selected-tags="selected_languages"
                @selectTag="selectLanguage"
            ></tag-category>
        </div>
    </div>
</template>

<script>
import gql from 'graphql-tag';
import Vue from 'vue'
import fetchFiltersQuery from './fetchFiltersQuery.graphql';
import TagCategory from '@bit/proscholy.search.tag-category/TagCategory.vue';

export default {
    props: ['init', 'selected-tags', 'selected-songbooks', 'selected-languages', 'show-authors', 'sort', 'descending', 'search-string', 'is-liturgy'],

    components: {
        TagCategory
    },

    data() {
        return {
            selected_tags: {},
            selected_songbooks: {},
            selected_languages: {},
            all_languages: [
                {id: 'cs', name: 'čeština'},
                {id: 'sk', name: 'slovenština'},
                {id: 'en', name: 'angličtina'},
                {id: 'la', name: 'latina'},
                {id: 'pl', name: 'polština'},
                {id: 'de', name: 'němčina'},
                {id: 'fr', name: 'francouzština'},
                {id: 'es', name: 'španělština'},
                {id: 'pt', name: 'portugalština'},
                {id: 'it', name: 'italština'},
                {id: 'sv', name: 'svahilština'},
                {id: 'he', name: 'hebrejština'},
                {id: 'cr', name: 'chorvatština'},
                {id: 'cu', name: 'staroslověnština'},
                {id: 'mixed', name: 'vícejazyčná píseň'}
            ]
        };
    },

    apollo: {
        $prefetch: false,
        tags_generic: {
            query: fetchFiltersQuery
        },
        tags_liturgy_part: {
            query: fetchFiltersQuery
        },
        tags_liturgy_period: {
            query: fetchFiltersQuery
        },
        tags_saints: {
            query: fetchFiltersQuery
        },
        tags_history_period: {
            query: fetchFiltersQuery
        },
        tags_musical_form: {
            query: fetchFiltersQuery
        },
        songbooks: {
            query: fetchFiltersQuery
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
                Vue.set(this.selected_languages, language.id, true);
            } else {
                Vue.delete(this.selected_languages, language.id);
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
            return this.selected_languages[language.id];
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
