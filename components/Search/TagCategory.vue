<template>
    <div class="position-relative">
        <div :class="['h5 mt-2 d-flex flex-wrap align-items-center justify-content-between', {'position-relative': !isClosed}]">
            <span>{{ heading }}</span>
            <button :class="['btn btn-secondary stretched-link']" @click="isClosed = !isClosed"><i :class="['fas', 'fa-chevron-' + (isClosed ? 'down' : 'up')]"></i></button>
        </div>
        <div :class="{ 'text-nowrap overflow-hidden': isClosed }">
            <a
                :class="[
                    {'tag-selected': isSelectedTag(tag)},
                    'tag tag-' + color
                ]"
                v-for="tag in tagsInCategory.filter(t => t.song_lyrics_count !== 0)"
                :key="'tag-' + tag.id"
                @click="$emit('selectTag', tag)"
                >{{ tag.name }}</a
            >
        </div>
    </div>
</template>

<script>
export default {
    props: ['heading', 'color', 'tags-in-category', 'selected-tags'],

    data() {
        return {
            isClosed: true
        };
    },

    mounted() {
        if (this.categoryContainsSelected) {
            this.isClosed = false;
        }
    },

    computed: {
        categoryContainsSelected() {
            return this.tagsInCategory.some(tag => {
                if (this.selectedTags[tag.id]) {
                    return true;
                }
            });
        }
    },

    watch: {
        categoryContainsSelected(val) {
            if (val) {
                this.isClosed = false;
            }
        }
    },

    methods: {
        isSelectedTag(tag) {
            return this.selectedTags[tag.id];
        }
    }
}
</script>
