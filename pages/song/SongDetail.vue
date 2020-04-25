<template>
    <div class="container-fluid mt-5">
        <div class="row">
            <div class="col-3">
                <search-box></search-box>
            </div>
            <div class="col-9">
                <div class="card">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-6 song-tags">
                                <div>
                                    <h5>Část mše:</h5>
                                    <badge title="Úvod"/>
                                    <badge title="Přijímání"/>
                                    <badge title="Závěr"/>
                                </div>
                                <div>
                                    <h5>Liturgická doba:</h5>

                                    <badge title="Velikonoce"/>
                                    <badge title="Mezidobí"/>
                                </div>
                                <div>
                                    <h5>Typ:</h5>

                                    <badge title="Píseň"/>
                                    <badge title="Proprium"/>
                                </div>
                                <div>
                                    <h5>Období:</h5>

                                    <badge title="Baroko"/>
                                </div>


                            </div>
                            <div class="col-6 text-right">
                                <h2 class="song-title">{{ song.name }}</h2>
                                <song-author-label :song="song"></song-author-label>

                                <badge title="Originální skladba"
                                       v-if="song.type === 0"
                                       class="mt-2"></badge>

                                <badge title="Překlad"
                                       v-if="song.type === 1"
                                       class="mt-2"></badge>

                                <badge title="Aranž"
                                       v-if="song.type === 2"
                                       class="mt-2"></badge>
                            </div>
                        </div>
                        <hr>

                        <div class="row">
                            <div class="col-6">
                                <h5>Náhled</h5>
                            </div>
                            <div class="col-6">
                                <h5>Noty</h5>
                                <scores :scores="song"></scores>

                                <h5 class="mt-3">Nahrávky</h5>

                                <h5 class="mt-3">Související</h5>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

        <!-- admin-toolbox :song="song" v-if="false"></admin-toolbox -->
    </div>
</template>

<script>
    import SongAuthorLabel from "./components/SongAuthorLabel";
    import SongView from "./components/SongBox/SongBox";
    import Badge from "~/components/Badge";
    import SearchBox from "~/pages/search/components/SearchBox";
    import Scores from "~/pages/song/components/Score/Scores";

    export default {
        name: "SongDetail",

        components: {
            Scores,
            SearchBox,
            Badge,
            SongView,
            SongAuthorLabel
        },

        props: ['song']
    }
</script>

<style scoped
       lang="scss">
    @import '~bootstrap/scss/functions.scss';
    @import '~bootstrap/scss/variables.scss';
    @import '~bootstrap/scss/mixins.scss';

    .container-fluid {

        @include media-breakpoint-up('lg') {
            padding: 0 60px;
        }

    }

    .song-tags {
        h5 {
            display:       inline-block;
            padding-right: 8px;
        }
    }
</style>

