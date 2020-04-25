<template>
  <span class="badge">{{title}}</span>
</template>

<script>
  export default {
    name: "Badge",

    props: ['title'],
  }
</script>

<style scoped
       lang="scss">
  .badge {
    position:         relative;
    bottom:           2px;

    display:          inline-block;

    padding:          4px 12px 3px;

    color:            #fa541c;

    border-radius:    4px;
    border:           1px solid #fcb47d;
    background-color: #fff2e8;

    font-family: PingFang, sans-serif;
    font-weight: 300;
  }
</style>
