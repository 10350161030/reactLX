import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { is, fromJS } from 'immutable';
import PropTypes from 'prop-types';
import API from '@/api/api';
import { isUserLogin } from '@/store/main/action';
import PublicAlert from '@/components/alert/alert';
import './Planningtrip.less';
import { Button } from 'antd-mobile';
import { Map, Marker, Polyline } from 'react-amap';
import _ from "lodash";
import axios from 'axios';
import { Wrapper, PositionPicker, SimpleMarker } from 'react-amapui-wrapper'
import NewMarker from "./newmark"




class Planningtrip extends Component {
    static propTypes = {
        formData: PropTypes.object.isRequired,
        isUserLogin: PropTypes.func.isRequired,
    }
    /* tost 公共状态 */
    state = {
        alertStatus: false, //弹框状态
        alertTip: "信息提醒",
        textcontent: "",/* 测试定位信息是否成功 */
        business: "wechet",/* 业务类型 是否预约接人还是导航 */
        imeiId: "1234567/97",/* 设备号 */
        latCode: "114.081924",/* 经度 */
        lngCode: "22.5427",/* 纬度 */
        address: "广东省沙河县",/* 详细中文地址 */
        openId: "200..00",/* openid */
        sig: "",/* 不知道舍参数 */
        Peripheral: [],/* 地图周边位置 */
        changeClass: 200,/* 点击代理 */
        thisMap: [],/* 地图初始化 */
        instance: [],/* 拖拽组件初始化 */
        marker: [],/* 拖拽后的标注初始化 */
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
    changeLatLng = (lat, lng, address, index, event) => {

        this.setState({
            changeClass: index,
            latCode: lat,
            lngCode: lng,
            address: address,
        });
        const geocoder1 = new window.AMap.Geocoder({
            radius: 1000,
            extensions: "all",
        });
        const _mythis = this;
        console.log(this.state.lngCode);
        console.log(this.state.latCode);
        _mythis.state.instance.stop();
        geocoder1.getAddress([lng, lat], function (status1, result1) {
            if (status1 === 'complete') {
                if (result1.info === 'OK') {
                    _mythis.state.thisMap.setCenter([lng, lat]);/* 这种地图中心点 */
                    _mythis.state.thisMap.setZoom(18);
                    _mythis.state.thisMap.remove(_mythis.state.marker);
                    const markerIcon = new window.AMap.Icon({
                        image: "//webapi.amap.com/ui/1.0/ui/misc/PositionPicker/assets/position-picker.png?v=1.0.11&key=c823911f82ee642a5322f8dafcbbeaac",
                        // size:new window.AMap.Size(32,32),  //要显示的点大小，将缩放图片
                        // imageOffset:new window.AMap.Pixel(16,32),//锚点的位置，即被size缩放之后，图片的什么位置作为选中的位置
                        imageSize: new window.AMap.Size(32, 32)   // 根据所设置的大小拉伸或压缩图片
                    });
                    const marker = new window.AMap.Marker({
                        position: [lng, lat],
                        icon: markerIcon,
                        offset: new window.AMap.Pixel(-16, -32),
                        // title: '北京',
                    });
                    _mythis.setState({
                        marker: marker,
                    })
                    console.log(marker);
                    console.log(markerIcon);
                    _mythis.state.thisMap.add(marker);


                }
            }
        });

    }



    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }
    componentWillMount() {
        // this.props.isUserLogin();
        // this.defaultMap();
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
        const _mythis = this;
        const plugins = [
            {
                name: 'ToolBar',

            }
        ];

        const onComplete = (data) => {
            this.setState({
                textcontent: "定位成功"
            });
            console.log("定位成功");
        };
        const onError = () => {
            console.log('定位失败');
            this.setState({
                textcontent: "定位失败"
            });
            // this.defaultMap();
        };

        const events = {
            created: (instance) => {

                instance.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Geolocation'], () => {
                    const autoOptions = {
                        city: "全国", //城市，默认全国
                        input: "tipinput" //使用联想输入的input的id
                    };
                    const autocomplete = new window.AMap.Autocomplete(autoOptions);
                    const placeSearch = new window.AMap.PlaceSearch({
                        city: '全国',
                        map: instance,
                        offset: 1,
                        page: 1,
                    })
                    window.AMap.event.addListener(autocomplete, "select", function (e) {
                        //TODO 针对选中的poi实现自己的功能
                        console.log(e.poi.location);
                        instance.setZoom(17);
                        instance.setCenter(e.poi.location);
                    });
                    const geolocation = new window.AMap.Geolocation({
                        enableHighAccuracy: true, //是否使用高精度定位，默认:true
                        timeout: 10000, //超过10秒后停止定位，默认：无穷大
                        buttonOffset: new window.AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                        zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                        buttonPosition: 'RT'
                    });
                    instance.addControl(geolocation);
                    geolocation.getCurrentPosition();
                    window.AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
                    window.AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
                });
                _mythis.setState({/* 暴露地图 */
                    thisMap: instance
                });
            }
        };

        const postitionpickerEvents = {
            created: (instance, e) => {

                instance.on('success', function (positionResult, regeocode) {
                    // 逆向地理编码
                    const lnglatXY = [positionResult.position.lng, positionResult.position.lat];
                    const geocoder = new window.AMap.Geocoder({
                        radius: 1000,
                        extensions: "all",
                    });
                    geocoder.getAddress(lnglatXY, function (status, result) {

                        if (status == 'complete') {
                            if (result.info == 'OK') {
                                console.log(positionResult);
                                console.log(result);
                                let firstjson = {
                                    address: "中航路1号中航城",
                                    businessArea: "上步",
                                    direction: "东",
                                    distance: 107,
                                    id: "B0FFFCRDQX",
                                    location: { Q: 22.542739, N: 114.08296899999999, lng: 114.082969, lat: 22.542739 },
                                    nam: "九方购物中心(华强北店)",
                                    te: "0755-22220001",
                                    typ: "购物服务;商场;购物中心",
                                };
                                firstjson.name = positionResult.address;
                                firstjson.location = { lng: positionResult.position.lng, lat: positionResult.position.lat };
                                let peripheryList = result.regeocode.pois;
                                peripheryList.push(firstjson);

                                console.log(firstjson);
                                console.log(peripheryList);
                                _mythis.setState({
                                    Peripheral: peripheryList,/* 周边地点集合 */
                                    latCode: positionResult.position.lat,/* 经度 */
                                    lngCode: positionResult.position.lng,/* 纬度 */
                                    address: positionResult.address,/* 详细中文地址 */
                                    changeClass: 200,
                                });
                                _mythis.state.thisMap.remove(_mythis.state.marker);
                                document.getElementById("listResultUL").scrollIntoView({/*scrollIntoView html5 api  */
                                    // behavior:'auto',/* 动画 */
                                    block: 'start',
                                    inline: "end",
                                });
                            }

                        }
                    });
                });
                instance.on('fail', function (positionResult) { });
                document.getElementById("container").addEventListener('touchend', function () {
                    instance.start();
                });
                _mythis.setState({/* 暴露拖拽组件 */
                    instance: instance
                });
            }
        }

        return (
            <main className="home-container" id="Planningtrip">
                <div className="postition_conent">
                    <div className="weui-cell " id="position_tip">
                        <p> 如定位不准确，您可以直接搜索目的地。（{this.state.textcontent}）</p>
                    </div>
                    <div className="weui-cell tipinputBox">
                        <input className="weui-input" type="text" id="tipinput" placeholder="输入位置"></input>
                        <span className="textclear"></span>
                        <a href="javascript:;" className="weui-btn weui-btn_mini weui-btn_plain-default" id="searchbtn">搜索</a>
                    </div>
                    <div id="container">
                        <Map zoom={16} amapkey="c823911f82ee642a5322f8dafcbbeaac" events={events} useAMapUI={true}>
                            <Wrapper>
                                {/* <PositionPicker
                                    events={postitionpickerEvents}
                                    eventSupport={true}
                                    instanceName={'PositionPicker'}>

                                </PositionPicker> */}
                                <NewMarker instanceName={'PositionPicker'} events={postitionpickerEvents}></NewMarker>
                            </Wrapper>
                        </Map>
                    </div>
                </div>
                <div id="listResult">
                    <ul className="weui-cells" id="listResultUL">
                        <li className={this.state.changeClass == 200 ? "weui-cell backgroun_acitve" : "weui-cell"} onClick={this.changeLatLng.bind(this, this.state.latCode, this.state.lngCode, this.state.address, 200)} >
                            <h3>位置</h3>
                            <p>{this.state.address}</p>
                        </li>
                        {
                            this.state.Peripheral.map((value, index) => (
                                <li className={this.state.changeClass == index ? "weui-cell backgroun_acitve" : "weui-cell"} key={index} onClick={this.changeLatLng.bind(this, value.location.lat, value.location.lng, value.address, index)} >
                                    <h3>{value.name} </h3>
                                    <p>{value.address}</p>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <div className="footerbtnBox weui-cells">
                    <a href="javascript:;" className="weui-btn weui-btn_plain-default footerbtn">发送给朋友</a>
                </div>
                <div className="alertSuccess">
                    <svg className="icon" aria-hidden="true">
                        <use href="#icon-fasongchenggong"></use>
                    </svg>
                    <p>发送成功</p>
                    <a className="weui-btn weui-btn_default altSucBtn">确定</a>
                </div>
                <div className="alertfalse">
                    <p>对不起，位置发送失败
                    <br></br> 请稍后重试
                </p>
                    <a className="weui-btn weui-btn_default altSucBtn">确定</a>
                </div>
                <div className="alertovertime">
                    <p>对不起，该信息已经失效
                    <br></br>请重新获取
                </p>
                    <a className="weui-btn weui-btn_default altSucBtn">确定</a>
                </div>
                <div id="mask"></div>
                <input type="hidden" id="latCode" name="latCode" value=""></input>
                <input type="hidden" id="lngCode" name="lngCode" value=""></input>
                <input type="hidden" id="location" name="location" value=""></input>

                <input type="hidden" id="openId" name="openId" ></input>
                <input type="hidden" id="imei" name="imei" ></input>
                <input type="hidden" id="business" name="business"></input>
                <input type="hidden" id="sig" name="sig" ></input>
                <PublicAlert alertStatus={this.state.alertStatus} alertTip={this.state.alertTip} />
            </main>
        );
    }
}

export default connect(state => ({
    formData: state.formData,
}), {
        isUserLogin,
    })(Planningtrip);
