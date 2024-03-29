<template>
    <div :class="[{'mt-3': !inSongList}, 'd-block']">
        <tag-category
            :taglist="song.tags_liturgy_part"
            :or-condition="song.is_approved_for_liturgy"
            title="mše svatá"
            icon-classes="fas fa-place-of-worship"
            color="blue"
        >
            <a
                href="https://zpevnik.proscholy.cz/napoveda#schvaleno-cbk"
                class="tag tag-blue"
                v-if="song.is_approved_for_liturgy"
            >schváleno ČBK pro liturgii <i class="fas fa-check"></i></a>
        </tag-category>
        <tag-category
            :taglist="song.tags_liturgy_period"
            title="liturgický rok"
            icon-classes="fas fa-calendar-day"
            color="red"
        ></tag-category>
        <tag-category
            :taglist="song.tags_sacred_occasion"
            title="svátosti a pobožnosti"
            icon-classes="fas fa-clock"
            color="green"
        ></tag-category>
        <tag-category
            :taglist="song.tags_generic"
            title="k příležitostem"
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
            v-if="publicSongbookRecords.length"
        >
            <div>
                <span class="tag tag-category" title="zpěvníky"><i class="fas fa-book"></i></span>
            </div>
            <div class="d-flex flex-wrap">
                <component
                    :is="whichComponent"
                    class="tag tag-yellow songbook-tag"
                    v-for="(sb, key) in publicSongbookRecords"
                    :key="'sb' + key"
                    :to="'/?zpevniky=' + sb.pivot.songbook.id"
                >
                    <span class="songbook-name">{{ sb.pivot.songbook.name }}</span>
                    <span class="songbook-number">{{ sb.pivot.number }}</span>
                </component>
            </div>
        </div>
        <div class="d-flex" v-if="bibleRefs">
            <div>
                <span class="tag tag-category" title="biblické reference"><i class="fas fa-bible"></i></span>
            </div>
            <div class="d-flex flex-wrap">
                <a
                    class="tag tag-blue"
                    v-for="(reference, key2) in bibleRefs"
                    :key="'ref' + key2"
                    :href="`https://www.bibleserver.com/CEP/${reference}`"
                >{{ reference }}</a>
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
 * 4) bible reference
 */
import TagCategory from './TagCategory';
import bible from 'bible-liturgy-utils/bible/bible'

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
        },

        publicSongbookRecords() {
            return this.song.songbook_records.filter(sb => !sb.pivot.songbook.is_private)
        },

        bibleRefs() {
            if (this.song.bible_refs_src) {
                const lines = this.song.bible_refs_src.split('\n');
                const bib_refs = lines.map(bible.parseEuropean);
                const lines_cz = bib_refs.flatMap(r => r.toCzechStrings());

                return lines_cz;
            }

            return false;
        }
    }
};
</script>
