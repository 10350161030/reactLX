import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { is, fromJS } from 'immutable';
import { connect } from 'react-redux';
import PublicAlert from '@/components/alert/alert';
import Certificates from '@/components/Certificates/Certificates';
import API from '@/api/api';
import "./brand.less";
import PropTypes from 'prop-types';
import { Toast, List, InputItem, Button, Flex, Modal, Icon, DatePicker } from 'antd-mobile';
import { getBrandData,seriesActFun,brandZJState } from '@/store/brand/action';
import { NavLink, Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import provincetext from "@/api/database.json";

class BrandSeries extends Component {
    static propTypes = {
        brandData: PropTypes.object.isRequired,
        getBrandData: PropTypes.func.isRequired,
        brandZJState:PropTypes.func.isRequired,
        seriesActFun:PropTypes.func.isRequired,
    }
    state = {
        alertStatus: false, //弹框状态
        alertTip: "信息提示",

        seriesInfoList: [],/* 车品牌信息 */
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
    /* 获取车型接口 */
    getbrandInfoFun = async type => {
        try {
            let result = await API.getbrandInfo({
                id: 'wechat'
            }, "1", "0");
            console.log(result);
            let carListArr = [];
            for (let item in result.body) {
                let reobj = {};
                reobj[item] = result.body[item];
                carListArr.push(reobj);
            }
            this.setState({
                seriesInfoList: carListArr,
            });
        } catch (err) {
            this.setState({
                alertStatus: true,
                alertTip: "服务器异常"
            })
            this.closeAlertFun();
        }
    }
    componentWillMount(){
        this.getbrandInfoFun();
    }
    bindFun = (name,id, evnent) => {
        this.props.seriesActFun(id,name)
        this.props.brandZJState(false,false,true);
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState));
    }
    componentDidMount() {

    }
    render() {
        console.log(this.state.seriesInfoList);
        return (
            <main className="common-con-top" id="seriesBox">
                <div className=" Car_brand Car_branddetail" id="carConfiguration">
                    <div className="weui-cell cell_branddetailT">
                        <div className="weui-cell__hd"><img src={this.props.brandData.brandDataList.brandImage} id="pageLogoSrc" /></div>
                        <div className="weui-cell__bd">
                            <p id="carSeriesName">{this.props.brandData.brandDataList.brandName}</p>
                        </div>
                    </div>
                    <div className="weui-cells car_branm0">
                        {
                            this.state.seriesInfoList.map((value, index) => {
                                let carListArr = [];
                                let carListkey = [];
                                for (let item in value) {
                                    carListkey = item
                                    carListArr = value[item];
                                }
                                return (
                                    <div className="carbrand_listbox" key={index} >
                                        <div className="weui-cells__title">{carListkey}</div>
                                        {
                                            carListArr.map((item, numberN) => (
                                                <div key={numberN}  onClick={this.bindFun.bind(this,item.seriesname,item.seriesid)}>
                                                    <div className="weui-cell" >
                                                        <div className="weui-cell__bd">
                                                            <p >{item.seriesname}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </main >
        )
    }
}

export default withRouter(connect(state => ({
    brandData: state.brandData,
}), {
        getBrandData,
        brandZJState,
        seriesActFun,
    })(BrandSeries));