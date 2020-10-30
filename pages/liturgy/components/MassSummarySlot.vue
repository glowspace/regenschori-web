<template>
    <tr>
        <td class="column-edit pl-3">
            <a v-b-modal="open_modal"><i class="fas fa-pencil-alt"></i></a>
        </td>

        <td><span class="title">{{ title }}</span></td>
        <td>123</td>
        <td>Ať srdce mé</td>
        <td>Autor</td>
        <td>Ikonky</td>
        <td>Vazba</td>
    </tr>
</template>

<script>
export default {
    name: "MassSummarySlot",

    props: [
        'open_modal',
        'title',
        'song_lyric'
    ],

    data: () => {
        return {
            focus: false
        }
    }
}
</script>

<style lang="scss">

.column-edit {
    width: 25px;

    .fa-pencil-alt {
        color: grey;
        cursor: pointer;
    }
}


.title {
    color:          grey;
    font-size:      0.9em;

    text-transform: uppercase;
}
</style>
