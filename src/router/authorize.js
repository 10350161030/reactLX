import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types'; 
import { userInfoAuthFun,openidFun,isUserLogin } from '@/store/main/action';
import { Route, Redirect } from "react-router-dom";
import { Toast} from 'antd-mobile';
import API from '@/api/api';
import axios from 'axios';
import PublicAlert from '@/components/alert/alert';
import { withRouter } from 'react-router';

export const PrivateRoute = ({ component: ComposedComponent, ...rest }) => {
  class Authentication extends Component {
    static propTypes = {
        WXauthorizationlist: PropTypes.object.isRequired,
        userInfoAuthFun: PropTypes.func.isRequired,
        WXopenIDlist:PropTypes.object.isRequired,
        openidFun:PropTypes.func.isRequired,
        formData: PropTypes.object.isRequired,
        isUserLogin: PropTypes.func.isRequired,
    }
    /* tost 公共状态 */
    state = {
        alertStatus: false, //弹框状态
        alertTip: "信息提醒",
        bindEQStatus: false,/* 绑定设备弹窗 */
        bgMask: false,/* 背景遮罩状态 */
        newUserAlert: false,/* 新用户福利弹窗 */
        index_:0,/* 防重复启用 */
        openidValue:false,/* openid初始化 */
    }

    isUserLogin = async type => {
        try {
            let loginResult = await API.isUserLogin({ type });
            console.log(loginResult);
            if (loginResult.code === "CD000001") {/* 已登录 */
                sessionStorage.setItem("Login",JSON.stringify(loginResult.body));
            }else if(loginResult.code === "CD008019"||loginResult.code === "CD001005"){/* 登录超时，页面过期 */
                this.props.userInfoAuthFun();/* 获取重定向 */
            }else if(loginResult.msg==="服务器异常"){/* 返回异常 */
                Toast.info(loginResult.msg);
            } else {/* 未登录 */
                if(this.props.isLoginSW&&sessionStorage.getItem("openid")){/* 有openid且开启登录验证 */
                    this.props.history.push("/login");
                    sessionStorage.removeItem("Login");
                }else if(!this.props.isLoginSW&&sessionStorage.getItem("openid")){/* 路由未开启登录校验 */
                    sessionStorage.removeItem("Login");
                }
            }
        } catch (err) {
            this.setState({
                alertStatus: true,
                alertTip: "服务器异常"
            })
            this.closeAlertFun();
        }
    }

    getOpenId = async codeText => {
        try {
            const openidData = await API.openidFun({},codeText);
            console.log(openidData);
            if (openidData.code === "CD000001") {
                sessionStorage.setItem("openid",openidData.body.openid);
                console.log("获取完openid 执行了");
                /* 管他三七二十一先获取登录信息，判断是否页面过期 */
                this.isUserLogin();
            } else {
                this.props.userInfoAuthFun();/* 获取重定向 */
                Toast.info(openidData.msg);
            }
        } catch (err) {
            Toast.info(err);
        }
    }



    componentWillMount() {
        /* 未有授权连接 */
        if(!sessionStorage.getItem("redirect")){/* 没有保存到重定向连接 */
            this.props.userInfoAuthFun();/* 获取授权 */
        }else if(sessionStorage.getItem("redirect") && !sessionStorage.getItem("openid")){/* 有授权连接，且没有openid */
            /* 匹配链接字符参数 */
            function GetParam(url, id) {
                url = url + "";
                let regstr = "/(\\?|\\&)" + id + "=([^\\&]+)/";
                let reg = eval(regstr); //eval可以将 regstr字符串转换为 正则表达式
                let __result = url.match(reg); //匹配的结果是：result[0]=?sid=22 result[1]=sid result[2]=22。所以下面我们返回result[2]
                if (__result && __result[2]) {
                    return __result[2];
                }
            }
            const linkurl=decodeURIComponent(window.location.href);
            const code= GetParam(linkurl,"code");
            console.log(code);
            if(!code){
                // Toast.info("授权时，未获取到code信息，请联系客服或关闭重试");
                this.props.userInfoAuthFun();/* 获取授权 */
                return false;
            }
            this.getOpenId(code);
        }else{
            console.log("有openid 执行了else");
             /* 管他三七二十一先获取登录信息，判断是否页面过期 */
             this.isUserLogin();
        }
        const _this=this;
        setTimeout(function() {/* 30秒后没有获取到openid 触发重定向连接 */
            if(!sessionStorage.getItem("openid")){
                _this.props.userInfoAuthFun();/* 获取重定向 */
            } 
        }, 30000);

    }
    componentWillReceiveProps(nextProps) {
        /* 判断是否授权异常 */
        if (nextProps.WXauthorizationlist.authorizationError.msg) {
            Toast.info(nextProps.WXauthorizationlist.authorizationError.msg);
        }
        /* 判断获取openid是否异常 */
        if (nextProps.WXopenIDlist.openIDError.msg ) {
            Toast.info(nextProps.WXopenIDlist.openIDError.msg);
        }else if(nextProps.WXopenIDlist.openIDData&&nextProps.WXopenIDlist.openIDData!==true){
            console.log("由于父级改变触发 state改变");
            // this.setState({
            //     openidValue:nextProps.WXopenIDlist.openIDData,
            // });
        }
    }
    render() {
        console.log("执行了渲染");
      return (
        <Route
          {...rest}
          render={
            props =>
                sessionStorage.getItem("openid")/* 是否有openid */
                ?
                    this.props.isLoginSW&&!localStorage.getItem("Login") /* 开启登录判断 */
                    ? 
                        (<Redirect
                            to={{
                            pathname: "/login",
                            state: { from: props.location }
                            }}
                        />) 
                    :/* 未开启登录 */
                        (<ComposedComponent {...props} />)
                :
                    <div style={{
                        width:'100%',
                        textAlign:'center',
                        marginTop:"50px"
                    }}>您未进行微信信息授权，请稍后。。</div>
          }
        />
      );
    }
  }
 
  const AuthenticationContainer =  withRouter(connect(state => ({
    WXauthorizationlist: state.WXauthorizationlist,
    WXopenIDlist:state.WXopenIDlist,
    formData: state.formData,
  }),{
    userInfoAuthFun,
    openidFun,
    isUserLogin,
  })(Authentication));
  return <AuthenticationContainer />;
};