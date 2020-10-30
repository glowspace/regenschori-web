<template>
    <div class="container">
        <h1>Co hrát na mši {{ headerDateString }}?</h1>
        <div class="d-flex mb-3">
            <nuxt-link
                :to="'/liturgie/aktualne/' + getDate(-7)[0]"
                class="tag tag-blue"
            ><i class="fas fa-chevron-left"></i></nuxt-link>
            <nuxt-link
                v-if="todayDate != thisDate"
                :to="'/liturgie/aktualne/' + todayDate"
                class="tag tag-blue"
            ><i class="fas fa-redo-alt"></i></nuxt-link>
            <div style="overflow-x:auto;white-space:nowrap" class="w-100 text-center">
                <nuxt-link
                    v-for="i in 9"
                    :key="i"
                    :to="'/liturgie/aktualne/' + getDate(i - 1)[0]"
                    :class="['tag tag-blue', {'tag-selected': thisDate == getDate(i - 1)[0]}]"
                >{{ getDate(i - 1)[1] }}</nuxt-link>
            </div>
            <nuxt-link
                :to="'/liturgie/aktualne/' + getDate(9)[0]"
                class="tag tag-blue"
            ><i class="fas fa-chevron-right"></i></nuxt-link>
        </div>
        <div v-for="tag in tags_enum" :key="tag.id">
            <h2>{{ tag.name.charAt(0).toUpperCase() + tag.name.slice(1) }}</h2>
            <h3 class="h5">Písně podle liturgického kalendáře</h3>
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
            <h3 class="h5">Další písně</h3>
            <div class="card">
                <div class="card-body p-0">
                    <SongsList
                        :search-string="''"
                        :selected-tags="{}"
                        :selected-songbooks="{}"
                        :selected-languages="{}"
                        :sort="0"
                        :descending="false"
                        :seed="seed"
                        :disable-observer="true"
                        :override-per-page="3"
                    ></SongsList>
                </div>
            </div>
        </div>

        <p>Písně k aktuální liturgii jsou generovány automaticky podle korespondence textu písně s&nbsp;mešním čtením, liturgického období atd.</p>

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
import SongsList from '../search/components/SongsList';

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
            }
            reading
            date
            type
            cycle
        }
    }
`;

const FETCH_TAGS = gql`
    query {
        tags_enum(type:LITURGY_PART) {
            id
            name
        }
    }
`;

export default {
    components: {
        SongsList
    },

    head() {
        return {
            title: this.getTitle(),
            meta: [
                {property: 'og:title', content: this.getTitle()},
                {property: 'twitter:title', content: this.getTitle()},
                {name: 'description', content: this.getDescription()},
                {property: 'og:description', content: this.getDescription()},
                {property: 'twitter:description', content: this.getDescription()}
            ]
        }
    },

    data() {
        return {
            titleWebsite: process.env.titleWebsite,
            titleSeparator: process.env.titleSeparator,
            thisDate: this.$route.params.date || new Date().toISOString().split('T')[0],
            seed: null
        };
    },

    asyncData() {
        const randomInteger = function randomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        return {
            seed: randomInteger(1, 100000)
        };
    },

    methods: {
        getTitle() {
            return 'Co hrát na mši ' + this.headerDateString + this.titleSeparator + this.titleWebsite;
        },

        getDescription() {
            return 'Co hrát v neděli na mši svaté? I to zjistíte na Zpěvníku ProScholy.cz.';
        },

        getDate(i) {
            var theDay = new Date(this.thisDate);
            theDay.setDate(theDay.getDate() - 1 + i);
            return [theDay.toISOString().split('T')[0], this.$dateFns.format(theDay, 'EEEEEE d. M.', { locale: 'cs' })];
        }
    },

    computed: {
        headerDateString() {
            return this.$dateFns.format(new Date(this.thisDate), 'd. MMMM', { locale: 'cs' });
        },

        todayDate() {
            return new Date().toISOString().split('T')[0];
        }
    },

    apollo: {
        liturgical_references: {
            query: FETCH_ITEMS
        },
        tags_enum: {
            query: FETCH_TAGS
        }
    },

    mounted() {
        if (!this.$route.params.date) {
            window.history.replaceState(null, '', '/liturgie/aktualne/' + this.thisDate);
        }
    }
};
</script>
