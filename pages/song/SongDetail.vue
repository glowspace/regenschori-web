<template>
    <div class="pt-3 pb-4 px-4">
        <div class="mb-3">
            <h1 class="song-title">{{ song_lyric.name }}</h1>
            <div class="d-flex align-items-center mt-1">
                <h4 class="song-number m-0">{{ song_lyric.song_number }}</h4>
                <p class="song-author ml-3 mb-0">
                    <song-author-label :song="song_lyric"></song-author-label>
                </p>
            </div>
            <tags :song="song_lyric"></tags>
        </div>
        <song-box :song_lyric="song_lyric"></song-box>
    </div>
</template>

<script>
import SongAuthorLabel from './components/SongAuthorLabel';
import Tags from './components/Tags';
import SongBox from './components/SongBox';

export default {
    name: 'SongDetail',

    components: {
        SongAuthorLabel,
        Tags,
        SongBox
    },

    props: ['song_lyric']
};
</script>
