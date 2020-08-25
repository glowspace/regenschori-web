<template>
    <div class="container">
        <div class="mt-4 mb-3">
            <v-skeleton-loader type="heading" height="43" />
            <div class="d-flex align-items-center">
                <v-skeleton-loader type="chip" />
                <v-skeleton-loader type="paragraph" class="ml-3 mb-0" max-width="500" width="100%" />
            </div>
            <v-skeleton-loader type="paragraph" max-width="800" class="mt-3" />
        </div>
        <div class="row">
            <div class="col-lg-9">
                <div class="card card-lyrics">
                    <div class="card-header p-1 song-links">
                        <v-skeleton-loader type="button" width="50" class="d-inline-block float-right" />
                    </div>
                    <div class="card-body py-2 pl-3">
                        <sl-parts-loading />
                    </div>
                    <div class="controls fixed-bottom position-sticky p-1 card-footer">
                        <v-skeleton-loader type="button" class="d-inline-block" />
                        <v-skeleton-loader type="button" width="50" class="d-inline-block float-right" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SlPartsLoading from './components/SlPartsLoading';

export default {
    name: 'SongLoading',
    components: {
        SlPartsLoading
    }
};
</script>
