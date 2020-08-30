<template>
    <!-- todo: refactor so that it does not need client-only wrapper -->
    <client-only>
    <div class="songs-list">
        <v-progress-linear
            indeterminate
            color="bg-main-blue"
            :height="4"
            :class="[results_loaded ? '' : 'opacity-1', 'custom-progress-bar']"
        ></v-progress-linear>
        <table class="table m-0">
            <tbody>
                <tr v-if="!results_loaded && !(song_lyrics && song_lyrics.length)">
                    <td style="width:4rem">
                        <div class="d-flex justify-content-end align-items-center">
                            <span>&nbsp;</span>
                            <span
                                class="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                            ></span>
                        </div>
                    </td>
                    <td>Načítám...</td>
                    <td class="p-1">
                        <a
                            class="btn btn-secondary float-right m-0"
                            target="_blank"
                            :href="
                                'https://docs.google.com/forms/d/e/1FAIpQLScmdiN_8S_e8oEY_jfEN4yJnLq8idxUR5AJpFmtrrnvd1NWRw/viewform?usp=pp_url&entry.1025781741=RS' +
                                    encodeURIComponent($route.fullPath)
                            "
                        >
                            Nahlásit
                        </a>
                    </td>
                </tr>
                <template
                    v-else-if="song_lyrics && song_lyrics.length"
                >
                    <template
                        v-for="(song_lyric, index) in song_lyrics"
                    >
                        <tr :key="song_lyric.id + '0'">
                            <td
                                class="py-0 pl-2 pr-0 align-middle w-min"
                            >
                                <a
                                    :class="[
                                        'btn btn-secondary text-secondary rounded-circle drawer-button',
                                        {'drawer-button--opened': (openDrawer == song_lyric.id)}
                                    ]"
                                    @click="openDrawer = (openDrawer == song_lyric.id) ? 0 : song_lyric.id"
                                ><i class="fas fa-plus"></i></a>
                            </td>
                            <td
                                class="p-1 align-middle"
                            >
                                <nuxt-link
                                    class="p-2 w-100 d-inline-block"
                                    :to="{path: song_lyric.public_route, query: $route.query }"
                                >{{ song_lyric.name }}</nuxt-link>
                            </td>
                            <td
                                class="p-1 align-middle"
                                :colspan="song_lyric.lang != 'cs' ? 1 : 2"
                            >
                                <span
                                    v-for="(ap,
                                    authorIndex) in song_lyric.authors_pivot"
                                    :key="authorIndex"
                                >
                                    <span v-if="authorIndex">,</span>
                                    <nuxt-link
                                        :to="ap.author.public_route"
                                        :title="song_lyric.type ? {'GENERIC':'','LYRICS':'text','MUSIC':'hudba'}['LYRICS'] : {'GENERIC':'','LYRICS':'text','MUSIC':'hudba'}[ap.authorship_type]"
                                        class="text-secondary"
                                        >{{ ap.author.name }}</nuxt-link
                                    >
                                </span>
                            </td>
                            <td
                                class="no-left-padding text-right text-uppercase small align-middle pr-3"
                                v-if="song_lyric.lang != 'cs'"
                            >
                                <span
                                    :class="[
                                        {
                                            'text-very-muted': !song_lyric.has_lyrics
                                        },
                                        'pr-sm-0 pr-1'
                                    ]"
                                    :title="song_lyric.lang_string"
                                    >{{ song_lyric.lang.substring(0, 3) }}</span
                                >
                            </td>
                            <td
                                style="width:10px"
                                class="no-left-padding align-middle d-none d-sm-table-cell"
                            >
                                <i
                                    v-if="song_lyric.scoreFiles.length > 0"
                                    class="fa fa-file-alt text-danger"
                                    title="K této písni jsou k dispozici noty."
                                ></i>
                                <i
                                    v-else
                                    class="fa fa-file-alt text-very-muted"
                                ></i>
                            </td>
                            <td
                                style="width:10px"
                                class="no-left-padding pr-4 align-middle d-none d-sm-table-cell"
                            >
                                <i
                                    v-if="
                                        song_lyric.spotifyTracks.length +
                                            song_lyric.soundcloudTracks.length +
                                            song_lyric.youtubeVideos.length +
                                            song_lyric.audioFiles.length
                                    "
                                    class="fas fa-headphones text-success"
                                    title="U této písně je k dispozici nahrávka."
                                ></i>
                                <i
                                    v-else
                                    class="fas fa-headphones text-very-muted"
                                ></i>
                            </td>
                        </tr>
                        <tr :key="song_lyric.id + '1'" v-if="openDrawer == song_lyric.id">
                            <td colspan="6" class="pb-2"><tags :song="song_lyric" :in-song-list="true"></tags></td>
                        </tr>
                    </template>
                    <tr v-if="results_loaded"><td class="p-0 border-top-0"><scroll-trigger
                        @triggerIntersected="loadMore"
                        @noObserver="caniuseObserver = false"
                        :enabled="enable_more"
                    /></td></tr>
                </template>
                <tr v-else-if="results_loaded">
                    <td class="p-1">
                        <span class="px-3 py-2 d-inline-block"
                            >Žádná píseň odpovídající zadaným kritériím nebyla
                            nalezena.</span
                        >
                        <a
                            class="btn btn-secondary float-right m-0"
                            target="_blank"
                            :href="'https://forms.gle/AYXXxkWtDHQQ13856'"
                        >
                            Přidat píseň
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="text-center">
            <div
                class="btn btn-secondary d-inline-flex align-items-center"
                v-if="enable_more && results_loaded"
                @click="loadMore"
            >
                <span
                    class="spinner-border spinner-border-sm mr-3"
                    role="status"
                    aria-hidden="true"
                    v-if="caniuseObserver"
                ></span>{{ caniuseObserver ? 'Načítám' : 'Načíst' }} další výsledky (celkem {{ song_lyrics_paginated.paginatorInfo.total }})</div
            >
        </div>
    </div>
    </client-only>
