import * as main from './action-type';

/* 默认不登录 */
let isLoginData = {
    LoginError:{},
    LoginData:{},
};
let WxPersonData={
    PersonError:{},
    PersonData:{},
}
// 判断登录信息
export const formData = ( state = isLoginData, action = {}) => {
  switch(action.type){
    case main.ISLOGIN: 
        return {...state, ...action}
    default:
        return state;
  }
}

// 首页表单数据
export const PersonList = ( state = WxPersonData, action = {}) => {
  switch(action.type){
    case main.PERSONDATA: 
        return {...state, ...action}
    default:
        return state;
  }
}


