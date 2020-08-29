<template>
    <div :class="[{'mt-3': !inSongList}, 'd-block']">
        <div class="d-inline-flex flex-row flex-wrap align-items-start mr-3"
            v-if="song.tags_liturgy_part.length || song.liturgy_approval_status">
            <component :is="whichComponent" to="/napoveda#schvaleno-cbk" class="tag tag-blue" v-if="song.liturgy_approval_status">{{
                JSON.parse(song.liturgy_approval_status_string_values)[song.liturgy_approval_status]
            }} <i class="fas fa-check"></i></component :is="whichComponent">
            <component :is="whichComponent" class="tag tag-blue" v-for="tag in song.tags_liturgy_part" :key="tag.id"
               :to="'/?stitky=' + tag.id">{{ tag.name }}</component :is="whichComponent">
        </div>

        <div class="d-inline-flex flex-row flex-wrap align-items-start mr-3"
            v-if="song.tags_liturgy_period.concat(song.tags_saints).concat(song.tags_generic).length">
            <component :is="whichComponent" class="tag tag-red" v-for="tag in song.tags_liturgy_period" :key="tag.id"
               :to="'/?stitky=' + tag.id">{{ tag.name }}</component :is="whichComponent">
            <component :is="whichComponent" class="tag tag-green" v-for="tag in song.tags_saints.concat(song.tags_generic)" :key="tag.id"
               :to="'/?stitky=' + tag.id">{{ tag.name }}</component :is="whichComponent">
        </div>

        <div class="d-inline-flex flex-row flex-wrap align-items-start"
            v-if="song.songbook_records.length">
            <component :is="whichComponent" class="tag tag-yellow songbook-tag" v-for="(sb, key) in song.songbook_records" :key="'sb' + key"
                :to="'/?zpevniky=' + sb.songbook.id">
                <span class="songbook-name">{{ sb.songbook.name }}</span><span class="songbook-number">{{ sb.number }}</span>
            </component :is="whichComponent">
        </div>
    </div>
</template>

<script>
/**
 * Song tags component.
 *
 * It renders:
 * 1) related tags
 * 2) related songbooks
 * 3) liturgy approval
 */
export default {
    name: 'Tags',

    props: ['song', 'in-song-list'],

    computed: {
        whichComponent() {
            if (this.inSongList) {
                return 'span';
            }
            return 'nuxt-link';
        }
    }
};
</script>
