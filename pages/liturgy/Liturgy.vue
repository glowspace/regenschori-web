<template>
    <div class="container">
        <h1>Co hrát na mši {{ headerDateString }}?</h1>
        <p>Písně k aktuální liturgii jsou generovány automaticky podle korespondence textu písně s&nbsp;mešním čtením, liturgického období atd.</p>
        <div class="d-flex mb-3">
            <nuxt-link
                :to="'/liturgie/aktualne/' + getDate(-5)[0]"
                class="tag tag-blue flex-shrink-0"
            ><i class="fas fa-chevron-left mr-3"></i>&minus;7</nuxt-link>
            <nuxt-link
                v-if="todayDate != thisDate"
                :to="'/liturgie/aktualne/' + todayDate"
                class="tag tag-blue"
            ><i class="fas fa-redo-alt"></i></nuxt-link>
            <div style="overflow-x:auto;white-space:nowrap" class="w-100 text-center">
                <nuxt-link
                    v-for="i in 9"
                    :key="i"
                    :to="'/liturgie/aktualne/' + getDate(i)[0]"
                    :class="['tag tag-blue', {'tag-selected': thisDate == getDate(i)[0]}]"
                >{{ getDate(i)[1] }}</nuxt-link>
            </div>
            <nuxt-link
                :to="'/liturgie/aktualne/' + getDate(9)[0]"
                class="tag tag-blue flex-shrink-0"
            >+7<i class="fas fa-chevron-right ml-3"></i></nuxt-link>
        </div>
        <div>
            <button type="button" class="btn btn-primary mr-3" @click="showFilters = !showFilters">{{ showFilters ? 'Skrýt filtry' : (filters_active ? 'Upravit filtry' : 'Filtrovat') }}</button> <span class="py-2 d-inline-block">Filtry se použijí pouze na „další písně“.</span>
            <Filters
                v-show="showFilters"
                :init="false"
                :selected-songbooks.sync="selected_songbooks"
                :selected-tags.sync="selected_tags"
                :selected-languages.sync="selected_languages"
                :show-authors.sync="showAuthors"
                :sort.sync="sort"
                :descending.sync="descending"
                :search-string="''"
                :is-liturgy="true"
            ></Filters>
        </div>
        <div v-for="tag in tags_enum" :key="tag.id">
            <h2>{{ tag.name.charAt(0).toUpperCase() + tag.name.slice(1) }}</h2>
            <h3 class="h5">Písně k aktuální liturgii</h3>
            <div class="card">
                <div class="card-body p-0">
                    <div class="songs-list overflow-auto">
                        <table class="table m-0">
                            <tbody>
                                <tr v-if="$apollo.loading && !(liturgical_references_filtered(tag.id) && liturgical_references_filtered(tag.id).length)">
                                    <td class="px-4">Načítám...</td>
                                </tr>
                                <template
                                    v-else-if="liturgical_references_filtered(tag.id) && liturgical_references_filtered(tag.id).length"
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
                                        v-for="litref in liturgical_references_filtered(tag.id)"
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
                                    <td class="px-4">Nebyla nalezena žádná vhodná píseň.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <h3 class="h5">Další písně{{ filters_active ? ' (filtrovány)' : '' }}</h3>
            <div class="card">
                <div class="card-body p-0">
                    <SongsList
                        :search-string="''"
                        :selected-tags="{...selected_tags, ...objGeneratedFromTag(tag.id)}"
                        :selected-songbooks="selected_songbooks"
                        :selected-languages="selected_languages"
                        :sort="sort"
                        :descending="descending"
                        :seed="seed"
                        :disable-observer="true"
                        :override-per-page="3"
                        :show-numbers="true"
                    ></SongsList>
                </div>
            </div>
        </div>

        <a href="http://www.musicasacra.cz/" target="_blank" class="footer-logo">
            <img src="/img/musica-sacra.svg" />
        </a>

        <a
            class="btn btn-secondary mb-0 search-report bg-transparent"
            title="Nahlásit"
            :href="
                'https://docs.google.com/forms/d/e/1FAIpQLScmdiN_8S_e8oEY_jfEN4yJnLq8idxUR5AJpFmtrrnvd1NWRw/viewform?usp=pp_url&entry.1025781741=RS' +
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
import Filters from '../search/components/Filters';

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
                tags_liturgy_part {id name}
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
        SongsList,
        Filters
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
            seed: null,
            showFilters: false,

            // Search data
            selected_songbooks: {},
            selected_languages: {},
            selected_tags: {},
            showAuthors: false,
            sort: 0,
            descending: false,
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
            theDay.setDate(theDay.getDate() - 2 + i);
            return [this.dateToString(theDay), this.$dateFns.format(theDay, 'EEEEEE d. M.', { locale: 'cs' })];
        },

        objGeneratedFromTag(id) {
            let obj = {};
            obj[id] = true;
            return obj;
        },

        liturgical_references_filtered(id) {
            return this.liturgical_references ? this.liturgical_references.filter(ref => {
                let correctTags = ref.song_lyric.tags_liturgy_part ? ref.song_lyric.tags_liturgy_part.filter(tag => {
                    return tag.id === id
                }).length : false;
                let correctDate = ref.date == this.thisDate;
                return correctTags && correctDate;
            }) : [];
        },

        dateToString(date) {
            function pad(number) {
                if (number < 10) {
                    return '0' + number;
                }

                return number;
            }

            return `${pad(date.getFullYear())}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
        }
    },

    computed: {
        headerDateString() {
            return this.$dateFns.format(new Date(this.thisDate), 'd. MMMM', { locale: 'cs' });
        },

        todayDate() {
            return this.dateToString(new Date());
        },

        filters_active() {
            return (
                Object.keys(this.selected_songbooks).length +
                    Object.keys(this.selected_tags).length +
                    Object.keys(this.selected_languages).length >
                0
            );
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
