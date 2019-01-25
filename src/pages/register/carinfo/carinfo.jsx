import React, { Component } from 'react';
import { is, fromJS } from 'immutable';
import { connect } from 'react-redux';
import PublicAlert from '@/components/alert/alert';
import Certificates from '@/components/Certificates/Certificates';
import API from '@/api/api';
import "./carinfo.less";
import { Toast, List, InputItem, Button, Flex, Modal } from 'antd-mobile';
import { NavLink, Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import lrz from 'lrz'/* 引用压缩插件 */
import PromptImg from "@/images/register/registerprocess/Prompt.jpg";

class Carinfo extends Component {
    state = {
        PositiveState: false,/* 正面状态 */
        oppositeState: false,/* 反面状态 */
        bindStatus: false,
        isAuthFinish: false,
        alertStatus: false, //弹框状态
        alertTip: "信息提示",
        quState: false,/* 上传中loading弹窗状态 */
        CertificatesStatus: false,/* 证件是否完成上传状态*/
        fileState: true,/* 文件状态 */
        PromptImg: false,/* 证件样版弹窗状态 */
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

    showModal = key => (e) => {
        e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({
            [key]: true,
        });
    }
    onClose = key => () => {
        this.setState({
            [key]: false,
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState));
    }
    componentDidMount() {
        this.getIDimgState();
    }
    render() {
        return (
            <main className="common-con-top">
                <div className="carinfo_4Gbox h100" id="carinfo_4G">
                    <div className="weui-flex carinfo_tip">
                        <div className="weui-flex__item">所填信息仅用于我们或合作方为您提供车主服务</div>
                    </div>
                    <div className="weui-flex carinfo_title">
                        <div className="weui-flex__item">
                            <h2>请上传行驶证</h2>
                            <p>继续添加车辆信息 为您定制专有服务</p>
                        </div>
                    </div>
                    <div className="carinfo_addfile">
                        <div className="weui-flex carinfo_addfirst">
                            {
                                !this.state.PositiveState &&
                                <div >
                                    <i></i>
                                    <p>上传行驶证正页照
                                    <a className="alert_zsz" onClick={this.showModal('PromptImg')}></a>
                                    </p>
                                </div>
                            }
                            {
                                this.state.PositiveState &&
                                <div>
                                    <i className="finish_caricon"></i>
                                    <p>上传成功</p>
                                </div>
                            }
                            {
                                !this.state.PositiveState && this.state.fileState &&
                                <input type="file" id="car_fistFilebtn" accept="image/*" onChange={this.fileChange.bind(this)} data-type="identity_card_front" />
                            }
                        </div>
                        <div className="weui-flex carinfo_addscoend">
                            {
                                !this.state.oppositeState &&
                                <div >
                                    <i></i>
                                    <p>上传行驶证副页照
                                        <a className="alert_zsz" onClick={this.showModal('PromptImg')}></a>
                                    </p>
                                </div>
                            }
                            {
                                this.state.oppositeState &&
                                <div>
                                    <i className="finish_caricon"></i>
                                    <p>上传成功</p>
                                </div>
                            }
                            {
                                !this.state.oppositeState && this.state.fileState &&
                                <input type="file" id="car_scoendFilebtn" accept="image/*" onChange={this.fileChange.bind(this)} data-type="identity_card_back" />
                            }
                        </div>
                    </div >
                    <div className="carinfo_btnbox">
                        <Link to="/carinfodetail" className="Nozjian" >不在身边，手动输入信息</Link>
                    </div>
                    <div className="carinfo_btnbox">
                        <Flex className="weui-flex person_subimt">
                            <Flex.Item className="weui-flex__item">
                                <Button type="primary" onClick={this.skipFun.bind(this)} className="skip">跳过认证</Button>
                            </Flex.Item>
                            <Flex.Item className="weui-flex__item">
                                <Button type="primary" onClick={this.submitIMG.bind(this)} className={this.state.PositiveState && this.state.oppositeState ? "finish_subimt carinfo_btn finish_carinfo" : "carinfo_btn "} >进行认证</Button>
                            </Flex.Item>
                        </Flex>
                    </div>
                </div >
                {this.state.quState && <div id="mask1"></div>}
                {this.state.quState && <Certificates uqText="上传中..."></Certificates>}
                <PublicAlert alertStatus={this.state.alertStatus} alertTip={this.state.alertTip} />

                <Modal
                    visible={this.state.PromptImg}
                    transparent
                    maskClosable={false}
                    onClose={this.onClose('PromptImg')}
                    title={<header><h3>证件样例</h3><p>车架号和发动机号在这里</p></header>}
                    message="提示信息"
                    footer={[{ text: '我知道了', onPress: () => { console.log('ok'); this.onClose('PromptImg')(); } }]}
                    wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                    afterClose={() => { }}
                >
                    <div className="upP_Promptmain">
                        <img src={PromptImg} />
                    </div>
                </Modal>


            </main >
        )
    }
}

export default withRouter(Carinfo);