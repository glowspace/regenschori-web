<template>
    <div class="card">
        <div class="card-header p-1"><v-skeleton-loader type="text" class="px-3 pb-2 pt-3" max-width="200" /></div>
        <div class="card-body p-0 overflow-hidden">
            <table class="table m-0">
                <tbody>
                    <template v-for="(x, key2) in [0, 1, 2]">
                        <tr v-for="(w, key) in [400, 200, 300, 350, 250, 350, 400, 250, 200, 450]" :key="key + '.' + key2">
                            <td class="px-3 pb-2 pt-3 align-middle">
                                <v-skeleton-loader type="text" :width="w/1.5" />
                            </td>
                            <td class="px-1 pb-2 pt-3 align-middle">
                                <v-skeleton-loader type="text" :width="w" />
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AuthorSongsListLoading',
};
</script>
