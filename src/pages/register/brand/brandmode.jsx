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
import { getBrandData, brandZJState, modeActFun } from '@/store/brand/action';
import { NavLink, Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import provincetext from "@/api/database.json";

class BrandMode extends Component {
    static propTypes = {
        brandData: PropTypes.object.isRequired,
        getBrandData: PropTypes.func.isRequired,
        brandZJState: PropTypes.func.isRequired,
        modeActFun: PropTypes.func.isRequired,
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
            }, "1", "1");
            this.setState({
                seriesInfoList: result.body.infoList,
            });
        } catch (err) {
            this.setState({
                alertStatus: true,
                alertTip: "服务器异常"
            })
            this.closeAlertFun();
        }
    }
    componentWillMount() {
        this.getbrandInfoFun();
    }
    bindFun = (name, id, evnent) => {
        this.props.modeActFun(id, name)
        this.props.brandZJState(false, false, false);
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState));
    }
    componentDidMount() {

    }
    render() {
        return (
            <main className="common-con-top brandcommon" id="seriesBox">
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
                                return (
                                    <div className="carbrand_listbox" key={index} >
                                        <div onClick={this.bindFun.bind(this, value.modelname, value.modelid)}>
                                            <div className="weui-cell" >
                                                <div className="weui-cell__bd">
                                                    <p >{value.modelname}</p>
                                                </div>
                                            </div>
                                        </div>
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
        modeActFun,
    })(BrandMode));