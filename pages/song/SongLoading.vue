<template>
    <div class="container">
        <div class="mt-4 mb-3">
            <v-skeleton-loader type="heading" height="43" />
            <div class="d-flex align-items-center">
                <v-skeleton-loader type="paragraph" class="mb-0" max-width="500" width="100%" />
            </div>
            <v-skeleton-loader type="paragraph" max-width="800" class="mt-3" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'SongLoading'
};
</script>
