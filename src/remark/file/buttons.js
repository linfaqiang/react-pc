import React, {
    PropTypes,
    Component
} from 'react'
import {
    render
} from 'react-dom';

import Reflux from 'reflux'
import ReactMixin from 'react-mixin'
import {
    Link,
    hashHistory
} from 'react-router';

import Constants from '../../core/common/constants.js'
import dicts from '../../core/common/dicts.js'
import CONFIG from '../../core/common/config.js'

export default class Buttons extends React.Component {
    constructor(props) {
        super(props);

        var self = this;
        self.state = {};

    }

    componentWillUnmount() {
    }

    render() {
        var self = this;
        let type = self.props.type;
        let typeId = self.props.typeId;

        var style100 = {
            width: "100%"
        };
        var style_form_group = {
            display: "block",
            marginBottom: "15px",
            verticalAlign: "middle"
        };

        return (
            <div style={{marginBottom:8 + 'px'}}>

                <div className="DTTT btn-group" style={{right:0+'px'}}>
                    <a className="btn btn-default DTTT_button_copy"
                       href={`#/remark/file/0?type=${type}&typeId=${typeId}`}>
                        <i className="fa fa-plus"></i>
                        <span>附件 </span>
                    </a>
                </div>
                <div style={{height: 32+"px"}}>
                    <a className="btn btn-default DTTT_button_copy" onClick={()=>{hashHistory.go(-1)}}>
                        <i className="fa fa-mail-reply"></i>
                        <span>返回 </span>
                    </a>
                </div>


            </div>


        )
    }
}