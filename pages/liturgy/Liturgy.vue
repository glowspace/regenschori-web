<template>
    <div class="container pb-5">
        <h1>Co hrát na mši {{ headerDateString }}?</h1>
        <div class="row mb-3">
            <p class="col-md-10 col-lg-9">
                Písně k aktuální liturgii jsou generovány automaticky podle
                korespondence textu písně s&nbsp;mešním čtením.
            </p>
        </div>
        <div class="row mb-3" :style="`opacity: ${customBibleString.length > 0 ? 0.4 : 1}`">
            <div class="col-sm-4 col-lg-3" v-for="(lit_day, key) in currentDateReadings" :key='key'>
                <h5>{{ lit_day.czechName}}</h5>
                <p v-if="lit_day.firstReading && lit_day.firstReading.length > 0"><i>1. čtení: {{ lit_day.firstReading }}</i></p>
                <p v-else><i>Nemá vlastní 1. čtení</i></p>
                <p v-if="lit_day.psalm && lit_day.psalm.length > 0"><i>Žalm: {{ lit_day.psalm }}</i></p>
                <p v-else><i>Nemá vlastní žalm</i></p>
                <p v-if="lit_day.secondReading && lit_day.secondReading.length > 0"><i>2. čtení: {{ lit_day.secondReading }}</i></p>
                <p v-if="lit_day.gospel && lit_day.gospel.length > 0"><i>Evangelium: {{ lit_day.gospel }}</i></p>
                <p v-else><i>Nemá vlastní evangelium</i></p>
            </div>
        </div>
        <div class="mb-3">
            <p class="mb-0">Nebo můžete zadat vlastní biblické odkazy:</p>
            <v-textarea
                placeholder="Např. Žalm 46 nebo Mt 3, 13-17"
                v-model="customBibleString"
                rows="3"
            ></v-textarea>
        </div>

        <div class="d-flex mb-3" :style="`opacity: ${customBibleString.length > 0 ? 0.4 : 1}`">
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

        <table class="card d-table table mt-3 mb-4">
            <tbody>
                <tr>
                    <td colspan="7" class="p-0">
                        <v-progress-linear
                            indeterminate
                            color="bg-main-blue"
                            :height="4"
                            :class="[!$apollo.loading ? '' : 'opacity-1', 'custom-progress-bar']"
                        ></v-progress-linear>
                    </td>
                </tr>
                <tr v-if="$apollo.loading && !(song_lyrics && song_lyrics.length)">
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
                            :href="'https://proscholy.atlassian.net/servicedesk/customer/portal/1/group/6/create/20?customfield_10056=' + encodeURIComponent(baseUrl + $route.fullPath)"
                        >
                            Nahlásit
                        </a>
                    </td>
                </tr>
                <template
                    v-else-if="song_lyrics && song_lyrics.length"
                >
                    <tr>
                        <th class="text-right border-top-0" title="číslo písně ve Zpěvníku ProScholy.cz">#</th>
                        <th class="align-middle border-top-0">název písně</th>
                        <th class="align-middle border-top-0">biblické odkazy</th>
                    </tr>
                    <tr v-for="(sl, key) in song_lyrics" :key='key'>
                        <td
                            class="p-1 align-middle text-right w-min"
                        >
                            <nuxt-link
                                class="p-2 pl-3 text-secondary"
                                :to="sl.public_route"
                            >{{ sl.song_number }}</nuxt-link>
                        </td>
                        <td
                            class="p-1 align-middle"
                        >
                            <nuxt-link
                                class="p-2 w-100 d-inline-block"
                                :to="sl.public_route"
                            ><song-name :song="sl" :multiline="true"></song-name></nuxt-link>
                        </td>
                        <td class="align-middle p-1">
                            <a
                                class="tag tag-blue my-1"
                                v-for="(reference, key2) in osisConvert(sl.bible_refs_osis)"
                                :key="'ref' + key2"
                                :href="`https://www.bibleserver.com/CEP/${reference}`"
                            >{{ reference }}</a>
                        </td>
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
import bible from 'bible-liturgy-utils/bible/bible'
import liturgy from 'bible-liturgy-utils/litcal/litcal'
import SongName from '@bit/proscholy.utilities.song-name/SongName.vue';

const FETCH_ITEMS = gql`
    query($bible_reference_osis: String!) {
        song_lyrics(bible_reference_osis: $bible_reference_osis) {
            id
            name
            secondary_name_1
            secondary_name_2
            song_number
            public_route
            bible_refs_osis
        }
    }
`

export default {
    components: {SongName},

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
            regenschoriUrl: process.env.regenschoriUrl,
            customBibleString: '',
            litCalendarLoaded: false,
            litCalendarDays: null // async loaded in mounted() func
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
            return 'Co hrát v neděli na mši svaté? I to zjistíte na webu ProScholy.cz.';
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
        },

        osisConvert(osisString) {
            return bible.parseOsis(osisString).toCzechStrings()
        },

        dayString(date) {
            return date.toISOString().slice(0, 10)
        },
    },

    computed: {
        headerDateString() {
            return this.$dateFns.format(new Date(this.thisDate), 'd. MMMM', { locale: 'cs' });
        },

        todayDate() {
            return this.dateToString(new Date());
        },

        currentDateReadings() {
            if (!this.litCalendarLoaded) {
                return []
            }

            const day_str = this.dayString(new Date(this.thisDate))

            // get all liturgical events (including workdays)
            let lit_events = this.litCalendarDays[day_str]
            for (const event of lit_events) {
                if (event.weekday && !lit_events.map(e => e.key).includes(event.weekday.key)) {
                    lit_events.push(event.weekday)
                }
            }

            return lit_events.flatMap(liturgy.getReadings).filter(x => x.czechName)
        },

        currentOsis() {
            let readings_strs = []

            if (this.customBibleString.length == 0) {
                readings_strs = this.currentDateReadings
                    .flatMap(r => [r.firstReading, r.psalm, r.secondReading, r.gospel])
            } else {
                readings_strs.push(this.customBibleString)
            }

            return readings_strs
                .map(bible.parseEuropean)
                .map(x => x.toString())
                .filter(x => x.length > 0)
                .join(',')
        }
    },

    apollo: {
        song_lyrics : {
            query: FETCH_ITEMS,
            variables() {
                return {
                    bible_reference_osis: this.currentOsis
                }
            },
            skip() {
                return !this.litCalendarLoaded
            }
        }
    },

    async mounted() {
        if (window.location.hash) {
            this.seed = parseInt(window.location.hash.replace('#', ''));
        }

        window.history.replaceState(null, '', '/liturgie/aktualne/' + this.thisDate + '#' + this.seed);

        if (window.document.title && window.document.title != this.getTitle()) {
            window.document.title = this.getTitle();
        }

        this.litCalendarDays = await liturgy.csRomcal.generateCalendar()
        this.litCalendarLoaded = true
    }
};
</script>
