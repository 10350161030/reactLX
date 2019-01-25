import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import {is,fromJS} from 'immutable';


import './footer.less';


export default class Publicfooter extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }
    render() {
        return (
            <footer id="publicFooter">
                <NavLink to="/" className="nav"  exact  activeClassName='active'>
                    <div className="navImg">
                    </div>
                    <p >首页</p>
                </NavLink>
                <NavLink to="/balance"  exact  activeClassName='active' className="nav">
                    <div className="navImg">
                    </div>
                    <p>违章查询</p>
                </NavLink>
                <NavLink to="/person"  exact  activeClassName='active' className="nav">
                    <div className="navImg">
                    </div>
                    <p>个人中心</p>
                </NavLink>
            </footer>
        )
    }

}