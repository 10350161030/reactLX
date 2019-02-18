import React, { Component } from 'react';
import PropTypes from 'prop-types';
import QueueAnim from 'rc-queue-anim';

export default class TipCompent extends Component {
    state = {
        tipState: true,
    }
    componentDidMount() {
        const that = this;
        if (that.timer) {
            clearTimeout(that.timer);
        }
        that.timer = setTimeout(() => {
            that.setState({
                tipState: false,
            });
        }, 5000);
    }
    render() {
        return (
            <QueueAnim className="demo-content"
                animConfig={[
                    { opacity: [1, 0], height: [30, 0] },
                ]}>
                {this.state.tipState ? [
                    <div className="tip" key="a">用车过程中保持网络连接，才能获取准确的位置</div>
                ] : null}
            </QueueAnim>
        )
    }
}
