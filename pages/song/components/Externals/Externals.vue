<template>
  <client-only>
  <div v-if="mediaFiles.length + mediaExternals.length"
       class="mb-3">
    <h5 class="mb-2">Nahrávky</h5>

    <div v-for="external in mediaFiles">
      <external-view
        :url="external.url"
        :download-url="external.download_url"
        :media-id="external.media_id"
        :type="fileTypeConvert(external.type)"
        :authors="external.authors"
      ></external-view>
    </div>

    <div v-for="external in mediaExternals">
      <external-view
        :url="external.url"
        :download-url="external.download_url"
        :media-id="external.media_id"
        :type="external.type"
        :authors="external.authors"
      ></external-view>
    </div>
  </div>
  </client-only>
</template>

<script>
  import ExternalView from "~/pages/song/components/Externals/ExternalView";

  export default {
    name: "Externals",
    components: {ExternalView},
    props: ['song'],

    methods: {
      fileTypeConvert: function (type) {
        const mapping = {
          1: 8,
          2: 9,
          3: 4,
          4: 7
        };

        return mapping[type] || type;
      },
    },

    computed: {
      mediaExternals: {
        get() {
          if (!this.hasExternalsOrFiles) {
            return [];
          }

          return this.song.externals.filter(ext =>
            [1, 2, 3, 7].includes(ext.type)
          );
        }
      },

      mediaFiles: {
        get() {
          if (!this.hasExternalsOrFiles) {
            return [];
          }

          return this.song.files.filter(file =>
            [1, 2, 3, 7].includes(this.fileTypeConvert(file.type))
          );
        }
      },

      hasExternalsOrFiles: {
        get() {
          return (
            this.song &&
            (this.song.externals || this.song.files) &&
            (this.song.externals.length || this.song.files.length)
          );
        }
      },
    }
  }
</script>

<style scoped>

</style>
