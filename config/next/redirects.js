const buildRedirect = (source, destination, permanent = false) => {
    return {
        source,
        destination,
        permanent,
    };
};

const redirects = [
    buildRedirect('/releases/:path*', '/gh-releases/:path*'),
    buildRedirect('/feed', '/feed.xml'),
    buildRedirect('/sitemap', '/sitemap.xml'),
]

module.exports = redirects