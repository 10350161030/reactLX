import React from 'react';/* 引用react */
import ReactDOM from 'react-dom';/* 引用渲染模板 */
import Route from "./router/";
import FastClick from "fastclick";
import './index.css';/* 引用首页样式 */
import registerServiceWorker from "./registerServiceWorker";
import {AppContainer} from "react-hot-loader";/* 热加载 */
import {Provider} from "react-redux";
import store from '@/store/store';
// import './utils/setRem';
import './style/base.css';
import 'antd-mobile/dist/antd-mobile.css';
FastClick.attach(document.body);


const render = Component =>{
    ReactDOM.render( //绑定redux、热加载
        <Provider store={store}>
          <AppContainer>
            <Component />
          </AppContainer>
        </Provider>, document.getElementById('LiuXin'));/* 定义类名 中的name */
}
render(Route);
if(module.hot){
    module.hot.accept("./router/",() => {
        render(Route);
    })
}

registerServiceWorker();

  