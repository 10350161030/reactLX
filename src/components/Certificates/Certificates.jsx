import React, { Component } from "react";
import './Certificates.less';
import { is, fromJS } from 'immutable';
import loadingImg from "@/images/register/registerprocess/loading.svg"



export default class Certificates extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }
    render() {
        return (
            <div className="PF_errortoast" id="PF_errortoast_loadingBox" >
                <div className="PF_errortoast_lading">
                    <img src={loadingImg} alt="loading" />
                </div>
                <div className="PF_errortoast_loadingText">{this.props.uqText}</div>
               
            </div >
        )
    }
}


