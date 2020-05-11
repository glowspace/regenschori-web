<template>
    <div class="card">
        <div class="card-body">
            <div class="row">
                <div class="col-8">
                    <search-current-status />
                </div>
                <div class="col-4 text-right">
                    <h2>Výsledky vyhledávání</h2>

                    <p>Nalezeno x záznamů</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Filters from '~/pages/search/components/Filters';
import SearchCurrentStatus from '~/pages/search/components/SearchCurrentStatus';

export default {
    name: 'SearchResults',
    components: { SearchCurrentStatus, Filters }
};
</script>

<style scoped></style>
