import React, { Component } from 'react';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import asyncComponent from '../utils/asyncComponent';

import home from "@/pages/home/home";
import { PrivateRoute } from "./authorize"; //需要登录的路
const login = asyncComponent(() => import("@/pages/login/login"));
const repassword = asyncComponent(() => import("@/pages/repassWord/repassWord"));
const changephone = asyncComponent(() => import("@/pages/changephone/changephone"));
const register = asyncComponent(() => import("@/pages/register/register"));
const personinfo = asyncComponent(() => import("@/pages/personinfo/personinfo"));
const person = asyncComponent(() => import("@/pages/person/person"));
const personid = asyncComponent(() => import("@/pages/register/personid/personid"));
const personiddetail = asyncComponent(() => import("@/pages/register/personid_detail/personid_detail"));

const carinfo = asyncComponent(() => import("@/pages/register/carinfo/carinfo"));
const carinfodetail = asyncComponent(() => import("@/pages/register/carinfodetail/carinfodetail"));

const nicknameedit = asyncComponent(() => import("@/pages/personinfo/component/NicknameEdit"));
const history = asyncComponent(() => import("@/pages/history/history"));
const flow_detail = asyncComponent(() => import("@/pages/flow/flow_detail/flow_detail"));
const flow_package = asyncComponent(() => import("@/pages/flow/flow_package/flow_package"));
const Planningtrip = asyncComponent(() => import("@/pages/Planningtrip/Planningtrip"));




// react-router4 不再推荐将所有路由规则放在同一个地方集中式路由，子路由应该由父组件动态配置，组件在哪里匹配就在哪里渲染，更加灵活
export default class RouteConfig extends Component{
  render(){
    return(
      <HashRouter>
        <Switch>
          <PrivateRoute path="/"  exact  component={home} />
          <PrivateRoute path="/login" component={login} />
          <PrivateRoute path="/repassword" component={repassword} />
          <PrivateRoute isLoginSW={true} path="/changephone/:name" component={changephone} />
          <PrivateRoute path="/register" component={register} />
          <PrivateRoute isLoginSW={true} path="/personinfo" component={personinfo} />
          <PrivateRoute isLoginSW={true} path="/nicknameedit/:name" component={nicknameedit} />
          <PrivateRoute path="/person" component={person} />
          <PrivateRoute isLoginSW={true} path="/personid" component={personid} />
          <PrivateRoute isLoginSW={true} path="/carinfo" component={carinfo} />
          <PrivateRoute isLoginSW={true} path="/history" component={history} />
          <PrivateRoute isLoginSW={true} path="/flowdetail" component={flow_detail} />
          <PrivateRoute isLoginSW={true} path="/flowpackage" component={flow_package} />
          <PrivateRoute isLoginSW={true} path="/Planningtrip" component={Planningtrip} />
          <PrivateRoute isLoginSW={true} path="/carinfodetail" component={carinfodetail} />
          <PrivateRoute isLoginSW={true} path="/personiddetail" component={personiddetail} />


          {/* <Route path="/"  exact  component={home} />
          <Route path="/login" component={login} />
          <Route path="/repassword" component={repassword} />
          <Route path="/changephone/:name" component={changephone} />
          <Route path="/register" component={register} />
          <Route path="/personinfo" component={personinfo} />
          <Route path="/nicknameedit/:name" component={nicknameedit} />
          <Route path="/person" component={person} />
          <Route path="/personid" component={personid} />
          <Route path="/carinfo" component={carinfo} />
          <Route path="/history" component={history} />
          <Route path="/flowdetail" component={flow_detail} />
          <Route path="/flowpackage" component={flow_package} />
          <Route path="/Planningtrip" component={Planningtrip} />
          <Route path="/carinfodetail" component={carinfodetail} />
          <Route path="/personiddetail" component={personiddetail} /> */}

          <Redirect to="/" />
        </Switch>
      </HashRouter>
    )
  }
}
