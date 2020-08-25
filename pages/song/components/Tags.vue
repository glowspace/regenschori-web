<template>
    <div class="song-tags p-0 mt-3">
        <div class="d-inline-flex flex-row flex-wrap align-items-start mr-3"
            v-if="song.tags_liturgy_part.length || song.liturgy_approval_status">
            <nuxt-link to="/napoveda#schvaleno-cbk" class="tag tag-blue" v-if="song.liturgy_approval_status">{{
                JSON.parse(song.liturgy_approval_status_string_values)[song.liturgy_approval_status]
            }} <i class="fas fa-check"></i></nuxt-link>
            <nuxt-link class="tag tag-blue" v-for="tag in song.tags_liturgy_part" :key="tag.id"
               :to="'/?stitky=' + tag.id">{{ tag.name }}</nuxt-link>
        </div>

        <div class="d-inline-flex flex-row flex-wrap align-items-start mr-3"
            v-if="song.tags_liturgy_period.concat(song.tags_saints).concat(song.tags_generic).length">
            <nuxt-link class="tag tag-red" v-for="tag in song.tags_liturgy_period" :key="tag.id"
               :to="'/?stitky=' + tag.id">{{ tag.name }}</nuxt-link>
            <nuxt-link class="tag tag-green" v-for="tag in song.tags_saints.concat(song.tags_generic)" :key="tag.id"
               :to="'/?stitky=' + tag.id">{{ tag.name }}</nuxt-link>
        </div>

        <div class="d-inline-flex flex-row flex-wrap align-items-start"
            v-if="song.songbook_records.length">
            <nuxt-link class="tag tag-yellow songbook-tag" v-for="(sb, key) in song.songbook_records" :key="'sb' + key"
                :to="'/?zpevniky=' + sb.songbook.id">
                <span class="songbook-name">{{ sb.songbook.name }}</span><span class="songbook-number">{{ sb.number }}</span>
            </nuxt-link>
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

    props: ['song']
};
</script>
