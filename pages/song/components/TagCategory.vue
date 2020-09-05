<template>
    <div
        class="d-flex"
        v-if="taglist.length || orCondition"
    >
        <div>
            <span class="tag tag-category" :title="title"><i :class="iconClasses"></i></span>
        </div>
        <div class="d-flex flex-wrap">
            <component
                :is="whichComponent"
                :class="'tag tag-' + color"
                v-for="tag in taglist"
                :key="tag.id"
                :to="'/?stitky=' + tag.id"
            >{{ tag.name }}</component>
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TagCategory',

    props: ['taglist', 'or-condition', 'title', 'icon-classes', 'color'],

    computed: {
        whichComponent() {
            if (this.$parent.inSongList) {
                return 'span';
            }
            return 'nuxt-link';
        }
    }
};
</script>
