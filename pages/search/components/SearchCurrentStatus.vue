<template>
    <div>
        <div class="mb-2" v-if="selected_tags.liturgy_part_tags.length">
            <h5>Část mše:</h5>
            <badge
                :title="tag.name"
                :key="tag.id"
                v-for="tag in selected_tags.liturgy_part_tags"
                class="mr-2"
            ></badge>
        </div>

        <div class="mb-2" v-if="selected_tags.liturgy_period_tags.length">
            <h5>Liturgická doba:</h5>
            <badge
                :title="tag.name"
                :key="tag.id"
                v-for="tag in selected_tags.liturgy_period_tags"
                class="mr-2"
            ></badge>
        </div>

        <div v-if="false">
            <h5>Typ</h5>
        </div>

        <div class="mb-2" v-if="selected_tags.historical_period_tags.length">
            <h5>Období</h5>
            <badge
                :title="tag.name"
                :key="tag.id"
                v-for="tag in selected_tags.historical_period_tags"
                class="mr-2"
            ></badge>
        </div>

        <div class="mb-2" v-if="selected_tags.instrumentation_tags.length">
            <h5>Instrumentace</h5>
            <badge
                :title="tag.name"
                :key="tag.id"
                v-for="tag in selected_tags.instrumentation_tags"
                class="mr-2"
            ></badge>
        </div>
    </div>
</template>

<script>
import Badge from '~/components/Badge';
import search_state from '~/pages/search/search_state';

/**
 * Status of search.
 *
 * This widget shows which filters
 * user selects in search query.
 */
export default {
    name: 'SearchCurrentStatus',
    components: { Badge },

    data: () => {
        return {
            selected_tags: search_state.selected_tags
        };
    }
};
</script>

<style scoped>
h5 {
    display: inline-block;
}
</style>
