<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-dark absolute-top">
            <div class="container d-flex">
                <nuxt-link to="/"
                             class="navbar-brand">
                    <img src="/img/logo_v2.png"
                         style="padding: 0 10px 0 0;"
                         width="60"
                         alt="logo">Zpěvník pro scholy
                </nuxt-link>

                <div class="d-flex flex-grow-1">
                    <ul class="navbar-nav flex-nowrap">
                        <li class="nav-item">
                            <nuxt-link to="/"
                                         class="btn btn-secondary"><i class="fas fa-search"></i> Vyhledávání
                            </nuxt-link>
                        </li>

                        <li class="nav-item">
                            <nuxt-link to="/o-zpevniku"
                                         class="btn btn-secondary">
                                <i class="fas fa-info"></i> O zpěvníku
                            </nuxt-link>
                        </li>

                        <dark-mode-button v-cloak> Tmavý mód</dark-mode-button>
                    </ul>
                </div>

                <div class="d-flex flex-grow-1">
                    <ul class="navbar-nav ml-auto flex-nowrap">
                        <li class="nav-item">
                            <nuxt-link to="/muj-ucet"
                                         class="btn btn-secondary nav-item"><i class="fas fa-user"></i> Přihlásit se
                            </nuxt-link>
                        </li>
                    </ul>
                </div>

            </div>
        </nav>

        <a class="invisible btn btn-secondary mobile-padding-button mb-0">
            <i class="fas fa-search"></i>
        </a>

        <nav class="navbar navbar-expand-lg navbar-dark fixed-top">
            <div class="container">
                <nuxt-link to="/"
                             class="btn">
                    <img src="/img/logo_v2.png"
                         height="24"
                         alt="logo"></nuxt-link>
                <nuxt-link to="/"
                             class="btn btn-secondary"><i class="fas fa-search"></i></nuxt-link>

                <nuxt-link to="/o-zpevniku"
                             class="btn btn-secondary"><i class="fas fa-info"></i></nuxt-link>

                <dark-mode-button></dark-mode-button>
            </div>
        </nav>
    </div>
</template>

<script>
    import DarkModeButton from "~/components/DarkModeButton";

    export default {
        name: "Navbar",

        components: {DarkModeButton}
    }
</script>

<style scoped>

</style>
