<template>
    <div class="container">
        <div class="error">
            <h1>Error {{ error.statusCode }}</h1>
            <p v-if="error.statusCode === 404">Stránka nebyla nalezena. <br>Zkuste použít vyhledávání.</p>
            <p v-else>Ajajaj, někde se stala chyba.<br> Zkuste použít vyhledávání.</p>
            <div class="text-center">
                <nuxt-link to="/" class="btn btn-primary display-all-songs font-weight-bold">
                    <i class="fas fa-search pr-1"></i> VYHLEDÁVÁNÍ
                </nuxt-link>
            </div>
            <div class="text-center mt-3 mb-5">
                <a :href="'https://proscholy.atlassian.net/servicedesk/customer/portal/1/group/6/create/20?customfield_10056=' + encodeURIComponent(baseUrl + $route.fullPath) + '&summary=Chyba%20webu%20(' + error.statusCode + ')'"
                    class="btn btn-primary display-all-songs font-weight-bold">
                    <i class="fas fa-exclamation-triangle pr-1"></i> NAHLÁSIT
                </a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['error'],

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
            baseUrl: process.env.baseUrl,
            titleWebsite: process.env.titleWebsite,
            titleSeparator: process.env.titleSeparator
        };
    },

    methods: {
        getTitle() {
            return 'Error ' + this.error.statusCode + this.titleSeparator + this.titleWebsite;
        },

        getDescription() {
            return '';
        }
    }
};
</script>
