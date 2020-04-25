<template>
  <div>
    <div v-for="score in scores">
      <score :score="['1']"></score>
    </div>
  </div>
</template>

<script>
  import Score from "~/pages/song/components/Score";

  export default {
    name: "Scores",
    components: {Score},
    props: ['scores']
  }
</script>

<style scoped>

</style>
