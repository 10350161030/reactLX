import React, { Component } from 'react';
import { is, fromJS } from 'immutable';
import PublicAlert from '@/components/alert/alert';
import API from '@/api/api';
import './nickName.less';
import { List,InputItem,Button } from 'antd-mobile';
import { Link, NavLink } from 'react-router-dom';


// import Cropper from 'react-cropper';
// import "cropperjs/dist/cropper.css";




class NicknameEdit extends Component {

    
    // static propTypes = {
    //     PersonList: PropTypes.object.isRequired,
    //     getWXpsoninfo: PropTypes.func.isRequired,
    // }
    state = {
        nickName: "",
        alertStatus: false, //弹框状态
        alertTip: "信息提醒",
        submitStatus:false,
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

    nickNameChange = (value) => {
        if(this.props.match.params.name==value){
            this.setState({
                nickName:value,
                submitStatus:false,
            });

            

        }else{
            this.setState({
                nickName:value,
                submitStatus:true,
            });
        }
    }
    submitBtn = async type =>{
        if(!this.state.submitStatus){
            this.props.history.goBack();
        }else{
            try {
                let result = await API.modifyFun({
                    name: this.state.nickName,
                });
                if (result.code === "CD000001") {
                
                    this.props.history.push({ pathname:'/person'});
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
    }


    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }

    componentDidMount() {
      
    }

    render() {
        return (
            <main className="home-container" id="nickname">
                <div className="nincheng">
                    <div className="nincheng_tosat">修改完成后，记得点击按钮保存哦～</div>
                    <div className="weui-cells">
                        <List className="my-list personalinfo_head ">
                            <InputItem placeholder="请输入昵称" onChange={this.nickNameChange}  className="personalinfo_headtext " defaultValue={this.props.match.params.name} arrow="horizontal" >修改昵称</InputItem>
                        </List>
                    </div>
                    <div className="comment_next">
                        <Button type="primary" onClick={this.submitBtn.bind(this)} className={this.state.submitStatus?"next":"next disablebtn"}>{this.state.submitStatus?"完成":"取消"}</Button>
                    </div>
                </div>
                <PublicAlert alertStatus={this.state.alertStatus} alertTip={this.state.alertTip} />
            </main>
        );
    }
}

export default NicknameEdit;
