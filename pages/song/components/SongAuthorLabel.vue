<template>
    <span>
        <span v-if="song.type">
            <span v-if="original">
                <span>Originál: </span>
                <nuxt-link :to="original.public_route">{{ original.name }}</nuxt-link><br>
                <span v-if="original.authors_pivot.length == 0">Autor neznámý,</span>
                <span v-else>
                    <span v-if="original.authors_pivot.length == 1">Autor:</span>
                    <span v-else>Autoři:</span>
                    <span v-for="(ap, key) in original.authors_pivot" :key="key">
                        <nuxt-link :to="ap.author.public_route"
                        :title="{'GENERIC':'','LYRICS':'text','MUSIC':'hudba'}[ap.authorship_type]"
                        >{{ ap.author.name }}</nuxt-link><span>, </span>
                    </span>
                </span>
            </span>

            <span v-if="song.authors_pivot.length == 0">{{original?'a':'A'}}utor překladu neznámý</span>
            <span v-else>
                <span v-if="song.authors_pivot.length == 1">{{original?'a':'A'}}utor překladu:</span>
                <span v-else>{{original?'a':'A'}}utoři překladu:</span>
                <span v-for="(ap, key2) in song.authors_pivot" :key="key2">
                    <span v-if="key2">,</span> <nuxt-link :to="ap.author.public_route"
                    :title="{'GENERIC':'','LYRICS':'text','MUSIC':'hudba'}['LYRICS']"
                    >{{ ap.author.name }}</nuxt-link>
                </span>
            </span>
        </span>
        <span v-else>
            <span v-if="song.authors_pivot.length == 0">Autor neznámý</span>
            <span v-else>
                <span v-if="song.authors_pivot.length == 1">Autor:</span>
                <span v-else>Autoři:</span>
                <span v-for="(ap, key3) in song.authors_pivot" :key="key3">
                    <span v-if="key3">,</span> <nuxt-link :to="ap.author.public_route"
                    :title="{'GENERIC':'','LYRICS':'text','MUSIC':'hudba'}[ap.authorship_type]"
                    >{{ ap.author.name }}</nuxt-link>
                </span>
            </span>
        </span>
    </span>
</template>

<script>
export default {
    name: 'SongAuthorLabel',

    props: ['song'],

    computed: {
        original: function() {
            return this.song.song.song_lyrics.find(sl => {
                return sl.type === 0
            });
        }
    }
};
</script>
