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
                  <search-current-status />
                </div>

                <div class="col-4 text-right">
                  <h2>Výsledky vyhledávání</h2>

                  <p>Nalezeno {{search_records_count}} záznamů</p>
                </div>
              </div>

              <div class="row">
                <search-results :songs="[]"></search-results>
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
  import Logo from "./components/Logo";

  import {isEmpty} from "lodash";
  import SearchBox from "~/pages/search/components/SearchBox";
  import SearchResults from "~/pages/search/components/SearchResults";
  import SearchCurrentStatus from "~/pages/search/components/SearchCurrentStatus";
  import SearchInput from "~/pages/search/components/SearchInput";

  import search_state from "~/pages/search/search_state";

  /**
   * Root search component.
   *
   * Toggles 2 views (SearchHome and SearchResults).
   */
  export default {
    props: {
      "str-prefill": String
    },

    data() {
      return {
        // Search component state storage
        state: search_state,

        // Search data
        search_string: "",
        selected_songbooks: {},
        selected_languages: {},
        selected_tags: {},

        // dcnf - disjunctive canonical normal form :)
        selected_tags_dcnf: {},

        // View state
        displayFilter: false,

        search_records_count: 0
      }
    },


    beforeCreate: function () {
      if (process.client) {
        document.body.className = 'home';
      }
    },

    beforeDestroy() {
      if (process.client) {
        document.body.className = '';
      }
    },

    methods: {
      updateSelectedTagsDcnf(event) {
        this.selected_tags_dcnf = event;
      },

      updateHistoryState() {
        if (this.init) {
          return;
        }

        this.$router.replace({
          path: '/search',
          query: {
            q: this.search_string || null,
            tags: Object.keys(this.selected_tags).join(','),
            langs: Object.keys(this.selected_languages).join(','),
            songbooks: Object.keys(this.selected_songbooks).join(',')
          }
        });

        console.log('replaced url');
      },

      applyStateChange(event) {
        let query = this.$route.query;

        if (isEmpty(query)) {
          this.resetState(false);
          return;
        }

        this.search_string = query.q || this.search_string;

        // a helper function
        const getObjFormat = function (str) {
          if (isEmpty(str)) {
            return {};
          }

          console.log(str);

          return str.split(',').filter(str => str.length)
            .reduce((obj, key, _) => {
              obj[key] = true;
              return obj;
            }, {});
        }

        this.selected_tags = getObjFormat(query.tags);
        this.selected_languages = getObjFormat(query.langs);
        this.selected_songbooks = getObjFormat(query.songbooks);
      },


      resetState(update_url) {
        this.search_string = "";
        this.selected_tags = {};
        this.selected_languages = {};
        this.selected_songbooks = {};

        if (update_url) {
          this.updateHistoryState();
        }
      },

      autoInit() {
        if (this.init && this.search_string !== "") {
          this.init = false;
        }
      },

      currentUrl() {
        // return encodeURIComponent(window.location.href);
        return this.$route.fullPath;
      }
    },

    mounted() {
      this.search_string = this.strPrefill ? this.strPrefill : "";
      if (process.client) {
        window.onpopstate = this.applyStateChange;
      }

      if (this.$route.path == "/search") {
        // this.applyStateChange();
        this.init = false;
      }
    },

    components: {
      SearchInput,
      SearchCurrentStatus,
      SearchResults,
      SearchBox,
      Logo,
      AppLinks,
      AuthorsList,
      SongsList,
      Filters
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
          Object.keys(this.selected_languages).length)
          > 0;
      }
    }
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
