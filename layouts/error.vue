<template>
    <div class="background-home">
        <div class="container">
            <div class="error">
                <h1>Error {{ error.statusCode }}</h1>
                <p v-if="error.statusCode === 404">Stránka nebyla nalezena. <br>Zkuste použít vyhledávání.</p>
                <p v-else>Ajajaj, někde se stala chyba.<br> Zkuste použít vyhledávání.</p>
                <div class="text-center text-white">
                    <nuxt-link to="/" class="btn btn-outline-light display-all-songs font-weight-bold">
                        <i class="fas fa-search pr-1"></i> VYHLEDÁVÁNÍ
                    </nuxt-link>
                </div>
                <div class="text-center text-white pt-5">
                    <a :href="'https://docs.google.com/forms/d/e/1FAIpQLSfry7CQD0vPpuC_VB7xGR6NUF2WdPUytQwX8KipKoZcIYxbdA/viewform?usp=pp_url&entry.1025781741=' + encodeURIComponent($route.fullPath) + '&entry.456507920=' + error.statusCode"
                        target="_blank"
                        class="btn btn-outline-light display-all-songs font-weight-bold">
                        <i class="fas fa-exclamation-triangle pr-1"></i> NAHLÁSIT
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['error'],

    head() {
        return {
            // title: this.$t('web.' + this.pageCode + '.page_title') + this.titleTemplate,
            // meta: [
            //     {name: 'description', content: this.$t('web.' + this.pageCode + '.description')},
            //     {property: 'og:title', content: this.$t('web.' + this.pageCode + '.page_title') + this.titleTemplate},
            //     {property: 'og:description', content: this.$t('web.' + this.pageCode + '.description')},
            //     {property: 'twitter:title', content: this.$t('web.' + this.pageCode + '.page_title') + this.titleTemplate},
            //     {property: 'twitter:description', content: this.$t('web.' + this.pageCode + '.description')}
            // ],
            bodyAttrs: {
                class: ['home']
            }
        }
    }
};
</script>
