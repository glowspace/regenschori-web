<template>
    <div class="card news" v-if="news_items && news_items.length">
        <span class="news-item"><b>Aktuálně:</b></span>
        <UniversalLink v-for="(item, key) in news_items" :key="key" :type="item.link_type" :link="item.link" classes="news-item">
            <i v-if="item.fa_icon" :class="item.fa_icon"></i>{{ item.text }}
        </UniversalLink>
        <slot></slot>
    </div>
</template>

<script>

import UniversalLink from '~/components/UniversalLink';
import gql from 'graphql-tag';

const FETCH_NEWS = gql`
    query {
        news_items(active: true) {
            text
            fa_icon
            link
            link_type
        }
    }
`;

export default {
    name: 'News',

    components: { UniversalLink },

    data() {
        return {
            // news_items: [
            //     {
            //         text: 'Zpěvníková šifra',
            //         fa_icon: 'key',
            //         link: 'https://zpevnik.proscholy.cz/preview/501/a-mezidobi-11.pdf',
            //         link_type: 'PDF'
            //     }
            // ]
        };
    },

    apollo: {
        news_items: {
            query: FETCH_NEWS
        }
    }
};
</script>
