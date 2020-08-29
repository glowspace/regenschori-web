<template>
    <div class="background-home">
        <div class="container">
            <div :class="[init ? 'home-init' : 'home-afterinit']">
                <div class="row mt-n4 justify-content-center zindex-lower fixed-top position-sticky">
                    <div class="col-lg-8 offset-lg-4 px-1 pt-5 pb-3">
                        <div class="search-wrapper">
                            <input
                                type="search"
                                class="search-home"
                                id="search-home"
                                placeholder="Zadejte název písně, část textu nebo jméno autora"
                                v-model="search_string"
                                v-on:keyup.enter="inputEnter()"
                                autofocus
                            />
                            <button
                                type="button"
                                class="search-submit d-none d-lg-inline"
                                @click="inputEnter()"
                            >
                                <i class="fa fa-search" v-if="!songLoading"></i>
                                <span
                                    v-else
                                    class="spinner-border spinner-border-sm align-middle"
                                    role="status"
                                    aria-hidden="true"
                                ></span>
                            </button>
                            <button
                                type="button"
                                class="search-submit d-lg-none"
                                :class="{
                                    'filter-active': filters_active,
                                    'filter-open': displayFilter
                                }"
                                @click="displayFilter = !displayFilter"
                            >
                                <i class="fa fa-filter" v-if="!songLoading"></i>
                                <span
                                    v-else
                                    class="spinner-border spinner-border-sm align-middle"
                                    role="status"
                                    aria-hidden="true"
                                ></span>
                            </button>
                        </div>
                        <div
                            class="mx-2 d-lg-none filter-panel position-absolute"
                            v-show="displayFilter"
                        >
                            <a
                                class="btn btn-secondary float-right fixed-top position-sticky"
                                v-on:click="displayFilter = false"
                            >
                                <i class="fas fa-times pr-0"></i>
                            </a>
                            <!-- filters shown only for mobile -->
                            <Filters
                                :init="init"
                                :selected-songbooks.sync="selected_songbooks"
                                :selected-tags.sync="selected_tags"
                                :selected-languages.sync="selected_languages"
                                :show-authors.sync="showAuthors"
                                :sort.sync="sort"
                                :descending.sync="descending"
                                :search-string="search_string"
                                v-on:refresh-seed="refreshSeed"
                                v-on:input="updateHistoryState(); init = false;"
                            ></Filters>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div
                        class="col-lg-4 d-none d-lg-block desktop-filter-container"
                    >
                        <div class="fixed-top position-sticky">
                            <!-- filters shown only for desktop -->
                            <Filters
                                :init="init"
                                :selected-songbooks.sync="selected_songbooks"
                                :selected-tags.sync="selected_tags"
                                :selected-languages.sync="selected_languages"
                                :show-authors.sync="showAuthors"
                                :sort.sync="sort"
                                :descending.sync="descending"
                                :search-string="search_string"
                                v-on:refresh-seed="refreshSeed"
                                v-on:input="updateHistoryState(); init = false;"
                            ></Filters>
                        </div>
                    </div>
                    <div class="col-lg-8">
                        <News v-show="!filters_active && !search_string" />
                        <div class="card" v-show="!init">
                            <div class="card-body p-0">
                                <SongsList
                                    v-if="!showAuthors"
                                    :search-string="search_string"
                                    :selected-tags="selected_tags"
                                    :selected-songbooks="selected_songbooks"
                                    :selected-languages="selected_languages"
                                    :sort="sort"
                                    :descending="descending"
                                    :seed="seed"
                                    v-on:query-loaded="queryLoaded"
                                ></SongsList>
                                <AuthorsList
                                    v-else
                                    :search-string="search_string"
                                    v-on:query-loaded="queryLoaded"
                                ></AuthorsList>
                            </div>
                        </div>
                        <div
                            v-show="init"
                            @click="init = false;"
                            class="text-center pt-2 text-white"
                        >
                            <a
                                class="btn btn-primary display-all-songs font-weight-bold"
                                ><i class="fas fa-chevron-down pr-2"></i>zobrazit všechny písně</a
                            >
                        </div>
                    </div>
                </div>

                <a
                    class="btn btn-secondary mb-0 search-report bg-transparent"
                    target="_blank"
                    title="Nahlásit"
                    :href="
                        'https://docs.google.com/forms/d/e/1FAIpQLScmdiN_8S_e8oEY_jfEN4yJnLq8idxUR5AJpFmtrrnvd1NWRw/viewform?usp=pp_url&entry.1025781741=RS' +
                            encodeURIComponent($route.fullPath)
                    "
                >
                    <i class="fas fa-exclamation-triangle p-0"></i>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import SongsList from './components/SongsList';
