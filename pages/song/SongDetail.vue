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
                                <h1 class="song-title">{{ song.name }}</h1>
                                <song-author-label :authors="song.authors"></song-author-label>

                                <song-type :song="song"/>
                            </div>
                        </div>
                        <hr>

                        <div class="row">
                            <div class="col-6">
                                <song-preview :song="song"></song-preview>
                            </div>
                            <div class="col-6">
                                <scores :song="song"/>

                                <externals :song="song"/>

                                <h5>Související</h5>
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
    import SongPreview from "~/pages/song/components/Preview/SongPreview";
    import SongType from "~/pages/song/components/SongType";
    import Externals from "~/pages/song/components/Externals/Externals";

    export default {
        name: "SongDetail",

        components: {
            Externals,
            SongType,
            SongPreview,
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

