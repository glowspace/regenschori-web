<template>
    <div class="container">
        <div class="mt-4 mb-3">
            <div>
                <h1 class="song-title">{{ song.name }}</h1>
                <div class="d-flex align-items-center mt-1">
                    <h4 class="song-number m-0">{{ song.song_number }}</h4>
                    <p class="song-author ml-3 mb-0">
                        <song-author-label :song="song"></song-author-label>
                    </p>
                </div>
            </div>
            <tags :song="song"></tags>
        </div>
        <song-box
            :song_lyric="song"
        ></song-box>
    </div>
</template>

<script>
import SongAuthorLabel from './components/SongAuthorLabel';
import SongBox from './components/SongBox/SongBox';
import Tags from './components/Tags';

export default {
    name: 'SongDetail',

    components: {
        SongBox,
        SongAuthorLabel,
        Tags
    },

    props: ['song']
};
</script>
