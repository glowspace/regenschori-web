<template>
    <b-modal :id="id"
             :title="title"
             body-class="p-0">

        <div class="card p-0">
            <div class="card-body p-0">
                <table class="table mb-0">
                    <tr v-for="litref in referenced_songs">
                        <td>
                            <nuxt-link
                                class="p-2 w-100 d-inline-block"
                                :to="litref.song_lyric.public_route"
                                target="_blank">{{ litref.song_lyric.name }}
                            </nuxt-link>
                        </td>
                        <td>koresponduje {{ litref.type }}<br><small>{{ litref.reading }}</small></td>
                        <td>
                            <b-button>Zvolit</b-button>
                        </td>
                    </tr>

                    <tr v-for="song in other_songs">
                        <td>
                            <nuxt-link
                                class="p-2 w-100 d-inline-block"
                                :to="song.public_route"
                                target="_blank">{{ song.name }}
                            </nuxt-link>
                        </td>
                        <td>hodí se na</td>
                        <td>
                            <b-button>Zvolit</b-button>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </b-modal>
</template>

<script>
export default {
    name: "PickAlternativeModal",

    props: [
        'id',
        'title',
        'referenced_songs',
    ],

    data: () => {
        return {
            other_songs: []
        }
    }
}
</script>

<style lang="scss">
body {
    // Quick fix of modal 17px right padding.
    padding-right: 0 !important;
}
</style>
