<template>
    <div class="container px-4">
        <h1>O projektu Regenschori</h1>

        <p>
            Komplexní webová platforma pro chrámové hudebníky, zejména pro vedoucí sborů a schol, varhaníky a chrámové zpěváky.
            Hlavní část tvoří rozsáhlý notový archiv s&nbsp;přehledně řazeným obsahem převážně liturgicky užívaného hudebního materiálu.
        </p>

        <p>
            Po vzoru <a href="https://imslp.org/">Petrucciho hudební knihovny</a> či
            <a href="https://cpdl.org/">ChoralWiki</a> vystavěných na MediaWiki umožňuje tento web
            organizaci materiálu dle štítků (např. dle autora, nástroje či liturgického zařazení: vánoční, eucharistie, mariánská apod.),
            a generuje tak notový materiál přívětivěji než dosavadní hudební webové archivy, jež převážně nabízejí pouze tabulkové zobrazení.
            Vítaným pomocníkem je propojení písní s biblickými souřadnicemi a začleněním do liturgického kalendáře.
        </p>

        <p>
            Dále umožňuje zobrazovat u každé skladby kromě základní partitury i verze upravené do vícehlasů,
            party pro nástroje, popis skladby s&nbsp;interpretačními poznámkami, liturgické zařazení, referenci na příbuzné materiály ad.
            Při kliknutí na jméno autora se uživateli objeví stručný životopis skladatele a přehled jeho díla dostupného na webu.
        </p>

        <p>
            Regenschori chce být dobrým rádcem pro chrámové hudebníky, kteří se často se dotazují na to, co kdy hrát,
            a zároveň prostorem pro uveřejňování nové hudební liturgické tvorby, k&nbsp;níž vybízela i nedávná 
            <a href="http://www.liturgie.cz/shared/clanky/411/V%C3%BDb%C4%9Br%20hudby%20k%20bohoslu%C5%BEb%C3%A1m.pdf">instrukce ČBK o hudbě v&nbsp;liturgii</a>.
            Kromě toho může být depozitářem již užívaných kompozic. Obohacován je postupnou digitalizací některých hudebních archivů.
        </p>

        <p>
            K&nbsp;přehlednému výběru skladeb napomůže i liturgický kalendář, jenž bude propojen s&nbsp;materiálem uloženým na webu.
            Návštěvník tak snadno dohledá, jaké skladby jsou vhodné pro blížící se liturgickou slavnost.
        </p>

        <p>
            <span class="mr-2">
                Regenschori vzniká jako projekt <a href="http://www.musicasacra.cz/">jednoty Musica Sacra</a> ve spolupráci s <a href="http://www.liturgie.cz/">Liturgickou komisí ČBK</a> 
                a <a href="https://www.cirkev.cz/mladez">Sekcí pro mládež ČBK</a>.
                Na jeho vývoji se aktivně podílejí <a href="https://zpevnik.proscholy.cz/o-zpevniku">členové týmu ProScholy</a>:
            </span>
            <a
                class="btn btn-outline-primary"
                href="https://zpevnik.proscholy.cz/o-zpevniku"
                >O zpěvníku ProScholy.cz</a
            >
        </p>
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
