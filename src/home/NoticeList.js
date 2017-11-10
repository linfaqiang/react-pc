import React from 'react';
import ListPager from '../core/components/TableList/ListPager';
import AjaxRequest from '../core/common/ajaxRequest';
import {APIS} from '../core/common/config';
import Tools from '../core/common/tools.js';

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
        }else if(qst.entityType=='CHANCE_QUOTATION'){
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
        
        if(lists.length===0){
            return <div className="no-massage"><div className='crmNoData'>暂无数据</div></div>
        }

        /*var lis = lists.map(function(qst,key){
            return <li key={key} className="messegeListLi" onClick={self.messegeLink.bind(self,qst)}>
                <div className="tx-img">
                    <img src={qst.imageAddress ? qst.imageAddress : APIS.img_path+"/assets/crm/images/default_user.png"} width="55" height="55" alt="" />
                </div>
                <h5 className={qst.isRead==1 ? 'isReadP':''}>{qst.typeText}</h5>
                <span className="time">{qst.remaintime}</span>
                <p className={qst.isRead==1 ? 'isReadP':''}>{qst.content}</p>
            </li>
        }.bind(this));*/
        /*var divs = lists.map(function(item,key){
            return (
                <div key={key} className="databox-top small" onClick={self.messegeLink.bind(self,item)}>
                    <div className="imgbox">
                        <img src={item.imageAddress ? item.imageAddress : APIS.img_path+"/assets/crm/images/default_user.png"} name="headPhoto"/>
                    </div>
                    <div className="infoBox">
                        <p className="databox-header carbon no-margin">{item.typeText}<span>{item.remaintime}</span></p>
                        <p className="databox-text gray no-margin">{item.content}</p>
                    </div>
                </div>
            );
        }.bind(this));

        return (
            <div className="baseList">
                {divs}
            </div>
        )*/
        var lis = lists.map(function(qst,key){
            return <li key={key} className="messegeListLi" onClick={self.messegeLink.bind(self,qst)}>
                <div className={qst.messageType==1?'message-img crm-pp mui-icon-approve':''||qst.messageType==2?'message-img crm-pp mui-icon-task':''||qst.messageType==3?'message-img crm-pp mui-icon-notice':''||qst.messageType==4?'message-img crm-pp mui-icon-workReport':''||qst.messageType==0?'message-img crm-pp mui-icon-business':''}>
                </div>
                <h5 className={qst.isRead==1 ? 'isReadP':'noReadP'}>{qst.typeText}</h5>
                <span className="time">{qst.remaintime}</span>
                <p className={qst.isRead==1 ? 'isReadP':''}>{qst.content}</p>
            </li>
        }.bind(this));

        return (
            <ul className="messegeLists" style={{paddingLeft:'0px'}}>
                {lis}
            </ul>
        )
    }
});
/*
 <ul className="messegeLists row">
 {lis}
 </ul>
* */

module.exports = React.createClass({

    getInitialState:function(){
        return {
            pageData:{
                currentPage:1,
                totalSize:0,
                num:0
            },
            lists:[

            ]
        }
    },

    componentDidMount:function(){

    },
    /*getTime: function(str){
        var now = new Date();
        var result = '';
        if(str){
            str = str.split(/-| |:/);
            var t = new Date(parseInt(str[0]), parseInt(str[1])-1, parseInt(str[2]), parseInt(str[3]), parseInt(str[4]), parseInt(str[5]));
            var n = now.getTime() - t.getTime();
            var s = parseInt(n/1000);//sec
            var hh = parseInt(s/(60*60));
            var min = parseInt((s%(60*60))/60);

            if(hh>0){
                if(hh>24){
                    result = t.Format('yyyy-MM-dd hh:mm');//parseInt(hh/(24))+'天前';
                    return result;
                }else{
                    result += (hh+'小时');
                }
            }
            if(min>0)
                result += (min+'分钟');
            if(hh>0 || min>0)
                result += '前';

            return result;
        }
        return result;
    },*/

    setPagerData:function (src) {    //设置页码信息
        var self=this;
        var list = src.data;

        for(var i=0; i<list.length; i++){
            var remaintime = getRemainTime(list[i].createdOn);
            list[i].remaintime = remaintime;
        }

        self.setState({
            lists:list
        });
    },

    render:function(){
        return (
            <div className="messegeListAll">
                <Content list={this.state.lists} />
            </div>
        )
    }
});