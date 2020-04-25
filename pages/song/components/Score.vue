<template>
  <div>
    <div @click="opened = !opened"
         class="toggler">
      <span><i class="fas fa-chevron-down"></i> Název not</span>
    </div>

    <div v-if="opened"
         class="content">
      <p>Autor:</p>

      <p>Editor:</p>

      <badge title="Varhany"></badge>
      <badge title="Zpěv"></badge>
      <badge title="Soprán"></badge>
      <badge title="Alt"></badge>
      <badge title="Tenor"></badge>
      <badge title="Bas"></badge>

      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam volutpat, odio at volutpat pellentesque, eros erat fermentum mi, at tristique tortor lectus non dolor.
        Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Maecenas eu ligula elit. Sed ut auctor risus, ut dictum libero. Nulla finibus velit id
        ornare venenatis. Donec a velit eleifend, scelerisque sapien ut, hendrerit diam. Nunc e!citur rutrum nulla, sit amet dapibus aug.</p>
    </div>
  </div>
</template>

<script>
  import Badge from "~/components/Badge";
  export default {
    name: "Score",
    components: {Badge},
    data: () => {
      return {
        opened: false,
      }
    }
  }
</script>

<style scoped>
  .toggler {
    cursor:        pointer;

    display:       block;

    border-bottom: 1px #d0d0d0 solid;
    padding-bottom: 8px;
    margin-bottom: 10px;
  }


  .content {
    font-size:    80%;
    color:        grey;
    padding-left: 25px;
  }
</style>
