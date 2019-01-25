import React, { Component } from 'react';
import { is, fromJS } from 'immutable';
import { connect } from 'react-redux';
import PublicAlert from '@/components/alert/alert';
import API from '@/api/api';
import { getWXpsoninfo } from '@/store/main/action';
import PropTypes from 'prop-types';
import '../../pages/register/register.less';
import "./changephone.less";
import { Toast, List, InputItem, WhiteSpace, Button } from 'antd-mobile';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';


class Changephone extends Component {
    static propTypes = {
        PersonList: PropTypes.object.isRequired,
    }
    constructor(props, context) {
        super(props, context);
    }

    state = {
        YZMState: false,/* 验证码倒计时 */
        YZMNumber: 0,/* 重新发送倒计时 */
        isShowPass: false,/* 是否显示密码 */
        alertStatus: false, //弹框状态
        alertTip: "信息提示",
        submitStatus: false,

        agree: true,/* 选择框 */

        phoneValue: "",/* 手机号校验 */
        phoneHasError: false,

        codeValue: "",/* 验证码校验 */
        codeHasError: false,
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
    /* 重置密码提交 */
    repassWordSubmit = async type => {
        if (!this.state.phoneValue.match(/^1[3|4|5|6|7|8|9][0-9]{9}$/) || !this.state.codeValue.match(/^[0-9]{6}$/) || !this.state.agree) {
            this.props.history.goBack();
            return false;
        }
        try {
            let result = await API.registerSubmit({
                verifyCode: this.state.codeValue,
                mobile: this.state.phoneValue,
                agree: this.state.agree,
            });
            if (result.code === "CD000001") {
                this.props.history.push("/personinfo");
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


    /* 发送验证码 */
    sendCodeFun = async type => {
        if (!this.state.phoneValue.match(/^1[3|4|5|6|7|8|9][0-9]{9}$/)) {
            return false;
        }
        this.setState({
            YZMNumber: 60,
        })
        try {
            let result = await API.verifyCode({
                mobile: this.state.phoneValue,
                business: 'wx_change_mobile_sms',
                channel: 'wechat'
            });
            if (result.code === "CD000001") {

                this.setState({
                    alertStatus: true,
                    alertTip: result.msg,
                })
                this.closeAlertFun();

                this.setState({
                    YZMState: true,
                })
                const that = this;
                clearTimeout(this.timer);

                if (this.timer) {
                    clearTimeout(this.timer);
                }
                this.timer = setInterval(() => {
                    this.state.YZMNumber--;
                    let nextNumber = that.state.YZMNumber--;
                    if (that.state.YZMNumber > 0) {
                        if (that.state.YZMNumber == 56) {
                            that.setState({
                                YZMNumber: nextNumber,
                                alertStatus: false,
                            });
                        } else {
                            that.setState({
                                YZMNumber: nextNumber,
                            });
                        }
                    } else {

                        that.setState({
                            YZMState: false,
                        });
                        clearTimeout(that.timer);
                    }
                }, 1000);
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

    /* 提交按钮改变状态 */
    agreeChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? !this.state.agree : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
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


    codeErrorClick = (e) => {
        if (this.state.codeHasError) {
            Toast.info(this.inputRef);
        }
    }

    codeChange = (codeValue) => {
        if (codeValue.match(/^[0-9]{6}$/)) {
            this.setState({
                codeHasError: false,
            });
        } else {
            this.setState({
                codeHasError: true,
            });
        }
        this.setState({
            codeValue,
        });
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState));
    }


    componentWillUpdate(v1, v2) {
        console.log();
        if (v2.phoneValue.match(/^1[3|4|5|6|7|8|9][0-9]{9}$/) && v2.agree && v2.codeValue.match(/^[0-9]{6}$/)) {
            this.setState({
                submitStatus: true,
            })
        } else {
            this.setState({
                submitStatus: false,
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        /* 异步判断获取微信服务器信息是否异常 */
        if (nextProps.PersonList.PersonError.msg) {
            if (nextProps.match.params.name) {
                this.setState({
                    alertStatus: true,
                    alertTip: nextProps.PersonList.PersonError.msg,
                    phoneValue: nextProps.match.params.name
                })
            } else {
                this.setState({
                    alertStatus: true,
                    alertTip: nextProps.PersonList.PersonError.msg
                })
            }
            this.closeAlertFun();
        } else {
            if (nextProps.match.params.name) {
                this.setState({
                    phoneValue: nextProps.match.params.name
                })
            }
        }
    }
    componentDidMount() {
        this.props.getWXpsoninfo();
    }
    render() {

        return (
            <main className="common-con-top">
                <div className="ver_form clearfix">
                    <header id="head_form">
                        <div className="register_photo"><img src={this.props.PersonList.PersonData.avatar} /></div>
                        <p className="username" >{this.props.PersonList.PersonData.name}</p>
                    </header>
                    <form className="cmxform" id="commentForm">
                        <div className="form-group clearfix">
                            <div className="col-xs-8">
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
                            <div className="col-xs-4 pa_ln yzm">
                                {!this.state.YZMState && <input onClick={this.sendCodeFun.bind(this)} className={this.state.phoneValue.match(/^1[3|4|5|6|7|8|9][0-9]{9}$/) ? "ver_btn truedisable" : "ver_btn"} type="button" value="发送验证码" />}
                                {this.state.YZMState && <a className="ver_btn "  ><span>{this.state.YZMNumber}</span>s再次发送</a>}
                            </div>

                        </div>
                        <div className="form-group clearfix">
                            <div className="col-xs-12">
                                <List>
                                    <InputItem
                                        type="number"
                                        placeholder="输入验证码"
                                        id="code"
                                        name="code"
                                        maxLength="6"
                                        className="form-control ver_label_inp pa_ln"
                                        onChange={this.codeChange}
                                        onErrorClick={this.codeErrorClick}
                                        error={this.state.codeHasError}
                                        value={this.state.codeValue}
                                        ref={el => this.inputRef = "验证码为6位数的数字"}
                                    ></InputItem>
                                </List>
                            </div>
                        </div>
                        <div className="form-group agreen_xieyi  clearfix pr">
                            <div id="checkbox_Id" className={this.state.agree ? "active" : ""}>
                                <input type="checkbox"
                                    onChange={this.agreeChange}
                                    className="checkbox" id="agree" name="agree" required="" checked="" />
                            </div>
                            <p className="xieyi">已阅读并同意
                                <NavLink to="/" href="/page/public/one/user.html">《用户使用协议》</NavLink>和
                                <NavLink to="/" href="/page/public/one/real_name.html">《实名认证协议》</NavLink>
                            </p>
                        </div>

                        <div name="phone" className="error_msg phone">
                        </div>
                        <div className="comment_next verifibtn">
                            <footer>
                                <Button href="javascript:;" onClick={this.repassWordSubmit.bind(this)} type="primary" className={this.state.submitStatus ? "next" : "next disablebtn"}>{this.state.submitStatus ? "完成" : "取消"} </Button>
                            </footer>
                        </div>

                    </form>
                </div>
                <PublicAlert alertStatus={this.state.alertStatus} alertTip={this.state.alertTip} />
            </main>
        )
    }
}

export default withRouter(connect(state => ({
    PersonList: state.PersonList,
}), {
        getWXpsoninfo,
    })(Changephone));