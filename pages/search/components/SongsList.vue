<template>
    <!-- todo: refactor so that it does not need client-only wrapper -->
    <client-only>
    <div :class="['songs-list', {'songs-list-liturgy-loading': !results_loaded && isLiturgy}]">
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
                        v-if="!showOne || !index"
                    >
                        <tr :key="song_lyric.id + '0' + index">
                            <td
                                class="py-0 pl-2 pr-0 align-middle w-min"
                            >
                                <a
                                    tabindex="0"
                                    :class="[
                                        'btn btn-secondary rounded-circle drawer-button',
                                        {'drawer-button--opened': (openDrawer == song_lyric.id)},
                                        plusActive(song_lyric) ? 'text-secondary' : 'text-very-muted disabled'
                                    ]"
                                    @click="openDrawer = (openDrawer == song_lyric.id) ? 0 : song_lyric.id"
                                ><i class="fas fa-plus"></i></a>
                            </td>
                            <td
                                v-if="!hideNumbers"
                                class="p-1 align-middle w-min"
                                :style="(isLiturgy ? 'width:8%' : '')"
                            >
                                <nuxt-link
	                                class="p-2 pl-3 w-100 d-flex justify-content-between text-secondary"
	                                :to="{path: song_lyric.public_route, query: $route.query }"
	                            >
	                                <span>{{
	                                    getSongNumber(song_lyric, true)
	                                }}</span>
	                                <span>{{
	                                    getSongNumber(song_lyric, false)
	                                }}</span>
	                            </nuxt-link>
                            </td>
                            <td
                                class="p-1 align-middle"
                                :style="(isLiturgy ? 'width:40%' : '')"
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
	                            class="no-left-padding align-middle d-none d-sm-table-cell w-min"
	                        >
	                            <i
	                                v-if="song_lyric.has_chords"
	                                class="fas fa-guitar text-primary"
	                                title="Tato píseň má přidané akordy."
	                            ></i>
	                            <i
	                                v-else-if="song_lyric.has_lyrics"
	                                class="fas fa-align-left text-secondary"
	                                title="U této písně je zaznamenán text (bez akordů)."
	                            ></i>
	                            <i v-else class="fas fa-align-left text-very-muted"></i>
	                        </td>
                            <td
                                class="no-left-padding align-middle d-none d-sm-table-cell w-min"
                            >
                                <i
                                    v-if="song_lyric.scores.length"
                                    class="fas fa-file-alt text-danger"
                                    title="K této písni jsou k dispozici noty."
                                ></i>
                                <i
                                    v-else
                                    class="fas fa-file-alt text-very-muted"
                                ></i>
                            </td>
                            <td
                                class="no-left-padding pr-4 align-middle d-none d-sm-table-cell w-min"
                            >
                                <i
                                    v-if="song_lyric.recordings.length"
                                    class="fas fa-headphones text-success"
                                    title="U této písně je k dispozici nahrávka."
                                ></i>
                                <i
                                    v-else
                                    class="fas fa-headphones text-very-muted"
                                ></i>
                            </td>
                            <td
                                v-if="isLiturgy"
                                class="no-left-padding pr-4 p-0 align-middle w-min"
                            >
                                <a
                                    tabindex="0"
                                    :class="[
                                        'btn rounded-circle',
                                        index ? 'text-primary' : 'btn-primary'
                                    ]"
                                    @click="index ? (chosenSongId = song_lyric.id) : (showOne = !showOne)"
                                    style="width:2.8rem"
                                ><i :class="[index ? 'fa-check' : (showOne ? 'fa-retweet' : 'fa-chevron-up'), 'fas']"></i></a>
                            </td>
                        </tr>
                        <tr :key="song_lyric.id + '1' + index" v-if="song_lyric.readings && song_lyric.readings.length">
                            <td colspan="42" class="px-4 pb-2 pt-0 border-top-0">
                                <div v-for="reading in song_lyric.readings">
                                    <div class="d-inline-block mr-4" v-if="reading.type">
                                        <span class="tag tag-category" title="vazba"><i class="fas fa-link"></i></span>
                                        <span class="tag tag-blue">{{ reading.type.toLowerCase() }}</span>
                                    </div>
                                    <div class="d-inline-flex mr-4" v-if="reading.reading_reference">
                                        <div>
                                            <span class="tag tag-category" title="odkazy"><i class="fas fa-bible"></i></span>
                                        </div>
                                        <div>
                                            <a
                                                class="tag tag-blue"
                                                v-for="(reference, key2) in osisConvert(reading.reading_reference)"
                                                :key="'ref' + key2"
                                                :href="`https://www.bibleserver.com/CEP/${reference}`"
                                            >{{ reference }}</a>
                                        </div>
                                    </div>
                                    <div class="d-inline-block" v-if="reading.cycle && reading.cycle.length && reading.cycle[0].replace(/\W/g, '')">
                                        <span class="tag tag-category"><i class="far fa-circle"></i></span>
                                        <span class="tag tag-blue">cyklus {{ reading.cycle.join(', ') }}</span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr :key="song_lyric.id + '2' + index" v-if="openDrawer == song_lyric.id">
                            <td colspan="42" class="pl-4 pb-2"><tags :song="song_lyric" :in-song-list="true"></tags></td>
                        </tr>
                    </template>
                    <tr v-if="results_loaded"><td class="p-0 border-top-0"><scroll-trigger
                        v-if="!disableObserver"
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
                v-if="enable_more && results_loaded && !showOne"
                @click="loadMore"
            >
                <span
                    class="spinner-border spinner-border-sm mr-3"
                    role="status"
                    aria-hidden="true"
                    v-if="caniuseObserver || $apollo.loading"
                ></span>{{ caniuseObserver || $apollo.loading ? 'Načítám' : 'Načíst' }} další výsledky (celkem {{ song_lyrics_paginated.paginatorInfo.total }})</div
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
import BibleReference from 'bible-reference/bible_reference';
import { uniqBy } from 'lodash';

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
        song_number
        public_route
        lang
        lang_string
        bible_refs_src
        scores: externals(content_type: SCORE) {
            id
        }
        recordings: externals(content_type: RECORDING) {
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
        tags_liturgy_period {id name}
        tags_generic        {id name}
        tags_saints         {id name}
        tags_history_period {id name}
        tags_musical_form   {id name}
        liturgy_approval_status
        liturgy_approval_status_string_values
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
    props: {
        searchString: {
            type: String,
            default: ""
        },

        selectedSongbooks: Object,
        selectedTags: Object,
        selectedLanguages: Object,

        // todo: refactor `sort` to String (or a kind of enum)
        sort: Number,
        descending: Boolean,
        seed: Number,

        disableObserver: Boolean,
        overridePerPage: Number,
        hideNumbers: Boolean,

        isLiturgy: Boolean,
        liturgicalReferences: Array,

        isProscholy: Boolean
    },

    components: { ScrollTrigger, Tags },

    data() {
        return {
            page: 1,
            per_page: this.overridePerPage || 20,
            enable_more: true,
            results_loaded: false,
            preferred_songbook_id: null,
            caniuseObserver: !this.disableObserver,
            loadedMore: false,
            openDrawer: 0,
            showOne: this.isLiturgy,
            chosenSongId: null
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
                        saints: this.tags_saints,
                        history_period: this.tags_history_period,
                        musical_form: this.tags_musical_form
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
                    show_regenschori: !this.isProscholy,
                    show_arrangements: false
                }
            });
        },

        song_lyrics() {
            let lr = this.litRefsProcessed;
            let slp = this.song_lyrics_paginated ? this.song_lyrics_paginated.data : [];
            let comb = [...lr, ...slp];
            comb = uniqBy(comb, 'id');

            if (comb.length) {
                if (!this.chosenSongId) {
                    this.chosenSongId = comb[0] ? comb[0].id : null;
                } else {
                    let chosenSong = comb.find(sl => {return sl.id == this.chosenSongId});
                    let chosenSongIndex = comb.findIndex(sl => {return sl.id == this.chosenSongId});

                    if (chosenSong && (chosenSongIndex + 1)) {
                        comb.splice(chosenSongIndex, 1);
                        comb.splice(0, 0, chosenSong);
                    }
                }

                // todo emit
            }

            return comb;
        },

        litRefsProcessed() {
            let litRefArray = [];

            if (this.liturgicalReferences && this.liturgicalReferences.length) {
                for (let i = 0; i < this.liturgicalReferences.length; i++) {
                    let { readings, song_lyric } = this.liturgicalReferences[i];

                    // let's create an array from cycles (we need to merge multiple even readings with different cycles)
                    readings.forEach((reading, key) => {
                        // find the first reading that is similar (and before this one)
                        let keyOfSimilarReading = readings.findIndex((r, k) => {
                            return (
                                r.type == reading.type
                                && r.reading_reference == reading.reading_reference
                                && k < key
                            );
                        });

                        // create array from cycle string
                        if (typeof reading.cycle == 'string') {
                            reading.cycle = [reading.cycle];
                        }

                        // add cycle of the similar reading here and remove dupes
                        if (keyOfSimilarReading !== -1) {
                            readings[keyOfSimilarReading].cycle = uniqBy([...readings[keyOfSimilarReading].cycle, ...reading.cycle]);
                            reading.cycle = uniqBy(readings[keyOfSimilarReading].cycle);
                        }
                    });

                    // remove duplicates from the previous algorithm
                    readings = uniqBy(readings, r => [r.type, r.reading_reference].join());

                    litRefArray[i] = { readings, ...song_lyric };
                }
            }

            return litRefArray;
        },

        filtersLoaded() {
            return (
                this.tags_generic
                && this.tags_liturgy_part
                && this.tags_liturgy_period
                && this.tags_saints
                && this.tags_history_period
                && this.tags_musical_form
            );
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

        },

        plusActive(song_lyric) {
            return (
                song_lyric.tags_liturgy_part.length +
                song_lyric.liturgy_approval_status +
                song_lyric.tags_liturgy_period.length +
                song_lyric.tags_generic.length +
                song_lyric.tags_saints.length +
                song_lyric.tags_history_period.length +
                song_lyric.tags_musical_form.length +
                song_lyric.songbook_records.length
            );
        },

        getSongNumber(song_lyric, getfirstPart) {
            if (this.preferred_songbook_id !== null) {
                let rec = song_lyric.songbook_records.filter(
                    record => record.songbook.id === this.preferred_songbook_id
                )[0];
                if (rec) {
                    if (getfirstPart) {
                        return rec.songbook.shortcut + ' ';
                    } else {
                        return rec.number;
                    }
                }
            }

            if (!getfirstPart) {
                return song_lyric.song_number;
            }
            return '';
        },

        osisConvert(osisString) {
            return BibleReference.fromOsis(osisString).toCzechStrings();
        }
    },

    // GraphQL client
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
        song_lyrics_paginated: {
            skip() {
                return !this.filtersLoaded;
            },
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
            }
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
