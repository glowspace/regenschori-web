<template>
    <tr>
        <td class="column-edit pl-3">
            <a v-b-modal="part"><i class="fas fa-pencil-alt"></i></a>
        </td>

        <td><span class="title">{{ title }}</span></td>
        <td>123</td>
        <td>Ať srdce mé</td>
        <td>Vazba</td>
    </tr>
</template>

<script>
export default {
    name: "MassSummarySlot",

    props: [
        'part',
        'title',
        'song_selected'
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
        color:  #7a7777;
        cursor: pointer;
    }
}


.title {
    color:          #4c4c4c;
    font-size:      0.9em;

    text-transform: uppercase;
}
</style>
