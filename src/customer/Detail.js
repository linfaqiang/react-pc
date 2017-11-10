import React from 'react';
import {Link, hashHistory} from 'react-router';
import '../core/components/Select2/select2.css';
import AjaxRequest from '../core/common/ajaxRequest.js';
import DetailTable from '../core/components/DetailTable/List';
//import TrackList from '../core/components/TrackList/List';
import TrackList from '../linkman/components/TrackList';
import DetailList from '../core/components/DetailList/List';
import ChanceList from '../core/components/ChanceList/List';

import Linkmans from '../core/components/Linkmans/List';
import LinkmansAll from '../core/components/Linkmans/All';
//import LinkmansAdd from '../core/components/Linkmans/Add';
import NoteList from '../core/components/NoteList/List';
import NoteAll from '../core/components/NoteList/All';
import NoteAdd from '../core/components/NoteList/Add';
import TeamList from '../core/components/TeamList/List';
import TeamAll from '../core/components/TeamList/All';
import TeamAdd from '../core/components/TeamList/Add';
import TeamDelete from '../core/components/TeamList/Delete';

import FileList from '../core/components/FileList/List';
import FileAll from '../core/components/FileList/All';
import FileAdd from '../core/components/FileList/Add';
import TaskList from '../core/components/TaskList/List';

import Hierarchy from './Hierarchy';
import HierarchyEdit from './HierarchyEdit';
import { APIS } from '../core/common/config';
import DistributionCon from './distribution';
import UserInfo from '../core/common/UserInfo.js';
import CluesList from './CluesList.js';
import CurrentPosition from '../core/components/layout/CurrentPosition';

