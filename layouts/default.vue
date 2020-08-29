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
        // http://patorjk.com/software/taag/#p=display&f=Ivrit&t=Regenschori
        console.log("%c  ____                                _                _ \n |  _ \\ ___  __ _  ___ _ __  ___  ___| |__   ___  _ __(_)\n | |_) / _ \\/ _` |/ _ \\ '_ \\/ __|/ __| '_ \\ / _ \\| '__| |\n |  _ <  __/ (_| |  __/ | | \\__ \\ (__| | | | (_) | |  | |\n |_| \\_\\___|\\__, |\\___|_| |_|___/\\___|_| |_|\\___/|_|  |_|\n            |___/                                        ",
        "font-family: monospace; font-weight: bold;");
        console.log("Hmm, asi se tady vyznáš… Stále hledáme posily do našeho týmu vývojářů, takže jestli se k nám chceš přidat, neváhej nás kontaktovat na redakce@proscholy.cz.");
    }
};
</script>
