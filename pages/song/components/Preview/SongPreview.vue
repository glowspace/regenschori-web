<template>
  <!--<embed src=""
         type="application/pdf"
         width="100%"
         height="1000px"/>-->
<div>
  <div>
    <h5>Text skladby</h5>

    <div class="card text-preview">{{song.lyrics_no_chords}}</div>
  </div>


</div>


</template>

<script>
  import SongLyricParts from "~/pages/song/components/Renderer/SongLyricParts";
  export default {
    name: "SongPreview",
    components: {SongLyricParts},
    props: ['song'],
  }
</script>

<style scoped>
 .text-preview {
   white-space: pre;
 }
</style>
