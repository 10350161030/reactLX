import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { is, fromJS } from 'immutable';
import PropTypes from 'prop-types';
import API from '@/api/api';
import {isUserLogin , getWXpsoninfo} from '@/store/main/action';
import PublicFooter from '@/components/footer/footer';
import PublicAlert from '@/components/alert/alert';
import './person.less';
import wx from 'weixin-js-sdk';
import testJson from "@/api/database.json";/* 文案 */

// mixin({ padStr })
class Person extends Component {
    static propTypes = {
        formData: PropTypes.object.isRequired,
        PersonList:PropTypes.object.isRequired,
        isUserLogin:PropTypes.func.isRequired,
        getWXpsoninfo:PropTypes.func.isRequired,
    }
    state = {
        alertStatus: false, //弹框状态
        alertTip:"信息提醒",
        bgMask:false,/* 背景遮罩状态 */
        equipmentStatus:false,/* 完整设备弹窗状态 */
    }
   
    closeAlertFun =()=>{
        const that = this;
        if(this.timer){
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(()=>{
            that.setState({
                alertStatus: false,
            });
        },4000); 
    }

    alertEquipment = () =>{
        this.setState({
            equipmentStatus: true,
        });
        const that = this;
        if(this.timer){
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(()=>{
            that.setState({
                equipmentStatus: false,
            });
        },4000); 
    }
    componentWillReceiveProps(nextProps){
        /* 异步判断是否登录异常 */
        if(nextProps.formData.LoginError.msg){
            this.setState({
                alertStatus: true,
                alertTip:nextProps.formData.LoginError.msg
            })
            this.closeAlertFun();
        }
        /* 异步判断获取微信服务器信息是否异常 */
        if(nextProps.PersonList.PersonError.msg){
            this.setState({
                alertStatus: true,
                alertTip:nextProps.PersonList.PersonError.msg
            })
            this.closeAlertFun();
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        /* 异步报错 tost */
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }
    componentWillMount(){
      
    }
    componentDidMount() {
        this.props.isUserLogin();
        this.props.getWXpsoninfo();
    }
    render() {
        return (
            <main className="home-container" id="person">
              <div className="person_head">
                    <div className="person_headPhoto">
                        <img src={this.props.PersonList.PersonData.avatar} />
                    </div>
                    {
                        !this.props.formData.LoginData.isLogin&&<a className="person_headNoLogin">
                            <h3>点击登录</h3>
                            <p>更多服务等你开启</p>
                        </a>
                    }
                    {
                        this.props.formData.LoginData.isLogin&&<div className="person_headLogin">
                            <h3 >{this.props.PersonList.PersonData.name}</h3>
                            <p>
                                手机:<span >{this.props.PersonList.PersonData.mobile}</span>
                            </p>
                            
                            <div className="person_headHobby">
                                {this.props.PersonList.PersonData.interest&&this.props.PersonList.PersonData.interest.map((item,index)=>(<span key={index}>{item}</span>))}
                                <a href="/user/01/person/hobby" className="special" ></a>
                            </div>
                        </div>
                    }
                </div>
                <div className="person_fun">
                    <Link to="/personinfo" className="person_funList person_edit "><i></i>编辑个人信息</Link>
                    {
                        this.props.formData.LoginData.isLogin && <div  className="person_funList person_equipmentbox"><i></i>
                            <p  className="equipment_box" onClick={this.alertEquipment.bind(this)}>{this.props.PersonList.PersonData.imei !="fals"? "设备ID:"+this.props.PersonList.PersonData.imei:"未绑定设备"}</p>
                            <a href="javascript:;" className="person_equipment">
                                <span>{this.props.PersonList.PersonData.imei !="fals"?"解除绑定":"去绑定"}</span>
                            </a>
                            {
                                this.state.equipmentStatus && <div className="equipment_detail">
                                    <div className="equipment_detail_main">
                                        <div className="arrow"></div>
                                        <span id="equipment_text">{this.props.PersonList.PersonData.imei}</span>
                                    </div>
                                </div>
                            }
                        </div>
                    }
                </div>
                { !this.props.formData.LoginData.isLogin && <a href="" id="mask"></a>}
                <PublicFooter></PublicFooter>
                <PublicAlert alertStatus={this.state.alertStatus}  alertTip={this.state.alertTip} />
            </main>
        );
    }
}

export default connect(state => ({
        formData: state.formData,
        PersonList:state.PersonList,
}), {
        isUserLogin,
        getWXpsoninfo,
})(Person);
