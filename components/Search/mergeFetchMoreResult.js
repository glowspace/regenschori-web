export default function (previousResult, fetchMoreResult) 
{
    const newSongLyrics = fetchMoreResult.song_lyrics_paginated.data;
    const paginatorInfo =
        fetchMoreResult.song_lyrics_paginated.paginatorInfo;

    return {
        hasMorePages: paginatorInfo.hasMorePages,
        currentPage: paginatorInfo.currentPage,
        mergedResult: {
            song_lyrics_paginated: {
                __typename:
                    previousResult.song_lyrics_paginated.__typename,
                // Merging the songLyrics lists
                data: [
                    ...previousResult.song_lyrics_paginated.data,
                    ...newSongLyrics
                ],
                paginatorInfo
            }
        }
    };
}