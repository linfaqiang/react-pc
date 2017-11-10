import React from 'react';
import {APIS} from '../core/common/config';
import AjaxRequest from '../core/common/ajaxRequest.js';

var ClueItem = React.createClass({
    render: function(){
        var data = this.props.data;
        return (
            <div className="prcPrice">
                <p><a href={'#/clue/'+data.id}>{data.needs}</a></p>
                <p className="silver">责任人：{data.ownerStaffName} <span>{data.statusName}</span></p>
                <p className="silver desc">最后跟进时间：{data.lastOperatedOn}</p>
            </div>
        );
    }
});

module.exports = React.createClass({
    render: function () {
        var divs,
            lists = this.props.lists;
            //cls= this.state.priceItemState;
        divs = lists.map(function(item, key){
            return (
                <ClueItem key={key} data={item}></ClueItem>
            )
        }.bind(this));
        return (
            <div className="baseList row otherRow">
                {divs}
            </div>
        )
    }
});