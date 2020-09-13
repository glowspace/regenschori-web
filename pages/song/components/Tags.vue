<template>
    <div :class="[{'mt-3': !inSongList}, 'd-block']">
        <tag-category
            :taglist="song.tags_liturgy_part"
            :or-condition="song.liturgy_approval_status"
            title="liturgie"
            icon-classes="fas fa-place-of-worship"
            color="blue"
        >
            <a
                href="https://zpevnik.proscholy.cz/napoveda#schvaleno-cbk"
                target="_blank"
                class="tag tag-blue"
                v-if="song.liturgy_approval_status"
            >{{ JSON.parse(song.liturgy_approval_status_string_values)[song.liturgy_approval_status]
            }} <i class="fas fa-check"></i></a>
        </tag-category>
        <tag-category
            :taglist="song.tags_liturgy_period"
            title="liturgický rok"
            icon-classes="fas fa-calendar-day"
            color="red"
        ></tag-category>
        <tag-category
            :taglist="song.tags_generic"
            title="příležitosti"
            icon-classes="fas fa-clock"
            color="green"
        ></tag-category>
        <tag-category
            :taglist="song.tags_saints"
            title="ke svatým"
            icon-classes="fas fa-pray"
            color="green"
        ></tag-category>
        <tag-category
            :taglist="song.tags_history_period"
            title="historické období"
            icon-classes="fas fa-landmark"
            color="red"
        ></tag-category>
        <tag-category
            :taglist="song.tags_musical_form"
            title="hudební forma"
            icon-classes="fas fa-border-style"
            color="green"
        ></tag-category>
        <div
            class="d-flex"
            v-if="song.songbook_records.length"
        >
            <div>
                <span class="tag tag-category" title="zpěvníky"><i class="fas fa-book"></i></span>
            </div>
            <div class="d-flex flex-wrap">
                <component
                    :is="whichComponent"
                    class="tag tag-yellow songbook-tag"
                    v-for="(sb, key) in song.songbook_records"
                    :key="'sb' + key"
                    :to="'/?zpevniky=' + sb.songbook.id"
                >
                    <span class="songbook-name">{{ sb.songbook.name }}</span>
                    <span class="songbook-number">{{ sb.number }}</span>
                </component>
            </div>
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
import TagCategory from './TagCategory';

export default {
    name: 'Tags',

    components: { TagCategory },

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
