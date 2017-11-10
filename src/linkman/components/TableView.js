import React from 'react';
import {Pagination, Select} from 'antd';
import ListTable from '../../core/components/TableList/ListTable.js';


module.exports = React.createClass({

    getInitialState: function() {
        return {
            pageData: {
                pageNo: 1,
                totalSize: 0,
                pageSize: 10
            },
            dataList: [],
            curPage: 1,
            showLoding: false,
            hideNoData: true/*,
            hasInit: false*/
        }
    },
    changeCurrentTr: function(id) {
        var datas = this.state.lists;
        for (var i = 0, len = datas.length; i < len; i++) {
            if (id == datas[i].id) {
                datas[i].selected = true;
            } else {
                datas[i].selected = false;
            }

        }
    },

    componentDidMount: function() {
        //this.setPagerData();
    },
    /*setPagerData:function(data){
        var self = this;

        var bar = $('#pageToolbar');
        var pageSize = (data && data.pageSize) ? data.pageSize : 10;
        var totalSize = (data && data.totalSize) ? data.totalSize : 0;
        //bar.html('');
        if(self.state.curPage == 1){
            bar.Paging({pagesize:pageSize,count:totalSize,toolbar:true, callback:function(page){
                //self.setState({curPage: page});
                if(self.props.initParam){
                    var param = self.props.initParam;
                    param.pageNo = page;
                    self.getData(param);
                }else{
                    self.getData({pageNo:page});
                }
            }});
        }

        self.finishLoad(data);
    },*/
    setPagerData:function(data){
        var self = this;
        var param = self.state.pageData;

        param.pageNo = data.pageNo || self.state.curPage || 1;
        param.totalSize = data.totalSize || 0;
        param.pageSize = data.pageSize || self.props.initParam.pageSize || 10;

        self.setState({pageData:param});

        self.finishLoad(data);
    },
    PageChange:function(page){
        var self = this;
        if(self.props.initParam){
            var param = self.props.initParam;
            param.pageNo = page;
            self.getData(param);
        }else{
            self.getData({pageNo:page});
        }
    },
    getData: function(args){
        this.props.getData(args);
    },
    resetTableView: function(){
        //this.setState({hasInit: false});
        this.setState({hideNoData: true});
        this.setState({dataList: []});
        this.setPageTool();
    },
    beginLoad: function(page){
        var self = this;
        self.setState({showLoding: true});
        self.setState({curPage: page||1});
        $('#shCircleLoader').shCircleLoader({
            color: 'red',
            dots: 24,
            dotsRadius: 13,
            keyframes: '0%   {background: red;    {prefix}transform: scale(1)}\
				20%  {background: orange; {prefix}transform: scale(.4)}\
				40%  {background: red;    {prefix}transform: scale(0)}\
				50%  {background: red;    {prefix}transform: scale(1)}\
				70%  {background: orange; {prefix}transform: scale(.4)}\
				90%  {background: red;    {prefix}transform: scale(0)}\
				100% {background: red;    {prefix}transform: scale(1)}'
        });
    },
    finishLoad: function(data){
        var self = this;
        $('#shCircleLoader').shCircleLoader('destroy');
        self.setState({showLoding: false});

        if(!data){//没有调接口
            self.setState({dataList: []});
            self.setState({hideNoData: true});
        }else{//调了接口
            if(data.data && data.data.length>0){
                self.setState({dataList: data.data});
                self.setState({hideNoData: true});
            }else{
                self.setState({dataList: []});
                self.setState({hideNoData: false});
            }
        }
    },
    stopEvent:function (e) {
        e.preventDefault();
        e.stopPropagation();
    },
    //noDate={this.state.hideNoData ? 0 : 1}
    render: function() {
        return (
            <div style={{overflow:'hidden', position:'relative', minHeight:'634px'}}>
                <ListTable lists={this.state.dataList}
                           clickBack={this.props.clickBack}
                           allClick={this.props.allClick}
                           changeCurrentTr={this.changeCurrentTr}
                           tableData={this.props.tableData}
                           deleteClick={this.props.deleteClick}
                />
                <br />
                <div className={this.state.hideNoData ? "no-massage hide" : "no-massage"} style={{top: '45%'}}><div className='crmNoData'>暂无数据</div></div>
                <div className="shCircleLoaderBox" onClick={this.stopEvent}  style={{display:(this.state.showLoding ? 'block' : 'none')}}>
                    <div id="shCircleLoader" className="shCircleLoader"></div>
                </div>
                {/*<div id="pageToolbar" style={{position:'absolute', right:'0px', bottom:'10px'}}></div>*/}
                <div style={{position:'absolute', right:'0px', bottom:'10px'}}>
                    <Pagination
                        selectComponentClass={Select}
                        total={this.state.pageData.totalSize}
                        showTotal={total => `共 ${total} 条记录`}
                        pageSize={this.state.pageData.pageSize}
                        defaultCurrent={this.state.pageData.pageNo}
                        current={this.state.pageData.pageNo}
                        onChange={this.PageChange}
                        showQuickJumper
                    />
                </div>
            </div>
        )
    }
});