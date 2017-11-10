import React, {Component} from 'react';
import {Link, hashHistory} from 'react-router';
import AjaxRequest from '../core/common/ajaxRequest';
import DetailTable from '../core/components/DetailTable/List';
import DetailList from '../core/components/DetailList/List';

import DataList from './components/DataList';
import AllData from './components/AllData';
import AddItem from './components/AddItem';
import ChanceList from './components/ChanceList';
import TrackList from './components/TrackList';
import NoteAdd from '../core/components/NoteList/Add';
import FileAdd from '../core/components/FileList/Add';
import {APIS} from '../core/common/config';
import CurrentPosition from '../core/components/layout/CurrentPosition';

module.exports = React.createClass({

    getInitialState: function () {
        return {
            name:"",
            routeId: this.props.params.linkmanId,
            showEditBtn: true,
            customerId:0,
            isViewAllRemark: false,//默认不显示全部备忘列表数据
            isViewAllAppendix: false,//默认不显示全部附件列表数据
            firstList: [
                {
                    name: '部门',
                    value: '',
                    filed: 'department',
                    iconClass: 'yellow pcicon-salesdest'
                }, {
                    name: '职位',
                    value: '',
                    filed: 'title',
                    iconClass: 'blue pcicon-contacts'
                }, {
                    name: '联系方式',
                    value: '',
                    filed: 'mobile',
                    iconClass: 'green'
                }, {
                    name: '客户',
                    value: '',
                    filed: 'customerName',
                    iconClass: 'red pcicon pcicon-customer'
                }
            ],
            detailList: [
                {
                    name: '座机',
                    field:'telephone',
                    value: ''
                },
                {
                    name: '地址',
                    field:'address',
                    value: ''
                },
                {
                    name: '生日',
                    field:'birthday',
                    value: ''
                },
                {
                    name: 'QQ',
                    field:'qq',
                    value: ''
                },
                {
                    name: '微信',
                    field:'wechat',
                    value: ''
                },
                {
                    name: 'E-Mail',
                    field:'email',
                    value: ''
                }

            ],
            taskList: [],
            memoList: [],
            appendixList:[],
            taskDailogId:"taskModal",
            memoDailogId:"memoModal",
            appendixDailogId:"appendixModal",
            chanceData: { //商机列表
                pageNo: 1,
                pageSize: 5,
                chanceLength:0
            },
            taskData: { //任务列表
                pageNo: 1,
                pageSize: 5,
                chanceLength:0
            },
            trackData: { //跟踪记录列表
                pageNo: 1,
                pageSize: 5,
                totalSize:0
            },
        }

    },

    componentWillUnmount: function () {
        $(document).off('linkmanDetailIdChange');
    },

    componentDidMount: function () {
        var self = this;
        $(document).on('linkmanDetailIdChange', function(e, detailId){
            self.state.routeId = detailId;
            self.getDetailData();
        });
        self.getDetailData();
    },
    getDetailData: function(){
        this.getData();  //联系人详细数据
        this.getTrackList(this.state.trackData);//跟进记录
    },

    setDetailData:function (data) {    //设置详情
        var list = this.state.detailList;

        for(var i=0,len=list.length; i<len; i++){
            var field = list[i].field;
            list[i].value = data[field] || '------';
        }
        this.state.detailList = list;
        this.setState(this.state.detailList)
    },
    
    setFirstList: function (data) {      //设置首行列表
        var list = this.state.firstList;
        for (var i = 0, len = list.length; i < len; i++) {
            var field = list[i].filed;
            if (typeof data[field] === 'number') {
                list[i].value = data[field]
            }
            if (typeof data[field] === 'string') {
                list[i].value = data[field] || "暂无";
            }
        }
        this.state.firstList = list;
        this.setState(this.state.firstList);//更新状态firstList
    },

    getData: function () {
        var self = this,
            thisUrl = APIS.contact_list +'/'+ this.state.routeId;
        AjaxRequest.get(thisUrl, '', function (res) {
            if (res.code = "200") {
                //self.state.apidata = data.data;     //设置详情数据
                self.setFirstList(res.data);       //修改状态firstList
                self.setDetailData(res.data);    //设置详情

                self.setState({customerId:res.data.customerId});
                self.setState({name:res.data.name});
            } else {
                console.log('请求失败!')
            }
        });
    },

    getChanceEven:function () {
        this.getChances({   //商机
            pageNo:this.state.chanceData.pageNo,
            pageSize:this.state.chanceData.pageSize
        })
    },
    //商机
    getChances:function (param) {
        var self = this,
            thisUrl = APIS.contact_chance.replace('{id}', this.state.routeId).replace('{pageSize}', param.pageSize).replace('{pageNo}', param.pageNo);

        AjaxRequest.get(thisUrl, '', function (res) {
            if (res.code = "200") {
                //console.log("debug --->");
                self.refs.changeList.setPagerData(res);

                self.state.chanceData.chanceLength = res.data.length;
                self.setState(self.state.chanceData);
            } else {
                console.log('请求失败!')
            }
        });
    },

    getTrackList:function (obj) {
        var self = this,
            thisUrl = APIS.contact_track.replace('{id}', this.state.routeId).replace('{pageSize}', obj.pageSize).replace('{pageNo}', obj.pageNo);

        AjaxRequest.get(thisUrl, '', function (res) {
            if (res.code = "200") {
                self.refs.trackList.setPagerData(res);
                window.scroll(0, 0);
                if(res.data.length > 0){
                    self.refs.trackList.setNoData(true, res.totalSize);
                }else{

                    self.refs.trackList.setNoData(false, 0);
                }
            } else {
                console.log('请求失败!')
            }
        });
    },

    getOtherMsg:function () {
        this.getMemoList();
        this.getAppendixList();
        this.getTaskList();
    },

    getTaskList:function(){
        this.getTasks({
            pageNo:this.state.taskData.pageNo,
            pageSize:this.state.taskData.pageSize});
    },

    getTasks:function(param){//调用任务列表接口
        var self = this,
            thisUrl = APIS.contact_undonetask.replace('{id}', this.state.routeId).replace('{pageSize}', param.pageSize).replace('{pageNo}', param.pageNo);

        AjaxRequest.get(thisUrl, '', function (res) {
            if (res.code = "200") {
                //console.log("debug --->");
                self.setTasksList(res.data);
            } else {
                console.log('请求失败!')
            }
        });
    },

    setTasksList:function(data){
        var list = new Array();
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            list.push({
                title: item.subject,
                desc: item.description,
                startTime: item.startTime,
                endTime: item.endTime,
                fileUrl: item.audioSubjectFileUrl||''
            });
        }
        this.state.taskList = list;
        this.setState(this.state.taskList);
    },

    addMemo:function (val) {
        var self = this;
        if(!val){
            toastr.error('请输入备注内容');
            return;
        }
        AjaxRequest.post(APIS.notes_add, {
            content: val,
            entityId:self.state.routeId,
            remarkType: "contact"
        }, function (res) {
            if (res.code = "200") {
                toastr.success('新增备注成功!');
                self.getMemoList();
            } else {
                console.log('请求失败!')
            }
        });
    },//添加备忘

    getMemoList:function () {//"v1/remarks/{type}/{id}"
        var self = this,
            thisUrl = APIS.remark_text_list.replace('{type}', 'contact').replace('{id}', self.state.routeId);
        AjaxRequest.get(thisUrl, null, function(res) {
            self.setMemoList(res.data);
        });

    },//获取备忘列表

    setMemoList: function(data){
        if(!(data instanceof Array)) return;
        var list = new Array();
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            list.push({
                headImg: item.headPhotoUrl,
                Name: item.createdBy,
                content: item.content,
                time: item.createdOn
            });
        }
        this.state.memoList = list;
        this.setState(this.state.memoList);
    },//更新状态memoList

    addAppendix:function (data) {
        var self = this,
            ids = [];
        for(var i=0,len=data.length;i<len;i++){
            ids.push(data[i].fId);
        }
        ids = ids.join(',');

        AjaxRequest.post(APIS.notes_add, {
            "content":"",
            "remarkType":"contact",
            "picFileIds":ids,
            "entityId":self.state.routeId
        }, function (res) {
            if (res.code = "200") {
                alert('新增附件成功!');
                self.getAppendixList();
            } else {
                console.log('请求失败!')
            }
        });
    },//添加附件

    getAppendixList:function(){
        var self = this,
            thisUrl = APIS.remark_files_list.replace('{type}','contact').replace('{id}',self.state.routeId);
        AjaxRequest.get(thisUrl, '', function (res) {
            if (res.code = "200") {
                //将amr后缀改为mp3
                for (var i = 0; i < res.data.length; i++) {
                    var fileUrl=res.data[i].fileUrl;
                    if(fileUrl.length>3 && fileUrl.substring(fileUrl.length-4,fileUrl.length).toLowerCase() =='.amr'){
                        res.data[i].fileUrl=fileUrl.substring(0,fileUrl.length-4)+'.mp3';
                        res.data[i].extension='mp3';
                    }
                }
                self.setAppendixList(res.data);
            } else {
                console.log('请求失败!')
            }
        });
    },//获取附件列表

    setAppendixList: function(data){
        var list = new Array();

        for(var i=0; i<data.length; i++){
            var item = data[i];
            item.originName = item.originName.split('.')[0];
            item.extension = item.extension.replace(/.*?\./, '').toUpperCase();
            list.push(item);
        }
        this.state.appendixList = list;
        this.setState(this.state.appendixList);
        if(data && data.length > 0){
            //附件列表图片预览
            $('#appendixList').viewer({
                url: 'data-original',
                built: function() {
                    var ht = $("#appendixListDiv");
                    $("#appendixListDiv").remove();
                    $(document.body).append(ht);
                }
            });
            //全部附件图片预览
            $('#appendixAllList').viewer({
                url: 'data-original',
                built: function() {
                    var ht = $("#appendixAllListDiv");
                    $("#appendixAllListDiv").remove();
                    $(document.body).append(ht);
                }
            });
        }
    },//更新状态appendixList

    componentWillUnmount:function(){
        $("#appendixListDiv").remove();
        $("#appendixAllListDiv").remove();
    },

    clearUpList:function () {
        this.refs.fileAdd.clearList();
    },

    /*contextTypes: {
        router: React.PropTypes.object
    },
    listen:function(){
        var self = this;
        self.context.router.listen(function(location){
            var oldId = self.state.routeId;
            var nid = location.pathname.split('/')[2];
            if(location.pathname.match(/linkman\//)){
                if (oldId && nid != oldId) {
                    self.state.routeId = nid;
                    self.componentDidMount();
                }
            }
        });
    },*/
    addTask:function () {
        /*this.context.router.push({
            pathname: '/task/add/0',
            query: {
                linkmanId: this.state.routeId,
                customerId: this.state.customerId,
                type:'linkman',
                linkmanName: this.state.name
            }
        });*/
        var linkmanId = this.state.routeId;
        var customerId = this.state.customerId;
        hashHistory.push(`/linkman/${linkmanId}/addTask?customerId=${customerId}`);
    },
    addActivity:function () {
        /*this.context.router.push({
            pathname: '/activity/add/0',
            query: {
                linkmanId: this.state.routeId,
                customerId: this.state.customerId,
                type:'linkman',
                linkmanName: this.state.name
            }
        });*/
        var linkmanId = this.state.routeId;
        var customerId = this.state.customerId;
        hashHistory.push(`/linkman/${linkmanId}/addActive?customerId=${customerId}`);
    },

    render: function () {
        var self = this;

        function renderChanceTab(){
            if(CONFIG.Exclude && CONFIG.Exclude.chance) return null;
            return (
                <li onClick={self.getChanceEven}>
                    <a data-toggle="tab" href="#chanceList">商机</a>
                </li>
            );
        };
        return (
            <div>
                <CurrentPosition routes={this.props.routes} params={this.props.params} />
                <div className="page-body noTopPadding">
                    <div className="row">
                        {/* Page Header */}
                        <div className="page-header position-relative">
                            <div className="header-title">
                                <h1>
                                    {this.state.name}
                                    <Link className="crm_edit pcicon pcicon-edit" to={'/linkman/'+this.state.routeId+'/edit'}></Link>
                                </h1>
                            </div>
                            {/*Header Buttons*/}
                            <div className="header-buttons">
                                <div className="glyphicon glyphicon-plus" onClick={this.addActivity}>活动</div>
                                <div className="glyphicon glyphicon-plus" onClick={this.addTask}>任务</div>
                            </div>
                            {/*Header Buttons End*/}
                        </div>
                        {/* /Page Header */}
                    </div>
                    {/*首行4块*/}
                    <DetailTable lists={this.state.firstList}/>
                    <div className="row">
                        <div className="col-lg-9 col-md-9 col-sm-12 col-xs-12">
                            <div className="row">
                                <div className="col-xs-12">
                                    <div className="dashboard-box">
                                        <div className="box-tabbs">
                                            <div className="tabbable">
                                                <ul className="nav nav-tabs myTab" id="myTab">
                                                    <li className="active">
                                                        <a data-toggle="tab" href="#linkMan">联系人详情</a>
                                                    </li>
                                                    {renderChanceTab()}
                                                    <li onClick={this.getOtherMsg}>
                                                        <a data-toggle="tab" href="#otherInfo">其他相关</a>
                                                    </li>
                                                </ul>
                                                <div className="tab-content tabs-flat no-padding">
                                                    <div id="linkMan" className="tab-pane animated fadeInUp active">
                                                        <div className="row otherRow">
                                                            <div className="col-lg-12">
                                                                <DetailList lists={this.state.detailList}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div id="chanceList" className="tab-pane animated fadeInUp">
                                                        <div className="row otherRow">
                                                            <div className="chanceList">
                                                                <ChanceList ref="changeList"
                                                                            getData={this.getChances}
                                                                            trackData={this.state.chanceData}
                                                                />
                                                                {/*
                                                                 <div className="chanceBox">
                                                                 <p className="darkcarbon">商机名称</p>
                                                                 <p className="stage darkgray">
                                                                 阶段：需求调研<span>责任人：陆军</span>
                                                                 </p>
                                                                 <p className="darkgray dpTable">
                                                                 <span>最后跟进时间：2016-09-18</span>
                                                                 <span>状态：进行中</span>
                                                                 <span>预测金额：10,000,000</span>
                                                                 </p>
                                                                 </div>*/}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div id="otherInfo" className="tab-pane padding-10 animated fadeInUp">
                                                        <div className="row">
                                                            <div className="col-lg-12">
                                                                <DataList type={"task"} title={"未完成的任务"} btntext={" 任务"} lists={this.state.taskList} dataHref={`#/linkman/${this.state.routeId}/task`} addAction={this.addTask}></DataList>
                                                                <hr className="mid" />
                                                                <DataList type={"memo"} title={"备注"} btntext={" 备注"} lists={this.state.memoList} target={this.state.memoDailogId} addTarget="addNoteModal"></DataList>
                                                                <hr className="mid" />
                                                                <DataList type={"appendix"} title={"附件"} btntext={" 附件"} lists={this.state.appendixList} target={this.state.appendixDailogId} clearUpList={this.clearUpList} addTarget="addFileModal"></DataList>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                            <div className="orders-container">
                                <div className="orders-header">
                                    <h6>
                                        <span>跟进记录</span>
                                    </h6>
                                </div>
                                <TrackList ref="trackList"
                                           getData={this.getTrackList}
                                           trackData={this.state.trackData}></TrackList>

                            </div>
                        </div>
                    </div>

                    <div className="container-fluid text-center">
                        <AllData type={"task"} title={"任务"} lists={this.state.taskList} modalId={this.state.taskDailogId}></AllData>
                        <AllData type={"memo"} title={"备注"} lists={this.state.memoList} modalId={this.state.memoDailogId}></AllData>
                        <AllData type={"appendix"} title={"附件"} lists={this.state.appendixList} modalId={this.state.appendixDailogId}></AllData>


                        {/*<AddItem type={"task"} title={"新增任务"} lists={this.state.taskList} modalId={this.state.taskDailogId}></AddItem>*/}
                        <NoteAdd addNotes={this.addMemo} />
                        <FileAdd addFile={this.addAppendix} ref="fileAdd"/>
                    </div>
                </div>
            </div>            
        )
    }
});
/*
 <NoteAdd action={this.addMemo} title={"新增任务"} modalId={this.state.memoDailogId}></NoteAdd>
 <FileAdd action={this.addFile} title={"新增附件"} modalId={this.state.appendixDailogId}></FileAdd>
* */