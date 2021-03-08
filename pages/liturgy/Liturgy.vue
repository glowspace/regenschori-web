<template>
    <div class="container">
        <h1>Co hrát na mši {{ headerDateString }}?</h1>
        <div class="mt-n4 mb-3"><span class="badge badge-danger" style="font-size:90%">testovací provoz</span></div>
        <div class="row mb-3">
            <p class="col-md-10 col-lg-9">
                Písně k aktuální liturgii jsou generovány automaticky podle
                korespondence textu písně s&nbsp;mešním čtením. Poznáte je podle
                ikony <i class="fas fa-link"></i> odkazu, která symbolizuje vazbu
                na určitou část mše svaté. Ostatní písně jsou doplněny automaticky.
            </p>
        </div>
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
                    :class="['tag tag-blue', {'tag-selected': thisDate == getDate(i)[0]}, {'font-weight-bold': getDate(i)[1].substr(0, 2) == 'ne'}]"
                    @click.native="clickLink(thisDate == getDate(i)[0])"
                >{{ getDate(i)[1] }}</nuxt-link>
            </div>
            <nuxt-link
                :to="'/liturgie/aktualne/' + getDate(9)[0]"
                class="tag tag-blue flex-shrink-0"
            >+7<i class="fas fa-chevron-right ml-3"></i></nuxt-link>
        </div>
        <div>
            <button type="button" class="btn btn-primary mr-3" @click="showFilters = !showFilters"><i class="fas fa-filter mr-2"></i>{{ showFilters ? 'Skrýt filtry' : (filters_active ? 'Upravit filtry' : 'Filtrovat') }}</button> <span class="py-2 d-inline-block">Filtry se použijí pouze na písně bez vazby na aktuální liturgii.</span>
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
        <table class="card d-table table mt-3 mb-5">
            <tbody>
                <tr v-for="(tag, index) in tags_enum" :key="tag.id" :class="{'bg-light': index % 2}">
                    <td class="align-top px-4 font-weight-bold" style="width:15%">{{ tag.name }}</td>
                    <td class="p-0">
                        <SongsList
                            :search-string="''"
                            :selected-tags="{...objGeneratedFromTag(tag.id), ...selected_tags}"
                            :selected-songbooks="selected_songbooks"
                            :selected-languages="selected_languages"
                            :sort="sort"
                            :descending="descending"
                            :seed="seed + parseInt(tag.id)"
                            :disable-observer="true"
                            :override-per-page="5"
                            :is-liturgy="true"
                            :liturgical-references="liturgical_references_filtered(tag.id)"
                        ></SongsList>
                    </td>
                </tr>
            </tbody>
        </table>

        <a href="http://www.musicasacra.cz/" class="footer-logo">
            <img src="/img/musica-sacra.svg" />
        </a>

        <a
            class="btn btn-secondary mb-0 search-report bg-transparent"
            title="Nahlásit"
            :href="'https://proscholy.atlassian.net/servicedesk/customer/portal/1/group/6/create/20?customfield_10056=' + encodeURIComponent(baseUrl + $route.fullPath)"
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
    query($date: Date!) {
        liturgical_references(date: $date) {
            song_lyric {
                id
                name
                secondary_name_1
                secondary_name_2
                song_number
                public_route
                lang
                lang_string
                bible_refs_src
                scores: externals(content_type: SCORE) {
                    id
                }
                recordings: externals(content_type: RECORDING) {
                    id
                }
                authors_pivot {
                    author {
                        id
                        name
                        public_route
                    }
                    authorship_type
                }
                tags {
                    id
                }
                tags_liturgy_part   {id name}
                tags_liturgy_period {id name}
                tags_generic        {id name}
                tags_saints         {id name}
                tags_sacred_occasion {id name}
                tags_history_period {id name}
                tags_musical_form   {id name}
                is_approved_for_liturgy
                has_chords
                has_lyrics
                songbook_records {
                    number
                    songbook {
                        id
                        name
                        shortcut
                    }
                }
            }
            readings {
                type
                reading_reference
                cycle
            }
            date
        }
    }
`;

const FETCH_TAGS = gql`
    query {
        tags_enum(type: LITURGY_PART, hide_in_liturgy: false) {
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
            baseUrl: process.env.baseUrl,
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
            return 'Co hrát na mši' + ((this.$route.params.date || process.client) ? ' ' + this.headerDateString : '') + this.titleSeparator + this.titleWebsite;
        },

        getDescription() {
            return 'Co hrát v neděli na mši svaté? I to zjistíte v databázi Regenschori.';
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
        },

        refreshSeed() {
            const randomInteger = function randomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            this.seed = randomInteger(1, 100000);
            window.location.hash = this.seed;
        },

        clickLink(current) {
            if (current) {
                this.refreshSeed();
            }
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
            query: FETCH_ITEMS,
            variables() {
                return {
                    date: this.thisDate
                };
            }
        },
        tags_enum: {
            query: FETCH_TAGS
        }
    },

    mounted() {
        if (window.location.hash) {
            this.seed = parseInt(window.location.hash.replace('#', ''));
        }

        window.history.replaceState(null, '', '/liturgie/aktualne/' + this.thisDate + '#' + this.seed);

        if (window.document.title && window.document.title != this.getTitle()) {
            window.document.title = this.getTitle();
        }
    }
};
</script>
