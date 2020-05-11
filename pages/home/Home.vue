<template>
    <div class="container-fluid">
        <div class="row mt-5">
            <div class="col-8 offset-2">
                <div class="row">
                    <div class="col-10">
                        <input
                            type="text"
                            class="w-100 form-control"
                            placeholder="Zadejte název skladby "
                        />
                    </div>
                    <div class="col-2">
                        <a href="" class="btn btn-search w-100">Vyhledat</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mt-5">
            <div class="col-3">
                <div class="card">
                    <search-box />
                </div>
            </div>

            <div class="col-6">
                <div class="card">
                    <div class="card-body">
                        <h5>Nejnovější skladby</h5>
                    </div>
                </div>
            </div>
            <div class="col-3">
                <div class="card">
                    <div class="card-body">
                        <h5>K dnešní liturgii</h5>

                        <p>Ve výstavbě</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SearchBox from '~/pages/search/components/SearchBox';
export default {
    name: 'Home',
    components: { SearchBox }
};
</script>

<style scoped>
.btn-search {
    background-color: darkred;
    color: white;
}
</style>
