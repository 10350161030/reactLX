import * as home from './action-type';
import API from '@/api/api';

// 初始化获取登录状态，保存至redux
export const isUserLogin = () => {
    // 返回函数，异步dispatch
    return async dispatch => {
      try{
        let result = await API.isUserLogin();
        if(result.code ==="CD000001"){
            dispatch({
                type: home.ISLOGIN,
                isLoginData: result.body,
            })
        }else{
            dispatch({
                type: home.ISLOGIN,
                isLoginData: result,
            })
        }
       
      }catch(err){
        console.error(err);
      }
    }
}