import Vue from 'vue';
import Router from 'vue-router';

import Search from '~/pages/search/Search';
import AboutProject from '~/pages/about/AboutProject';
import Author from '~/pages/author/Author';

Vue.use(Router);

export function createRouter() {
    return new Router({
        mode: 'history',
        routes: [
            { name: 'index', path: '/', component: Search },

            { path: '/o-projektu', component: AboutProject },
            { path: '/pisen/:id/*', component: Search },
            { path: '/autor/:id', component: Author },

            { path: '/vanoce', redirect: { name: 'index', query: { stitky: '22' } } },
            { path: '/velikonoce', redirect: { name: 'index', query: { stitky: '23' } } },
            { path: '/advent', redirect: { name: 'index', query: { stitky: '24' } } },
            { path: '/postni-doba', redirect: { name: 'index', query: { stitky: '25' } } }
        ],
        scrollBehavior (to, from, savedPosition) {
            if (to.hash) {
                return { selector: to.hash }
            } else if (savedPosition) {
                return savedPosition
            } else {
                return { x: 0, y: 0 }
            }
        }

    });
}
