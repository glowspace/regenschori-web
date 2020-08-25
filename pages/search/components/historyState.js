import { isEmpty } from 'lodash';

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
        razeni: params.sort > 0 ? params.sort : undefined,
        sestupne: params.is_descending == true ? 'ano' : undefined,
        nahoda: params.seed ? params.seed : undefined
    };
}

function deleteInvalidGETParameters(params) {
    Object.keys(params).forEach((p) => validParameters().includes(p) || delete params[p]);
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
        sort: params.razeni ?? 0
    }
}

export default { toGETParameters, deleteInvalidGETParameters, fromGETParameters };
