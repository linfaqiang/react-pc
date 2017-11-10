import React from 'react';
import TableView from '../core/components/TableList/TableView.js';
import '../core/components/Select2/select2.min.css';
import CurrentPosition from '../core/components/layout/CurrentPosition';
import TabSelect2 from '../core/components/PublicSelect/TabSelect2.js';
import AjaxRequest from '../core/common/ajaxRequest.js';
import {APIS} from '../core/common/config';
import UserInfo from '../core/common/UserInfo.js';

module.exports = React.createClass({

    getInitialState: function () {
        return {
            isManger: UserInfo.isManager(),
            initParam: {
                "q": "",
                "pageNo": 1,
                "pageSize": 10
            },    //搜索列表参数
            tableData: {     //存放表格数据
                tableName: 'info/news',
                //url:'http://192.168.8.24:8081/crm-web/v1/marketing_infos',
                th: [
                    {
                        name: '主题',
                        width: 260
                    }, {
                        name: '类型',
                        width: 200
                    }, {
                        name: '发布人',
                        width: 200
                    }, {
                        name: '发布时间',
                        width: 200
                    }
                ],
                tr: ['subject', 'type', 'createdName', 'createdOn']
            },
            curentSelect: {
                name: '市场资讯',
                index: 1
            },
            liList: [{
                name: '市场资讯',
                index: 1
            }, {
                name: '市场公告',
                index: 2
            }],
            selectShow: false
        }
    },

    setSelectType: function (index, text) {
        var t = this.state.curentSelect;
        t.name = text;
        t.index = index;
        if(index == 1){
            this.state.tableData.tableName = 'info/news';
        }else if(index == 2){
            this.state.tableData.tableName = 'info/notice';
        }
        this.setState({curentSelect: t});
        this.setState({initParam:{
            "q": '',
            "pageNo": 1,
            "pageSize": 10
        }});

        //这里执行帅选后的回调
        this.getData();
    },

    componentWillMount: function () {
    },
    componentDidMount: function () {
        this.getData()
    },
    getData: function (args) {
        var self = this;
        var param = args || self.state.initParam;
        var curentSelect = self.state.curentSelect;
        var thisUrl = APIS.manage_list + '?pageSize=' + param.pageSize + '&pageNo=' + param.pageNo+'&q='+param.q;

        if(curentSelect.index == 2){
            thisUrl = APIS.notices + '?pageSize=' + param.pageSize + '&pageNo=' + param.pageNo+'&q='+param.q;
            localStorage.setItem('CRM_Info_List_Type', 'notice');
        }else{
            localStorage.setItem('CRM_Info_List_Type', 'info');
        }

        self.refs.info.beginLoad(param.pageNo);
        AjaxRequest.get(thisUrl, null, function (body) {
            self.refs.info.setPagerData(body);
        });

    },

    confirmSelect: function() { //保存后进行查询
        this.setState({selectShow: false});
        var temp = this.state.initParam;

        this.state.initParam.q = this.refs.infoName.value;
        this.state.initParam.pageNo = 1;
        this.state.initParam.pageSize = 10;
        this.setState(this.state.initParam);

        /*this.setState({initParam:{
            "q": this.refs.infoName.value,
            "pageNo": 1,
            "pageSize": 10
        }});*/
        this.getData();
    },
    clearMoreSelect: function() {
        this.refs.infoName.value = '';
        this.setState({initParam:{
            "q": '',
            "pageNo": 1,
            "pageSize": 10
        }});
    },
    selectShowHide: function() {
        this.setState({selectShow: !this.state.selectShow})
    },
    render: function () {
        var self = this;
        var isManger = self.state.isManger;

        function renderNoticeBtn(){
            if(!isManger) return null;
            return (
                <a className="btn btn-default DTTT_button_copy" href="#/info/add/notice/0">
                    <i className="fa fa-plus"></i>
                    <span>发布公告</span>
                </a>
            );
        }
        function renderInfoBtn(){
            if(!isManger) return null;
            return (
                <a className="btn btn-default DTTT_button_copy" href="#/info/add/news/0">
                    <i className="fa fa-plus"></i>
                    <span>发布资讯</span>
                </a>
            );
        }
        return (
            <div>
                <CurrentPosition routes={this.props.routes} params={this.props.params} />
                {/*<div className="page-breadcrumbs">
                    <ul className="breadcrumb">
                        <li>
                            <i className="fa fa-home"></i>
                            <a href="javascript:void(0)">首页</a>
                        </li>
                        <li className="active">市场资讯</li>
                    </ul>
                </div>*/}

                <div className="page-body">
                    <div className="dashboard-box my">
                        <div className="box-tabbs">
                            <div className="tabbable my" >
                                <ul className="nav nav-tabs myTab">
                                    <TabSelect2 liList={this.state.liList}
                                               curentSelect={this.state.curentSelect}
                                               setSelectType={this.setSelectType}/>

                                    <div className="DTTT btn-group">
                                        {renderInfoBtn()}
                                        {renderNoticeBtn()}
                                        <a onClick={this.selectShowHide} className="btn btn-default DTTT_button_collection">
                                            <i className="fa fa-filter"></i>
                                            <span>筛选 <i className="fa fa-angle-down"></i></span>
                                        </a>
                                    </div>

                                    <div style={{display:this.state.selectShow ? 'block' : 'none', width:380+'px',height:400+'px', zIndex:100, position:'absolute',right:1+'px',top:42+'px'}}>
                                        <div className="well with-header" style={{background:'#fff',height:'100%'}}>
                                            <div className="header bordered-blue">
                                                <div className="buttons-preview" style={{textAlign:'right',paddingTop:10+'px'}}>
                                                    <button onClick={this.clearMoreSelect} className="btn btn-cancer">重置</button>
                                                    <button onClick={this.confirmSelect} className="btn btn-danger">确定</button>
                                                </div>
                                            </div>
                                            <div style={{marginTop:30+'px',paddingLeft:10+'px'}}>
                                                <div className="form-group form-li" >
                                                    <label>标题</label><br/>
                                                    <input type="text" ref="infoName" className="form-control" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </ul>

                                <div className="tab-content tabs-flat">
                                    <div id="visits" className="tab-pane animated fadeInUp active">
                                        <TableView ref="info" getData={this.getData} initParam={this.state.initParam} tableData={this.state.tableData}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*<div className="page-body">
                    <div className="widget lists">
                        <div className="widget-body">
                            <div role="grid" id="editabledatatable_wrapper"
                                 className="dataTables_wrapper form-inline no-footer">
                                <div style={{display:this.state.selectShow ? 'block' : 'none', width:380+'px',height:400+'px', zIndex:100, position:'absolute',right:-12+'px',top:34+'px'}}>
                                    <div className="well with-header" style={{background:'#fff',height:'100%'}}>
                                        <div className="header bordered-blue">
                                            <div className="buttons-preview" style={{textAlign:'right',paddingTop:10+'px'}}>
                                                <button onClick={this.clearMoreSelect} className="btn btn-cancer">重置</button>
                                                <button onClick={this.confirmSelect} className="btn btn-danger">确定</button>
                                            </div>
                                        </div>
                                        <form style={{marginTop:30+'px',paddingLeft:10+'px'}}>
                                            <div className="form-group form-li" >
                                                <label>标题</label><br/>
                                                <input type="text" ref="infoName" className="form-control" />
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="DTTT btn-group" style={{right:0+'px'}}>
                                    {renderInfoBtn()}
                                    {renderNoticeBtn()}
                                    <a onClick={this.selectShowHide} className="btn btn-default DTTT_button_collection">
                                        <i className="fa fa-filter"></i>
                                        <span>筛选 <i className="fa fa-angle-down"></i></span>
                                    </a>
                                </div>
                                <div style={{marginBottom:8+'px'}}>
                                    <TabSelect liList={this.state.liList}
                                               curentSelect={this.state.curentSelect}
                                               setSelectType={this.setSelectType}/>
                                    <span className="margin-left-10"></span>
                                </div>
                                <TableView ref="info" getData={this.getData} initParam={this.state.initParam}
                                           tableData={this.state.tableData}/>
                            </div>
                        </div>
                    </div>
                </div>*/}
            </div>
        )
    }
});