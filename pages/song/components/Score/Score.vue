<template>
    <div>
        <div @click="opened = !opened" class="toggler">
            <span>
                <i
                    class="fas fa-chevron-right ml-2"
                    style="width: 15px"
                    v-if="!opened"
                ></i>
                <i
                    class="fas fa-chevron-down ml-2"
                    style="width: 15px"
                    v-else
                ></i>
                {{ score.public_name }}</span
            >
        </div>

        <div v-if="opened" class="content mb-3">
            <div class="mb-2">
                <song-author-label :authors="score.authors" />
            </div>

            <badge
                :title="tag.name"
                v-for="tag in score.tags"
                :key="tag.id"
            ></badge>

            <div>
                <a :href="score.url" class="mr-3">Zobrazit</a>
                <a :href="score.download_url">Stáhnout noty</a>
            </div>
        </div>
    </div>
</template>

<script>
import Badge from '~/components/Badge';
import SongAuthorLabel from '~/pages/song/components/SongAuthorLabel';

export default {
    name: 'Score',

    components: { SongAuthorLabel, Badge },
    props: ['score'],

    mounted() {
        // console.log(this.score);
    },

    data: () => {
        return {
            opened: false
        };
    }
};
</script>

<style scoped>
.toggler {
    cursor: pointer;

    display: block;

    border-bottom: 1px #d0d0d0 solid;
    padding-bottom: 8px;
    margin-bottom: 10px;
}

.content {
    font-size: 80%;
    color: grey;
    padding-left: 25px;
}
</style>
