import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { is, fromJS } from 'immutable';
import TouchableOpacity from '@/components/TouchableOpacity/TouchableOpacity';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './alert.less';

export default class Alert extends Component {
    //   static propTypes = {
    //     alertTip: PropTypes.string.isRequired,
    //   }
    // css动画组件设置为目标组件
    FirstChild = props => {
        const childrenArray = React.Children.toArray(props.children);
        return childrenArray[0] || null;
    }
    state = {
        alertStatus: false,
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.alertStatus) {
            this.setState({
                alertStatus: true,
            });
        } else {
            this.setState({
                alertStatus: false,
            });
        }

    }


    render() {
        return (
            <div>
                {
                    this.state.alertStatus && <div className="alert_error" ><span>{this.props.alertTip}</span></div>
                }
            </div>
        );
    }
}