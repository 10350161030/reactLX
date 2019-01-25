import * as home from './action-type';

/* 默认不登录 */
let defaultState = {
    isLoginData:{},
}
// 首页表单数据
export const formData = (state = defaultState , action = {}) => {
  switch(action.type){
    case home.ISLOGIN: 
      return {...state, ...action}
    default:
      return state;
  }
}

