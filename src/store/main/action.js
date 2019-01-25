import * as main from './action-type';
import API from '@/api/api';

// 初始化获取登录状态，保存至redux
export const isUserLogin = () => {
    // 返回函数，异步dispatch
    return async dispatch => {
      try{
        let result = await API.isUserLogin();
        if(result.code ==="CD000001"){
            dispatch({
                type: main.ISLOGIN,
                LoginData: result.body,
            })
        }else{
            dispatch({
                type: main.ISLOGIN,
                LoginError: result,
            })
        }
       
      }catch(err){
        let result={
            msg:"服务器异常",
        }
        dispatch({
            type: main.ISLOGIN,
            LoginError: result,
        })
      }
    }
}

// 初始化获取微信个人信息，保存至redux
export const getWXpsoninfo = () => {
    // 返回函数，异步dispatch
    return async dispatch => {
      try{
        let result = await API.getWXpsoninfo();
        if(result.code ==="CD000001"){
            dispatch({
                type: main.PERSONDATA,
                PersonData: result.body,
            })
        }else{
            dispatch({
                type: main.PERSONDATA,
                PersonError: result,
            })
        }
      }catch(err){
        let result={
            msg:"服务器异常",
        }
        dispatch({
            type: main.PERSONDATA,
            PersonError: result,
        })
      }
    }
}
