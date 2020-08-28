<template>
    <div class="container">
        <h1 class="mb-n3">Nápověda</h1>
        <div class="row flex-column-reverse flex-lg-row">
            <div class="col-lg-9 mb-5">

                <div>
                    <h2 id="schvaleno-cbk" class="mt-0 pt-5">Co znamená štítek „schváleno ČBK pro liturgii“?</h2>
                    <p>
                        Liturgická hudba není vázaná na určitý hudební nástroj nebo hudební styl,
                        ale úzce souvisí s liturgickým děním, takže pomáhá objevit plný význam obřadů,
                        ze kterých sama získává hodnotu. Je integrální a nezbytnou součástí liturgie a má tedy svá pravidla.
                    </p>
                    <p>
                        Mnohá z nich najdete v dokumentu našich biskupů
                        <UniversalLink
                            type="PDF"
                            link="https://www.liturgie.cz/shared/clanky/411/V%C3%BDb%C4%9Br%20hudby%20k%20bohoslu%C5%BEb%C3%A1m.pdf"
                        ><i class="far fa-file-pdf pr-1"></i>Výběr hudby k bohoslužbám – Směrnice ČBK pro používání liturgické hudby při bohoslužbách, zvláště ve vztahu k&nbsp;mládeži</UniversalLink>.
                    </p>
                    <p>
                        Štítek znamená, že takto označenou píseň je možné pro danou část mše svaté použít,
                        protože získala potřebné schválení liturgické komise České biskupské konference.
                    </p>
                </div>
            </div>
            <div class="col-lg-3">
                <div class="card d-inline-flex px-3 mt-5 position-sticky" style="top:60px">
                    <div class="card-body">
                        <div class="card-title h4">Obsah</div>
                        <ol class="mb-0">
                            <li><a href="#schvaleno-cbk" @click.prevent="scrollTo('#schvaleno-cbk')">Co znamená štítek „schváleno ČBK pro liturgii“?</a></li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import UniversalLink from '@bit/proscholy.utilities.universal-link/UniversalLink.vue';

export default {
    name: 'Support',

    components: {
        UniversalLink
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
            titleSeparator: process.env.titleSeparator
        };
    },

    methods: {
        getTitle() {
            return 'Podpora' + this.titleSeparator + this.titleWebsite;
        },

        getDescription() {
            return '';
        },

        scrollTo(el) {
            var element = document.querySelector(el);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    },

    mounted() {
        if (this.$route.hash && process.client) {
            this.scrollTo(this.$route.hash);
        }
    }
};
</script>
