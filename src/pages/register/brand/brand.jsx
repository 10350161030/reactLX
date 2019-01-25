import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { is, fromJS } from 'immutable';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import PublicAlert from '@/components/alert/alert';
import Certificates from '@/components/Certificates/Certificates';
import API from '@/api/api';
import "./brand.less";
import { brandZJState,brandActFun } from '@/store/brand/action';
import { Toast, List, InputItem, Button, Flex, Modal, Icon, DatePicker } from 'antd-mobile';
import { NavLink, Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import provincetext from "@/api/database.json";

class Brand extends Component {
    static propTypes = {
        brandData: PropTypes.object.isRequired,
        brandZJState: PropTypes.func.isRequired,
        brandActFun:PropTypes.func.isRequired,
    }
    state = {
        alertStatus: false, //弹框状态
        alertTip: "信息提示",

        brandInfoList: [],/* 车品牌信息 */
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
    /* 获取车品牌信息 */
    getbrandInfoFun = async type => {
        console.log("车品牌执行了");
        try {
            let result = await API.getbrandInfo({
                id: 'wechat'
            },"0","0");
            let carListArr = [];
            for (let item in result.body) {
                let reobj = {};
                reobj[item] = result.body[item];
                carListArr.push(reobj);
            }
            this.setState({
                brandInfoList: carListArr,
            });
        } catch (err) {
            this.setState({
                alertStatus: true,
                alertTip: "服务器异常"
            })
            this.closeAlertFun();
        }

    }
    bindFun = (name,image,id,evnent) => {
        this.props.brandActFun(id,name,image)
        this.props.brandZJState(false,true,false);
    }
    bandScrollFun = (value,event) => {/* 锚点 */
        if (value) {
            let anchorElement = document.getElementById(value);
            if(anchorElement) { 
                anchorElement.scrollIntoView({/*scrollIntoView html5 api  */
                    // behavior:'auto',/* 动画 */
                    block: 'start',
                    inline:"end",
                });
            }
        }

    }
    componentWillMount(){
        this.getbrandInfoFun();
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState));
    }
    componentDidMount() {
       
    }
    render() {
        return (
            <main className="common-con-top" id="brandBox">
                <div className="Car_brand">
                    <div className="weui-cells car_branm0">
                        <div className="carbrand_listbox">
                            {
                                this.state.brandInfoList.map((value, index) => {
                                    let carListArr = [];
                                    let carListkey = [];
                                    for (let item in value) {
                                        carListkey = item
                                        carListArr = value[item];
                                    }
                                    return (
                                        <div key={index} id={carListkey}>
                                            <div className="weui-cells__title"  >{carListkey}</div>
                                            {
                                                carListArr.map((item, numberN) => (
                                                    <div key={numberN} className="weui-cell" onClick={this.bindFun.bind(this,item.brandname,item.brandimg,item.brandid)}>
                                                        <div className="weui-cell__hd">
                                                            <img className="lazy" src={item.brandimg} />
                                                        </div>
                                                        <div className="weui-cell__bd">
                                                            <p >{item.brandname}</p>
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
                    <div className="carbrand_lisnav" id="carbrand_lisnav">
                        {
                            provincetext.brandNav.map((value, index) => (
                                <a href="javascript:;" key={index} className="scrolla" data-value={value} onClick={this.bandScrollFun.bind(this,value)}>{value}</a>
                            ))
                        }
                    </div>
                </div>
            </main >
        )
    }
}

export default withRouter( connect(state => ({
    brandData:state.brandData,
}), {
     brandZJState,brandActFun
    })(Brand));