<template>
  <tbody>
  <tr>
    <td class="text-right">
        <span class="fas fa-plus toggler" v-if="!active"
              @click="active = !active"></span>

      <span class="fas fa-minus toggler" v-if="active"
            @click="active = !active"></span>
    </td>
    <td>{{song.name}}</td>
    <td>
      <song-author-label :authors="song.authors"></song-author-label>
    </td>
    <td>
      <song-type :song="song"></song-type>
    </td>
    <td></td>
    <td></td>
  </tr>
  <tr class="additional-info"
      v-if="active">
    <td></td>
    <td colspan="6">
      <p>Liturgická doba</p>
      <p>Období</p>
      <p>Instrumentace</p>
    </td>
  </tr>
  </tbody>
</template>

<script>
  import SongAuthorLabel from "~/pages/song/components/SongAuthorLabel";
  import SongType from "~/pages/song/components/SongType";
  export default {
    name: "SearchResultLine",
    components: {SongType, SongAuthorLabel},
    props: ['song'],

    data: () => {
      return {
        active: false,
      }
    }
  }
</script>

<style scoped>
  .toggler {
    border: 1px #b3b3b3 solid;

    font-size: 10px;
    border-radius: 3px;

    color: grey;
    padding: 3px;

    cursor: pointer;

    position:relative;
    bottom: 2px;
  }


  .additional-info {

  }
</style>
