<template>
  <span class="badge"
        :class="{disabled: !active}"
        @click="toggle()">{{tag.name}}</span>
</template>

<script>
  import search_state from "~/pages/search/search_state";

  export default {
    name: "FilterTagSelectBadge",

    data: () => {
      return {
        active: false,

        selected_tags: search_state.selected_tags
      }
    },

    props: ['tag'],

    methods: {
      /**
       * Toggle state of badge.
       */
      toggle() {
        if (this.active) {
          this.unselect()
        }
        else {
          this.select()
        }
      },

      /**
       * Enable this filter and store tag into search storage.
       */
      select() {
        this.active = true;

        // Add to correct filter array
        if (this.tag.type_enum === 'LITURGY_PART') {
          this.selected_tags.liturgy_part_tags.push(this.tag);
        }

        if (this.tag.type_enum === 'LITURGY_PERIOD') {
          this.selected_tags.liturgy_period_tags.push(this.tag);
        }

        if (this.tag.type_enum === 'HISTORY_PERIOD') {
          this.selected_tags.historical_period_tags.push(this.tag);
        }

        if (this.tag.type_enum === 'INSTRUMENTATION') {
          this.selected_tags.instrumentation_tags.push(this.tag);
        }
      },

      unselect() {
        this.active = false;

        // Remove from filter array
        if (this.tag.type_enum === 'LITURGY_PART') {
          this.selected_tags.liturgy_part_tags = this.selected_tags.liturgy_part_tags.filter(obj => obj.id !== this.tag.id);

        }

        if (this.tag.type_enum === 'LITURGY_PERIOD') {
          this.selected_tags.liturgy_period_tags = this.selected_tags.liturgy_period_tags.filter(obj => obj.id !== this.tag.id);

        }

        if (this.tag.type_enum === 'HISTORY_PERIOD') {
          this.selected_tags.historical_period_tags = this.selected_tags.historical_period_tags.filter(obj => obj.id !== this.tag.id);

        }

        if (this.tag.type_enum === 'INSTRUMENTATION') {
          this.selected_tags.instrumentation_tags = this.selected_tags.instrumentation_tags.filter(obj => obj.id !== this.tag.id);
        }
      }
    }
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
