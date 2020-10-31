<template>
    <div>
        <div class="card mt-4">
            <div class="card-body p-0">
                <table class="table mb-0">
                    <thead>
                    <tr>
                        <th></th>
                        <th>část mše</th>
                        <th>#</th>
                        <th>název písně</th>
                        <th>důvod výběru</th>
                    </tr>
                    </thead>
                    <tbody>
                    <mass-summary-slot title="Vstup"
                                       part="vstup"></mass-summary-slot>

                    <mass-summary-slot title="Úkon kajícnosti"
                                       part="ukon_kajicnosti"></mass-summary-slot>

<!--                    <mass-summary-slot title="Žalm"-->
<!--                                       part="zalm"></mass-summary-slot>-->

                    <mass-summary-slot title="Před evangeliem"
                                       part="pred_evangeliem"></mass-summary-slot>

                    <mass-summary-slot title="Přinášení darů"
                                       part="prinaseni_daru"></mass-summary-slot>

                    <mass-summary-slot title="Přijímání"
                                       part="prijimani"></mass-summary-slot>

                    <mass-summary-slot title="Závěr"
                                       part="zaver"></mass-summary-slot>

                    <mass-summary-slot title="Ordinárium"
                                       part="ordinarium"></mass-summary-slot>
                    </tbody>
                </table>
            </div>
        </div>

        <pick-alternative-modal id="vstup"
                                :referenced_songs="liturgical_references_filtered('1')"
                                title="Vyberte píseň na vstup"></pick-alternative-modal>

        <pick-alternative-modal id="ukon_kajicnosti"
                                :referenced_songs="liturgical_references_filtered('2')"
                                title="Vyberte píseň při úkonu kajícnosti"></pick-alternative-modal>

        <pick-alternative-modal id="zalm"
                                :referenced_songs="liturgical_references_filtered('39')"
                                title="Vyberte responsoriální žalm"></pick-alternative-modal>

        <pick-alternative-modal id="pred_evangeliem"
                                :referenced_songs="liturgical_references_filtered('3')"
                                title="Vyberte zpěv před evangeliem"></pick-alternative-modal>

        <pick-alternative-modal id="prinaseni_daru"
                                :referenced_songs="liturgical_references_filtered('5')"
                                title="Vyberte píseň při přinášení darů"></pick-alternative-modal>

        <pick-alternative-modal id="prijimani"
                                :referenced_songs="liturgical_references_filtered('6')"
                                title="Vyberte píseň na přijímání"></pick-alternative-modal>

        <pick-alternative-modal id="zaver"
                                :referenced_songs="liturgical_references_filtered('9')"
                                title="Vyberte píseň na závěr"></pick-alternative-modal>

        <pick-alternative-modal id="ordinarium"
                                :referenced_songs="liturgical_references_filtered('10')"
                                title="Vyberte ordinárium"></pick-alternative-modal>

    </div>

</template>

<script>
import MassSummarySlot from "~/pages/liturgy/components/MassSummarySlot";
import PickAlternativeModal from "@/pages/liturgy/components/PickAlternativeModal";

export default {
    name: "MassSummary",
    components: {PickAlternativeModal, MassSummarySlot},

    data: () => {
        return {
            selected_vstup: {},
            selected_uk: {},
            selected_evangelium: {},
        }
    },

    props: [
        'liturgical_references',
        'date',

        'search-string',
        'selected-songbooks',
        'selected-tags',
        'selected-languages',
        'sort',
        'descending',
        'seed',
        'disableObserver',
        'overridePerPage',
        'showNumbers'
    ],

    methods: {
        liturgical_references_filtered(id) {
            return this.liturgical_references ? this.liturgical_references.filter(ref => {
                let correctTags = ref.song_lyric.tags_liturgy_part ? ref.song_lyric.tags_liturgy_part.filter(tag => {
                    return tag.id === id
                }).length : false;
                let correctDate = ref.date == this.date;
                return correctTags && correctDate;
            }) : [];
        },
    },
}
</script>

<style scoped>

</style>
