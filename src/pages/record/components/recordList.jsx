import React, { Component } from 'react';
import { is, fromJS } from 'immutable';
import API from '@/api/api';
import './recordList.less';
import axios from "axios";
import wx from 'weixin-js-sdk';


class RecordList extends Component {

    state = {
        recordData: [],
    }
    /**
     * 初始化获取数据
     * @param  {string} type 数据类型
     */
    getRecord = async type => {
        try {
            let result = await API.getRecord({ type });
            this.setState({ recordData: result.data || [] })
        } catch (err) {
            console.error(err);
        }
    }

    componentWillReceiveProps(nextProps) {
        // 判断类型是否重复
        let currenType = this.props.location.pathname.split('/')[2];
        let type = nextProps.location.pathname.split('/')[2];
        if (currenType !== type) {
            this.getRecord(type);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }
    //此处引入微信jssdk，已经试过网上说的es6的npm包，不行
 
    componentWillMount() {
        let type = this.props.location.pathname.split('/')[2];
        this.getRecord(type);


    }

    componentDidMount() {
        // let u = window.navigator.userAgent;
        //     let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        // let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        //安卓需要使用当前URL进行微信API注册（即当场调用location.href.split('#')[0]）
        //iOS需要使用进入页面的初始URL进行注册，（即在任何pushstate发生前，调用location.href.split('#')[0]）
        // let url = '';
        // if (isiOS) {
        //     url = encodeURIComponent(`http://www.qq.com/home/index?op=${window.sessionStorage.getItem('option')}`);//获取初始化的url相关参数
        // } else {
            // alert(window.location.href);
            let  url = encodeURIComponent(window.location.href.split('#')[0]);
        // }

        // let time = Math.round(new Date().getTime() / 1000); //获取10位时间戳
        // alert(url);
        axios({
            url:`http://test.cardoor.cn/base/sharedAddSig`,
            data:JSON.stringify({
                url:url,
            }),
            method:"post",
            headers:{'Content-type':'application/json',},
        } ).then(function (response) {
            if (response.data.code === "CD000001") {

                        const linkUrl=encodeURIComponent(window.location.href.split('#')[0]);
                        // alert(linkUrl);
                        // console.warn(response.data);
                        // console.log(`上面一个测试数据`);
                        // alert(response.data.body.appId);
                        // alert(response.data.body.timestamp);
                        // alert(response.data.body.nonceStr);
                        // alert(response.data.body.signature);
                        /*配置微信jssdk*/
                        wx.config({
                            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                            appId: response.data.body.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
                            timestamp: response.data.body.timestamp, // 必填，生成签名的时间戳（10位）
                            nonceStr: response.data.body.nonceStr, // 必填，生成签名的随机串,注意大小写
                            signature: response.data.body.signature,// 必填，签名，见附录1（通过https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=jsapisign 验证）
                            jsApiList: [
                                'getLocation',
                                'onMenuShareTimeline',
                                'onMenuShareAppMessage',
                                'hideMenuItems',
                            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                        });
                        wx.ready(function(){
                            alert("finish_ready");
                                // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                                wx.onMenuShareAppMessage({
                                    title: '我来接你了', // 分享标题
                                    desc: '点击这里告诉我你的位置，方便我快速找到你', // 分享描述
                                    link: linkUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                                    imgUrl: 'http://wechat.dofun.cc/static/images/sharemeet.jpg', // 分享图标
                                    type: 'link', // 分享类型,music、video或link，不填默认为link
                                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                                    success: function () { 
                                        // 用户确认分享后执行的回调函数
                                        alert("已分享");
                                        // location.href="http://wechat.dofun.cc/base/userInfoAuth";
                                    },
                                    cancel: function () { 
                                        // 用户取消分享后执行的回调函数
                                        alert("取消分享");	
                                    }
                                });
                                wx.hideMenuItems({
                                    menuList: [
                                    'menuItem:share:timeline',
                                    'menuItem:share:qq',
                                    'menuItem:share:weiboApp',
                                    'menuItem:share:facebook',
                                    'menuItem:share:QZone',
                                    'menuItem:editTag',
                                    'menuItem:delete',
                                    'menuItem:copyUrl',
                                    'menuItem:originPage',
                                    'menuItem:openWithQQBrowser',
                                    'menuItem:openWithSafari',
                                    'menuItem:share:email'
                                    ] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                                });
                        });

            }
        }).catch(function (errors) {
            console.log('errors', errors);
        })
    }