import AuthorsList from '@bit/proscholy.search.authors-list/AuthorsList.vue';
import Filters from './components/Filters';
import News from './components/News';
import SearchHistoryManager from '@bit/proscholy.search.search-history-manager/SearchHistoryManager.vue';

import gql from 'graphql-tag';

const FETCH_SONG_ROUTE = gql`
    query($song_number: Int!) {
        song_lyric_number(song_number: $song_number) {
            public_route
        }
    }
`;

/**
 * Root search component.
 *
 * Toggles 2 views (SearchHome and SearchResults).
 */
export default {
    extends: SearchHistoryManager,

    head() {
        return {
            title: this.getTitle(),
            meta: [
                {property: 'og:title', content: this.getTitle()},
                {property: 'twitter:title', content: this.getTitle()},
                {name: 'description', content: this.getDescription()},
                {property: 'og:description', content: this.getDescription()},
                {property: 'twitter:description', content: this.getDescription()}
            ],
            bodyAttrs: {
                class: ['home-scroll']
            }
        }
    },

    data() {
        return {
            // Search data
            search_string: '',
            selected_songbooks: {},
            selected_languages: {},
            selected_tags: {},

            // View state
            init: true,
            displayFilter: false,
            showAuthors: false,

            // Title
            titleWebsite: process.env.titleWebsite,
            titleSeparator: process.env.titleSeparator,

            // Admin url
            adminUrl: process.env.adminUrl,

            // Random order seed
            seed: 0,
            seedLocked: false,

            // Sort
            sort: 0,
            descending: false,

            // Song route loading
            songLoading: false
        };
    },

    asyncData() {
        const randomInteger = function randomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        return {
            seed: randomInteger(1, 100000)
        };
    },

    methods: {
        getTitle() {
            return this.titleWebsite;
        },

        getDescription() {
            return '';
        },

        resetState(manual = false) {
            this.selected_tags = {};
            this.selected_languages = {};
            this.selected_songbooks = {};
            this.sort = 0;
            this.descending = false;

            if (manual) {
                this.init = true;
                if (document.getElementById('search-home')) {
                    document.getElementById('search-home').focus();
                }
                this.search_string = ''; // this prevents search box from being cleared after filters' load
                this.refreshSeed();
                this.updateHistoryState();
            }
        },

        queryLoaded() {
            if (this.search_string && this.init) {
                this.updateHistoryState();
                this.init = false;
            } else if (!this.init) {
                this.updateHistoryState();
            }
        },

        inputEnter() {
            this.init = false;
            if (this.search_string) {
                if (this.search_string == 'admin') {
                    window.location.href = this.adminUrl;
                } else if (!isNaN(parseInt(this.search_string, 10))) {
                    this.songLoading = true;
                    this.$apollo.query({
                        query: FETCH_SONG_ROUTE,
                        variables: {
                            song_number: this.search_string
                        }
                    }).then((response) => {
                        if (response.data.song_lyric_number) {
                            this.$router.push({
                                path: response.data.song_lyric_number.public_route
                            }).catch(err => {});
                        }
                        this.songLoading = false;
                    }).catch((err) => {
                        this.songLoading = false;
                    });
                }
            }
        },

        refreshSeed() {
            const randomInteger = function randomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            this.seedLocked = false;
            this.seed = randomInteger(1, 100000);
        }
    },

    mounted() {
        window.onpopstate = this.applyStateChange;
        if (document.getElementById('navbar-brand')) {
            document.getElementById('navbar-brand').onclick = () => {this.resetState(true);};
        }
        if (document.getElementById('navbar-brand-small')) {
            document.getElementById('navbar-brand-small').onclick = () => {this.resetState(true);};
        }
        if (document.getElementById('search-home')) {
            document.getElementById('search-home').focus();
        }
        this.applyStateChange();
    },

    components: {
        SongsList,
        AuthorsList,
        Filters,
        News
    },

    computed: {
        /**
         * Note that there has to be sth together at the line with return,
         * otherwise js will see only return; and don't give a f*ck about the things below.
         *
         * @returns {boolean}
         */
        filters_active() {
            return (
                Object.keys(this.selected_songbooks).length +
                    Object.keys(this.selected_tags).length +
                    Object.keys(this.selected_languages).length >
                0
            );
        },


        // getter / setter for the SearchHistoryManager extending component
        historyStateObject: {
            get() {
                this.seedLocked = !(this.search_string || this.sort || this.showAuthors || this.init);

                return {
                    search_string: this.search_string,
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
                this.search_string = obj.search_string;
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
    },

    watch: {
        init(val) {
            if (val) {
                if (document.getElementById('search-home')) {
                    document.getElementById('search-home').focus();
                }
                this.seedLocked = false;
            } else {
                if (!this.search_string) {
                    this.seedLocked = true;
                    this.updateHistoryState();
                }
            }
        },

        showAuthors(val) {
            this.resetState();
        }
    }
};
</script>
