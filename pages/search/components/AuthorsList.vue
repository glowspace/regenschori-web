<template>
    <!-- todo: refactor so that it does not need client-only wrapper -->
    <client-only>
    <div class="authors-list">
        <v-progress-linear
            indeterminate
            color="bg-main-blue"
            :height="4"
            :class="[results_loaded ? '' : 'opacity-1', 'custom-progress-bar']"
        ></v-progress-linear>
        <table class="table m-0">
            <tbody>
                <tr v-if="!results_loaded && !(authors && authors.length)">
                    <td class="p-1"><span class="p-2 pl-3 d-inline-block">Načítám...</span></td>
                    <td class="p-1">
                        <a
                            class="btn btn-secondary float-right m-0"
                            target="_blank"
                            :href="
                                'https://docs.google.com/forms/d/e/1FAIpQLScmdiN_8S_e8oEY_jfEN4yJnLq8idxUR5AJpFmtrrnvd1NWRw/viewform?usp=pp_url&entry.1025781741=' +
                                    encodeURIComponent($route.fullPath)
                            "
                        >
                            Nahlásit
                        </a>
                    </td>
                </tr>
                <template
                    v-else-if="authors && authors.length"
                >
                    <tr
                        v-for="(author, index) in authors"
                        v-bind:key="author.id"
                    >
                        <td
                            class="p-1 align-middle"
                        >
                            <nuxt-link
                                class="p-2 pl-3 w-100 d-inline-block"
                                :to="author.public_route"
                            >{{ author.name }}</nuxt-link>
                        </td>
                        <td
                            class="p-1 align-middle"
                        >{{ author.type_string }}</td>
                    </tr>
                </template>
                <tr v-else-if="results_loaded">
                    <td class="p-1" colspan="2">
                        <span class="px-3 py-2 d-inline-block"
                            >Žádný autor odpovídající zadaným kritériím nebyl
                            nalezen.</span
                        >
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    </client-only>
</template>

<script>
import gql from 'graphql-tag';

// Query
const fetch_items = gql`
query ($search_string: String) {
    authors(search_string: $search_string, order_abc: true) {
        id
        name
        public_route
        type_string
    }
}`;

export default {
    props: [
        'search-string'
    ],

    data() {
        return {
            results_loaded: false
        };
    },

    // GraphQL client
    apollo: {
        authors: {
            query: fetch_items,
            variables() {
                return {
                    search_string: this.searchString
                };
            },
            // debounce waits 200ms for query refetching
            debounce: 200,
            result(result) {
                this.$emit('query-loaded', null);
                this.results_loaded = true;
            }
        }
    },

    watch: {
        searchString(val) {
            this.results_loaded = false;
        }
    }
};
</script>
