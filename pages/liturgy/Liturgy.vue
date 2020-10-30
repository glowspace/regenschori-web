<template>
    <div class="container">
        <h1>Co hrát na mši?</h1>
        <div class="row">
            <div class="col-lg-9">
                <div class="card">
                    <div class="card-body p-0">
                        <div class="songs-list">
                            <v-progress-linear
                                indeterminate
                                color="bg-main-blue"
                                :height="4"
                                :class="[!$apollo.loading ? '' : 'opacity-1', 'custom-progress-bar']"
                            ></v-progress-linear>
                            <table class="table m-0">
                                <tbody>
                                    <tr v-if="$apollo.loading && !(liturgical_references && liturgical_references.length)">
                                        <td style="width:4rem">
                                            <div class="d-flex justify-content-end align-items-center">
                                                <span>&nbsp;</span>
                                                <span
                                                    class="spinner-border spinner-border-sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                            </div>
                                        </td>
                                        <td>Načítám...</td>
                                        <td class="p-1" colspan="5">
                                            <a
                                                class="btn btn-secondary float-right m-0"
                                                :href="
                                                    'https://docs.google.com/forms/d/e/1FAIpQLScmdiN_8S_e8oEY_jfEN4yJnLq8idxUR5AJpFmtrrnvd1NWRw/viewform?usp=pp_url&entry.1025781741=' +
                                                        encodeURIComponent($route.fullPath)
                                                "
                                            >
                                                Nahlásit
                                            </a>
                                        </td>
                                    </tr>
                                    <template
                                        v-else-if="liturgical_references && liturgical_references.length"
                                    >
                                        <tr>
                                            <th class="text-right" title="číslo písně ve Zpěvníku ProScholy.cz">#</th>
                                            <th class="align-middle">název písně</th>
                                            <th class="p-1 align-middle">autoři</th>
                                            <th class="align-middle">odkaz</th>
                                            <th class="align-middle">datum</th>
                                            <th class="align-middle">vazba</th>
                                            <th class="align-middle pr-4">cyklus</th>
                                        </tr>
                                        <tr
                                            v-for="litref in liturgical_references"
                                            :key="litref.song_lyric.id"
                                        >
                                            <td
                                                class="p-1 align-middle text-right w-min"
                                            >
                                                <nuxt-link
                                                    class="p-2 pl-3 w-100 d-flex justify-content-between text-secondary"
                                                    :to="litref.song_lyric.public_route"
                                                >{{ litref.song_lyric.song_number }}</nuxt-link>
                                            </td>
                                            <td
                                                class="p-1 align-middle"
                                            >
                                                <nuxt-link
                                                    class="p-2 w-100 d-inline-block"
                                                    :to="litref.song_lyric.public_route"
                                                >{{ litref.song_lyric.name }}</nuxt-link>
                                            </td>
                                            <td
                                                class="p-1 align-middle"
                                            >
                                                <span
                                                    v-for="(ap,
                                                    authorIndex) in litref.song_lyric.authors_pivot"
                                                    :key="authorIndex"
                                                >
                                                    <span v-if="authorIndex">,</span>
                                                    <nuxt-link
                                                        :to="ap.author.public_route"
                                                        :title="litref.song_lyric.type ? {'GENERIC':'','LYRICS':'text','MUSIC':'hudba'}['LYRICS'] : {'GENERIC':'','LYRICS':'text','MUSIC':'hudba'}[ap.authorship_type]"
                                                        class="text-secondary"
                                                        >{{ ap.author.name }}</nuxt-link
                                                    >
                                                </span>
                                            </td>
                                            <td class="align-middle">{{ litref.reading }}</td>
                                            <td class="align-middle" style="white-space:nowrap">{{
                                                (new Date(litref.date)).toLocaleDateString(undefined, {weekday: 'short', day: 'numeric', month: 'numeric'})
                                            }}</td>
                                            <td class="align-middle">{{ litref.type }}</td>
                                            <td class="align-middle pr-4">{{ litref.cycle }}</td>
                                        </tr>
                                    </template>
                                    <tr v-else-if="!$apollo.loading">
                                        <td class="p-1" colspan="7">
                                            <span class="px-3 py-2 d-inline-block"
                                                >Nebyla nalezena žádná vhodná píseň.</span
                                            >
                                            <a
                                                class="btn btn-secondary float-right m-0"
                                                :href="'https://forms.gle/AYXXxkWtDHQQ13856'"
                                            >
                                                Přidat píseň
                                            </a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3">
                <p class="card px-4 py-3">Písně k aktuální liturgii jsou generovány automaticky podle korespondence textu písně s&nbsp;mešním čtením, liturgického období atd.</p>
            </div>
        </div>

        <a href="http://www.musicasacra.cz/" target="_blank" class="footer-logo">
            <img src="/img/musica-sacra.svg" />
        </a>

        <a
            class="btn btn-secondary mb-0 search-report bg-transparent"
            title="Nahlásit"
            :href="
                'https://docs.google.com/forms/d/e/1FAIpQLScmdiN_8S_e8oEY_jfEN4yJnLq8idxUR5AJpFmtrrnvd1NWRw/viewform?usp=pp_url&entry.1025781741=' +
                    encodeURIComponent($route.fullPath)
            "
        >
            <i class="fas fa-exclamation-triangle p-0"></i>
        </a>
    </div>
</template>

<script>
import gql from 'graphql-tag';

const FETCH_ITEMS = gql`
    query {
        liturgical_references {
            song_lyric {
                id
                name
                song_number
                type
                public_route
                only_regenschori
                authors_pivot {
                    author {
                        id
                        name
                        public_route
                    }
                    authorship_type
                }
            }
            reading
            date
            type
            cycle
        }
    }
`;

export default {
    head() {
        return {
            title: this.getTitle(),
            meta: [
                {property: 'og:title', content: this.getTitle()},
                {property: 'twitter:title', content: this.getTitle()},
                {name: 'description', content: this.getDescription()},
                {property: 'og:description', content: this.getDescription()},
                {property: 'twitter:description', content: this.getDescription()}
            ],
            bodyAttrs: {
                class: ['home']
            }
        }
    },

    data() {
        return {
            titleWebsite: process.env.titleWebsite,
            titleSeparator: process.env.titleSeparator
        };
    },

    methods: {
        getTitle() {
            return 'Co hrát na mši' + this.titleSeparator + this.titleWebsite;
        },

        getDescription() {
            return 'Co hrát v neděli na mši svaté? I to zjistíte na Zpěvníku ProScholy.cz.';
        }
    },

    apollo: {
        liturgical_references: {
            query: FETCH_ITEMS
        }
    }
};
</script>
