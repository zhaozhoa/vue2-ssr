const Vue = require('vue')
const fs = require('fs')
const {createBundleRenderer} = require('vue-server-renderer')
const setupDevServer = require('./build/setup-dev-server.js')

const express = require('express')
const server = express()


const isProd = process.env.NODE_ENV === 'production'
let renderer 
let onReady // 是否重新打包
if(isProd) {
    // serverBundle 里面包含了打包好的vue 文件 files[entry]
    const serverBundle = require('./dist/vue-ssr-server-bundle.json')
    const template = fs.readFileSync('./index.template.html','utf-8')
    const clientManifest = require('./dist/vue-ssr-client-manifest.json')
    renderer = createBundleRenderer(serverBundle,{
        template,
        clientManifest
    })
} else {
    // 开发模式， 监听打包构建， 重新生成 renderer 渲染器
    onReady = setupDevServer(server, (serverBundle, template, clientManifest)=> {
        renderer = createBundleRenderer(serverBundle,{
            template,
            clientManifest
        })
    })
}


//开放静态资源 ‘/dist’ 对应 webpack output 的 publicPath
server.use('/dist', express.static('./dist'))

// 渲染函数
const render = async(req, res)=> {
    try {
        const html = await renderer.renderToString({
            title: '测试 ssr', // 设置页面title
            meta: `
            <meta name="description" content="测试 ssr">
            `, // 设置title
            url: req.url
        })
        res.send(html)
    } catch (err) {
        console.log('err: ', err);
        res.status(500).end('server error')
    }



}

server.get('*', isProd ? render : async (req,res)=> {
    // 开发环境， 需要等待有了 renderer 渲染器后 调研 render 渲染
    await onReady
    render(req,res)
} )
server.listen(3000, ()=> {
    console.log(`server is running at port 3000`);
})

