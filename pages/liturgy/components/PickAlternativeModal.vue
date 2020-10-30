<template>
    <b-modal :id="id"
             title="Zvolte píseň na úvod">


        <div class="card p-0">
            <div class="card-body p-0">
                <table class="table mb-0">
                    <tr>
                        <td>Ať srdce mé Tebe vídá</td>
                        <td>koresponduje evangelium</td>
                    </tr>
                    <tr>
                        <td>Ať srdce mé Tebe vídá</td>
                        <td>koresponduje 1. čtení</td>
                    </tr>
                    <tr>
                        <td>Ať srdce mé Tebe vídá</td>
                        <td>vhodné na vstup</td>
                    </tr>
                    <tr>
                        <td>Ať srdce mé Tebe vídá</td>
                        <td>vhodné na vstup</td>
                    </tr>
                </table>
            </div>
        </div>
    </b-modal>
</template>

<script>
export default {
    name: "PickAlternativeModal",

    props: [
        'id',
        'show',
    ]
}
</script>

<style scoped>

</style>
