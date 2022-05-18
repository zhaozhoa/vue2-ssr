/**
 * 客户端配置
 */

const {merge} = require('webpack-merge')
const baseConfig = require('./webpack.base.config.js')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

module.exports = merge(baseConfig, {
    entry: {
        app: './src/entry-client.js' // 这里路径指的是 执行打包命令是的路径，即项目根目录
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        cacheDirectory: true,
                        plugins: ['@babel/plugin-transform-runtime']
                    }
                }
            }
        ]
    },

    // 将 webpack 运行时分离到一个引导 chunk 中，以便可以在之后正确注入异步 chunk
    optimization: {
        splitChunks: {
            name: 'manifest',
            minChunks: Infinity
        }
    },

    plugins: [
        // 此插件 在输出目录中生成 vue-ssr-client-manifest.json
        new VueSSRClientPlugin()
    ]
})