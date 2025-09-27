<script>
import { isEmpty, isEqual } from 'lodash';

export default {
    methods: {
        updateHistoryState(push, force) {
            if (push !== false) {push = true;}
            let oldParams = JSON.parse(JSON.stringify(this.$route.query));
            let newParams = JSON.parse(JSON.stringify(toGETParameters(this.historyStateObject)));

            if (isEqual(oldParams, newParams) && !force) {
                return;
            }

            if (push) {
                this.$router.push({
                    path: '/',
                    query: toGETParameters(this.historyStateObject)
                }).catch(err => {
                    // empty catch prevents errors when navigating to the current route
                });
            } else {
                this.$router.replace({
                    path: '/',
                    query: toGETParameters(this.historyStateObject)
                }).catch(err => {
                    // empty catch prevents errors when navigating to the current route
                });
            }
        },

        applyStateChange(event, basic) {
            let GETparameters = this.$route.query;
            let originalParams = JSON.stringify(GETparameters);
            deleteInvalidGETParameters(GETparameters);

            if (basic) {
                this.historyStateObject = fromGETParameters(GETparameters);
            } else {
                if (isEmpty(GETparameters)) {
                    this.resetState();
                    return;
                }

                this.init = false;
                this.historyStateObject = fromGETParameters(GETparameters);

                if (JSON.stringify(GETparameters) != originalParams) {
                    this.updateHistoryState(false);
                }
            }
        }
    }
}

const GET_PARAMETERS = {
    search_string: 'vyhledavani',
    tags: 'stitky',
    languages: 'jazyky',
    songbooks: 'zpevniky',
    show_authors: 'autori',
    sort: 'razeni',
    is_descending: 'sestupne',
    seed: 'nahoda'
};

function validParameters() {
    return Object.values(GET_PARAMETERS);
}

function toGETParameters(
    params = {
        search_string: "",
        tags: [],
        languages: [],
        songbooks: [],
        sort: 0,
        seed: null,
        is_descending: false,
        show_authors: false
    }
) {

    const joinKeys = (obj) => Object.keys(obj).length ? Object.keys(obj).join(',') : undefined;

    return {
        vyhledavani: params.search_string ? params.search_string.replace(/\s/g, '_') : undefined,
        stitky: joinKeys(params.tags),
        jazyky: joinKeys(params.languages),
        zpevniky: joinKeys(params.songbooks),
        autori: params.show_authors == true ? 'ano' : undefined,
        razeni: params.sort > 0 ? String(params.sort) : undefined,
        sestupne: params.is_descending == true ? 'ano' : undefined,
        nahoda: params.seed ? String(params.seed) : undefined
    };
}

function deleteInvalidGETParameters(params) {
    // checks if the parameter is valid and its value is not undefined, otherwise it deletes the property
    Object.keys(params).forEach(p => (validParameters().includes(p) && params[p] !== undefined) || delete params[p]);
}

function fromGETParameters(params) {
    const keysToObj = function(str) {
        if (isEmpty(str)) return {};

        return str
            .split(',')
            .filter(str => str.length)
            .reduce((obj, key, _) => {
                obj[key] = true;
                return obj;
            }, {});
    };

    return {
        search_string: params.vyhledavani ? params.vyhledavani.replace(/_/g, ' ') : "",
        tags: keysToObj(params.stitky),
        languages: keysToObj(params.jazyky),
        songbooks: keysToObj(params.zpevniky),
        show_authors: !!params.autori,
        is_descending: !!params.sestupne,
        seed: params.nahoda,
        sort: params.razeni ? params.razeni : 0
    }
}
</script>
