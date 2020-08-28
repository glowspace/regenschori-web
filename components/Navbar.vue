<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-dark absolute-top">
            <div class="container">
                <nuxt-link to="/" class="navbar-brand" id="navbar-brand">
                    <h1 v-if="$nuxt.$route.path == '/'" class="home-h1">Regenschori</h1>
                    <span v-else>Regenschori</span>
                </nuxt-link>
                <div class="d-inline-flex">
                    <nuxt-link
                        to="/"
                        :class="[{ active: isHome }, 'btn btn-secondary']"
                    ><i class="fas fa-search"></i> Vyhledávání</nuxt-link>
                    <nuxt-link
                        to="/o-zpevniku"
                        class="btn btn-secondary"
                        active-class="active"
                    ><i class="fas fa-info"></i> O&nbsp;projektu</nuxt-link>
                    <dark-mode-button v-cloak> Tmavý&nbsp;mód</dark-mode-button>
                </div>
            </div>
        </nav>

        <a class="invisible btn btn-secondary mobile-padding-button mb-0">
            <i class="fas fa-search"></i>
        </a>

        <nav class="navbar navbar-expand-lg navbar-dark fixed-top">
            <div class="container">
                <nuxt-link to="/" class="btn" id="navbar-brand-small">R</nuxt-link>

                <nuxt-link to="/" class="btn btn-secondary" :class="[{ active: isHome }, 'btn btn-secondary']"
                    ><i class="fas fa-search"></i
                ></nuxt-link>

                <nuxt-link to="/o-zpevniku" class="btn btn-secondary" active-class="active"
                    ><i class="fas fa-info"></i
                ></nuxt-link>

                <dark-mode-button></dark-mode-button>
            </div>
        </nav>
    </div>
</template>

<script>
import DarkModeButton from '@bit/proscholy.utilities.dark-mode-button/DarkModeButton.vue';

export default {
    name: 'Navbar',

    components: { DarkModeButton },

    computed: {
        isHome() {
            return this.$nuxt.$route.name == 'index';
        }
    }
};
</script>
