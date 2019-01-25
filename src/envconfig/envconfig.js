/**
 * 全局配置文件
 */
let baseURL; 
let imgUrl = '//elm.cangdu.org/img/';
if(process.env.NODE_ENV === 'development'){
  baseURL = 'https://www.easy-mock.com/mock/5c2d6b92410de05f5d0de661/user/01';
}else{
  baseURL = 'https://www.easy-mock.com/mock/5c2d6b92410de05f5d0de661/user/01';
}


export default {imgUrl, baseURL}