/**
 * webpack 服务端 配置
 */

const {merge} = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const baseConfig = require('./webpack.base.config')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

module.exports = merge(baseConfig, {
    entry: './src/entry-server.js',
    // 允许 webpack 以 Node 适用方式处理模块加载
    target: 'node',
    output: {
        filename: 'server-bundle.js',
        // 使用 commonjs 风格导出模块
        libraryTarget: 'commonjs2'
    },
    // 不打包 node_modules 第三方包， 而是保留 require 方式直接加载
    externals: [nodeExternals({
        // 配置第三方包 白名单， 正常打包第三方包的 css 文件
        allowlist: [/\.css$/]
    })],
    plugins: [
        // 将服务器的整个输出为单个 JSON 文件的插件， 默认名称为 vue-ssr-server-bundle.json
        new VueSSRServerPlugin()
    ]
})