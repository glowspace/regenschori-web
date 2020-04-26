<template>
  <div class="row mt-5">
    <div class="col-8 offset-2">

      <div class="row">
        <div class="col-10">
          <input type="text"
                 class="w-100 form-control"
                 v-model="state.query"
                 placeholder="Zadejte název skladby ">
        </div>
        <div class="col-2">
          <a href="#"
             class="btn btn-search w-100"
             @click="search">Vyhledat</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import search_state from "~/pages/search/search_state";

  export default {
    name: "SearchInput",

    data: () => {
      return {
        state: search_state
      }
    },

    methods: {
      search() {
        this.$router.push('search')
      }
    }
  }
</script>

<style scoped>
  .btn-search {
    color:            white;

    background-color: #c40000;
  }
</style>
