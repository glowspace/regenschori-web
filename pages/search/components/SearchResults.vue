<template>
  <table class="table">
    <thead>
    <tr>
      <th></th>
      <th>Název</th>
      <th>Autor</th>
      <th>Typ záznamu</th>
      <th>Část mše</th>
      <th>Název</th>
    </tr>
    </thead>

    <search-result-line :song="song" v-for="song in songs" :key="song.id"></search-result-line>
  </table>
</template>

<script>
  import Filters from "~/pages/search/components/Filters";
  import SearchCurrentStatus from "~/pages/search/components/SearchCurrentStatus";
  import SongAuthorLabel from "~/pages/song/components/SongAuthorLabel";
  import SearchResultLine from "~/pages/search/components/SearchResultLine";

  export default {
    name: "SearchResults",
    components: {SearchResultLine, SongAuthorLabel, SearchCurrentStatus, Filters},
    props: ['songs']
  }
</script>

<style scoped>

</style>
