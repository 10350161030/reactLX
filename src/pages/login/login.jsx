import React, { Component } from 'react';
import { is, fromJS } from 'immutable';
import PublicAlert from '@/components/alert/alert';
import API from '@/api/api';
import { Toast, List, InputItem, WhiteSpace, Button } from 'antd-mobile';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';

import '../../pages/register/register.less';
import "./login.less"

class Login extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state = {
        isShowPass: false,/* 是否显示密码 */
        alertStatus: false, //弹框状态
        alertTip: "信息提示",
        submitStatus: false,

        phoneValue: "",/* 手机号校验 */
        phoneHasError: false,

        passWordValue: "",/* 密码校验 */
        passWordHasError: false,
    }

    /* 自动关闭弹窗 */
    closeAlertFun = () => {
        const that = this;
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
            that.setState({
                alertStatus: false,
            });
        }, 4000);
    }

    /* 显示密码 */
    showPassFun = () => {
        this.setState({
            isShowPass: !this.state.isShowPass,
        });
    }
    /* 登录提交 */
    loginSubmit = async type => {
        if (!this.state.phoneValue.match(/^1[3|4|5|6|7|8|9][0-9]{9}$/)) {
            this.setState({
                alertStatus: true,
                alertTip: "请输入正确的手机号",
            })
            this.closeAlertFun();
            return false;
        }  else if (!this.state.passWordValue.match(/^[0-9a-zA-Z]{6,16}$/)) {
            this.setState({
                alertStatus: true,
                alertTip: "请输入正确的密码",
            })
            this.closeAlertFun();
            return false;
        }


        try {
            let result = await API.loginSubmit({
                password: this.state.passWordValue, //密码
                mobile:this.state.phoneValue,
            });
            if (result.code === "CD000001") {
                this.props.history.push("/");
            } else {
                this.setState({
                    alertStatus: true,
                    alertTip: result.msg,
                })
                this.closeAlertFun();
            }
        } catch (err) {
            this.setState({
                alertStatus: true,
                alertTip: "服务器异常"
            })
            this.closeAlertFun();
        }
    }


    phoneErrorClick = (e) => {
        if (this.state.phoneHasError) {
            Toast.info(this.inputRef);
        }
    }

    phoneChange = (phoneValue) => {
        if (phoneValue.match(/^1[3|4|5|6|7|8|9][0-9]{9}$/)) {
            this.setState({
                phoneHasError: false,
            });
        } else {
            this.setState({
                phoneHasError: true,
            });
        }
        this.setState({
            phoneValue,
        });
    }

    passWordErrorClick = (e) => {
        if (this.state.passWordHasError) {
            Toast.info(this.inputRef);
        }
    }

    passWordChange = (passWordValue) => {
        if (passWordValue.match(/^[0-9a-zA-Z]{6,16}$/)) {
            this.setState({
                passWordHasError: false,
            });
        } else {
            this.setState({
                passWordHasError: true,
            });
        }
        this.setState({
            passWordValue,
        });
    }



    shouldComponentUpdate(nextProps, nextState) {

        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState));
    }


    componentWillUpdate(v1, v2) {
        if (v2.phoneValue.match(/^1[3|4|5|6|7|8|9][0-9]{9}$/) && v2.passWordValue.match(/^[0-9a-zA-Z]{6,16}$/)) {
            this.setState({
                submitStatus: true,
            })
        } else {
            this.setState({
                submitStatus: false,
            })
        }
    }

    componentDidMount() {

    }

    render() {

        return (
            <main className="common-con-top registerCommon" id="login">
                <div className="ver_form clearfix">
                    <form className="cmxform" id="commentForm">
                        <div className="form-group clearfix">
                            <div className="col-xs-12">
                                <List >
                                    <InputItem
                                        type="number"
                                        placeholder="输入手机号"
                                        id="phone"
                                        name="phone"
                                        maxLength="11"
                                        className="form-control pa_ln photo_lable_inp"
                                        onChange={this.phoneChange}
                                        onErrorClick={this.phoneErrorClick}
                                        error={this.state.phoneHasError}
                                        value={this.state.phoneValue}
                                        ref={el => this.inputRef = "手机号为13|4|5|6|7|8|9开头的11位数字"}
                                    ></InputItem>
                                </List>
                            </div>
                        </div>
                        <div className="form-group password_value clearfix">
                            <div className="col-xs-12 pr passwordbox">
                                <List>
                                    <InputItem
                                        type={this.state.isShowPass ? "text" : "password"}
                                        placeholder="设置6-16位密码"
                                        id="password"
                                        onChange={this.handleInputChange}
                                        className="form-control password_lable_inp pa_ln"
                                        maxLength="16"
                                        onChange={this.passWordChange}
                                        onErrorClick={this.passWordErrorClick}
                                        error={this.state.passWordHasError}
                                        value={this.state.passWordValue}
                                        ref={el => this.inputRef = "密码为6-16位数的数字英文大小写"}
                                    ></InputItem>
                                </List>
                                <i className="icon" onClick={this.showPassFun.bind(this)} id={this.state.isShowPass ? "showPass" : "hidenPass"}></i>
                            </div>
                        </div>
                        <div className="clearfix">
                            <NavLink to="/repassword" className="fgpassword_btn">忘记密码？</NavLink>
                        </div>

                        <div name="phone" className="error_msg phone">
                        </div>
                        <div className=" verifibtn">
                            <footer>
                                <Button href="javascript:;" onClick={this.loginSubmit.bind(this)} type="primary" className={this.state.submitStatus ? "next" : "next disablebtn"}>点击登录</Button>
                            </footer>
                        </div>
                        <div className="col-xs-12 login_registerBox">
                            <NavLink to="/register" className="login_register new_login_register">没有账号，快速注册</NavLink>
                        </div>
                    </form>
                </div>
                <PublicAlert alertStatus={this.state.alertStatus} alertTip={this.state.alertTip} />
            </main>
        )
    }
}

export default withRouter(Login);
