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

    next()
}
