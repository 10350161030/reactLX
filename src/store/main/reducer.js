import * as main from './action-type';

/* 登录信息 */
let isLoginData = {
    LoginError:{},
    LoginData:{},
};
/* 微信个人信息 */
let WxPersonData={
    PersonError:{},
    PersonData:{},
}
/* 获取微信授权信息重定向连接 */
let WXauthorizationData={
    authorizationError:false,
    authorizationData:false,
}

/* 微信openID兑换 */
let WXopenIDData={
    openIDError:false,
    openIDData:false,
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


// 获取微信授权信息重定向连接
export const WXauthorizationlist= ( state = WXauthorizationData, action = {}) => {
  switch(action.type){
    case main.AUTHORIZATION: 
        return {...state, ...action}
    default:
        return state;
  }
}

// 获取openID
export const WXopenIDlist= ( state = WXopenIDData, action = {}) => {
  switch(action.type){
    case main.OPENID: 
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


