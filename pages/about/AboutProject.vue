<template>
    <div class="container">
        <h1>O projektu Regenschori</h1>
    </div>
</template>

<script>
export default {
    name: 'AboutProject',

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
            titleSeparator: process.env.titleSeparator
        };
    },

    methods: {
        getTitle() {
            return 'O projektu ' + this.titleWebsite;
        },

        getDescription() {
            return 'Jak vzniká projekt Regenschori? Tady to zjistíte.';
        }
    }
};
</script>
