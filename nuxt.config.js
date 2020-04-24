require('dotenv').config();

export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
    ],
    link: [
      { rel: 'icon', type: 'image/png', 'sizes':'32x32', href: '~/static/img/favicon/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', 'sizes':'16x16', href: '~/static/img/favicon/favicon-16x16.png' },
      { rel: 'stylesheet', type: 'text/css', 'href': "https://fonts.googleapis.com/css?family=Nunito:200,600" },
      { rel: 'stylesheet', 'href': "https://fonts.googleapis.com/icon?family=Material+Icons" },
      { rel: 'stylesheet', type: 'text/css', 'href': "https://use.fontawesome.com/releases/v5.8.1/css/all.css", 'integrity':"sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf", 'crossorigin':"anonymous" }
      
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '~assets/sass/app.scss'
  ],
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
    ['@nuxtjs/google-analytics', { id: 'UA-94042414-8' }],
    '@nuxtjs/router',
    '@nuxtjs/dotenv',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // '@nuxtjs/pwa',
    '@nuxtjs/apollo',
    '@nuxtjs/axios',
    '@nuxtjs/proxy'
  ],
  apollo: {  
    clientConfigs: {
      default: {
        httpEndpoint: process.env.APP_URL
      }
    }
  },
  proxy: {
    '/api': { 
      target: process.env.GRAPHQL_TARGET,
      pathRewrite: {
        '^/api' : '/'
        }
      }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    },
    extractCSS: true
  }
}
