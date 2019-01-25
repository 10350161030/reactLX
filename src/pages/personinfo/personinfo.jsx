import React, { Component } from 'react';
import { is, fromJS } from 'immutable';
import { connect } from 'react-redux';
import PublicAlert from '@/components/alert/alert';
import { getWXpsoninfo } from '@/store/main/action';
import PropTypes from 'prop-types';
import API from '@/api/api';
import './personinfo.less';
import { List, Picker } from 'antd-mobile';
import { Link, NavLink } from 'react-router-dom';


import Cropper from 'react-cropper';
import "cropperjs/dist/cropper.css";



const Item = List.Item;
const Brief = Item.Brief;

const sexName = [
    {
        label: '男',
        value: "男"
    }, {
        label: '女',
        value: "女",
    }
];

class PersonInfo extends Component {

    static propTypes = {
        PersonList: PropTypes.object.isRequired,
        getWXpsoninfo: PropTypes.func.isRequired,
    }
    state = {
        CropperState: false,
        fileState: true,
        CropperFile: "",
        fileValue: "",
        alertStatus: false, //弹框状态
        alertTip: "信息提醒",
        bgMask: false,/* 背景遮罩状态 */
        equipmentStatus: false,/* 完整设备弹窗状态 */
        sexValue: ["男"],
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

    finishCrop = async type => {
        let imgUIL = this.refs.cropper.getCroppedCanvas({ minWidth: 200, minHeight: 200, width: 200, height: 200, maxWidth: 200, maxHeight: 200 }).toDataURL();

        try {
            let result = await API.modifyFun({
                imgData: imgUIL,
            });
            if (result.code === "CD000001") {
                this.setState({
                    alertStatus: true,
                    alertTip: "上传成功",
                })
                this.closeAlertFun();
                // this.props.getWXpsoninfo();
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



        /* 文件上传按钮值清空，显示隐藏假动作 */
        this.setState({
            CropperState: false,
            // fileValue:"",
            fileState: false,
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

    cancelCrop = () => {
        this.setState({
            CropperState: false,
            fileState: false,
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


    fileChange = (event) => {
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        console.log(event.target.files[0]);
        reader.onload = function (e) {
            console.log(typeof e.target.result);
            this.setState({
                CropperState: true,
                CropperFile: e.target.result,

            });
        }.bind(this);
        event.preventDefault();
    }


    nickNameFun = () => {
        this.props.history.push({ pathname: '/nicknameedit/' + this.props.PersonList.PersonData.name });
    }


    onChangeSex = async sex => {
        try {
            let result = await API.modifyFun({
                sex: sex.join(","),
            });
            if (result.code === "CD000001") {
                this.setState({
                    sexValue: sex,
                    alertStatus: true,
                    alertTip: "修改成功",
                });
                this.closeAlertFun();
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


    componentWillReceiveProps(nextProps) {
        let defaultSex = [];
        defaultSex.push(nextProps.PersonList.PersonData.sex);
        this.setState({
            sexValue: defaultSex,
        });
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }
    componentDidMount() {
        this.props.getWXpsoninfo();
    }

    render() {
        return (
            <main className="home-container">
                {
                    this.state.CropperState && <div className="photocli_box">
                        <Cropper
                            id="clipArea"
                            ref='cropper'
                            src={this.state.CropperFile}
                            aspectRatio={1 / 1}/* 裁切比例 */
                            style={{ 'height': "100vh" }}
                            className="company-logo-cropper"
                            viewMode={1} //定义cropper的视图模式
                            zoomable={true} //是否允许放大图像
                            preview='.cropper-preview'
                            background={false} //是否显示背景的马赛克
                            rotatable={true} //是否旋转
                            autoCrop={true}/* 自动裁切 */
                            cropBoxMovable={false}/* 允许通过拖动移动裁剪框 */
                            cropBoxResizable={false}/* 允许通过拖动调整裁剪框的大小。 */
                            dragMode="move"//定义裁剪器的拖动模式。crop'：创建一个新的裁剪框'move'：移动画布'none'： 没做什么
                        />
                        <div className="photoclip_tool">
                            <input type="button" id="clipBtn" onClick={this.finishCrop.bind(this)} className="btn" value="完成" />
                            <input type="button" id="clipBtn2" onClick={this.cancelCrop.bind(this)} className="btn" value="取消"></input>
                        </div>
                    </div>
                }

                <div className="personalinfo">
                    <List className="my-list personalinfo_head ">
                        <Item className="personalinfo_headtext " extra={<img src={this.props.PersonList.PersonData.avatar} />} arrow="horizontal" >修改头像</Item>
                        {this.state.fileState && <input type="file" id="file" accept="image/*" onChange={this.fileChange.bind(this)} />}
                    </List>
                    <List className="my-list ibox">

                        <Item arrow="horizontal" onClick={this.nickNameFun.bind(this)} extra={this.props.PersonList.PersonData.name} >昵称</Item>

                        <Picker
                            data={sexName}
                            cols={1}
                            className="forss"
                            onOk={this.onChangeSex.bind(this)}
                            value={this.state.sexValue}
                        >
                            <List.Item arrow="horizontal" >性别</List.Item>
                        </Picker>
                        <Item arrow="horizontal" onClick={() => { this.props.history.push({ pathname: '/changephone/' + this.props.PersonList.PersonData.mobile })}} extra={this.props.PersonList.PersonData.mobile}>更换手机</Item>

                    </List>

                    <List className="my-list ibox">
                        <Item arrow="horizontal" onClick={() => { }} >车辆信息</Item>
                    </List>

                    <List className="my-list ibox">
                        <Item arrow="horizontal" onClick={() => { this.props.history.push({ pathname: '/repassWord/' + this.props.PersonList.PersonData.mobile }) }} >修改密码</Item>
                    </List>

                    <List className="my-list ibox">
                        <Item arrow="horizontal" onClick={() => { }} >退出登录</Item>
                    </List>
                </div>
                <PublicAlert alertStatus={this.state.alertStatus} alertTip={this.state.alertTip} />
            </main>
        );
    }
}

export default connect(state => ({
    PersonList: state.PersonList,
}), {
        getWXpsoninfo,
    })(PersonInfo);
