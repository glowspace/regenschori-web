import gql from 'graphql-tag';
import ScrollTrigger from '@bit/proscholy.search.scroll-trigger/ScrollTrigger.vue';
import buildElasticSearchParams, { getSelectedTagsDcnf } from '~/node_modules/@bit/proscholy.search.build-elastic-search-params/buildElasticSearchParams';
import mergeFetchMoreResult from '~/node_modules/@bit/proscholy.search.merge-fetch-more-result/mergeFetchMoreResult';
import fetchFiltersQuery from '../../search/components/fetchFiltersQuery.graphql'
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
