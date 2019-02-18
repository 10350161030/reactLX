import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { is, fromJS } from 'immutable';
import PropTypes from 'prop-types';
import API from '@/api/api';
import { isUserLogin } from '@/store/main/action';
import PublicAlert from '@/components/alert/alert';
import './flow_package.less';
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
        flowPackage: [],
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
    getFlowPackage = async () => {
        try {
            let result = await API.queryFlowPackage({});
            if (result.code === "CD000001") {
                this.setState({
                    flowPackage: result.body.pack,
                })
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
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }
    componentWillMount() {
        this.props.isUserLogin();
        this.getFlowPackage();
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
        return (
            <main className="home-container" id="flow_package">
                <div id="Telecom">
                    <div className="main">
                        {
                            this.state.flowPackage.map((value, index) => (
                                <div className="main_package" key={index}>
                                    <header>
                                        <div className="title">
                                            <h2 className="title_text" >{value.packTitle}</h2>
                                        </div>
                                    </header>
                                    <div className="describe">
                                        <pre>
                                            {value.packDesc}
                                        </pre>
                                    </div>
                                    <div className="packageList_box">
                                        {
                                            value.packInfo.map((item, numberList) => (
                                                <div key={numberList} className={item.recommends=="00"?"packagelist list_TJ":(item.recommends=="01"?"packagelist list_rq":(item.recommends=="02"?"packagelist list_ZZ":"packagelist"))} >
                                                    <h3 >{item.wpackname}</h3>
                                                    <span className="money">{item.salesmoney}</span>
                                                    <del>{item.originalprice}</del>
                                                    <span className="time" >{item.packdesc}</span>
                                                    <a href={"/flow/01/payFlow/" + item.id} className="buy">立即购买</a>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
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
