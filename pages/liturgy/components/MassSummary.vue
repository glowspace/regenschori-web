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
                                part="vstup"
                                title="Vyberte píseň na vstup"></pick-alternative-modal>

        <pick-alternative-modal id="ukon_kajicnosti"
                                title="Vyberte píseň při úkonu kajícnosti"></pick-alternative-modal>

        <pick-alternative-modal id="pred_evangeliem"
                                title="Vyberte zpěv před evangeliem"></pick-alternative-modal>

        <pick-alternative-modal id="prinaseni_daru"
                                title="Vyberte píseň při přinášení darů"></pick-alternative-modal>

        <pick-alternative-modal id="prijimani"
                                title="Vyberte píseň na přijímání"></pick-alternative-modal>

        <pick-alternative-modal id="zaver"
                                title="Vyberte píseň na závěr"></pick-alternative-modal>

        <pick-alternative-modal id="ordinarium"
                                title="Vyberte ordinárium"></pick-alternative-modal>

    </div>

</template>

<script>
import MassSummarySlot from "~/pages/liturgy/components/MassSummarySlot";
import PickAlternativeModal from "@/pages/liturgy/components/PickAlternativeModal";

export default {
    name: "MassSummary",
    components: {PickAlternativeModal, MassSummarySlot},

    data:()=> {
        return {
            selected_vstup: {},
            selected_uk: {},
            selected_evangelium: {},
        }
    }
}
</script>

<style scoped>

</style>
