/**
 * 客户端入口
 */

import { createApp } from "./app";

const {app, router,store} = createApp()
// 挂载
if(window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__)
}
router.onReady(()=> {
    app.$mount('#app');
})