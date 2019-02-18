import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { is, fromJS } from 'immutable';
import PropTypes from 'prop-types';
import API from '@/api/api';
import { isUserLogin } from '@/store/main/action';
import PublicAlert from '@/components/alert/alert';
import './flow_detail.less';
import { Button } from 'antd-mobile';
import LiquidFillGauge from 'react-liquid-gauge';
import _ from "lodash";
import moment from "moment";/* 日期格式化工具类 */

class FlowDetail extends Component {
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
        supplier: "01",/* 运营商 */
        iccid: "1035031320.231320",/* iccid号 */
        cardStatus: "2",/* 车辆激活状态 */
        flowValue: 0,/* 流量剩余百分比 */
        hasFlow: false,/* 是否有可用修炼 */
        Cycle: "-",/* 周期内可用 */
        Surplus: "-",/* 流量剩余量 */
        UseED: "-",/* 周期内已使用 */
        refreshTime: "",/* 刷新时间 */
        waveAmplitude: 3,/* 剩余流量的水波 波高度度 */
        resultList: false,/* 是否有正在使用套餐列表 */
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
    getCarFlowDeta = async () => {
        try {
            let result = await API.getCarFlowDeta({

            });
            if (result.code === "CD000001") {
                this.setState({
                    supplier: result.body.supplier,
                    iccid: result.body.iccid,
                });
                this.refreshFun(result.body.iccid, result.body.imeiid);
            } else {
                this.defaultMap();
            }
        } catch (err) {
            this.setState({
                alertStatus: true,
                alertTip: "服务器异常"
            })
            this.closeAlertFun();
        }
    }

