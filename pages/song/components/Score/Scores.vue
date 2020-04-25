<template>
  <div>
    <div v-for="score in scores">
      <score :score="[score]"></score>
    </div>
  </div>
</template>

<script>
  import Score from "~/pages/song/components/Score/Score";

  export default {
    name: "Scores",
    components: {Score},
    props: ['scores']
  }
</script>

<style scoped>

</style>
