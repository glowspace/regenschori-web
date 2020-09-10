import isHTTPS from 'is-https'

export default function(req, res, next) {
    // detect urls you'd like to redirect
    // call res.redirect(CODE, NEWURL)
    // return if it's a match, don't run next()!

    // www start
    if (req.headers.host == 'regenschori.cz') {
        const destination = 'https://www.regenschori.cz' + req.originalUrl
        res.writeHead(307, { Location: destination })
        return res.end(destination)
    }
    // www end

    // https start
    if (req.headers.host == 'www.regenschori.cz') {
        const options = {
            trustProxy: true,
            redirectPort: 443,
            redirectHost: '',
            redirectUnknown: true,
            statusCode: 307
        }

        const _port = options.redirectPort === 443 ? '' : (':' + options.redirectPort)
        const url = req.url || ''
        const _isHttps = isHTTPS(req, options.trustProxy)
        const shouldRedirect = options.redirectUnknown ? !_isHttps : _isHttps === false

        if (shouldRedirect) {
            const _redirectHost = (options.redirectHost || req.headers.host || '').split(':')[0]
            const ـredirectURL = 'https://' + _redirectHost + _port + url
            res.writeHead(options.statusCode, { Location: ـredirectURL })
            return res.end(ـredirectURL)
        }
    }
    // https end

    next()
}
