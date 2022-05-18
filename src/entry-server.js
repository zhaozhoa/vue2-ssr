/**
 * 服务端入口
 */

import {createApp} from './app'

export default async context => {
    const {app, router, store} = createApp()
    router.push(context.url)
    await new Promise(router.onReady.bind(router))
    context.rendered = () => {
        // renderer 会把 context.state 中的对象内联到页面模板中
        // 最终发送给客户端的页面包含一段脚本： window.__INITIAL_STATE__ = content.state
        // 客户端把 window.__INITIAL_STATE__ 拿出来填充到 store 容器中
        context.state = store.state
    }
    return app
}