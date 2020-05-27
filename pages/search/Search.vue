<template>
  <div>
    <div class="container-fluid">
      <search-input></search-input>

      <div class="row mt-5">
        <div class="col-3">
          <search-box></search-box>
        </div>
        <div class="col-9">
          <div class="card">
            <div class="card-body">

              <div class="row">
                <div class="col-8">
                  <search-current-status/>
                </div>

                <div class="col-4 text-right" v-if="results_ready">
                  <h2>Výsledky vyhledávání</h2>

                  <p>Nalezeno {{song_lyrics_paginated.paginatorInfo.total}} záznamů</p>
                </div>
              </div>

              <div class="row">
                <search-results :songs="song_lyrics_paginated.data"
                                v-if="results_ready"></search-results>

                <div class="text-center" v-else>načítám</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import AuthorsList from "./components/AuthorsList";
  import SongsList from "./components/SongsList";
  import Filters from "./components/Filters";
  import AppLinks from "./components/AppLinks";
  import SearchBox from "~/pages/search/components/SearchBox";
  import SearchResults from "~/pages/search/components/SearchResults";
  import SearchCurrentStatus from "~/pages/search/components/SearchCurrentStatus";
  import SearchInput from "~/pages/search/components/SearchInput";

  import SearchState from "~/pages/search/search_state"

  import gql from 'graphql-tag';

  // Query
  const fetch_items = gql`
        query ($search_params: String, $page: Int, $per_page: Int) {
            song_lyrics_paginated: search_song_lyrics(search_params: $search_params, page: $page, per_page: $per_page) {
                data {
                  id,
                  name,
                  public_url,
                  lang,
                  lang_string,
                  scoreExternals: externals(type: 4){id},
                  scoreFiles: files(type: 3){id},
                  youtubeVideos: externals(type: 3){id},
                  spotifyTracks: externals(type: 1){id},
                  soundcloudTracks: externals(type: 2){id},
                  audioFiles: files(type: 4){id},
                  authors{id, name, public_url}
                  tags{id},
                  has_chords,
                  has_lyrics,
                  songbook_records{number, songbook{id, name, shortcut}}
              },
              paginatorInfo {
                currentPage,
                lastPage,
                total,
                hasMorePages
              }
            }
        }`;


  /**
   * Root search component.
   *
   * Toggles 2 views (SearchHome and SearchResults).
   */
  export default {

    components: {
      SearchInput,
      SearchCurrentStatus,
      SearchResults,
      SearchBox,
      AppLinks,
      AuthorsList,
      SongsList,
      Filters
    },

    data() {
      return {
        state: SearchState,
        results_ready: false
      }
    },

    computed: {
      search_records_count() {

        return 0;

      },

      searchParams() {
        // encode the elasticsearch attributes into an object and send as JSON text
        // for docs see https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html
        // all the searchable fields are defined in App\SongLyrics: toSearchableArray() and $mapping attr
        // also, the Kibana tool can be used for debugging the elasticsearch requests
        // see docker-compose.yml
        let query = {
          'bool': {
            'must': [],
            'filter': []
          }
        };
        // beware that not all attribute types can be used for sorting, this is why 'name_keyword' has been added to index
        let sort = [];

        if (this.state.query) {
          query.bool.must.push({
            'multi_match': {
              'query': this.state.query,
              'fields': ['name^2', 'lyrics', 'authors', '_id^50', 'songbook_records.sonbgook_number']
            }
          });
        }
        else {
          // no search keyword provided, so use the alphabetical sorting
          sort.push('name_keyword');
        }

        /*
        for (let category_tags of Object.values(this.selected_tags_dcnf)) {
          let tag_ids = Object.values(category_tags).map(v => parseInt(v));
          if (tag_ids.length) {
            query.bool.filter.push({'terms': {'tag_ids': tag_ids}})
          }
        }


        if (Object.keys(this.selectedLanguages).length) {
          query.bool.filter.push({'terms': {'lang' : Object.keys(this.selectedLanguages)}})
        }

        if (Object.keys(this.selectedSongbooks).length) {
          query.bool.filter.push({'terms': {'songbook_records.songbook_id': Object.keys(this.selectedSongbooks)}})
        }
        */

        // encode to a JSON string to pass as an argument
        // // const query_base64 = Buffer.from(query_str).toString("base64");
        return JSON.stringify({
          "sort": sort,
          "query": query
        });
      },

    },

    mounted() {

    },

    watch: {
      searchParams() {
        this.results_ready = false;
      },
    },

    // GraphQL client
    apollo: {
      song_lyrics_paginated: {
        query: fetch_items,

        variables() {
          return {
            search_params: this.searchParams,
            page: 1,
            per_page: 50
          }
        },

        // debounce waits 200ms for query refetching
        debounce: 200,

        result(result) {
          this.$emit("query-loaded", null);
          //this.enable_more = result.data.song_lyrics_paginated.paginatorInfo.hasMorePages;
          this.results_ready = true;
        },
      }
    },


  }
</script>

<style lang="scss">
  .filter-panel {
    display: block;
  }

  .btn.search-report {
    position:   fixed;
    bottom:     0;
    right:      0;
    color:      #292929;
    opacity:    0.5;
    transition: 0.2s;
  }

  .btn.search-report:hover {
    color:   #292929;
    opacity: 1;
  }

  .home {
    position: relative;
  }
</style>
