<template>
  <div>
    <span v-if="song.authors.length === 1">Autor:</span>
    <span v-if="song.authors.length >1">Autoři:</span>

    <!-- Original -->
    <nuxt-link v-for="(author, index) in song.authors"
               to="/"
               :key="author.id">
      {{author.name}} {{ index !== 0 ?', ' : '' }}
    </nuxt-link>

  </div>
</template>

<script>
  export default {
    name: "SongAuthorLabel",
    props: ['song'],

    mounted() {
      console.log(this.song.authors);
    }
  }
</script>

<style scoped>

</style>