    render() {
        return (
            <div>
                <ul className="record-list-con">
                    {
                        this.state.recordData.map((item, index) => {
                            return <li className="record-item" key={index}>
                                <section className="record-item-header">
                                    <span>创建时间：{item.created_at}</span>
                                    <span>{item.type_name}</span>
                                </section>
                                <section className="record-item-content">
                                    <p><span>用户名：</span>{item.customers_name} &emsp; {item.customers_phone}</p>
                                    <p><span>商&emsp;品：</span>{item.product[0].product_name}</p>
                                    <p><span>金&emsp;额：</span>{item.sales_money} &emsp; 佣金：{item.commission}</p>
                                </section>
                                <p className="record-item-footer">等待管理员审核，审核通过后，佣金将结算至账户</p>
                            </li>
                        })
                    }
                </ul>
            </div>
        );
    }

}

export default RecordList;



/* export default class AppMain extends React.Component {

    constructor(props) {
      super(props);
    }
   //此处引入微信jssdk，已经试过网上说的es6的npm包，不行
    componentWillMount() {
       (function(d, s, id){
           var js, fjs = d.getElementsByTagName(s)[0];
           if (d.getElementById(id)) {return;}
           js = d.createElement(s); js.id = id;
           js.src = '//res2.wx.qq.com/open/js/jweixin-1.4.0.js';
           fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'wechat-jssdk'));
    }
  
    componentDidMount () {
        //初始化微信配置
        let weChatState = {
            debug: true,
            appId: null,
            timestamp: null,
            nonceStr: null,
            signature: null,
            jsApiList: ['chooseImage', 'uploadImage', 'getLocation']
        }
        let siteUrl = location.href.split('#')[0] // 我网页的地址
        apiFetch.get('/v1/service/wechat/jssdk',{
            params: {
            url: siteUrl
            }
        }).then((res) => {
            //res.data 里面有nonceStr,timestamp,appId,signature
            Object.assign(weChatState, res.data)
            wx.config(weChatState)
            wx.ready(() => {
            wx.checkJsApi({
                jsApiList: ['chooseImage', 'uploadImage', 'getLocation'],
                success: (res) => {
                console.log('upload/UploadContainer/wx/checkApiPass/wx.ready.res')
                console.log(JSON.stringify(res))
                },
                fail: (err) => {
                console.error('upload/UploadContainer/wx/checkApiError/wx.ready.err')
                console.error(JSON.stringify(err))
                }
            })
            });
            wx.error((err) => {
            console.error('upload/UploadContainer/wx/wxError')
            console.error(JSON.stringify(err))
            });
        }).catch((err) => {
            console.error('catch err')
            console.error(err)
        });
    }
    render() {
      return (
        <div>
        </div>
      )
    }
} */

// export function jsSdkConfig(axios, host) {
//     let u = window.navigator.userAgent;
//     let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
//     let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
//     //安卓需要使用当前URL进行微信API注册（即当场调用location.href.split('#')[0]）
//     //iOS需要使用进入页面的初始URL进行注册，（即在任何pushstate发生前，调用location.href.split('#')[0]）
//     let url = '';
//     if (isiOS) {
//         url = encodeURIComponent(`http://www.qq.com/home/index?op=${window.sessionStorage.getItem('option')}`);//获取初始化的url相关参数
//     } else {
//         url = encodeURIComponent(window.location.href.split('#')[0]);
//     }

//     let time = Math.round(new Date().getTime() / 1000); //获取10位时间戳
//     // alert(window.location.href.split('#')[0]);
//     axios.get(`${host}/wechat/getJsSDKConfig?timestamp=${time}&nonceStr=nonceStr&url=${url}`).then(function (response) {
//         if (response.data.state === 0) {
//             /*配置微信jssdk*/
//             window.wx.config({
//                 debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//                 appId: response.data.data.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
//                 timestamp: response.data.data.timestamp, // 必填，生成签名的时间戳（10位）
//                 nonceStr: response.data.data.nonceStr, // 必填，生成签名的随机串,注意大小写
//                 signature: response.data.data.signature,// 必填，签名，见附录1（通过https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=jsapisign 验证）
//                 jsApiList: [
//                     'getLocation',
//                     'onMenuShareTimeline',
//                     'onMenuShareAppMessage'
//                 ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
//             });
//         }
//     }).catch(function (errors) {
//         console.log('errors', errors);
//     })
// }
