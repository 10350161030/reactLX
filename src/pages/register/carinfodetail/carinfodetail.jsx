import React, { Component } from 'react';
import { is, fromJS } from 'immutable';
import { connect } from 'react-redux';
import PublicAlert from '@/components/alert/alert';
import Certificates from '@/components/Certificates/Certificates';
import API from '@/api/api';
import "./../carinfo/carinfo.less";
import "./carinfodetail.less";
import { Toast, List, InputItem, Button, Flex, Modal, Icon, DatePicker } from 'antd-mobile';
import { getBrandData, brandZJState, saveFormData } from '@/store/brand/action';
import { NavLink, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import lrz from 'lrz'/* 引用压缩插件 */
import PromptImg from "@/images/register/registerprocess/Prompt.jpg";
import icon_zk from "@/images/register/registerprocess/zk.svg";
import provincetext from "@/api/database.json";
import moment from "moment";/* 日期格式化工具类 */

import Brand from "./../brand/brand";
import BrandSeries from "./../brand/brandseries";
import BrandMode from "./../brand/brandmode";

function formatDate(date) {
    const pad = n => n < 10 ? `0${n}` : n;
    const dateStr = `${date.getFullYear()}年${pad(date.getMonth() + 1)}月`;
    // const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    return `${dateStr}`;
}

class Carinfodetail extends Component {
    static propTypes = {
        brandData: PropTypes.object.isRequired,
        getBrandData: PropTypes.func.isRequired,
        brandZJState: PropTypes.func.isRequired,
    }
    state = {

        isWirte: false,/* 是否手写 */
        alertStatus: false, //弹框状态
        alertTip: "信息提示",
        // quState: false,/* 上传中loading弹窗状态 */

        PromptImg: false,/* 证件样版弹窗状态 */
        Province: false,/* 省份选择弹窗 */
        // ProvinceText: "粤",/* 省份文字 */
        // carNumber: "",/* 车牌号 */
        // carframeNo: "",/* 车架号 */
        // engineNo: "",/* 发动机号 */

        brandName: "请选择车品牌",
        carbrandName: "请选择车型号",

        dateOfIssue: "",/* 行驶证发证日期 */
        drivingLicenseEndDate: "",/* 驾驶证截止日期 */
        insuranceStartDate: "",/* 保险日期 */

        brandState: false,/* 车品牌组件显示状态 */
        serideState: false,/* 车型组件显示状态 */
        modeState: false,/* 车系组件显示状态 */
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

    submitcarinfo = async type => {
        if (!(/^[A-Za-z]{1}[A-Za-z0-9]{4}[A-Za-z0-9挂学警港澳]{1}$/).test(this.props.brandData.brandDataList.carNumber)) {
            this.setState({
                alertStatus: true,
                alertTip: "您的车牌号输入有误"
            })
            this.closeAlertFun();
            return false;
        }else if(!(/^[a-zA-Z0-9_]{6,30}$/).test(this.props.brandData.brandDataList.frameNumber)){
            this.setState({
                alertStatus: true,
                alertTip: "您的车架号输入有误"
            })
            this.closeAlertFun(); 
            return false;
        }  else if(!(/^[a-zA-Z0-9_]{6,30}$/).test(this.props.brandData.brandDataList.engineNumber)){
            this.setState({
                alertStatus: true,
                alertTip: "您的发动机号输入有误"
            })
            this.closeAlertFun(); 
            return false;
        }

        try {
            let result = await API.submitcarInfo({
                isConfirm: "true", // 未注册true（注册的时候带这个参数，不注册不带参数）
                identifyType: "vehicle_license",
                business: "user_default_car_info",
                channel: "wechat",
                licenceNo: this.props.brandData.brandDataList.province + this.props.brandData.brandDataList.carNumber, //  车牌号
                carframeNo: this.props.brandData.brandDataList.frameNumber, //    车架号
                engineNo: this.props.brandData.brandDataList.engineNumber, //发动机号

                brandId: this.props.brandData.brandDataList.brandId,
                seriesId: this.props.brandData.brandDataList.seriesId,
                modelId: this.props.brandData.brandDataList.modelId,

                registerid: "333", //  如果是修改信息，需要带上这个参数，车辆ID

                drivingCertificateDate: this.props.brandData.brandDataList.dateOfIssue, //   200011        发证日期
                insuranceStartDate: this.props.brandData.brandDataList.insuranceStartDate, //     199901		保险日期
                drivingLicenseEndDate: this.props.brandData.brandDataList.drivingLicenseEndDate,


            });
            if (result.code === "CD000001") {
                console.log("提交成功");
                // this.props.history.push("/personiddetail");
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
    ChoiceProvince = (item) => {
        this.setState({
            ProvinceText: item,
        });
    }

    handleInput = (type, e) => {
        let value = "";
        switch (type) {
            case 'province':/* 省份选择 */
                value = e.target.innerHTML;
                this.props.saveFormData(value, type);
                break;
            case 'carNumber':/* 车牌 */
                value = e.target.value.toUpperCase();
                if ((/^[A-Za-z0-9挂学警港澳]{0,6}$/).test(e.target.value)) {
                    console.log(value);
                    this.props.saveFormData(value, type);
                }
                break;
            case 'frameNumber':/* 车架号 */
                value = e.target.value.toUpperCase();
                if ((/^[0-9a-zA-Z_]{0,30}$/).test(e.target.value)) {
                    this.props.saveFormData(value, type);
                }
                break;
            case 'engineNumber':/* 发动机 */
                value = e.target.value.toUpperCase();
                if ((/^[0-9a-zA-Z_]{0,20}$/).test(e.target.value)) {
                    this.props.saveFormData(value, type);
                }
                break;
            case 'dateOfIssue':/* 行驶证 */
                value = moment(e).format("YYYYmm")
                this.props.saveFormData(value, type);
                break;
            case 'drivingLicenseEndDate':/* 驾驶证 */
                value = moment(e).format("YYYYmm")
                this.props.saveFormData(value, type);
                break;
            case 'insuranceStartDate':/* 保险 */
                value = moment(e).format("YYYYmm")
                this.props.saveFormData(value, type);
                break;
            default: ;
        }

    }
    showBrand = (e) => {
        this.props.brandZJState(true, false, false);
    }
    componentWillMount(e, v) {
        // if (this.state.isWirte) {
        this.props.getBrandData();
        // }

    }
    componentWillUpdate() {

    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState));
    }
    componentWillReceiveProps(nextProps) {
        // console.log("拿到redux数据");
        if (nextProps.brandData.brandDataError.msg) {
            this.setState({
                alertStatus: true,
                alertTip: nextProps.brandData.brandDataError.msg
            })
            this.closeAlertFun();
        } else {
            let dateXSZ = new Date(nextProps.brandData.brandDataList.dateOfIssue.substring(0, 4), nextProps.brandData.brandDataList.dateOfIssue.substring(4, 6));

            let dateJSZ = new Date(nextProps.brandData.brandDataList.drivingLicenseEndDate.substring(0, 4), nextProps.brandData.brandDataList.drivingLicenseEndDate.substring(4, 6));

            let dateBX = new Date(nextProps.brandData.brandDataList.insuranceStartDate.substring(0, 4), nextProps.brandData.brandDataList.insuranceStartDate.substring(4, 6));
            // console.log("父组件触发");
            this.setState({
                ProvinceText: nextProps.brandData.brandDataList.province,/* 省份文字 */
                carNumber: nextProps.brandData.brandDataList.carNumber,/* 车牌号 */
                carframeNo: nextProps.brandData.brandDataList.frameNumber,/* 车架号 */
                engineNo: nextProps.brandData.brandDataList.engineNumber,/* 发动机号 */
                brandName: nextProps.brandData.brandDataList.brandName,
                carbrandName: nextProps.brandData.brandDataList.seriesName + nextProps.brandData.brandDataList.modeName,
                dateOfIssue: dateXSZ,/* 行驶证发证日期 */
                drivingLicenseEndDate: dateJSZ,/* 驾驶证截止日期 */
                insuranceStartDate: dateBX,/* 保险日期 */
                /* 组件显示状态 */
                brandState: nextProps.brandData.brandState,
                serideState: nextProps.brandData.seriesState,
                modeState: nextProps.brandData.modeState,
            });

        }
    }

    componentDidMount() {

    }
    render() {
        // console.log("渲染次数");

        return (
            <main className="common-con-top carinfocommon" id="carinfodetail">
                {this.state.brandState && <Brand className="brandBox"></Brand>}
                {this.state.serideState && <BrandSeries></BrandSeries>}
                {this.state.modeState && <BrandMode></BrandMode>}
                <div className="carinfo_detailbox" id="carinfo_detail">
                    {
                        this.state.isWirte ?
                            <div className="cardetai_tip" >
                                <p>所填信息仅用于我们或合作方为您提供车主服务</p>
                            </div>
                            :
                            <div className="cardetai_tip" >
                                <p><i className="CD_tipicon"></i>识别成功，请核对以下信息</p>
                            </div>
                    }


                    <div className="ver_form fl w100">

                        <form id="carform">
                            <div className="carDetail_box">
                                <div className="form-group clearfix">
                                    <label className="photo_lable col-xs-3 control-label">车牌号</label>
                                    <div className="DC_btn  col-xs-3 ">
                                        <a className="info_pai pull-left alert_pai open-popup" href="javascript:;" onClick={this.showModal('Province')}>{this.props.brandData.brandDataList.province}</a>
                                        <Icon type="down" className="icon" />
                                    </div>
                                    <div className="col-xs-6 list_group_right carinfo_number ">
                                        <div id="alert_pai" className="weui-popup__container popup-bottom">
                                            <div className="weui-popup__overlay"></div>
                                            <Modal
                                                popup
                                                visible={this.state.Province}
                                                onClose={this.onClose('Province')}
                                                animationType="slide-up"
                                                afterClose={() => { }}
                                            >
                                                <List renderHeader={
                                                    () => <div className="toolbar-inner">
                                                        <a href="javascript:;" className="picker-button close-popup" onClick={this.onClose('Province')
                                                        }>完成</a>
                                                        <h1 className="title">请选择省份</h1>
                                                    </div>}
                                                    className="popup-list" id="alert_pai">
                                                    <ul id="myUl">
                                                        {
                                                            provincetext.Province.map((item, key) =>
                                                                <li key={key} onClick={this.handleInput.bind(this, "province")}>{item}</li>
                                                            )
                                                        }
                                                    </ul>
                                                </List>
                                            </Modal>
                                        </div>
                                        <input type="text" name="carNumber" id="carNumber" placeholder="请输入车牌号" className="pai_edit pull-left form-control" value={this.props.brandData.brandDataList.carNumber} onChange={this.handleInput.bind(this, "carNumber")} />
                                    </div>
                                    <div className="hr-line-dashed  col-xs-12"></div>
                                </div>

                                <div className="form-group clearfix">
                                    <label className="photo_lable col-xs-3 control-label">车架号</label>
                                    <div className="col-xs-9 pr">
                                        <input type="text" className="form-control photo_lable_inp"
                                            name="Framehao" id="Framehao" placeholder="请输入车架号" value={this.props.brandData.brandDataList.frameNumber} onChange={this.handleInput.bind(this, "frameNumber")} />
                                        <i className="icon pull-right Driver pa" id="Driver" onClick={this.showModal('PromptImg')} ></i>
                                    </div>
                                    <div className="hr-line-dashed  col-xs-12"></div>
                                </div>

                                <div className="form-group clearfix">
                                    <label className="password_lable col-xs-3 control-label">发动机号</label>
                                    <div className="col-xs-9 pr">
                                        <input type="text" value={this.props.brandData.brandDataList.engineNumber} className="form-control password_lable_inp" name="Engine" id="Engine" placeholder="请输入发动机号" onChange={this.handleInput.bind(this, "engineNumber")} />
                                        <i className="icon pull-right Driver pa" onClick={this.showModal('PromptImg')}></i>
                                    </div>
                                </div>
                                <Modal
                                    visible={this.state.PromptImg}
                                    transparent
                                    maskClosable={false}
                                    onClose={this.onClose('PromptImg')}
                                    title={<header><h3>证件样例</h3><p>车架号和发动机号在这里</p></header>}
                                    footer={[{ text: '我知道了', onPress: () => { console.log('ok'); this.onClose('PromptImg')(); } }]}
                                    wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                                    afterClose={() => { }}
                                >
                                    <div className="upP_Promptmain">
                                        <img src={PromptImg} />
                                    </div>
                                </Modal>
                            </div>
                            <div className="carDetail_box2">
                                <h3>选填信息</h3>
                                <div className="weui-cells">
                                    <div className="weui-cell clearfix">
                                        <List className="my-list w100">
                                            <List.Item arrow="horizontal" onClick={this.showBrand.bind(this)} className="w100" extra={this.state.brandName} >
                                                车品牌
                                            </List.Item>
                                        </List>
                                    </div>
                                    <div className="weui-cell" >
                                        <List.Item arrow="horizontal" onClick={() => { }} className="w100" extra={this.state.carbrandName} >
                                            车型号
                                        </List.Item>
                                    </div>

                                    <div className="weui-cell">
                                        <List className="date-picker-list w100" >
                                            <DatePicker
                                                mode="month"
                                                title="请选择发证日期"
                                                extra="请选择发证日期"
                                                format={val => `${formatDate(val)}`}
                                                onOk={this.handleInput.bind(this, "dateOfIssue")}
                                                value={this.state.dateOfIssue}
                                            /* onChange={date => {this.setState({ dateOfIssue: date, })}} */
                                            >
                                                <List.Item arrow="horizontal">行驶证</List.Item>
                                            </DatePicker>
                                        </List>
                                    </div>
                                    <div className="weui-cell">
                                        <List className="date-picker-list w100" >
                                            <DatePicker
                                                mode="month"
                                                title="请选择驾驶截止日期"
                                                extra="请选择驾驶截止日期"
                                                format={val => `${formatDate(val)}`}
                                                value={this.state.drivingLicenseEndDate}
                                                onOk={this.handleInput.bind(this, "drivingLicenseEndDate")}
                                                onChange={date => this.setState({ drivingLicenseEndDate: date })}
                                            >
                                                <List.Item arrow="horizontal">驾驶证</List.Item>
                                            </DatePicker>
                                        </List>
                                    </div>
                                    <div className="weui-cell">
                                        <List className="date-picker-list w100" >
                                            <DatePicker
                                                mode="month"
                                                title="请选择保险起始日期"
                                                extra="请选择保险起始日期"
                                                format={val => `${formatDate(val)}`}
                                                onOk={this.handleInput.bind(this, "insuranceStartDate")}
                                                value={this.state.insuranceStartDate}
                                                onChange={date => this.setState({ insuranceStartDate: date })}
                                            >
                                                <List.Item arrow="horizontal">保险</List.Item>
                                            </DatePicker>
                                        </List>
                                    </div>
                                </div>
                                <div className="cardetail_link" >
                                    <NavLink href="javascript:;" to="/carinfo">识别有误？重新上传</NavLink>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="weui-flex car_subBox">
                    {
                        this.state.isWirte ?
                            <div className="weui-flex__item">
                                <a href="javascript:;" onClick={this.submitcarinfo.bind(this)} className="weui-btn weui-btn_plain-default active no_card">完成</a>
                                <div className="cd_tiaoguo" >跳过</div>
                            </div>
                            :
                            <div className="weui-flex__item">
                                <a href="javascript:;" onClick={this.submitcarinfo.bind(this)} className="weui-btn weui-btn_plain-default active">完成</a>
                            </div>
                    }
                </div>
                <PublicAlert alertStatus={this.state.alertStatus} alertTip={this.state.alertTip} />
            </main >
        )
    }
}



export default withRouter(connect(state => ({
    brandData: state.brandData,
}), {
        getBrandData,
        brandZJState,
        saveFormData,
    })(Carinfodetail));