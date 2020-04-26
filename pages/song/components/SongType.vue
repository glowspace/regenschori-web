<template>
  <div>
    <badge title="Originální skladba"
           v-if="song.type === 0"
           class="mt-2"></badge>

    <badge title="Překlad"
           v-if="song.type === 1"
           class="mt-2"></badge>

    <badge title="Autorizovaný překlad"
           v-if="song.type === 2"
           class="mt-2"></badge>

  </div>
</template>

<script>
  import Badge from "~/components/Badge";

  export default {
    name: "SongType",
    components: {Badge},
    props: ['song']
  }
</script>

<style scoped>

</style>
