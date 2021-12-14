module.exports = {
    devServer: {
        host: 'localhost',
        port: 8080,
        https: false,
        proxy: {
            '/travel': {
                target: 'http://localhost:3055',
                changeOrigin: true
            },
            '/test': {
                target: 'http://localhost:8085',
                changeOrigin: true
            }
        }
    }
}