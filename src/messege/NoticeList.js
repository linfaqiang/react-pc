import React from 'react';
import ListPager from '../core/components/TableList/ListPager';
import AjaxRequest from '../core/common/ajaxRequest';
import {APIS} from '../core/common/config';
import Tools from '../core/common/tools.js';
import {Pagination, Select} from 'antd';

var Content = React.createClass({

    getInitialState:function(){
        return {
            
        }
    },

    componentDidMount:function(){
    },
    componentDidUpdate:function(){
        if(this.props.list && this.props.list.length > 0){
            Tools.imgLoadError();
        }
    },
    contextTypes: {
        router: React.PropTypes.object
    },
    messegeLink: function (qst) {
        console.log(qst.id+'~~~~~~'+qst.entityType);
        var self=this;
        if(qst.isRead==0){
        self.isReadFn(qst.id);
        }
        if(qst.entityType=='MY_REPORT'){
        self.context.router.push({
            pathname: '/working',
            query: {
                messegeId: qst.entityId
            }
        });
        }else if(qst.entityType=='SALE_TASK'){
            self.context.router.push({
                pathname: '/task',
                query: {
                    messegeId: qst.entityId
                }
            });
        }else if(qst.entityType=='QUOTATION_APPROVAL'){
            self.context.router.push({
                pathname: '/price/'+qst.entityId
            });
        }else if(qst.entityType=='Notice'){
            var qsts=JSON.stringify(qst);
            self.context.router.push({
                pathname: '/messege/'+qst.entityId,
                query: {
                    messageAll: qsts
                }
            });
        }else{
            var qsts=JSON.stringify(qst);
            self.context.router.push({
                pathname: '/messege/'+qst.entityId,
                query: {
                    messageAll: qsts
                }
            });
        }
    },
    isReadFn: function (id) {
        var self=this;
        AjaxRequest.put(APIS.message_list + "/" + id, null, function(data){
            if (data && data.code == 200) {
               console.log('消息变成已读');
            } else {
                alert('设置为已读失败！');
            }
            })
    },
    render:function(){
        var self=this;
        var lists = self.props.list;

        if( !Array.isArray(lists) ) throw new Error('this.props.lists必须是数组');


        var lis = lists.map(function(qst,key){
            return <li key={key} className="messegeListLi" onClick={self.messegeLink.bind(self,qst)}>
                    <div className={qst.messageType==1?'message-img crm-pp mui-icon-approve':''||qst.messageType==2?'message-img crm-pp mui-icon-task':''||qst.messageType==3?'message-img crm-pp mui-icon-notice':''||qst.messageType==4?'message-img crm-pp mui-icon-workReport':''||qst.messageType==0?'message-img crm-pp mui-icon-business':''}>
                    </div>
                    <h5 className={qst.isRead==1 ? 'isReadP':'noReadP'}>{qst.typeText}</h5>
                {/*<span className="time">{qst.updatedOn}</span>*/}
                <span className="time">{qst.remaintime}</span>
                <p className={qst.isRead==1 ? 'isReadP':''}>{qst.content}</p>
                </li>
        }.bind(this));

        return (
            <ul className="messegeLists row">
                {lis}
            </ul>
        )
    }
});

module.exports = React.createClass({

    getInitialState:function(){
        return {
            /*pageData:{
                currentPage:1,
                totalSize:0,
                num:0
            },
            lists:[

            ]*/

            pageData: {
                pageNo: 1,
                totalSize: 0,
                pageSize: 10
            },
            dataList: [],
            curPage: 1,
            showLoding: false,
            hideNoData: true
        }
    },

    componentDidMount:function(){

    },

    setPagerData:function (data) {    //设置页码信息
        /*var self=this;
        var totalSize = list.totalSize,
            pageSize = self.props.trackData.pageSize,
            num =  (totalSize % pageSize == 0) ? totalSize/pageSize : parseInt(totalSize/pageSize)+1;

        self.setState({
            lists:list.data,
            pageData:{
                currentPage:self.state.pageData.currentPage,
                totalSize:list.totalSize,
                num:num
            }
        })*/
        var self = this;
        var param = self.state.pageData;

        param.pageNo = data.pageNo || self.state.curPage || 1;
        param.totalSize = data.totalSize || 0;
        param.pageSize = data.pageSize || self.props.trackData.pageSize || 10;

        self.setState({pageData:param});

        self.finishLoad(data);
    },


    /*setCurrentPage:function (num) {
        var self=this;
        self.state.pageData.currentPage = num;

        self.setState(self.state.pageData);
    },*/

    /*goPage:function (num,cb) {
        var self=this;
        var param = {
            pageSize:self.props.trackData.pageSize,
            today:self.props.trackData.today,
            isDesktop:self.props.trackData.isDesktop,
            pageNo:num
        };

        if(typeof cb == 'function'){
            cb();
        }else{
            self.setCurrentPage(num);
        }

        self.props.getData(param);


    },*/
    PageChange:function(page){
        var self = this;
        var param = self.props.trackData;
        param.pageNo = page;
        self.props.getData(param);
    },

    beginLoad: function(page){
        var self = this;
        self.setState({showLoding: true});
        self.setState({curPage: page||1});
        $('#shCircleLoader').shCircleLoader();
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

    /*prePage:function (num) {
        var self = this;
        if(num-1 < 1){
            return;
        }

        self.goPage(num-1,function () {
            self.setCurrentPage(num-1);
        })
    },

    nextPage:function (num) {
        var self = this;
        if(num+1 > self.state.pageData.num){
            return;
        }

        self.goPage(num+1,function () {
            self.setCurrentPage(num+1);
        })
    },*/

    render:function(){
        return (
            <div style={{paddingBottom: '40px', minHeight:'400px'}}>
                <Content list={this.state.dataList} />
                {/*<div className="messegeTotalSize">共<span>{this.props.messegeList.totalSize}</span>个通知</div>
                <ListPager pageData={this.state.pageData}
                           num={this.state.pageData.num}
                           pagesize={this.props.trackData.pageSize}
                           prePage={this.prePage}
                           goPage={this.goPage}
                           nextPage={this.nextPage}
                />*/}
                <br />
                <div className={this.state.hideNoData ? "no-massage hide" : "no-massage"} style={{top: '45%'}}><div className='crmNoData'>暂无数据</div></div>
                <div className="shCircleLoaderBox" onClick={this.stopEvent}  style={{display:(this.state.showLoding ? 'block' : 'none')}}>
                    <div id="shCircleLoader" className="shCircleLoader"></div>
                </div>
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