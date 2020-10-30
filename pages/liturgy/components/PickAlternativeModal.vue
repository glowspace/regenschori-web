<template>
    <b-modal :id="id"
             :title="title"
             body-class="p-0">

        <div class="card p-0">
            <div class="card-body p-0">
                <table class="table mb-0">
                    <tr>
                        <td>Ať srdce mé Tebe vídá</td>
                        <td>koresponduje evangelium</td>
                        <td>
                            <b-button>Zvolit</b-button>
                        </td>
                    </tr>
                    <tr>
                        <td>Ať srdce mé Tebe vídá</td>
                        <td>koresponduje 1. čtení</td>
                        <td>
                            <b-button>Zvolit</b-button>
                        </td>
                    </tr>
                    <tr>
                        <td>Ať srdce mé Tebe vídá</td>
                        <td>vhodné na vstup</td>
                        <td>
                            <b-button>Zvolit</b-button>
                        </td>
                    </tr>
                    <tr>
                        <td>Ať srdce mé Tebe vídá</td>
                        <td>vhodné na vstup</td>
                        <td>
                            <b-button>Zvolit</b-button>
                        </td>
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
        'title',
        'part',
    ]
}
</script>

<style lang="scss">
body {
    // Quick fix of modal 17px right padding.
    padding-right: 0 !important;
}
</style>