    refreshFun = async (iccidValue, imeiidValue) => {
        try {
            let result = await API.refreshFun({
                iccid: iccidValue,
                imeiid: imeiidValue,
                channel: "wechat",
            });
            if (result.code === "CD000001") {
                /* 获取过期状态 */
                // var overdue = _.filter(data.body.resultList, { 'status': "1" });
                // /* 获取最大天数 */
                // var end = _.maxBy(data.body.resultList, function (o) { return o.day; });
                const isNumber = _.floor(_.subtract(100, result.body.resultMap.useFlowPercent), 2);
                // const isNumber =89;
                let waveheight = 3;
                if (isNumber < 50) {
                    waveheight = (50 / isNumber) * 3
                } else if (80 > isNumber > 50) {
                    waveheight = (isNumber / 50) * 5
                } else if (isNumber => 80) {
                    waveheight = (isNumber / 50) * 7
                }

                console.log(waveheight);

                if (result.body.resultList.length > 0) {
                    this.setState({
                        cardStatus: result.body.resultMap.cardStatus,/* 车辆激活状态 */
                        flowValue: isNumber,/* 流量剩余百分比 */
                        hasFlow: true,/* 是否有可用修炼 */
                        Cycle: result.body.resultMap.allFlow,/* 周期内可用 */
                        Surplus: result.body.resultMap.overFlow,/* 流量剩余量 */
                        UseED: result.body.resultMap.useFlow,/* 周期内已用： */
                        waveAmplitude: waveheight,
                    });
                } else {
                    this.setState({
                        cardStatus: result.body.resultMap.cardStatus,/* 车辆激活状态 */
                        flowValue: isNumber,/* 流量剩余百分比 */
                        hasFlow: true,/* 是否有可用修炼 */
                        Cycle: "0",/* 周期内可用 */
                        Surplus: "0",/* 流量剩余量 */
                        UseED: "0",/* 周期内已用： */
                        waveAmplitude: waveheight,
                    });
                }
                if (result.body.resultList.length > 0) {
                    for (var i = 0; i < result.body.resultList.length; i++) {
                        if (result.body.resultList[i].type == "0") { /* 默认套餐 */
                            if (result.body.resultMap.supplier === "01" || result.body.resultMap.supplier === "04") { /*  电信套餐 */
                                this.setState({
                                    resultList: false,
                                    flowValue: 0,/* 流量剩余百分比 */
                                    hasFlow: true,/* 是否有可用修炼 */
                                    Cycle: "0",/* 周期内可用 */
                                    Surplus: "0",/* 流量剩余量 */
                                    UseED: "0",/* 周期内已用： */
                                });
                                return false;
                            } else {
                                if (result.body.resultList[i].status == "1" || result.body.resultList[i].status == "2") { /* 待使用 */
                                    result.body.resultList[i].isblock = "db";
                                    result.body.resultList[i].badge = "未生效";
                                    result.body.resultList[i].time = "等待当前套餐结束后生效";
                                } else if (result.body.resultList[i].status == "0") { /* 在使用 */
                                    result.body.resultList[i].isblock = "dn";
                                    result.body.resultList[i].badge = "";
                                } else if (result.body.resultList[i].status == "-1") { /* 已使用 */
                                    result.body.resultList[i].isblock = "db";
                                    result.body.resultList[i].badge = "已过期,请充值";
                                } else {
                                    result.body.resultList[i].isblock = "dn";
                                    result.body.resultList[i].badge = "";
                                }
                            }
                        } else if (result.body.resultList[i].type == "1") { /* 主套餐 */
                            if (result.body.resultList[i].status == "1" || result.body.resultList[i].status == "2") { /* 待使用 */
                                result.body.resultList[i].isblock = "db";
                                result.body.resultList[i].badge = "未生效";
                                result.body.resultList[i].time = "等待当前套餐结束后生效";
                            } else if (result.body.resultList[i].status == "0") { /* 在使用 */
                                result.body.resultList[i].isblock = "dn";
                                result.body.resultList[i].badge = "";
                            } else if (result.body.resultList[i].status == "-1") { /* 已使用 */
                                result.body.resultList[i].isblock = "db";
                                result.body.resultList[i].badge = "已过期,请充值";
                            } else {
                                result.body.resultList[i].isblock = "dn";
                                result.body.resultList[i].badge = "";
                            }
                        } else if (result.body.resultList[i].type == "2") { /* 叠加包 */
                            if (result.body.resultList[i].status == "1" || result.body.resultList[i].status == "2") { /* 待使用 */
                                result.body.resultList[i].isblock = "db";
                                result.body.resultList[i].badge = "未生效";
                                result.body.resultList[i].time = "等待当前套餐结束后生效";
                            } else if (result.body.resultList[i].status == "0") { /* 在使用 */
                                if (result.body.resultMap.supplier == "02" && result.body.resultList[i].name.indexOf("1G") != -1) { /*  鎏信联通套餐 */
                                    result.body.resultList[i].isblock = "db";
                                    result.body.resultList[i].badge = "2个月有效";
                                } else {
                                    result.body.resultList[i].isblock = "db";
                                    result.body.resultList[i].badge = "当月有效";
                                }
                            } else if (result.body.resultList[i].status == "-1") { /* 已使用 */
                                result.body.resultList[i].isblock = "db";
                                result.body.resultList[i].badge = "已过期,请充值";
                            } else {
                                result.body.resultList[i].isblock = "db";
                                result.body.resultList[i].badge = "当月有效";
                            }
                        } else { /* 无限流量 */
                            if (result.body.resultList[i].status == "1" || result.body.resultList[i].status == "2") { /* 待使用 */
                                result.body.resultList[i].isblock = "db";
                                result.body.resultList[i].badge = "未生效";
                                result.body.resultList[i].time = "等待当前套餐结束后生效";
                            } else if (result.body.resultList[i].status == "0") { /* 在使用 */
                                result.body.resultList[i].isblock = "dn";
                                result.body.resultList[i].badge = "";
                            } else if (result.body.resultList[i].status == "-1") { /* 已使用 */
                                result.body.resultList[i].isblock = "db";
                                result.body.resultList[i].badge = "已过期,请充值";
                            }

                        }
                    }
                    this.setState({
                        resultList: result.body.resultList,
                    });
                } else {
                    this.setState({
                        resultList: false,
                    });
                }
            } else {
                this.setState({
                    alertStatus: true,
                    alertTip: result.msg
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
        this.getCarFlowDeta();
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

    }
    componentDidMount() {

    }
    render() {

        const gradientStops = [
            {
                key: '0%',
                stopColor: "#a4d32a",
                stopOpacity: 1,
                offset: '0%'
            },
            {
                key: '50%',
                stopColor: "#b7e63b",
                stopOpacity: 0.75,
                offset: '50%'
            },
            {
                key: '100%',
                stopColor: "#d0f153",
                stopOpacity: 0.5,
                offset: '100%'
            }
        ]

        return (
            <main className="home-container" id="flow_detail">
                <div className="box Telecom" className={this.state.supplier == '01' || this.state.supplier == '04' ? 'chinaMove box' : (this.state.supplier == '03' || this.state.supplier == '06' ? 'Telecom box' : 'Unicom box')}>
                    <div className="flowBox pr">
                        <header>
                            <i className="flow_icon"></i>
                            <div className="DeviceName" >ICCID：{this.state.iccid}<span>({this.state.cardStatus == "1" ? "已激活" : "未激活"})</span></div>
                            <input type="hidden" id="iccid" />
                            <div id="flow_progress">
                                <div id="progress_contain">
                                    {
                                        this.state.hasFlow ?
                                            <div>
                                                <div className="title1"> 周期内可用<br /><strong>{this.state.Cycle}M</strong></div>
                                                <div className="title2"> 剩余<br /><strong>{this.state.Surplus}M</strong></div>
                                            </div>
                                            :
                                            <div className="title3">-</div>
                                    }
                                </div>
                                <LiquidFillGauge
                                    width={150}
                                    height={150}
                                    value={this.state.flowValue}
                                    percent="%"
                                    textSize={1}
                                    textOffsetX={0}
                                    textOffsetY={0}
                                    textRenderer={(props) => {
                                        const value = Math.round(props.value);
                                    }}
                                    riseAnimation
                                    waveAnimation
                                    waveFrequency={2}
                                    waveAmplitude={this.state.waveAmplitude}
                                    gradient
                                    gradientStops={gradientStops}
                                    circleStyle={{
                                        fill: "#fff"
                                    }}
                                    waveStyle={{
                                        fill: "#1084d0"
                                    }}
                                    textStyle={{
                                        fill: "#fff",
                                        fontFamily: 'Arial'
                                    }}
                                    waveTextStyle={{
                                        fill: "#fff",
                                        fontFamily: 'Arial'
                                    }}

                                />
                            </div>
                            <div className="flow_used">
                                <i className="flow_tip">
                                    <div className="equipment_detail">
                                        <div className="equipment_detail_main">
                                            <div className="arrow"></div>
                                            <div id="equipment_text">
                                                <p></p>
                                                <p></p>
                                            </div>
                                        </div>
                                    </div>
                                </i>
                                <div className="flow_tip_text">周期内已用：{this.state.UseED}M</div>
                            </div>
                        </header>
                        <div className="refreshTime">{"更新时间：" + moment().format("MM-DD hh:mm:ss")}</div>
                    </div>
                    <div className="flowMain">
                        <div className="weui-panel weui-panel_access">
                            <div className="weui-panel__hd">当前套餐</div>
                            <div className="weui-panel__bd">

                                {
                                    this.state.resultList != false ?
                                        this.state.resultList.map((value, index) => (
                                            <div className="weui-media-box weui-media-box_appmsg" key={index}>
                                                <div className="weui-media-box__bd">
                                                    <h4 className="weui-media-box__title">{value.name}<span className={"weui-badge " + value.isblock}>{value.badge}</span> </h4>
                                                    <p className="weui-media-box__desc">有效期：{value.time}</p>
                                                </div>
                                            </div>))
                                        :
                                        <div className="weui-media-box weui-media-box_appmsg noList ">
                                            <div className="weui-media-box__bd">
                                                <h4 className="weui-media-box__title">无可用套餐<span className="weui-badge dn">30天有效</span> </h4>
                                                <p className="weui-media-box__desc Notice">如未办理套餐业务<br />内置SIM卡将在60天后自动销号</p>
                                            </div>
                                        </div>
                                }

                            </div>
                        </div>
                    </div>
                    <footer>
                        <NavLink to="/flowpackage" className="weui-btn weui-btn_warn rechargeBtn">特惠流量充值</NavLink>
                    </footer>
                </div>
                <PublicAlert alertStatus={this.state.alertStatus} alertTip={this.state.alertTip} />
            </main>
        );
    }
}

export default connect(state => ({
    formData: state.formData,
}), {
        isUserLogin,
    })(FlowDetail);
