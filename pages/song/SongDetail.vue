<template>
    <div class="py-3 px-4">
        <div class="mb-3">
            <h1 class="song-title">{{ song.name }}</h1>
            <p class="song-author mb-0">
                <song-author-label :song="song"></song-author-label>
            </p>
            <tags :song="song"></tags>
        </div>
        <div class="tools"></div>
    </div>
</template>

<script>
import SongAuthorLabel from './components/SongAuthorLabel';
import Tags from './components/Tags';

export default {
    name: 'SongDetail',

    components: {
        SongAuthorLabel,
        Tags
    },

    props: ['song'],
};
</script>