module.exports = React.createClass({
    getInitialState: function () {
        return {
            routeId: this.props.params.customerId,
            tableData: { //详情首行表格
                firstList: [{
                    name: '地址',
                    value: '',
                    filed: 'address.address',
                    iconClass: 'yellow pcicon-addr'
                }, {
                    name: '联系人',
                    value: '',
                    filed: 'linkman.name',
                    iconClass: 'blue pcicon-contacts'
                }, {
                    name: '联系方式',
                    value: '',
                    filed: 'linkman.mobile',
                    iconClass: 'green'
                }, {
                    name: '责任人',
                    value: '',
                    filed: 'ownerStaffName',
                    iconClass: 'red pcicon pcicon-head'
                }],
                lists: []
            },
            trackData: { //跟进记录
                pageNo: 1,
                pageSize: 5,
                totalSize:0
            },
            chanceData: { //商机列表
                pageNo: 1,
                pageSize: 5,
                chancLength: 0
            },
            detailList: [ //详情
                {
                    name: '客户简称',
                    field: 'shortname',
                    value: ''
                }, {
                    name: '重要程度',
                    field: 'customerLevelName',
                    value: ''
                }, {
                    name: '行业类别',
                    field: 'industryName',
                    value: ''
                }, {
                    name: '公司电话',
                    field: 'telephone',
                    value: ''
                }, {
                    name: '电子邮箱',
                    field: 'email',
                    value: ''
                }, {
                    name: '公司网址',
                    field: 'url',
                    value: ''
                }, {
                    name: '员工总数',
                    field: 'employeesTotal',
                    value: ''
                }, {
                    name: '年度收入',
                    field: 'annualIncome',
                    value: ''
                }, {
                    name: 'CEO',
                    field: 'ceoName',
                    value: ''
                }

            ],
            linkmanList: [], //客户联系人
            noteList: [], //备注
            taskList: [], //任务列表
            teamList: [], //销售团队
            fileList: [],
            cluesList: [],//客户相关线索
            hierarchyList: { //客户层级
                parent: {},
                subdirectories: []
            },
            isDistribution: false,
            isFocused: false
        }

    },
    componentWillUnmount: function () {
        $(document).off('customerDetailIdChange');
    },
    componentDidMount: function () {
        var self = this;
        $(document).on('customerDetailIdChange', function(e, detailId){
            self.state.routeId = detailId;
            self.getDetailData();
        });
        self.getDetailData();
    },
    getDetailData: function(){
        this.getData(); //详情首行
        this.getTracks({ //跟进记录
            pageNo: 1,
            pageSize: 5
        });
    },
    getChanceEven: function () {

        this.getChances({ //跟进记录
            pageNo: 1,
            pageSize: 5
        })
    },
    setDetailData: function (data) { //设置详情
        var list = this.state.detailList;

        for (var i = 0, len = list.length; i < len; i++) {
            var field = this.state.detailList[i].field;
            this.state.detailList[i].value = data[field] || '------'
        }

        this.setState(this.state.detailList)
    },
    setFirstList: function (data) { //设置首行列表
        var list = this.state.tableData.firstList;
        for (var i = 0, len = list.length; i < len; i++) {
            var field = list[i].filed;
            if (field.split('.').length == 2) {
                var arrs = field.split('.'),
                    arr_1 = arrs[0],
                    arr_2 = arrs[1];
                list[i].value = data[arr_1][arr_2];
            } else {
                list[i].value = data[field];
            }

        }
    },
    getData: function () {
        var self = this;

        AjaxRequest.get(APIS.customerDetail + self.state.routeId, null, function (body) {

            self.state.tableData.lists = body.data; //设置首页表格数据

            self.setFirstList(body.data); //设置首行列表数据

            self.setState(self.state.tableData);

            self.setDetailData(body.data); //设置详情

            self.setDistrtbution(body.data || ''); //判断是否未分配客户

            if(body.data.isFocus == 1){//1:已关注;0:未关注
                self.setState({isFocused:true});
            }

        });

    },
    setDistrtbution: function (data) {
        var userId = UserInfo.staffId();
        if (userId == data.createdBy) {
            this.setState({
                isDistribution: false
            })
        } else {
            if (data.belongTo && (data.belongTo == 'pending')) {
                this.setState({
                    isDistribution: true
                })
            } else {
                this.setState({
                    isDistribution: false
                })
            }
        }
    },
    //跟进记录列表
    getTracks: function (param) {
        var self = this,
            thisUrl = APIS.customer_follow.replace('{id}', this.state.routeId);

        AjaxRequest.get(thisUrl + '?pageSize=' + param.pageSize + '&pageNo=' + param.pageNo, null, function (body) {
            self.refs.tracksList.setPagerData(body);

            window.scroll(0, 0);
            if(body.data.length > 0){
                self.refs.tracksList.setNoData(true, body.totalSize);
            }else{

                self.refs.tracksList.setNoData(false, 0);
            }
        });

    },
    //机会列表
    getChances: function (param) {
        var self = this,
            thisUrl = APIS.customerDetail + self.state.routeId + '/chances';

        AjaxRequest.get(thisUrl + '?pageSize=' + param.pageSize + '&pageNo=' + param.pageNo, null, function (body) {

            self.refs.changeList.setPagerData(body);

            self.state.chanceData.chancLength = body.data.length;
            self.setState(self.state.chanceData);

        });

    },
    refreshLinkman: function () {
        var self = this,
            linkmanUrl = APIS.customerDetail + self.state.routeId + '/linkman';

        AjaxRequest.get(linkmanUrl, null, function (body) {

            self.setState({
                linkmanList: body.data
            })

        });

    },
    refreshNote: function () {
        var self = this,
            noteUrl = APIS.remark_text_list.replace('{type}', 'customer').replace('{id}', self.state.routeId);


        AjaxRequest.get(noteUrl, null, function (body) {

            self.setState({
                noteList: body.data
            })

        });

    },
    refreshTeam: function () {
        var self = this,
            teamUrl = APIS.customer_team.replace('{id}', self.state.routeId);


        AjaxRequest.get(teamUrl, null, function (body) {

            var thisData = body.data;
            if (thisData.length) {
                for (var i = 0, len = thisData.length; i < len; i++) {
                    thisData[i].checked = false;
                }
            }

            self.setState({
                teamList: thisData
            })

        });

    },
    refreshHierarchy: function () {
        var self = this,
            thisUrl = APIS.customerDetail + this.state.routeId + '/getCorrelation';


        AjaxRequest.get(thisUrl, null, function (body) {

            self.setState({
                hierarchyList: body.data
            });

            self.refs.hierarchys.setShowHideBtn(); //父客户搜索列表里添加父客户信息 才能setvalue

        });

    },
    getOtherMsg: function () {
        this.refreshLinkman();
        this.refreshNote();
        this.refreshTeam();
        this.refreshHierarchy();
        this.getFiles();
        this.getTaskList();
    },
    //备注
    addNotes: function (val) {
        var self = this;

        if (!val) {
            bootbox.alert('请输入备注内容');
            return;
        }

        var param = {
            content: val,
            entityId: self.state.routeId,
            remarkType: "customer"
        };

        AjaxRequest.post(APIS.notes_add, param, function (body) {
            toastr.success('新增备注成功!');
            self.refreshNote();
        });

    },
    addFile: function (data) {
        var self = this,
            ids = [];
        for (var i = 0, len = data.length; i < len; i++) {
            ids.push(data[i].fId);
        }
        ids = ids.join(',');


        var param = {
            "content": "",
            "remarkType": "customer",
            "picFileIds": ids,
            "entityId": self.state.routeId
        };

        AjaxRequest.post(APIS.notes_add, param, function (body) {
            toastr.success('上传成功!');
            //self.refreshNote();
            self.getFiles();
        });

    },
    //销售团队
    addTeams: function (arr) {
        var self = this,
            param = {
                customerId: self.state.routeId,
                saleStaffIdList: arr
            };

        AjaxRequest.post(APIS.customer_team_add, param, function (body) {
            toastr.success('新增销售成员成功!');
            self.refreshTeam();
        });

    },
    deleteTeams: function (id) {
        var self = this;

        AjaxRequest.delete(APIS.customer_team_delete.replace('{id}', id), null, function (body) {
            toastr.success('删除销售人员成功!');
            self.refreshTeam();
        });

    },
    selectTeams: function (key) {
        for (var i = 0, len = this.state.teamList.length; i < len; i++) {
            this.state.teamList[i].checked = false;
        }
        this.state.teamList[key].checked = true;
        this.setState(this.state.teamList);
    },
    initTeamSearch: function () {
        this.refs.TeamAdds.initTeamSearch()
    },
    initDistributionSearch: function () {
        this.refs.distribution.initDistributionSearch()
    },
    initTeamList: function () {
        var lists = this.state.teamList;
        for (var i = 0, len = lists.length; i < len; i++) {
            lists[i].checked = false;
        }
        this.setState({
            teamList: lists
        })
    },
    //联系人
    addLinkmans: function (param) {
        var self = this,
            params = param;
        params['customerId'] = parseInt(this.state.routeId);

        AjaxRequest.post(APIS.contact_list, params, function (body) {
            toastr.success('新增销售成员成功!');
            self.refreshLinkman();
        });

    },
    clearAddValue: function () {
        this.refs.linkmansAdd.clearValue();
    },
    //附件上传
    getFiles: function () {
        var self = this,
            fileUrl = APIS.remark_files_list.replace('{type}', 'customer').replace('{id}', self.state.routeId);

        AjaxRequest.get(fileUrl, null, function (body) {
            //将amr后缀改为mp3
            for (var i = 0; i < body.data.length; i++) {
                var fileUrl = body.data[i].fileUrl;
                var originName = body.data[i].originName;
                if (fileUrl.length > 3 && fileUrl.substring(fileUrl.length - 4, fileUrl.length).toLowerCase() == '.amr') {
                    body.data[i].fileUrl = fileUrl.substring(0, fileUrl.length - 4) + '.mp3';
                    body.data[i].extension = 'mp3';
                    body.data[i].originName = originName.substring(0, originName.length - 4) + '.mp3';
                }
            }
            self.setState({
                fileList: body.data
            })
        });

    },
    clearUpList: function () {
        this.refs.fileAdd.clearList();
    },
    getTaskList: function () {
        let self = this;
        let taskUrl = APIS.customerDetail + self.state.routeId + '/tasks';

        let taskData = { //任务列表
            pageNo: 1,
            pageSize: 5,
            undone: 1
        };

        AjaxRequest.get(taskUrl, taskData, function (data) {
            if (data.code == 200 || data.code == '200') {
                self.setState({
                    taskList: data.data
                })
            }
        });
    },
    /*contextTypes: {
        router: React.PropTypes.object
    },*/
    selectAllTask: function () {
        /*this.context.router.push({
            pathname: '/task',
            query: {
                customerId: this.state.routeId,
                type: 'customer'
            }
        });*/
        var customerId = this.state.routeId;
        hashHistory.push(`/customer/${customerId}/task`);
    },
    addLinkman: function () {
        /*this.context.router.push({
            pathname: '/linkman/add/0',
            query: {
                customerId: this.state.routeId,
                type: 'customer',
                customerName: this.state.tableData.lists.name
            }
        });*/
        var customerId = this.state.routeId;
        hashHistory.push(`/customer/${customerId}/addLinkman`);
    },
    addTask: function () {
        /*this.context.router.push({
            pathname: '/task/add/0',
            query: {
                customerId: this.state.routeId,
                type: 'customer'
            }
        });*/
        var customerId = this.state.routeId;
        hashHistory.push(`/customer/${customerId}/addTask`);
    },
    /*contextTypes: {
        router: React.PropTypes.object
    },
    addLinkman: function () {
        this.context.router.push({
            pathname: '/linkman/add/0',
            query: {
                customerId: this.state.routeId,
                type: 'customer',
                customerName: this.state.tableData.lists.name
            }
        });
    },
    addChance: function () {
        this.context.router.push({
            pathname: '/chance/add/0',
            query: {
                customerId: this.state.routeId,
                type: 'customer'
            }
        });
    },
    addTask: function () {
        this.context.router.push({
            pathname: '/task/add/0',
            query: {
                customerId: this.state.routeId,
                type: 'customer'
            }
        });
    },
    addActivity: function () {
        this.context.router.push({
            pathname: '/activity/add/0',
            query: {
                customerId: this.state.routeId,
                type: 'customer',
                customerName: this.state.tableData.lists.name
            }
        });
    },*/

    distribution: function (data) {
        if (!data.id) {
            toastr.error('请选择分配人员！！');
            return;
        }
        var thisUrl = APIS.customerDetail + this.state.routeId + '/assignto',
            param = {
                toDeptId: (data.type == 'dept') ? data.id : 0,
                toStaffId: (data.type == 'staff') ? data.id : 0
            };

        AjaxRequest.post(thisUrl, param, function (body) {
            toastr.success('分配成功')
        });
    },
    focusCustomer: function () {
        var self = this;
        var isFocused = this.state.isFocused;
        if(isFocused){//取消关注
            AjaxRequest.get(APIS.cancelFocusCustomer.replace('{customerId}', this.state.routeId), null, function (data) {
                if (data.code == 200) {
                    self.setState({isFocused: !isFocused});
                }else{
                    toastr.error('取消关注失败');
                }
            });
        }else{
            AjaxRequest.get(APIS.focusCustomer.replace('{customerId}', this.state.routeId), null, function (data) {
                if (data.code == 200) {
                    self.setState({isFocused: !isFocused});
                }else{
                    toastr.error('关注客户失败');
                }
            });
        }
    },
    getClues: function(){
        var self = this;
        AjaxRequest.get(APIS.customerRelativeClues.replace('{customerId}', this.state.routeId), null, function (data) {
            if (data.code == 200) {
                self.setState({cluesList: data.data});
            }else{
                toastr.error('查询失败');
            }
        });
    },
    render: function () {
        var self = this;
        var customerId = this.state.routeId;

        function renderChanceBtn(){
            if(CONFIG.Exclude && CONFIG.Exclude.chance){
                return null;
            }
            return (
                <div className="glyphicon glyphicon-plus"
                     style={{display:self.state.isDistribution?'none':'inline-block'}}
                     onClick={()=>{hashHistory.push(`/customer/${customerId}/addChance`)}}>商机
                </div>
            );
        };
        function renderClueTab(){
            if(CONFIG.Exclude && CONFIG.Exclude.clue) return null;
            return (
                <li onClick={self.getClues}>
                    <a data-toggle="tab" href="#customer-cluesList">
                        线索{self.state.cluesList.length ? '(' + self.state.cluesList.length + ')' : ''}
                    </a>
                </li>
            );
        };
        function renderChanceTab(){
            if(CONFIG.Exclude && CONFIG.Exclude.chance) return null;
            return (
                <li onClick={self.getChanceEven}>
                    <a data-toggle="tab" href="#customer-sj">
                        商
                        机{self.state.chanceData.chancLength ? '(' + self.state.chanceData.chancLength + ')' : ''}
                    </a>
                </li>
            );
        };
        return (
            <div>
                <CurrentPosition routes={this.props.routes} params={this.props.params} />
                <div className="page-body noTopPadding">
                    <div className="row">
                        <div className="page-header position-relative">
                            <div className="header-title">
                                <h1>
                                    {this.state.tableData.lists.name}
                                    <Link to={`/customer/${customerId}/edit`}>
                                        <span className="crm_edit pcicon pcicon-edit"></span>
                                    </Link>
                                    <span className={this.state.isFocused ? "crm_edit fa fa-star": "crm_edit fa fa-star cancel"} onClick={this.focusCustomer}></span>
                                </h1>
                            </div>
                            <div className="header-buttons">
                                <div className="glyphicon glyphicon-plus"
                                     onClick={this.initDistributionSearch}
                                     style={{display:this.state.isDistribution?'inline-block':'none'}}
                                     data-toggle="modal" data-target="#distribution">分配
                                </div>
                                <div className="glyphicon glyphicon-plus"
                                     style={{display:this.state.isDistribution?'none':'inline-block'}}
                                     onClick={()=>{hashHistory.push(`/customer/${customerId}/addActive`)}}>活动
                                </div>
                                <div className="glyphicon glyphicon-plus"
                                     style={{display:this.state.isDistribution?'none':'inline-block'}}
                                     onClick={()=>{hashHistory.push(`/customer/${customerId}/addTask`)}}>任务
                                </div>
                                {renderChanceBtn()}
                                {/*<div className="glyphicon glyphicon-plus"
                                     style={{display:this.state.isDistribution?'none':'inline-block'}}
                                     onClick={()=>{hashHistory.push(`/customer/${customerId}/addChance`)}}>商机
                                </div>*/}
                                <div className="glyphicon glyphicon-plus"
                                     style={{display:this.state.isDistribution?'none':'inline-block'}}
                                     onClick={()=>{hashHistory.push(`/customer/${customerId}/addLinkman`)}}>联系人
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="detail-table">
                        <DetailTable lists={this.state.tableData.firstList}/>
                    </div>
                    <div className="row">
                        <div className="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <div className="dashboard-box">
                                <div className="box-tabbs">
                                    <div className="tabbable">
                                        <ul className="nav nav-tabs myTab" id="myTab11">
                                            <li className="active">
                                                <a data-toggle="tab" href="#customer-khxq">
                                                    客户详情
                                                </a>
                                            </li>
                                            {renderChanceTab()}
                                            {renderClueTab()}
                                            {/*<li onClick={this.getChanceEven}>
                                                <a data-toggle="tab" href="#customer-sj">
                                                    商
                                                    机{this.state.chanceData.chancLength ? '(' + this.state.chanceData.chancLength + ')' : ''}
                                                </a>
                                            </li>
                                            <li onClick={this.getClues}>
                                                <a data-toggle="tab" href="#customer-cluesList">
                                                    线索{this.state.cluesList.length ? '(' + this.state.cluesList.length + ')' : ''}
                                                </a>
                                            </li>*/}
                                            <li onClick={this.getOtherMsg}>
                                                <a data-toggle="tab" href="#customer-qtxg">
                                                    其他相关
                                                </a>
                                            </li>
                                        </ul>
                                        <div className="tab-content tabs-flat detail-left">
                                            <div id="customer-khxq" className="animated fadeInUp tab-pane in active">
                                                <DetailList lists={this.state.detailList}/>
                                            </div>
                                            <div id="customer-cluesList" className="animated fadeInUp tab-pane in">
                                                <CluesList lists={this.state.cluesList}/>
                                            </div>

                                            <div id="customer-sj" className="tab-pane animated fadeInUp">
                                                <ChanceList ref="changeList"
                                                            getData={this.getChances}
                                                            trackData={this.state.chanceData}
                                                />
                                            </div>
                                            <div id="customer-qtxg" className="tab-pane animated fadeInUp">
                                                <div className="detail-tab3">

                                                    <Linkmans lists={this.state.linkmanList}
                                                              addLinkman={this.addLinkman}
                                                    />
                                                    <TaskList lists={this.state.taskList}
                                                              addTask={this.addTask}
                                                              selectAllTask={this.selectAllTask}/>
                                                    <TeamList lists={this.state.teamList}
                                                              initTeamSearch={this.initTeamSearch}
                                                              initTeamList={this.initTeamList}
                                                    />
                                                    <NoteList lists={this.state.noteList}/>

                                                    <FileList clearUpList={this.clearUpList}
                                                              lists={this.state.fileList}/>

                                                    <Hierarchy lists={this.state.hierarchyList}/>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12">
                            <div className="dashboard-box">
                                <div className="tabbable">
                                    <div className="tabs-flat orders-container">
                                        <div className="orders-header">
                                            <h6>
                                                <span>跟进记录</span>
                                            </h6>
                                        </div>

                                        <TrackList ref="tracksList"
                                                   getData={this.getTracks}
                                                   trackData={this.state.trackData}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container-fluid text-center">
                    <LinkmansAll lists={this.state.linkmanList}/>

                    <NoteAll lists={this.state.noteList}/>
                    <NoteAdd addNotes={this.addNotes}/>

                    <FileAll lists={this.state.fileList}/>
                    <FileAdd addFile={this.addFile} ref="fileAdd"/>

                    <TeamAll lists={this.state.teamList}/>
                    <TeamAdd ref="TeamAdds" addTeams={this.addTeams} customerId={this.state.routeId}/>
                    <TeamDelete deleteTeams={this.deleteTeams}
                                selectTeams={this.selectTeams}
                                lists={this.state.teamList}
                    />
                    <HierarchyEdit refreshHierarchy={this.refreshHierarchy}
                                   ids={this.state.routeId}
                                   thisName={this.state.tableData.lists.name}
                                   ref="hierarchys" hierarchyList={this.state.hierarchyList}
                                   lists={this.state.hierarchyList}/>

                    <DistributionCon ref='distribution'
                                     distribution={this.distribution}
                                     initDistributionSearch={this.initDistributionSearch}/>

                </div>

            </div>
        )
    }
});