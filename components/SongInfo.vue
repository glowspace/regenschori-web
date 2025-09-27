<template>
    <span>
        <span
            v-if="song.lang && song.lang !== 'cs'"
            class="text-uppercase text-secondary ml-3"
            :title="song.lang_string"
        >{{ song.lang }}</span>
        <span
            v-if="song.licence_type_cc != 'UNSET'"
        ><br>Licence: {{ licenceValues ? licenceValues[song.licence_type_cc] : '' }}</span>
    </span>
</template>

<script>
export default {
    name: 'SongInfo',

    computed: {
        licenceValues() {
            return this.song.licence_type_cc_string_values ? JSON.parse(this.song.licence_type_cc_string_values) : undefined;
        }
    },

    props: ['song']
};
</script>
