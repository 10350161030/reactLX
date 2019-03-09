import * as main from './action-type';
import API from '@/api/api';

// 初始化获取登录状态，保存至redux
export const isUserLogin = () => {
    // 返回函数，异步dispatch
    return async dispatch => {
        try {
            let result = await API.isUserLogin();
            if (result.code === "CD000001") {
                dispatch({
                    type: main.ISLOGIN,
                    LoginData: result.body,
                })
            } else {
                dispatch({
                    type: main.ISLOGIN,
                    LoginError: result,
                })
            }

        } catch (err) {
            let result = {
                msg: "服务器异常",
            }
            dispatch({
                type: main.ISLOGIN,
                LoginError: result,
            })
        }
    }
}


// 获取授权连接
export const userInfoAuthFun = () => {
    // 返回函数，异步dispatch
    return async dispatch => {
        sessionStorage.removeItem("openid");
        try {
            let result = await API.userInfoAuth();
            if (result.code === "CD000001") {
                dispatch({
                    type: main.AUTHORIZATION,
                    authorizationData: result.body.redirect,
                })
                sessionStorage.setItem("redirect", result.body.redirect);
               
                window.location.href = result.body.redirect;
                return false;
            } else {
                dispatch({
                    type: main.AUTHORIZATION,
                    authorizationError: result,
                })
                sessionStorage.removeItem("redirect");
            }
        } catch (err) {
            sessionStorage.removeItem("redirect");
            let result = {
                msg: "服务器异常",
            }
            dispatch({
                type: main.AUTHORIZATION,
                authorizationError: result,
            })
        }
    }
}

// 获取openid
export const openidFun = (params, redirect) => {
    // 返回函数，异步dispatch
    return async dispatch => {
        try {
            let result = await API.openidFun(params, redirect);
            if (result.code === "CD000001") {
                console.log("获取到openid设置openid");
                console.log(result);
                sessionStorage.setItem("openid",result.body.openid)
                // dispatch({
                //     type: main.OPENID,
                //     openIDData: result.body.openid,
                // })
              
            } else {
                dispatch({
                    type: main.OPENID,
                    openIDError: result,
                })
                sessionStorage.removeItem("openid")
            }

        } catch (err) {
            sessionStorage.removeItem("openid")
            let result = {
                msg: "服务器异常",
            }
            dispatch({
                type: main.OPENID,
                openIDError: result,
            })
        }
    }
}


// 初始化获取微信个人信息，保存至redux
export const getWXpsoninfo = () => {
    // 返回函数，异步dispatch
    return async dispatch => {
        try {
            let result = await API.getWXpsoninfo();
            if (result.code === "CD000001") {
                dispatch({
                    type: main.PERSONDATA,
                    PersonData: result.body,
                })
            } else {
                dispatch({
                    type: main.PERSONDATA,
                    PersonError: result,
                })
            }
        } catch (err) {
            let result = {
                msg: "服务器异常",
            }
            dispatch({
                type: main.PERSONDATA,
                PersonError: result,
            })
        }
    }
}