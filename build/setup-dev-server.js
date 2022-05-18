/**
 * 监听是否打包成功
 */
const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const webpack = require('webpack')
const resolve = filePath => path.resolve(__dirname, filePath)
// 开发环境，将打包不用写入内存，不用写入磁盘
const devMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')

module.exports = (server, callback) => {
    let ready
    const onReady = new Promise( r => ready = r)
    let template, serverBundle, clientManifest

    const update = () => {
        if(template && serverBundle && clientManifest) {
            ready()
            callback(serverBundle, template, clientManifest)
        }
    }

    update()
    // ①监视 template -> 调用 update -> 更新 renderer 
    const templatePath = resolve('../index.template.html')
    template = fs.readFileSync(templatePath, 'utf-8')
    // 监听文件 用 chokidar 代替 fs.watch 和 fs.watchFile
    // 文档地址 https://www.npmjs.com/package/chokidar
    chokidar.watch(templatePath).on('change', ()=> {
        template = fs.readFileSync(templatePath, 'utf-8')
        update()
    })
    
    // ②监视 serverBundle -> 调用 update -> 更新 renderer 
    const serverConfig = require('./webpack.server.config')
    const serverCompiler = webpack(serverConfig)
    const serverDevMiddleware = devMiddleware(serverCompiler, {
        // logLevel: 'silent' // 关闭日志输入 ， 由 FriendlyErrorsWebpackPlugin 处
    })

    serverCompiler.hooks.done.tap('server',  () => {
        // 用 serverDevMiddleware.context.outputFileSystem 代替 fs 用来读取内存中文件
        serverBundle = JSON.parse(
            serverDevMiddleware.context.outputFileSystem.readFileSync(resolve('../dist/vue-ssr-server-bundle.json'), 'utf-8')
            )
        update()

    })
    // serverCompiler.watch({}, (err,stats) => {
    //     if(err) {
    //         console.log('webpack 配置文件错误');
    //         throw err
    //     }
    //     if(stats.hasErrors()) {
    //         console.log('编译错误');
    //         return
    //     }
    //     serverBundle = JSON.parse(fs.readFileSync(resolve('../dist/vue-ssr-server-bundle.json'), 'utf-8'))
    // })


    // ③监视 clientManifest -> 调用 update -> 更新 renderer 
    const clientConfig = require('./webpack.client.config')
    // plugins 添加热更新
    clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
    clientConfig.entry.app = [
        'webpack-hot-middleware/client?quiet=true&reload=true',
        clientConfig.entry.app
    ]
    clientConfig.output.filename = '[name].js' // 热更新模式要确保 文件名一致， 所以不能有hash
    const clientCompiler = webpack(clientConfig)
    const clientDevMiddleware = devMiddleware(clientCompiler, {
        // logLevel: 'silent' // 关闭日志输入 ， 由 FriendlyErrorsWebpackPlugin 处
        publicPath: clientConfig.publicPath
    })

    clientCompiler.hooks.done.tap('client',  () => {
        clientManifest = JSON.parse(
            clientDevMiddleware.context.outputFileSystem.readFileSync(resolve('../dist/vue-ssr-client-manifest.json'), 'utf-8')
            )
        update()

    })

    server.use(hotMiddleware(clientCompiler, {
        log: false
    }))

    // 将 clientDevMiddleware 挂载到 express 服务中， 提供对其内存中数据访问
    server.use(clientDevMiddleware)
    return onReady
}