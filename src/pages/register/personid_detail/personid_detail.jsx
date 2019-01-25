import React, { Component } from 'react';
import { is, fromJS } from 'immutable';
import { connect } from 'react-redux';
import PublicAlert from '@/components/alert/alert';
import Certificates from '@/components/Certificates/Certificates';
import API from '@/api/api';
import "./personid_detail.less";
import { Toast, List, InputItem, Button, Flex, Modal } from 'antd-mobile';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
import lrz from 'lrz'/* 引用压缩插件 */

const requireIconContext = require.context("@/images/register/registerprocess/", true, (/^\.\/.*?(gif|png|jpg|svg)$/));
const indexIconImgs = requireIconContext.keys().map(requireIconContext);

class PersonidDetail extends Component {
    state = {
        alertStatus: false, //弹框状态
        alertTip: "信息提示",
        userName:"",
        userId:"",
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
    /* 获取身份信息 */
    getIDInfo = async type => {
        try {
            let result = await API.getIDInfo({
                id: 'wechat'
            });
            if (result.code === "CD000001") {
                this.setState({
                    userName: result.body.name,/* 正面状态 */
                    userId: result.body.number,/* 反面状态 */
                });
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
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState));
    }
    componentDidMount() {
        this.getIDInfo();
    }
    render() {
        return (
            <main className="common-con-top">
                <div id="psID_detail" className="psID_detailBox">
                    <div className="psID_detail_tip">
                        <p>
                            <i className="CD_tipicon"></i>识别成功，请核对以下信息</p>
                    </div>
                    <div className="weui-cells psId_main">
                        <div className="weui-cell">
                            <div className="weui-cell__hd col-xs-3">姓名</div>
                            <div className="weui-cell__bd">
                                <p className="photo_lable_inp" >{this.state.userName}</p>
                            </div>
                        </div>
                        <div className="weui-cell">
                            <div className="weui-cell__hd col-xs-3">身份证</div>
                            <div className="weui-cell__bd">
                                <p className="photo_lable_inp" >{this.state.userId}</p>
                            </div>
                        </div>
                    </div>
                    <div className="link_a">
                        <a href="javascript:;" onClick={()=>{this.props.history.goBack()}}>识别有误？重新上传</a>
                    </div>
                    <div className="weui-flex psid_subBox">
                        <div className="weui-flex__item">
                            <a href="javascript:;" className="weui-btn weui-btn_plain-default active">下一步</a>
                        </div>
                    </div>
                </div>
                {this.state.quState && <div id="mask1"></div>}
                {this.state.quState && <Certificates uqText="上传中..."></Certificates>}
                <PublicAlert alertStatus={this.state.alertStatus} alertTip={this.state.alertTip} />
            </main>
        )
    }
}
export default withRouter(PersonidDetail);