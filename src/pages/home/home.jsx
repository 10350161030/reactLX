import React, { Component } from 'react';
import { Link, NavLink  } from 'react-router-dom';
import { connect } from 'react-redux';
import { is, fromJS } from 'immutable';
import PropTypes from 'prop-types';
import API from '@/api/api';
// import envconfig from '@/envconfig/envconfig';
import { isUserLogin } from '@/store/main/action';
// import { clearSelected } from '@/store/production/action';
// import PublicHeader from '@/components/header/header';
import PublicFooter from '@/components/footer/footer';

import PublicAlert from '@/components/alert/alert';
// import TouchableOpacity from '@/components/TouchableOpacity/TouchableOpacity';
import mixin, { padStr } from '@/utils/mixin';
import './home.less';
import wx from 'weixin-js-sdk';
// import { Button } from 'react-weui';
import Swiper from 'swiper/dist/js/swiper.js';
import 'swiper/dist/css/swiper.min.css';
import testJson from "@/api/database.json";/* 文案 */
import newUerImg from "@/images/indexComment/success_5s.svg"

import { Button } from 'antd-mobile';

/* icon图片列表 */
const requireIconContext = require.context("@/images/index_icon/", true, (/^\.\/.*?(gif|png|jpg)$/));
const indexIconImgs = requireIconContext.keys().map(requireIconContext);
let indexIcon = [];
indexIconImgs.forEach(function (value, index) {
    let varObj = {};
    varObj["pic"] = value;
    varObj["url"] = testJson.IndexIcon[index].url;/* banner图链接 */
    varObj["title"] = testJson.IndexIcon[index].title;/* banner标题 */
    varObj["text"] = testJson.IndexIcon[index].text;/* banner文字说明 */
    indexIcon.push(varObj);
});

/* 应用banner图 */
const requireContextNmae = require.context("@/images/indexs/", true, (/^\.\/.*?(gif|png|jpg)$/));
const projectImgs = requireContextNmae.keys().map(requireContextNmae);
let IMGList = [];
projectImgs.forEach(function (value, index) {
    let varObj = {};
    varObj["pic"] = value;
    varObj["url"] = testJson.more[index];/* banner图链接 */
    IMGList.push(varObj);
});

// mixin({ padStr })
class Home extends Component {
    static propTypes = {
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
    }
    /* 关闭新用户福利 */
    closeNewUserFun = () => {
        this.setState({
            newUserAlert: false,/* 新用户福利弹窗 */
            bgMask: false,
        })
    }
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
    /* 绑定设备方法 */
    bindEQFun = () => {
        if (!this.props.formData.LoginData.isBind && this.props.formData.LoginData.isLogin) {
            console.log(44);
            this.setState({
                bindEQStatus: true,
                bgMask: true,
            })
        }
    }
    /* 点击遮罩关闭 */
    closeMask = () => {
        this.setState({
            bindEQStatus: false,
            bgMask: false,
            newUserAlert: false,/* 新用户福利弹窗 */
        })
    }
    /* 点击领取流量 */
    getGitFlow = async type => {
        try {
            let result = await API.newGitFlowFun({ type });
            if (result.code === "CD000001") {
                this.setState({
                    alertStatus: true,
                    alertTip: "领取成功",
                    bgMask: false,
                    newUserAlert: false,/* 新用户福利弹窗 */
                })
                this.closeAlertFun();
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



    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }
    componentWillMount() {
        this.props.isUserLogin();
    }
    componentWillReceiveProps(nextProps) {
        /* 异步判断是否登录异常 */
        if (nextProps.formData.LoginError.code) {
            this.setState({
                alertStatus: true,
                alertTip: nextProps.formData.LoginError.code
            })
            this.closeAlertFun();
        }
        /* 判断新用户福利 */
        if (nextProps.formData.LoginData.isLogin && nextProps.formData.LoginData.isBind && nextProps.formData.LoginData.giftSwitch && !nextProps.formData.LoginData.isGiveFlow && nextProps.formData.LoginData.supplier) {
            this.setState({
                newUserAlert: true,
                bgMask: true,
            })
        }
    }
    componentDidMount() {
        let mySwiper = new Swiper('#index_banner1', {
            loop: true,     //循环
            autoplay: {      //自动播放，注意：直接给autoplay:true的话，在点击之后不能再自动播放了
                delay: 4500,
                disableOnInteraction: false,    //户操作swiper之后，是否禁止autoplay。默认为true：停止。
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,    // 允许点击跳转
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    }
    render() {
        return (
            <main className="home-container" id="home">
                {
                    this.props.formData.LoginData.isBind && this.props.formData.LoginData.isLogin && !this.props.formData.LoginData.isAuthFinish && <NavLink to="/personid" className="index_4Gtitle">{testJson.IndexAuthentication[0]}<br />
                        <strong >{this.props.formData.LoginData.isCustomized ? testJson.IndexAuthentication[1] : (this.props.formData.LoginData.isGiveFlow ? testJson.IndexAuthentication[2] : testJson.IndexAuthentication[3])}</strong>
                    </NavLink>
                }
                <div className="swiper-container" id="index_banner1" ><div className="swiper-wrapper">{IMGList.map((item, index) => (<div key={index} className="swiper-slide" ><a href={item.url}><img src={item.pic} alt="banner图" /></a></div>))}</div><div className='swiper-pagination'></div></div>
                <div className="base">
                    <div className="base_connent">
                        {
                            indexIcon.map((value, index) => (
                                <NavLink className="base_connent_flax" to={(!this.props.formData.LoginData.isBind && this.props.formData.LoginData.isLogin) ? "javascript:;" : value.url} onClick={this.bindEQFun.bind(this)} key={index} >
                                    <div className="base_connent_icon">
                                        <img src={value.pic} />
                                    </div>
                                    <div className="base_connent_text">
                                        <h2>{value.title}</h2>
                                        <p>{value.text}</p>
                                    </div>
                                </NavLink>
                            ))
                        }
                    </div>
                </div>

                {this.state.bgMask && <a href="javascript:;" id="mask1" onClick={this.closeMask.bind(this)} ></a>}
                {/* 绑定设备弹窗 */}
                {
                    this.state.bindEQStatus && <div id="alert_stylebox">
                        <div className="alert_stylemain">
                            <h3>{testJson.bindEQStatus[0]}</h3>
                            <p>{testJson.bindEQStatus[1]}</p>
                        </div>
                        <NavLink to="/person" className="alert_stylebtn">{testJson.bindEQStatus[2]}</NavLink>
                    </div>
                }
                {/* 新用户福利弹窗 */}
                {
                    this.state.newUserAlert && <div id="alert_stylebox2">
                        <div className="imgbox_5s">
                            <img src={newUerImg} alt="" />
                        </div>
                        <div className="alert_stylemain">
                            <h3>设备绑定成功</h3>
                            <p>快去领取新用户福利吧!</p>
                        </div>
                        <a href="javascript:;" onClick={this.closeNewUserFun.bind(this)} className="alert_stylebtn ">暂不领取</a>
                        <a href="javascript:;" onClick={this.getGitFlow.bind(this)} className="alert_stylebtn ">领取流量</a>
                    </div>
                }
                {!this.props.formData.LoginData.isLogin && <NavLink href="javascript:;" to="/register" id="mask"></NavLink>}
                <PublicFooter></PublicFooter>
                <PublicAlert alertStatus={this.state.alertStatus} alertTip={this.state.alertTip} />
            </main>
        );
    }
}

export default connect(state => ({
    formData: state.formData,
}), {
        isUserLogin,
    })(Home);
