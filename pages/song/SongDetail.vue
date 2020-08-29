<template>
    <div class="container">
        <div class="row">
            <div
                class="col-lg-4 d-none d-lg-block"
            >
                    <!-- filters shown only for desktop -->
                    <Filters
                        :selected-songbooks.sync="selected_songbooks"
                        :selected-tags.sync="selected_tags"
                        :selected-languages.sync="selected_languages"
                        :show-authors.sync="showAuthors"
                        :sort.sync="sort"
                        :descending.sync="descending"
                        v-on:input="updateHistoryState(null, true)"
                    ></Filters>
            </div>
            <div class="col-lg-8">
                <div class="mt-4 mb-3">
                    <div>
                        <h1 class="song-title">{{ song.name }}</h1>
                        <div class="d-flex align-items-center mt-1">
                            <h4 class="song-number m-0">{{ song.song_number }}</h4>
                            <p class="song-author ml-3 mb-0">
                                <song-author-label :song="song"></song-author-label>
                            </p>
                        </div>
                    </div>
                    <tags :song="song"></tags>
                </div>
                <div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SongAuthorLabel from './components/SongAuthorLabel';
import Tags from './components/Tags';
import Filters from '~/pages/search/components/Filters';
import SearchHistoryManager from '@bit/proscholy.search.search-history-manager/SearchHistoryManager.vue';

export default {
    name: 'SongDetail',

    extends: SearchHistoryManager,

    components: {
        SongAuthorLabel,
        Tags,
        Filters
    },

    props: ['song'],

    data() {
        return {
            // Search data
            selected_songbooks: {},
            selected_languages: {},
            selected_tags: {},

            // View state
            displayFilter: false,
            showAuthors: false,

            // Random order seed
            seed: 0,
            seedLocked: false,

            // Sort
            sort: 0,
            descending: false
        };
    },

    mounted() {
        window.onpopstate = this.applyStateChange;
        this.applyStateChange(null, true);
    },

    computed: {
        // getter / setter for the SearchHistoryManager extending component
        historyStateObject: {
            get() {
                this.seedLocked = this.seed;

                return {
                    tags: this.selected_tags,
                    languages: this.selected_languages,
                    songbooks: this.selected_songbooks,
                    show_authors: this.showAuthors,
                    seed: this.seedLocked ? this.seed : null,
                    is_descending: this.search_string ? null : this.descending,
                    sort: this.search_string ? null : this.sort
                };
            },

            set(obj) {
                this.selected_tags = obj.tags;
                this.selected_languages = obj.languages;
                this.selected_songbooks = obj.songbooks;
                this.showAuthors = obj.show_authors;
                this.descending = obj.is_descending;
                if (obj.seed) {this.seed = obj.seed;}
                this.sort = obj.sort;

                if (this.seed) {
                    this.seedLocked = true;
                }
            }
        }
    }
};
</script>
