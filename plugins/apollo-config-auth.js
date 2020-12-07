import { createHttpLink } from 'apollo-link-http'
import Cookies from 'js-cookie'

export default function() {
  return {
    defaultHttpLink: false,

    link: createHttpLink({
      credentials: 'include',

      uri: process.env.APP_URL,

      fetch: (uri, options) => {
        // preparing for the new Laravel Sanctum authentication
        options.headers['X-XSRF-TOKEN'] = Cookies.get('XSRF-TOKEN')

        return fetch(uri, options)
      },
    }),
  }
}