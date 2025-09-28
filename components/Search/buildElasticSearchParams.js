/// INTERNAL FUNCTIONS USED FOR BUILDING ELASTIC QUERY

function applyFulltext(query, search_string, options = {
    exact_phrase: false,
}) {
    if (options.exact_phrase) {
        query.bool.must.push({
            multi_match: {
                query: search_string,
                fields: ['name', 'lyrics', 'authors', 'hymnology'],
                type: 'phrase'
            }
        })
    } else {
        query.bool.should.push({
            // search-as-you-type
            multi_match: {
                query: search_string,
                fields: ['name^2', 'name_.2gram', 'name._3gram'],
                type: 'bool_prefix'
            }
        }, {
            // phrase search
            multi_match: {
                query: search_string,
                fields: ['name^2', 'lyrics^3'],
                type: 'phrase',
                slop: 2
            }
        }, {
            //fuzzy search, word-by-word
            multi_match: {
                query: search_string,
                fields: ['name'],
                fuzziness: 1
            }
        }, {
            //fuzzy search, authors more prone to errors
            multi_match: {
                query: search_string,
                fields: ['authors', 'hymnology'],
                fuzziness: 'AUTO'
            }
        })
    }

    const exact_match_fields = [
        'song_number^50',
        'songbook_records.songbook_number',
        'songbook_records.songbook_full_number^50'
    ]

    query.bool.should.push({
        multi_match: {
            query: search_string,
            fields: exact_match_fields
        }
    });
}

function applyDisableRegenschori(query)
{
    // todo: rewrite to is_for_band
    // query.bool.filter.push({ term: { only_regenschori: { value: false } } });
}

function applyDisableArrangements(query)
{
    query.bool.filter.push({ term: { is_arrangement: { value: false } } });
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
    sort.push({'name_raw': {order: is_descending ? 'desc' : 'asc'}});
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

// groups here reflect the graphql definition as in https://github.com/proscholy/api.proscholy.cz/blob/development/graphql/tag.graphql#L32
// however, for the purpose of elasticsearch filtering in buildElasticSearchParams.js, exact group names are *not* necessary
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
        sacred_occasion: [],
    },
    selected_tags = {}
) {
    return Object.values(tags_groups).map(
        group => group ?
            group.map(tag => tag.id).filter(tag_id => selected_tags[tag_id])
            : []
    );
}

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
    },
    filterConfig: {
        show_regenschori: false,
        show_arrangements: false
    }
}) {

    let query = {
        bool: {
            // see must/should/filter elastic documentation https://www.elastic.co/guide/en/elasticsearch/reference/current/query-filter-context.html
            must: [],
            should: [],
            filter: []
        }
    };

    let sort = [];

    const cleanSearchString = params.searchString.replace(/"/g, '');
    const isExactMatch = params.searchString == `"${cleanSearchString}"`;

    if (cleanSearchString) {
        applyFulltext(query, params.searchString, {
            exact_phrase: isExactMatch
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

    if (!(params.filterConfig && params.filterConfig.show_regenschori)) {
        applyDisableRegenschori(query);
    }

    if (!(params.filterConfig && params.filterConfig.show_arrangements)) {
        applyDisableArrangements(query);
    }

    const query_str = JSON.stringify({
        sort: sort,
        query: query,
        min_score: cleanSearchString ? 0.5 : 0
    });

    return query_str;
}
