import React from 'react';
import {Link} from 'react-router';

var MoreHead = React.createClass({
    render: function() {
        {/* <p>最近线索<a href="#">更多线索&gt;</a></p> */}
        var text = this.props.text,
            more = this.props.more,
            moreUrl = this.props.moreUrl;
        return (
            <p>{text}<a data-url={moreUrl}>{more}</a></p>
        )
    }
});
var IconHead = React.createClass({
    render: function() {
        {/* <p><i className="fa fa-search"></i><span>"150333333"</span>搜索结果</p> */}
        var data = this.props.data;
        return (
            <p><i className="fa fa-search"></i><span>{data}</span>搜索结果</p>
        )
    }
});
var TextHead = React.createClass({
    render: function() {
        {/* <p>更多搜索</p> */}
        return (
            <p>更多搜索</p>
        )
    }
});

var ResultItem = React.createClass({

    render: function() {
        var data = this.props.data;
        var baseUrl = this.props.baseUrl;
        var cls = this.props.cls;
        return (
            <li>
                <a data-url={baseUrl+'/'+data.id} data-id={data.id} data-tableName={baseUrl.substring(1)}><i className={"fa pcicon "+ cls}></i>{data.name}</a>
            </li>
        )
    }
});


var LinkmenList = React.createClass({
    render: function() {
        var list = this.props.list;
        var baseUrl = list.moreUrl,
            data = list.data,
            cls = list.cls;

        if(data.length>0){
            var lis = data.map(function(item, key){
                return (
                    <ResultItem key={key} cls={cls} baseUrl={baseUrl} data={item}></ResultItem>
                )
            }.bind(this));
            return (
                <ul>
                    {lis}
                </ul>
            )
        }else{
            return null;
        }
    }
});

var OtherList = React.createClass({
    render: function() {
        var list = this.props.list;
        var baseUrl = list.moreUrl,
            data = list.data,
            cls = list.cls;

        if(data.length>0){
            var lis = data.map(function(item, key){
                return (
                    <ResultItem key={key} cls={cls} baseUrl={baseUrl} data={item}></ResultItem>
                )
            }.bind(this));
            return (
                <li>
                    <MoreHead text={list.title} more={list.more} moreUrl={list.moreUrl}></MoreHead>
                    <ul>
                        {lis}
                    </ul>
                </li>
            )
        }else{
            return null;
        }
    }
});

module.exports ={
    LinkmenList: LinkmenList,
    OtherList: OtherList,//客户、商机、线索
    IconHead:IconHead
};
