<template>
  <div class="container-fluid">
    <search-input></search-input>

    <div class="row mt-5">
      <div class="col-3">
        <div class="card">
          <search-box/>
        </div>
      </div>

      <div class="col-6">
        <div class="card">
          <div class="card-body">
            <h5>Nejnovější skladby</h5>
          </div>
        </div>
      </div>
      <div class="col-3">
        <div class="card">
          <div class="card-body">
            <h5>K dnešní liturgii</h5>

            <p>Ve výstavbě</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import SearchBox from "~/pages/search/components/SearchBox";
  import SearchInput from "~/pages/search/components/SearchInput";

  export default {
    name: "Home",
    components: {SearchInput, SearchBox}
  }
</script>

<style scoped>

</style>
