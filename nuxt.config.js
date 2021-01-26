require('dotenv').config();
import PurgecssPlugin from 'purgecss-webpack-plugin'
import glob from 'glob-all'
import path from 'path'

export default {
    ssr: !process.env.NUXT_SPA,
    env: {
        baseUrl: 'https://www.regenschori.cz',
        titleWebsite: 'Regenschori',
        titleSeparator: ' – ',
        adminUrl: process.env.ADMIN_URL || ''
    },
    /*
     ** Headers of the page
     */
    head: {
        title: 'Regenschori',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },

            { name: 'msapplication-TileColor', content: '#da532c' },
            { name: 'theme-color', content: '#292929' },

            { property: 'og:type', content: 'website' },
            // { property: 'og:image', content: 'https://zpevnik.proscholy.cz/banner.png' },
            // { property: 'twitter:card', content: 'summary_large_image' },
            // { property: 'twitter:image', content: 'https://zpevnik.proscholy.cz/banner.png' }
        ],
        link: [
            // { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            // { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },
            // { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32x32.png' },
            // { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16x16.png' },
            // { rel: 'manifest', href: '/favicon/site.webmanifest' },
            // { rel: 'mask-icon', href: '/favicon/safari-pinned-tab.svg', color: '#5bbad5' },

            {
                rel: 'stylesheet',
                type: 'text/css',
                href: 'https://use.fontawesome.com/releases/v5.9.0/css/all.css',
                crossorigin: 'anonymous'
            }
        ],
        script: [
            { src: '/dark.js' }
        ]
    },
    messages: {
        loading: 'Načítání…',
        error_404: 'Error 404 – stránka nebyla nalezena',
        server_error: 'Chyba serveru',
        nuxtjs: '',
        back_to_home: 'Zpět na úvodní stránku',
        server_error_details:
          `Ajajaj, na našem serveru se někde stala chyba.
          <br>Zkuste <u><a href="/">použít vyhledávání</a></u>.
          <br>Chybu také můžete <u><a
          href="https://docs.google.com/forms/d/e/1FAIpQLSfry7CQD0vPpuC_VB7xGR6NUF2WdPUytQwX8KipKoZcIYxbdA/viewform?usp=pp_url&entry.1025781741=–&entry.456507920=e500"
          id="report-link">nahlásit</a></u>.
          <script>if (document.getElementById('report-link'))
          {document.getElementById('report-link').setAttribute('href',
          document.getElementById('report-link').getAttribute('href').replace('=–&', '=' + encodeURIComponent(window.location.href) + '&'));}</script>`,
        client_error: 'Chyba',
        client_error_details:
          'Během renderování stránky došlo k chybě. Více informací najdeš v konzoli nástrojů pro vývojáře.'
    },
    /*
     ** Customize the progress-bar color
     */
    loading: { color: '#aaa' },
    /*
     ** Global CSS
     */
    css: ['~assets/sass/app.scss'],
    /*
     ** Plugins to load before mounting the App
     */
    plugins: [
        // ssr: false to only include it on client-side
        { src: '~/plugins/firebase.js', ssr: false }
    ],
    /*
     ** Nuxt.js dev-modules
     */
    buildModules: [
        ['@nuxtjs/google-gtag', {
            id: 'G-2NKB4371EG',
            config: { anonymize_ip: true }
        }],
        '@nuxtjs/router',
        '@nuxtjs/dotenv',
        ['@nuxtjs/vuetify', { treeShake: true, theme: { disable: true } }],
        ['@nuxtjs/date-fns', { locales: ['cs'] }]
    ],
    /*
    ** Nuxt.js modules
    */
   modules: [
       // '@nuxtjs/pwa',
       '@nuxtjs/apollo',
       '@nuxtjs/axios',
       '@nuxtjs/proxy',
       '@nuxtjs/sentry'
    ],
    apollo: {
        clientConfigs: {
            default: '~/plugins/apollo-config-auth.js',
        }
    },
    proxy: {
        '/api': {
            target: process.env.GRAPHQL_TARGET,
            pathRewrite: {
                '^/api': '/'
            }
        }
    },
    sentry: {
        dsn: process.env.SENTRY_DSN
    },
    /*
     ** Build configuration
     */
    build: {
        /*
         ** You can extend webpack config here
         */
        extend(config, { isDev, isClient }) {
            config.plugins.push(
                new PurgecssPlugin({
                    paths: glob.sync([
                        path.join(__dirname, './pages/**/*.vue'),
                        path.join(__dirname, './layouts/**/*.vue'),
                        path.join(__dirname, './components/**/*.vue'),
                        path.join(__dirname, './node_modules/@bit/**/*.vue')
                    ]),
                    whitelist: ['html', 'body', 'nuxt-progress', 'tag-selected'],
                    whitelistPatterns: [/^v-((?!application).)*$/, /^nuxt/],
                    whitelistPatternsChildren: [/^theme--*/, /^v-((?!application).)*$/, /^nuxt/, /data-dark/]
                })
            );

            if (isClient) {
                config.optimization.splitChunks.maxSize = 500000;
            }
        },
        extractCSS: true
    }
};
