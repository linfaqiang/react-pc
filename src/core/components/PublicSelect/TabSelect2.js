import React from 'react';


module.exports = React.createClass({

    getInitialState:function(){
        return {

        }
    },

    changeSelect:function (index,text,event) {   //帅选客户类型

        event.preventDefault();
        this.props.setSelectType(index,text);

    },

    render:function () {
        var lists = this.props.liList;
        if( !Array.isArray(lists) ) throw new Error('this.props.lists必须是数组');

        var self = this;

        var Lis = lists.map(function(qst,key){
            return <li key={key} onClick={self.changeSelect.bind(self,qst.index,qst.name)}><a href="javascript:void(0);">{qst.name}</a></li>
        }.bind(this) );
        
        return (
            <li className="dropdown active">
                <a data-toggle="dropdown" className="dropdown-toggle">
                    {this.props.curentSelect.name}<b className="caret"></b>
                </a>
                <ul className="dropdown-menu dropdown-blue listType">
                    {Lis}
                </ul>
            </li>
        );

        /*return (
            <div className="btn-group">
                <a className="btn btn-default " href="javascript:void(0);">{this.props.curentSelect.name}</a>
                <a className="btn btn-default  dropdown-toggle" data-toggle="dropdown" href="javascript:void(0);"><i className="fa fa-angle-down"></i></a>
                <ul className="dropdown-menu dropdown-inverse">
                    {Lis}
                </ul>
            </div>
        )*/
    }
});