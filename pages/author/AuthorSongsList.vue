<template>
    <div class="card">
        <div class="card-header p-1"><div class="px-3 py-2 d-inline-block">{{ text }}</div></div>
        <div class="card-body p-0">
            <table class="table m-0">
                <tbody>
                    <tr v-for="(sl, key) in songs" :key="key">
                        <td class="p-1 align-middle">
                            <nuxt-link class="px-3 py-2 w-100 d-inline-block" :to="sl.public_route">{{ sl.name }}</nuxt-link>
                        </td>
                        <td class="author-secondary-links px-1 py-2 align-middle">
                            <song-author-label :song="sl"></song-author-label>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import SongAuthorLabel from '../song/components/SongAuthorLabel';

export default {
    name: 'AuthorSongsList',

    components: {
        SongAuthorLabel
    },

    props: ['text', 'songs']
};
</script>
