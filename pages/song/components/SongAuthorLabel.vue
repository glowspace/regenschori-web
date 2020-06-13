<template>
    <div class="authors">
        <span v-if="authors.length === 1">Autor:</span>
        <span v-if="authors.length > 1">Autoři:</span>

        <!-- Original -->
        <nuxt-link
            v-for="(author, index) in authors"
            to="/"
            :key="author.id"
            class="link-author"
        >
            {{ author.name }}{{ index !== authors.length - 1 ? ', ' : '' }}
        </nuxt-link>
    </div>
</template>

<script>
export default {
    name: 'SongAuthorLabel',
    props: ['authors'],

    mounted() {
        // console.log(this.authors);
    }
};
</script>

<style scoped>
.link-author {
    color: #6d6d6d;
}

.authors {
    color: #6d6d6d;
}
</style>
