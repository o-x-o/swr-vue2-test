module.exports = {
    devServer: {
        // disableHostCheck: true,
        proxy: {
            '/proxy/lmember-cms-api-prod/': {
                target: 'https://api.longfor.com/lmember-cms-api-prod/',
                changeOrigin: true,
                pathRewrite: {
                  '^/proxy/lmember-cms-api-prod/': ''
                }
            },
            '/proxy/lkblog/': {
                target: 'http://api.lkblog.net/',
                changeOrigin: true,
                pathRewrite: {
                    '^/proxy/lkblog/': ''
                }
            }
        }
    }
}