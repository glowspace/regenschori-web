<template>
    <div class="card mt-4">
        <div class=" p-0">

            <table class="table mb-0">
                <tbody>
                <mass-summary-slot title="Vstup" open_modal="vstup"></mass-summary-slot>
                <mass-summary-slot title="Úkon kajícnosti"></mass-summary-slot>
                <mass-summary-slot title="Přinášení darů"></mass-summary-slot>
                <mass-summary-slot title="Přijímání"></mass-summary-slot>
                <mass-summary-slot title="Závěr"></mass-summary-slot>
                <mass-summary-slot title="Ordinárium"></mass-summary-slot>
                </tbody>
            </table>
        </div>

        <pick-alternative-modal id="vstup"
                                show="true"></pick-alternative-modal>
    </div>

</template>

<script>
import MassSummarySlot from "~/pages/liturgy/components/MassSummarySlot";
import PickAlternativeModal from "@/pages/liturgy/components/PickAlternativeModal";

export default {
    name: "MassSummary",
    components: {PickAlternativeModal, MassSummarySlot}
}
</script>

<style scoped>

</style>
