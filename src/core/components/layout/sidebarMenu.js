import React from 'react';
import {hashHistory} from 'react-router';
import AjaxRequest from '../../common/ajaxRequest';
import {APIS} from '../../common/config';
module.exports = React.createClass({

    getInitialState:function(){
        return {
            allList: {
                '首页': {
                    name: '首页',
                    active: false,
                    icon: 'glyphicon glyphicon-home',
                    href:'#/'

                },
                '线索': {
                    name: '线索',
                    active: false,
                    icon: 'fa fa-exchange',
                    href:'#/clue'


                },
                '客户': {
                    name: '客户',
                    active: false,
                    icon: 'fa fa-th',
                    href:'#/customer'

                },
                '商机': {
                    name: '商机',
                    active: false,
                    icon: 'fa fa-bomb',
                    href:'#/chance'

                },
                '联系人': {
                    name: '联系人',
                    active: false,
                    icon: 'fa fa-envelope-o',
                    href:'#/linkman'

                },
                '活动': {
                    name: '活动',
                    active: false,
                    icon: 'fa  fa-legal',
                    href:'#/activity'

                },
                '任务': {
                    name: '任务',
                    active: false,
                    icon: 'fa fa-tasks',
                    href:'#/task'

                },
                '工作报告': {
                    name: '工作报告',
                    active: false,
                    icon: 'fa fa-picture-o',
                    href:'#/working'

                },
                '销售计划': {
                    name: '销售计划',
                    active: false,
                    icon: 'fa fa-desktop',
                    href:'#/salesplan'

                },
                '报价': {
                    name: '报价',
                    active: false,
                    icon: 'fa fa-pencil-square-o',
                    href:'#/price'

                },
                '竞争对手': {
                    name: '竞争对手',
                    active: false,
                    icon: 'fa fa-calendar',
                    href:'#/competitor'

                },
                '市场活动': {
                    name: '市场活动',
                    active: false,
                    icon: 'glyphicon glyphicon-paperclip',
                    href:'#/marketing'

                },
                '产品': {
                    name: '产品',
                    active: false,
                    icon: 'glyphicon glyphicon-link',
                    href:'#/product'

                },
                '文档': {
                    name: '文档',
                    active: false,
                    icon: 'fa fa-align-right',
                    href:'#/document'

                },
                '信息发布': {
                    name: '信息发布',
                    active: false,
                    icon: 'fa fa-hand-o-right',
                    href:'#/info'

                },
                '个人设置': {
                    name: '个人设置',
                    active: false,
                    icon: 'fa fa-hospital-o',
                    href:'#/setting'

                },
                '报表': {
                    name: '报表',
                    active: false,
                    icon: 'fa  fa-bar-chart-o',
                    href:'#/report'

                }
            },
            menuList:[],
            hrefChange: false
        }
    },
    componentDidMount:function(){
        var self = this;
        AjaxRequest.get(APIS.menuList, '', function(data){
            if(data.code="200"){
                var newList = data.data;
                newList.unshift({
                    name: '首页',
                    code: '',
                    icon: 'glyphicon glyphicon-home',
                    href:'#/'
                });
                
                self.setState({
                    menuList:newList
                })

            }else{
                console.log('请求失败!')
            }
        });

        hashHistory.listen(function(){
            self.setState({hrefChange: true});
        });
    },
    clickActive:function(url, e){
        e.target.blur();
        $('#sidebar ul li').removeClass('active');
        hashHistory.push(url.substring(1));
        this.setState({hrefChange: false});
    },
    render() {
        var lists = this.state.menuList;
        var pathname = this.props.pathname;
        var curpathname = pathname.substring(1).split('/')[0];

        var lis = lists.map(function(qst,key){
            var cls = "";
            var exculde = CONFIG.Exclude;
            for(var o in exculde){
                if(qst.href.match(exculde[o])){
                    return null;
                }
            }
            if(curpathname.length==0 && key==0){
                cls = "active";
            }else if( (curpathname.length > 0) && (qst.href.match(curpathname)) ){
                cls = "active";
            }else{
                cls = "";
            }
            return <li key={key} className={cls} onClick={this.clickActive.bind(this, qst.href)}>
                        <a href={"javascript:void(0);"||qst.href}>
                            <i className={"menu-icon " + qst.icon }></i>
                            <span className="menu-text">{qst.name}</span>
                        </a>
                    </li>
        }.bind(this) );

        return (
            <div className="page-sidebar" id="sidebar">
                <ul className="nav sidebar-menu">
                    {lis}
                </ul>
            </div>
        )
  }
});



