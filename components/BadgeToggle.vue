<template>
  <span class="badge"
        :class="{disabled: !active}"
        @click="active = !active">{{title}}</span>
</template>

<script>
  export default {
    name: "BadgeToggle",

    data: () => {
      return {
        active: false,
      }
    },

    props: ['title'],
  }
</script>

<style scoped
       lang="scss">
  .badge {
    position:         relative;
    bottom:           2px;

    display:          inline-block;

    margin-right:     5px;
    margin-bottom:    10px;
    padding:          4px 12px 3px;

    color:            #fa541c;

    border-radius:    4px;
    border:           1px solid #fcb47d;
    background-color: #fff2e8;

    font-family:      PingFang, sans-serif;
    font-weight:      300;

    cursor:           pointer;

    transition:       0.3s;
  }

  .disabled {
    color:            #1f1f1f;
    border-color:     #a3a3a3;

    background-color: #ececec;
  }
</style>
