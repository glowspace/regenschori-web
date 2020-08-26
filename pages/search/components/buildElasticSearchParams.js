/// INTERNAL FUNCTIONS USED FOR BUILDING ELASTIC QUERY

function baseQueryObject() {
    return {
        bool: {
            // see must vs filter elastic documentation https://www.elastic.co/guide/en/elasticsearch/reference/current/query-filter-context.html
            must: [],
            should: [],
            filter: [
                { term: { is_arrangement: { value: false } } },
                { term: { only_regenschori: { value: false } } }
            ]
        }
    };
}

function applyFulltext(query, search_string, options = {
    must_match: false,
    phrase_fields: [
        'name^10',
        'lyrics^5'
    ],
    exact_match_fields: [
        'name^2',
        'lyrics',
        'authors',
        'song_number^50',
        'songbook_records.songbook_number',
        'songbook_records.songbook_full_number^50'
    ]
}) {
    // if exact match query -> multi_match needs to end in `must` section,
    // otherwise it is to be in `should` in order only to improve the rating
    let queryObject = options.must_match ? query.bool.must : query.bool.should;
    queryObject.push({
        multi_match: {
            query: search_string,
            type: 'phrase',
            fields: options.phrase_fields
        }
    });

    query.bool.must.push({
        // see multi_match elastic documentation https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html
        multi_match: {
            query: search_string,
            fields: options.exact_match_fields
        }
    });
}

function applyFilterTags(query, filterTagsDcnf) {
    for (let category_tags of Object.values(filterTagsDcnf)) {
        let tag_ids = Object.values(category_tags).map(v =>
            parseInt(v)
        );

        if (tag_ids.length) {
            query.bool.filter.push({ terms: { tag_ids: tag_ids } });
        }
    }
}

function applyFilterLanguages(query, filterLanguages) {
    if (Object.keys(filterLanguages).length === 0)
        return;

    query.bool.filter.push({
        terms: { lang: Object.keys(filterLanguages) }
    });
}

function applyFilterSongbooks(query, filterSongbooks) {
    if (Object.keys(filterSongbooks).length === 0)
        return;

    query.bool.filter.push({
        terms: {
            'songbook_records.songbook_id': Object.keys(
                filterSongbooks
            )
        }
    });
}

function applyRandomSorting(query, seed) {
    query.bool.must.push({
        function_score: {
            query: { match_all: { boost: 1 } },
            random_score: { seed: parseInt(seed), field: '_id' }
        }
    });
}

function applyAZSorting(sort, is_descending) {
    sort.push({name_keyword: {order: is_descending ? 'desc' : 'asc'}});
}

function applySongNumberSorting(sort, is_descending) {
    sort.push({song_number_integer: {order: is_descending ? 'desc' : 'asc'}});
}

function applySongbookNumberSorting(sort, is_descending, query, songbook_id) {
    query.bool.must.push({
        function_score: {
            query: { match_all: { boost: 1 } },
            script_score: { script: { source: `
                for (int i = 0; i < params._source.songbook_records.length; i++) {
                    if (params._source.songbook_records[i].songbook_id == ${songbook_id}) {
                        return params._source.songbook_records[i].songbook_number_integer;
                    }
                }
                return 0;
            ` } }
        }
    });
    sort.push({_score: {order: is_descending ? 'desc' : 'asc'}});
}

// EXPORTED FUNCTION USED TO TRANSFORM TAGS' ARRAYS TO DISJUNCTIVE CANONICAL NORMAL FORM
// [ (1 or 2 or 3) and (4 or 5) and ... ]

function getSelectedTagsDcnf(
    tags_groups = {
        liturgy_part: [],
        liturgy_period: [],
        generic: [],
        saints: [],
        history_period: [],
        instrumentation: [],
        genre: [],
        musical_form: [],
    },
    selected_tags = {}
) {
    return Object.values(tags_groups).map(
        group => group ?
            group.map(tag => tag.id).filter(tag_id => selected_tags[tag_id])
            : []
    );
}

// groups here reflect the graphql definition as in https://github.com/proscholy/api.proscholy.cz/blob/development/graphql/tag.graphql#L32
// however, for the purpose of elasticsearch filtering in buildElasticSearchParams.js, exact group names are *not* necessary
export { getSelectedTagsDcnf };

export default function(params = {
    searchString: "",
    filterTagsDcnf: [],
    filterLanguages: [],
    filterSongbooks: [],
    sortType: "RANDOM",
    sortConfig: {
        seed: null,
        songbook_id: null,
        is_descending: false
    }
}) {

    let query = baseQueryObject();
    let sort = [];

    const cleanSearchString = params.searchString.replace(/"/g, '');
    const isExactMatch = params.searchString == `"${cleanSearchString}"`;

    if (cleanSearchString) {
        applyFulltext(query, params.searchString, {
            must_match: isExactMatch
        });
    } else {
        // if no search string is provided then apply sorting
        if (params.sortType == "NAME") {
            applyAZSorting(sort, params.sortConfig.is_descending);
        } else if (params.sortType == "NUMBER") {
            applySongNumberSorting(sort, params.sortConfig.is_descending);
        } else if (params.sortType == "SONGBOOK_NUMBER") {
            if (!params.sortConfig.songbook_id) {
                throw new Exception("Sorting with songbook number needs sortConfig.songbook_id defined")
            }
            applySongbookNumberSorting(sort, params.sortConfig.is_descending, query, params.sortConfig.songbook_id);
        } else if (params.sortType == "RANDOM") {
            applyRandomSorting(query, params.sortConfig.seed);
        }
    }

    applyFilterTags(query, params.filterTagsDcnf);
    applyFilterLanguages(query, params.filterLanguages);
    applyFilterSongbooks(query, params.filterSongbooks);

    const query_str = JSON.stringify({
        sort: sort,
        query: query
    });

    return query_str;
}
