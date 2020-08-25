<template>
    <tr>
        <td
            :class="[
                translation.lang == 'cs' ? 'invisible' : 'text-secondary',
                'text-right text-uppercase small align-middle pr-0'
            ]"
            :title="translation.lang_string"
        >{{ translation.lang }}</td>
        <td class="align-middle">
            <nuxt-link
                :to="translation.public_route"
                :class="{
                    'font-weight-bolder': translation.name == original_name
                }"
                >{{ translation.name }}</nuxt-link
            >
        </td>
        <td class="align-middle">
            <span class="d-none d-sm-inline">{{ typeString }}</span
            ><span class="d-sm-none">{{ typeChar }}</span>
        </td>
        <td class="align-middle">
            <span
                v-for="(ap, authorIndex) in translation.authors_pivot"
                :key="authorIndex"
                ><span v-if="authorIndex">,</span>
                <nuxt-link :to="ap.author.public_route" class="text-secondary"
                :title="translation.type ? {'GENERIC':'','LYRICS':'text','MUSIC':'hudba'}['LYRICS'] : {'GENERIC':'','LYRICS':'text','MUSIC':'hudba'}[ap.authorship_type]"
                >{{
                    ap.author.name
                }}</nuxt-link>
            </span>
        </td>
    </tr>
</template>

<script>
export default {
    props: ['translation', 'original_name'],
    computed: {
        typeString() {
            let typeStrings = ['originál', 'překlad', 'autorizovaný překlad'];
            return typeStrings[this.translation.type];
        },
        typeChar() {
            let typeChars = ['O', 'P', 'AP'];
            return typeChars[this.translation.type];
        }
    }
};
</script>
