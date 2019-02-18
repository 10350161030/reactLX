import React, { Component } from 'react';
import { is, fromJS } from 'immutable';
import { connect } from 'react-redux';
import PublicAlert from '@/components/alert/alert';
import TipCompent from '@/components/alert/TipCompent';
import Certificates from '@/components/Certificates/Certificates';
import API from '@/api/api';
import "./history.less";
import { Toast, List, InputItem, Button, Flex, Modal, Icon, Calendar } from 'antd-mobile';
import { getBrandData, brandZJState, saveFormData } from '@/store/brand/action';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import moment from "moment";/* 日期格式化工具类 */
import TweenOne from 'rc-tween-one';/* 动画插件 */
import Children from 'rc-tween-one/lib/plugin/ChildrenPlugin';
import _ from "lodash";
import { Map, Marker, Polyline } from 'react-amap';
import axios from 'axios';

TweenOne.plugins.push(Children);
const now = new Date();
const TimeName = moment().format("YYYY年MM月DD日");


class History extends Component {

    constructor() {
        super();
        const _this = this;
        this.mapEvents = {
            created(m) {
                _this.map = m;
            }
        }
        this.lineEvents = {
            created: (markers) => {
                _this.map.setFitView(markers);
            }
        }
    }
    static propTypes = {
        brandData: PropTypes.object.isRequired,
        getBrandData: PropTypes.func.isRequired,
        brandZJState: PropTypes.func.isRequired,
    }
    state = {
        alertStatus: false, //弹框状态
        alertTip: "信息提示",
        canderShow: false,/* 日历弹窗状态 */
        TimeName: TimeName,
        TimeValue: now,
        footerState: false,
        dataState: false,
        extra: {},/* 历史轨迹日期列表 */
        historyData: [],/* 历史轨迹列表 */
        iTotKm: "0",
        iTotMin: "0",
        iAvgSpeed: "0",
        position: "",
        mapzoop: 13,
        mapEvents: {},
        startMark: [-17, -42],/* 偏移量 */
        endMark: [-10, -40],/* 偏移量 */

        startMarkPosition: [],
        endMarkPosition: [],
        markerState: false,
        mapState: false,
        mapPath: [],
        MaplineStyle: {
            strokeColor: "#3366FF", // 线颜色
            strokeOpacity: 1, // 线透明度
            strokeWeight: 5, // 线宽
            strokeStyle: "solid", // 线样式
            strokeDasharray: [10, 5],
        },
        animation: null,/* 动画效果 */
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
    originbodyScrollY = document.getElementsByTagName('body')[0].style.overflowY;
    /* 退出日历 */
    onCancel = () => {
        document.getElementsByTagName('body')[0].style.overflowY = this.originbodyScrollY;
        this.setState({
            canderShow: false,
        });
    }
    /* 确定日历 */
    onConfirm = (startTime, endTime) => {
        document.getElementsByTagName('body')[0].style.overflowY = this.originbodyScrollY;
        this.setState({
            canderShow: false,
            TimeName: moment(startTime).format("YYYY年MM月DD日"),
            TimeValue: startTime
        });
        this.gethistotyList(moment(startTime).format("YYYYMMDD"));
    }
    /* 下一天 */
    nextFun = (e) => {
        let thisTime = this.state.TimeValue;

        let NextTime = new Date(thisTime.getFullYear(), thisTime.getMonth(), thisTime.getDate() + 1);
        let limitTime = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        console.log(NextTime);
        if (NextTime < now && NextTime > limitTime) {
            this.setState({
                TimeValue: NextTime,
                TimeName: moment(NextTime).format("YYYY年MM月DD日"),
            });
            this.gethistotyList(moment(NextTime).format("YYYYMMDD"));
        } else {
            console.log("大于当前日期");
            console.log("小于限制时间");
            console.log("其他");
        }
    }
    /* 上一天 */
    prveFun = (e) => {
        let thisTime = this.state.TimeValue;
        let prveTime = new Date(thisTime.getFullYear(), thisTime.getMonth(), thisTime.getDate() - 1);
        let limitTime = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        if (prveTime < now && prveTime > limitTime) {
            this.setState({
                TimeValue: prveTime,
                TimeName: moment(prveTime).format("YYYY年MM月DD日"),
            });
            this.gethistotyList(moment(prveTime).format("YYYYMMDD"));
        } else {
            console.log("大于当前日期");
            console.log("小于限制时间");
            console.log("其他");
        }
    }
    /* 获取历史数据某天列表 */
    gethistotyList = async type => {
        try {
            let result = await API.gethistoryList({
                "business": "track_analysis",
                "channel": "wechat",
                "dateTime": type
            });
            if (result.code === "CD000001") {
                let detail = result.body.result;
                // console.log(detail);
                _.forEach(detail, function (value, key) {
                    value.startTime = value.startEpochTime;
                    value.endTime = value.endEpochTime;
                    value.duration = _.round(value.duration / 60);
                    value.distance = _.round(value.distance / 1000);
                    value.maxSpeed = _.round(value.max_speed);
                    value.startEpochTime = moment.unix(value.start_point.loc_time).format("HH:mm");
                    value.endEpochTime = moment.unix(value.end_point.loc_time).format("HH:mm");
                    return value;
                });
                // 删除零时长的行程
                _.remove(detail, {
                    duration: 0,
                    maxSpeed: 0,
                    distance: 0,
                    endLocaName: '',
                    startLocaName: ''
                });
                // 累计总里程、总时长
                let iTotKm = _.sumBy(detail, 'distance');
                let iTotMin = _.sumBy(detail, 'duration');
                let iAvgSpeed = _.round(iTotKm / (iTotMin / 60));
                if (_.isNaN(iAvgSpeed)) {
                    iAvgSpeed = 0;
                }
                // 统计数据
                let total_data = {
                    "totalMileage": _.round(iTotKm),
                    "totalDuration": _.round(iTotMin),
                    "averageSpeed": iAvgSpeed
                };


                this.setState({
                    iTotKm: iTotKm,
                    iTotMin: iTotMin,
                    iAvgSpeed: iAvgSpeed,

                    dataState: true,/* 数据状态 */
                    historyData: detail,
                });

            } else {
                this.setState({
                    dataState: false,/* 数据状态 */
                    historyData: [],

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
    /* 获取所有有数据的日期列表 */
    getDateList = async type => {
        try {
            let result = await API.getDateList({
                "business": "track_analysis",
                "channel": "wechat",
            });

            if (result.code === "CD000001") {
                let dateList = {};
                result.body.trackDateList.map((value) => {
                    if (value.datastt != "99") {
                        console.log(value.datastt);
                        let monthValue = parseFloat(value.datatime.substring(4, 6)) - 1;
                        let dataValue = parseFloat(value.datatime.substring(6, 8));
                        dateList[+new Date(value.datatime.substring(0, 4), monthValue, dataValue)] = { info: '•', selected: true };
                    } else {
                        // console.log(value);
                    }
                });
                Object.keys(dateList).forEach((key) => {
                    const info = dateList[key];
                    const date = new Date(key);
                    if (!Number.isNaN(+date) && !dateList[+date]) {
                        dateList[+date] = info;
                    }
                });
                this.setState({
                    extra: dateList,
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
    /* 调起地图 */
    showMap = async type => {
        console.log("调用打开地图");
        try {
            let result = await API.getHistoryDetaliList({
                // "date": String(getDate),
                // "type": String(getType),
                // "startTime": String(startTime),
                // "endTime": String(EndTime),
                // "business": "MapABC",/* 高德地图标识 */
            });
            if (result.code === "CD000001") {

                const lineArr = result.body.imeiDetailTrack;


                const lineArr_first = _.first(lineArr);
                const lineArr_last = _.last(lineArr);
                // 判断轨迹点数
                if (lineArr.length >= 5) {
                    const centerY = result.body.centerY;
                    const centerX = result.body.centerX;
                    this.setState({
                        markerState: true,
                        startMarkPosition: _.first(lineArr),
                        endMarkPosition: _.last(lineArr),
                        position: [centerY, centerX],
                        mapPath: lineArr,
                        mapState: true,
                    });
                    this.markerEvents = {
                        created: (map) => {
                            console.error(map);
                            map.setFitView();
                        }
                    }

                } else {
                    this.setState({
                        mapState: true,
                    })
                    // this.closeAlertFun();
                    this.defaultMap();
                }
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
    /* 关闭地图 */
    closeMap = () => {
        this.setState({
            mapState: false,
        })
    }
    // 删除历史轨迹
    deleMapdata = type => {
       
       const alertInstance = Modal.alert('删除提示', '轨迹删除后，无法恢复哦！', [
            {
                text: '取消', onPress: () => {
                   
                }, style: 'default'
            },
            {
                text: '确定', onPress:async  () => {
                    Toast.loading('数据删除中', 10000000);
                   
                    try {
                        let result = await API.deleMapdata({
                            "business": "track_analysis",
                            "dateTime": String(type),
                            "channel": "wechat",
                        });
                        console.log(result);
                        console.log(result.data);
                        if (result.code === 'CD000001') {
                            this.gethistotyList(moment(this.state.TimeValue).format('YYYYMMDD'));
                            this.getDateList();
                            Toast.info('轨迹已经删除', 3);
                        } else {
                            Toast.info('删除失败，请重试', 3);
                        }
                       
                    } catch (err) {
                        Toast.hide()
                        this.setState({
                            alertStatus: true,
                            alertTip: "服务器异常"
                        })
                        this.closeAlertFun();
                    }
                    
                }
            },
        ]);
        

    }

    /* 获取地图默认中心点 */
    defaultMap = async type => {
        let _this = this;
        _.delay(function (text) {
            window.AMap.service(["AMap.CitySearch"], function () {
                //实例化城市查询类
                var citysearch = new window.AMap.CitySearch();
                //自动获取用户IP，返回当前城市
                citysearch.getLocalCity(function (status, result) {
                    // console.info(result);
                    if (status === 'complete' && result.info === 'OK') {
                        if (result && result.city && result.bounds) {
                            let hisData = result.adcode;
                            axios({
                                url: 'https://restapi.amap.com/v3/config/district?key=03ec59b5d20e05beaea9b9aba7973d83&keywords=' + hisData + '&subdistrict=0&extensions=all',
                                contentType: "application/json",
                                dataType: "json",
                                data: JSON.stringify({}),
                                timeout: 30000,
                                type: 'get',
                            }).then(function (res) {
                                var _center = _.split(res.data.districts[0].center, ',', 2);
                                console.log(_center);
                                _this.setState({
                                    position: _center
                                });
                            }).catch(function (error) {
                                console.log(error);
                            })

                        }
                    }
                });
            });
        }, 500, 'ok');
    }
    /* 首次加载当天历史轨迹 */
    componentWillMount() {
        this.gethistotyList(moment().format('YYYYMMDD'));
        this.getDateList();
    }
    componentDidMount() {

    }
    componentWillReceiveProps(nextProps) {
        // console.log("拿到redux数据");
        // if (nextProps.brandData.brandDataError.msg) {
        //     this.setState({
        //         alertStatus: true,
        //         alertTip: nextProps.brandData.brandDataError.msg
        //     })
        //     this.closeAlertFun();
        // } else {
        //     // console.log("父组件触发");
        //     this.setState({
        //     });

        // }
    }
    componentWillUpdate() {

    }
    /* 避免多次渲染 */
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState));
    }
    /* 格式化显示日期 */
    getDateExtra = date => {
        return this.state.extra[+date];
    };
    render() {
        return (
            <main className="common-con-top"  id="history">
                <TipCompent></TipCompent>
                {

                    this.state.mapState && <div id="container">
                        <Map amapkey="c823911f82ee642a5322f8dafcbbeaac"  events={this.mapEvents}>
                            {
                                this.state.markerState && <Marker position={this.state.startMarkPosition}
                                    offset={this.state.startMark}

                                >
                                    <div className="marker-route map_start"></div>
                                </Marker>
                            }

                            <Polyline path={this.state.mapPath} events={this.lineEvents} style={this.state.MaplineStyle} />
                            {
                                this.state.markerState && <Marker position={this.state.endMarkPosition}
                                    offset={this.state.endMark}
                                >
                                    <div className="marker-route map_end"></div>
                                </Marker>
                            }
                        </Map>
                    </div>
                }
                {
                    this.state.mapState && <div id="mask1" onClick={this.closeMap.bind(this)}></div>
                }

                <Calendar
                    visible={this.state.canderShow}
                    onCancel={this.onCancel}
                    onConfirm={this.onConfirm}
                    getDateExtra={this.getDateExtra}
                    defaultDate={new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())}
                    minDate={new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())}
                    maxDate={new Date(now)}
                    initalMonths={2}
                    type="one"
                    defaultValue={[new Date(+this.state.TimeValue), new Date(this.state.TimeValue)]}
                />
                <div id="history__body">
                    <div id="stuck" className="weui-flex text-white history-top navbar navbar-default navbar-fixed-top navbar-wrapper">
                        <div>
                            <div className="clearfix LRbox">
                                <a href="javascript:void(0);" id="date-prve" onClick={this.prveFun.bind(this)}>
                                    <Icon type="left" />
                                </a>
                            </div>
                        </div>
                        <div className="weui-flex__item text-center">
                            <div className="placeholder">
                                <h3><input title="选择日期" onClick={() => {
                                    document.getElementsByTagName('body')[0].style.overflowY = 'hidden';
                                    this.setState({
                                        canderShow: true,
                                    });
                                }} className="weui-input text-center" id="date2" type="text" value={this.state.TimeName} readOnly /></h3>
                            </div>
                        </div>
                        <div>
                            <div className="clearfix LRbox">
                                <a href='javascript:void(0);' id='date-next' onClick={this.nextFun.bind(this)} >
                                    <Icon type="right" />
                                </a>
                            </div>
                        </div>
                    </div>
                    {/* 总数据 */}

                    <div className="weui-flex history-title" id="history-total">
                        <div className="weui-flex__item text-df-gray">
                            <div className="white-bg fh-100 fw-100 b-r-xll">
                                <span>行驶里程
                                    <strong className="counter" id="totalMileage">
                                        <TweenOne animation={{
                                            Children: { value: this.state.iTotKm, floatLength: 0, formatMoney: true }
                                        }}>
                                        </TweenOne>
                                    </strong>km
                                </span>
                            </div>
                        </div>
                        <div className="weui-flex__item">
                            <span className="border-right">耗时
                                <strong className="counter" id="totalDuration">
                                    <TweenOne animation={{
                                        Children: { value: this.state.iTotMin, floatLength: 0, formatMoney: true }
                                    }}>
                                    </TweenOne>
                                </strong>min
                            </span>
                        </div>
                        <div className="weui-flex__item">
                            <span>时速
                                <strong className="counter" id="averageSpeed">
                                    <TweenOne animation={{
                                        Children: { value: this.state.iAvgSpeed, floatLength: 0, formatMoney: true }
                                    }}>
                                    </TweenOne>
                                </strong>km/h
                            </span>
                        </div>
                    </div>


                    {/* 分段轨迹 */}
                    <div className="p-w-sm history-track" id="history-day">
                        {
                            this.state.dataState ?
                                <div >
                                    {
                                        this.state.historyData.map((value, index) => (
                                            <div className="history-detailBox" key={index} >
                                                <div className="history-detail">
                                                    <div className="weui-flex text-df-gray">
                                                        <div className="w-80 history-dot">{value.startEpochTime}</div>
                                                        <div className="weui-flex__item">{value.start_point.address}</div>
                                                    </div>
                                                    <div className="weui-flex text-df-dark-gray">
                                                        <div className="w-80"></div>
                                                        <div className="weui-flex__item">
                                                            <p className="text-df-success">
                                                                <a href="javascript:;" onClick={this.showMap.bind(this)} className="open-popup dofun__button__map">查看轨迹</a>
                                                            </p>
                                                            <ul>
                                                                <li className="weui-flex">
                                                                    <span className="weui-flex__item">耗时</span>
                                                                    <span className="weui-flex__item">{value.duration}min</span>
                                                                    <span className="weui-flex__item">急加速</span>
                                                                    <span className="weui-flex__item">{value.harsh_acceleration_num}次</span>
                                                                </li>
                                                                <li className="weui-flex">
                                                                    <span className="weui-flex__item">里程</span>
                                                                    <span className="weui-flex__item">{value.distance}km</span>
                                                                    <span className="weui-flex__item">急转弯</span>
                                                                    <span className="weui-flex__item">{value.harsh_steering_num}次</span>
                                                                </li>
                                                                <li className="weui-flex">
                                                                    <span className="weui-flex__item">最高速</span>
                                                                    <span className="weui-flex__item">{value.maxSpeed}km/h</span>
                                                                    <span className="weui-flex__item">急减速</span>
                                                                    <span className="weui-flex__item">{value.harsh_breaking_num}次</span>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div className="weui-flex text-df-gray">
                                                        <div className="w-80 history-dot">{value.endEpochTime}</div>
                                                        <div className="weui-flex__item">{value.end_point.address}</div>
                                                    </div>
                                                </div>
                                                <i className="history-hr"></i>
                                            </div>
                                        ))
                                    }
                                </div>
                                :
                                <div>
                                    {/* 没有数据 */}
                                    <div className="history-detail">
                                        <div className="weui-flex text-df-gray">
                                            <div className="w-80 history-dot">01-22{}</div>
                                            <div className="weui-flex__item">您在这一天没有轨迹信息{}</div>
                                        </div>
                                    </div>
                                    <i className="history-hr"></i>
                                </div>
                        }
                    </div>

                    <div id="footer">
                        {
                            this.state.dataState ?
                                <div className="weui-footer">  {/* 有数据的页脚 */}
                                    <p className="weui-footer__text">由鎏信云卡提供信息安全保护</p>
                                    <div className="weui-flex p-sm">
                                        <div className="weui-flex__item">
                                            <button id="show-delete" onClick={this.deleMapdata.bind(this)} className="weui-btn weui-btn_success">删除当天轨迹</button>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className="weui-footer weui-footer_fixed-bottom"> {/* 无数据的页脚 */}
                                    <p className="weui-footer__text">
                                        <a href="https://mp.weixin.qq.com/s?__biz=MzI0NDQ3NTA1MQ==&amp;mid=100000335&amp;idx=2&amp;sn=f2b47d8b6a1b93e2d83359e754c8c0ea">历史轨迹不显示
                            <i className="icon_WH" aria-hidden="true">  ?</i>
                                        </a>
                                    </p>
                                </div>
                        }
                    </div>
                </div>
                <div id="full" className="weui-popup__container popup-bottom"></div>
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
    })(History));