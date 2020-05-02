<template>
  <div class="card">
    <div class="card-body">
      <div class="search-category">Část mše</div>

      <filter-tag-select-badge :tag="tag"
                     v-for="tag in liturgy_part_tags"
                     :key="tag.id"/>

      <div class="search-category">Liturgická doba</div>

      <filter-tag-select-badge :tag="tag"
                     v-for="tag in liturgy_period_tags"
                     :key="tag.id"/>

      <div class="search-category">Typ</div>



      <div class="search-category">Období</div>

      <filter-tag-select-badge :tag="tag"
                     v-for="tag in historical_period_tags"
                     :key="tag.id"/>

      <div class="search-category">Instrumentace</div>

      <filter-tag-select-badge :tag="tag"
                     v-for="tag in instrumentation_tags"
                     :key="tag.id"/>

      <div class="row">
        <div class="col-12 text-right">
          <a class="btn btn-search"
             href="">Vyhledat</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import BadgeToggle from "~/pages/search/components/FilterTagSelectBadge";
  import SearchToggle from "~/pages/search/components/FilterTagSelectBadge";
  import gql from "graphql-tag";

  import SearchState from "~/pages/search/search_state";
  import FilterTagSelectBadge from "~/pages/search/components/FilterTagSelectBadge";

  const fetch_tags = gql`query {
  tags_generic: tags_enum(type: GENERIC) {
    id
    name
    type_enum
  }

   tags_liturgy_part: tags_enum(type: LITURGY_PART) {
    id
    name
    type_enum
  }

  tags_liturgy_period: tags_enum(type: LITURGY_PERIOD) {
    id
    name
    type_enum
  }

  tags_historical_period: tags_enum(type: HISTORICAL_PERIOD) {
    id
    name
    type_enum
  }

  tags_instrumentation: tags_enum(type: INSTRUMENTATION) {
    id
    name
    type_enum
  }
}
`;

  export default {
    name: "SearchBox",
    components: {FilterTagSelectBadge, SearchToggle, BadgeToggle},

    data: () => {
      return {
        liturgy_part_tags: [],
        liturgy_period_tags: [],
        historical_period_tags: [],
        song_type: [],
        instrumentation_tags: []
      }
    },

    // GraphQL client
    apollo: {
      tags_liturgy_part: {
        query: fetch_tags,
        // debounce waits 200ms for query refetching
        debounce: 200,
        result(result) {
          this.liturgy_part_tags = result.data.tags_liturgy_part
          this.liturgy_period_tags = result.data.tags_liturgy_period
          this.historical_period_tags = result.data.tags_historical_period
          this.instrumentation_tags = result.data.tags_instrumentation
        },
      }
    },
  }
</script>

<style scoped>
  .search-category {
    margin-top:     15px;

    padding-bottom: 10px;
    margin-bottom:  15px;

    border-bottom:  1px solid #d7d7d7;
  }


  .btn-search {
    margin-top:       15px;

    display:          inline-block;
    color:            white;

    background-color: #d90404;
  }
</style>
