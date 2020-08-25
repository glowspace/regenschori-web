<template>
    <div id="app">
        <navbar />
        <nuxt />
    </div>
</template>

<script>
import Navbar from '~/components/Navbar';

export default {
    components: { Navbar },

    data() {
        return {
            baseUrl: process.env.baseUrl
        }
    },

    head() {
        return {
            meta: [
                {property: 'og:url', content: this.baseUrl + this.$nuxt.$route.path},
                {property: 'twitter:url', content: this.baseUrl + this.$nuxt.$route.path}
            ]
        }
    },

    mounted() {
        // http://patorjk.com/software/taag/#p=display&f=Ivrit&t=ProScholy.cz
        console.log("%c  ____           ____       _           _                 \n |  _ \\ _ __ ___/ ___|  ___| |__   ___ | |_   _   ___ ____\n | |_) | '__/ _ \\___ \\ / __| '_ \\ / _ \\| | | | | / __|_  /\n |  __/| | | (_) |__) | (__| | | | (_) | | |_| || (__ / / \n |_|   |_|  \\___/____/ \\___|_| |_|\\___/|_|\\__, (_)___/___|\n                                          |___/           ",
        "font-family: monospace, monospace; font-weight: bold;");
        console.log("Hmm, asi se tady vyznáš… Stále hledáme posily do našeho týmu vývojářů, takže jestli se k nám chceš přidat, neváhej nás kontaktovat na redakce@proscholy.cz.");
    }
};
</script>
