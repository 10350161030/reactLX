import React, { Component } from 'react';
import { is, fromJS } from 'immutable';
import { connect } from 'react-redux';
import PublicAlert from '@/components/alert/alert';
import Certificates from '@/components/Certificates/Certificates';
import API from '@/api/api';
import "./personid.less";
import { Toast, List, InputItem, Button, Flex, Modal } from 'antd-mobile';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
import lrz from 'lrz'/* 引用压缩插件 */

const requireIconContext = require.context("@/images/register/registerprocess/", true, (/^\.\/.*?(gif|png|jpg|svg)$/));
const indexIconImgs = requireIconContext.keys().map(requireIconContext);

class Personid extends Component {
    state = {
        PositiveState: false,/* 正面状态 */
        oppositeState: false,/* 反面状态 */
        bindStatus: false,
        isAuthFinish: false,
        alertStatus: false, //弹框状态
        alertTip: "信息提示",
        quState: false,/* 上传中loading弹窗状态 */
        CertificatesStatus: false,/* 证件是否完成上传状态*/
        fileState: true,
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
    /* 获取身份照片上传状态 */
    getIDimgState = async type => {
        try {
            let result = await API.getIDimgState({
                id: 'wechat'
            });
            if (result.code === "CD000001") {
                this.setState({
                    PositiveState: result.body.existBphoto,/* 正面状态 */
                    oppositeState: result.body.existBphoto,/* 反面状态 */
                    bindStatus: result.body.bindStatus,
                    isAuthFinish: result.body.isAuthFinish,
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

    submitIMG = () => {
        if (this.state.PositiveState && this.state.oppositeState) {
            this.props.history.push("/personiddetail");
        } else {
            const alertInstance = Modal.alert('提示', '上传完证件才能提交哦', [
                { text: '我知道了', onPress: () => console.log('cancel') },
                // { text: 'OK', onPress: () => console.log('ok') },
            ]);
        }
    }
    skipFun = () => {
        const alertInstance = Modal.alert('工信部要求，网络用户', '需实名认证，否则影响正常使用！', [
            {
                text: '不要认证', onPress: () => {
                    this.props.history.push("/");
                }, style: "default"
            },
            { text: '继续认证', onPress: () => { } },
        ]);
    }

    fileChange = async event => {
        this.setState({/* 上传中loading */
            quState: true,
        });
        const rawSize = event.target.files[0].size;
        const ImgType = event.target;
        const reader = new FileReader();
        let finallyResult;
        reader.readAsDataURL(event.target.files[0]);
       
        reader.onload = function (e) {
            if (rawSize > 3145728) {/* 大于3m进行压缩处理 */
                lrz(e.target.result, { quality: 0.8 }).then((results) => {
                    //     imgbase: results.base64, //取base64的值传值
                    //     imgsize: results.fileLen, //压缩后的图片大下
                    //     suffix: _this.state.selectImgSuffix, //文件类型
                    //     filename: _this.state.selectImgName, //文件名
                    console.log(results.base64);
                    if (results.fileLen > 3145728) {
                        const alertInstance = Modal.alert('提示', '证件图片大小不能超过4M', [
                            {
                                text: '我知道了', onPress: () => { }
                            },
                        ]);
                    } else {
                        finallyResult = results.base64;
                    }

                });
            } else {
                finallyResult = e.target.result;
            }
        }.bind(this);

        try {
            let result = await API.uqdataPaperImg({
                identifyInfo: finallyResult, //图片
                business: ImgType.getAttribute("data-type"),
                identifyType: "id_card",
            });
            if (result.code === "CD000001") {
                if (ImgType.getAttribute("data-type") == "identity_card_back") {
                    this.setState({
                        oppositeState: true,/* 反面状态 */
                    });
                } else if (ImgType.getAttribute("data-type") == "identity_card_front") {
                    this.setState({
                        PositiveState: true,/* 正面状态 */
                    });
                }
            } else if (result.code == "CD008021" || result.code == "CD001004") {
                const alertInstance = Modal.alert('无法识别', '可能证件未摆正、模糊、有闪光', [
                    {
                        text: '重新上传', onPress: () => { }
                    },
                ]);
            } else if (result.code === "CD004025") {
                const alertInstance = Modal.alert('操作异常', '已经确认信息，无需再次重复操作', [
                    {
                        text: '我知道了', onPress: () => { }
                    },
                ]);
            } else if (result.code == "CD001011" || result.code == "CD001013" || result.code == "CD004017") {
                const alertInstance = Modal.alert('网络异常', '请稍后重试', [
                    {
                        text: '重新上传', onPress: () => { }
                    },
                ]);
            } else if (result.code == "CD001005") {
                const alertInstance = Modal.alert('网络异常', '页面已经过期，请刷新后重试', [
                    {
                        text: '重新上传', onPress: () => { }
                    },
                ]);
            } else if (result.code == "CD001006") {
                const alertInstance = Modal.alert('操作异常', '请登录后重试', [
                    {
                        text: '重新上传', onPress: () => { }
                    },
                ]);
            } else {
                const alertInstance = Modal.alert('网络异常', '请稍后重试', [
                    {
                        text: '重新上传', onPress: () => { }
                    },
                ]);
            }



        } catch (err) {
            this.setState({
                alertStatus: true,
                alertTip: "服务器异常"
            })
            this.closeAlertFun();
        }
        /* 文件上传按钮值清空，显示隐藏假动作 */
        this.setState({
            fileState: false,
            quState: false,/* 上传中loading */
        });
        const that = this;
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
            that.setState({
                fileState: true,
            });
        }, 10);
      
    }




    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState));
    }
    componentDidMount() {
        this.getIDimgState();
    }
    render() {
        return (
            <main className="common-con-top" id="person_id">
                <div className="person_id" >
                    <div className="person_topbox">
                        <div className="weui-flex person_idtitle">
                            <div className="weui-flex__item">请上传您的有效二代身份证</div>
                        </div>
                        <div className="weui-flex PS_fistFile">
                            {
                                this.state.PositiveState &&
                                <div className="weui-flex__item" >
                                    <span ></span>
                                    <i className="i_finish"></i>
                                    <p>身份证人像面上传成功</p>
                                </div>
                            }
                            {
                                !this.state.PositiveState &&
                                <div className="weui-flex__item" >
                                    <span></span>
                                    <i></i>
                                    <p>上传身份证人像面</p>
                                </div>
                            }
                            {
                                !this.state.PositiveState && this.state.fileState &&
                                <input type="file" id="PS_fistFilebtn" accept="image/*" onChange={this.fileChange.bind(this)} data-type="identity_card_front" />
                            }

                        </div>
                        <div className="weui-flex PS_scoendFile">
                            {
                                this.state.oppositeState &&
                                <div className="weui-flex__item">
                                    <span ></span>
                                    <i className="i_finish"></i>
                                    <p>身份证国徽面上传成功</p>
                                </div>
                            }
                            {
                                !this.state.oppositeState &&
                                <div className="weui-flex__item">
                                    <span></span>
                                    <i></i>
                                    <p>上传身份证国徽面</p>
                                </div>
                            }
                            {
                                !this.state.oppositeState && this.state.fileState && <input type="file" id="PS_scoendFilebtn" accept="image/*" onChange={this.fileChange.bind(this)} data-type="identity_card_back" />
                            }

                        </div>
                    </div>

                    <div className="person_bottombox">
                        <fieldset>
                            <legend>拍摄示例</legend>
                            <Flex className="weui-flex person_Bexbox">
                                <Flex.Item>
                                    <div className="person_imgbox">
                                        <img src={indexIconImgs[13]} alt="" />
                                        <i className="person_success"></i>
                                    </div>
                                    <p>标准</p>
                                </Flex.Item>
                                <Flex.Item>
                                    <div className="person_imgbox">
                                        <img src={indexIconImgs[14]} alt="" />
                                        <i></i>
                                    </div>
                                    <p>表框缺失</p>
                                </Flex.Item>
                                <Flex.Item>
                                    <div className="person_imgbox">
                                        <img src={indexIconImgs[15]} alt="" />
                                        <i></i>
                                    </div>
                                    <p>照片模糊</p>
                                </Flex.Item>
                                <Flex.Item>
                                    <div className="person_imgbox">
                                        <img src={indexIconImgs[16]} alt="" />
                                        <i></i>
                                    </div>
                                    <p>闪光强烈</p>
                                </Flex.Item>
                            </Flex>
                        </fieldset>

                        <div className="person_text">
                            <p>根据工信部要求<br /> 物联网用户需实名制才能正常使用网络功能
                      </p>
                        </div>
                        <Flex className="weui-flex person_subimt">
                            <Flex.Item className="weui-flex__item">
                                <Button type="primary" onClick={this.skipFun.bind(this)} className="weui-btn weui-btn_plain-default ">跳过认证</Button>
                            </Flex.Item>
                            <Flex.Item className="weui-flex__item">
                                <Button type="primary" onClick={this.submitIMG.bind(this)} className={this.state.PositiveState && this.state.oppositeState ? "finish_subimt weui-btn " : "weui-btn"} >进行认证</Button>
                            </Flex.Item>
                        </Flex>
                    </div>
                </div>
                {this.state.quState && <div id="mask1"></div>}
                {this.state.quState && <Certificates uqText="上传中..."></Certificates>}
                <PublicAlert alertStatus={this.state.alertStatus} alertTip={this.state.alertTip} />
            </main>
        )
    }
}

export default withRouter(Personid);