</template>

<script>
import gql from 'graphql-tag';
import ScrollTrigger from '@bit/proscholy.search.scroll-trigger/ScrollTrigger.vue';
import buildElasticSearchParams, { getSelectedTagsDcnf } from '~/node_modules/@bit/proscholy.search.build-elastic-search-params/buildElasticSearchParams';
import mergeFetchMoreResult from '~/node_modules/@bit/proscholy.search.merge-fetch-more-result/mergeFetchMoreResult';
import fetchFiltersQuery from './fetchFiltersQuery.graphql';
import Tags from '~/pages/song/components/Tags';

// Query
const FETCH_ITEMS = gql`
    query($search_params: String, $page: Int, $per_page: Int) {
        song_lyrics_paginated: search_song_lyrics(
            search_params: $search_params
            page: $page
            per_page: $per_page
        ) {
            data {
                ...SongLyricFragment
                arrangements {
                    ...SongLyricFragment
                }
            }
            paginatorInfo {
                currentPage
                lastPage
                total
                hasMorePages
            }
        }
    }

    fragment SongLyricFragment on SongLyric {
        id
        name
        public_route
        lang
        lang_string
        scoreExternals: externals(type: 4) {
            id
        }
        scoreFiles: files(type: 3) {
            id
        }
        youtubeVideos: externals(type: 3) {
            id
        }
        spotifyTracks: externals(type: 1) {
            id
        }
        soundcloudTracks: externals(type: 2) {
            id
        }
        audioFiles: files(type: 4) {
            id
        }
        authors_pivot {
            author {
                id
                name
                public_route
            }
            authorship_type
        }
        tags {
            id
        }
        tags_liturgy_part   {id name}
        tags_generic        {id name}
        tags_liturgy_period {id name}
        tags_saints         {id name}
        has_chords
        has_lyrics
        songbook_records {
            number
            songbook {
                id
                name
                shortcut
            }
        }
    }
`;

export default {
    props: [
        'search-string',
        'selected-songbooks',
        'selected-tags',
        'selected-languages',
        'sort',
        'descending',
        'seed'
    ],

    components: { ScrollTrigger, Tags },

    data() {
        return {
            page: 1,
            per_page: 20,
            enable_more: true,
            results_loaded: false,
            preferred_songbook_id: null,
            caniuseObserver: true,
            loadedMore: false,
            openDrawer: 0
        };
    },

    computed: {
        searchParams() {
            return buildElasticSearchParams({
                searchString: this.searchString,
                filterTagsDcnf: getSelectedTagsDcnf({
                        generic: this.tags_generic,
                        liturgy_part: this.tags_liturgy_part,
                        liturgy_period: this.tags_liturgy_period,
                        saints: this.tags_saints
                    },
                    this.selectedTags),
                filterLanguages: this.selectedLanguages,
                filterSongbooks: this.selectedSongbooks,
                sortType: [
                    "RANDOM",
                    "NAME",
                    this.preferred_songbook_id === null ? "NUMBER" : "SONGBOOK_NUMBER"
                ][this.sort],
                sortConfig: {
                    seed: this.seed,
                    songbook_id: this.preferred_songbook_id,
                    is_descending: this.descending
                },
                filterConfig: {
                    show_regenschori: true,
                    show_arrangements: false
                }
            });
        },

        song_lyrics() {
            return this.song_lyrics_paginated
                ? this.song_lyrics_paginated.data
                : [];
        }
    },

    methods: {
        async loadMore() {
            this.loadedMore = true;
            this.page++;

            try {
                await this.$apollo.queries.song_lyrics_paginated.fetchMore({
                    variables: {
                        page: this.page,
                        per_page: this.per_page
                    },
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                        const { hasMorePages, mergedResult } = mergeFetchMoreResult(previousResult, fetchMoreResult);
                        this.enable_more = hasMorePages;

                        return mergedResult;
                    }
                });
            } catch (e) {
                return e;
            }

        }
    },

    // GraphQL client
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
        song_lyrics_paginated: {
            query: FETCH_ITEMS,
            variables() {
                return {
                    search_params: this.searchParams,
                    page: 1,
                    per_page: this.per_page
                };
            },
            // debounce waits 200ms for query refetching
            debounce: 200,
            result(result) {
                this.$emit('query-loaded', null);
                this.enable_more =
                    result.data.song_lyrics_paginated.paginatorInfo.hasMorePages;
                this.results_loaded = true;

                // when the graphql result is cached, then currentPage is higher than 1 at component mounting
                // this needs to get mirrored in the local page property
                // we also have to check if the user has fired loadMore event as otherwise he could accidentally fetch one page multiple times
                if (!this.loadedMore) {
                    this.page = result.data.song_lyrics_paginated.paginatorInfo.currentPage;
                }
            },
            prefetch: false
        },
    },

    watch: {
        searchParams() {
            this.page = 1;
            this.results_loaded = false;
        },

        selectedSongbooks(val) {
            let arr = Object.keys(val);
            if (arr.length == 1) {
                this.preferred_songbook_id = arr[0];
            } else {
                this.preferred_songbook_id = null;
            }
        }
    }
};
</script>
