<template>
    <div>
        <v-skeleton-loader
        v-for="(w, k) in [400, 200, 300, 350, 250, 350, 400, 250, 200, 450]"
        :width="w" :key="k" class="mt-3" type="paragraph" max-width="100%" />
    </div>
</template>

<script>
export default {
    name: 'SlPartsLoading'
};
</script>
