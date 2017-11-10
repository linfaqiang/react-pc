import React, {Component} from 'react';
import {Link, hashHistory} from 'react-router';
import '../core/components/Select2/select2.css';
import AjaxRequest from '../core/common/ajaxRequest.js';
import {APIS} from '../core/common/config';
import Tools from '../core/common/tools.js';
import DictsFun from '../core/common/dicts.js'
import DetailTable from '../core/components/DetailTable/List';
import CurrentPosition from '../core/components/layout/CurrentPosition';
//import TrackList from '../core/components/TrackList/List';
import TrackList from '../linkman/components/TrackList';
import DetailList from '../core/components/DetailList/List';

import Linkmans from '../core/components/Linkmans/List';
import LinkmansAdd from '../core/components/Linkmans/AddSearch';
import LinkmansAll from '../core/components/Linkmans/All';

import TaskList from '../core/components/TaskList/List';
import TeamList from '../core/components/TeamList/List';
import TeamAll from '../core/components/TeamList/All';
import TeamAdd from '../core/components/TeamList/Add';
import TeamDelete from '../core/components/TeamList/Delete';
import CompetitorList from '../core/components/Competitor/List';
import CompetitorAdd from '../core/components/Competitor/AddSearch';
import CompetitorAll from '../core/components/Competitor/All';
import NoteList from '../core/components/NoteList/List';
import NoteAll from '../core/components/NoteList/All';
import NoteAdd from '../core/components/NoteList/Add';
import ProductList from '../core/components/ChanceProduct/List';
import QuoteList from '../core/components/ChanceQuote/List';
import FileList from '../core/components/FileList/List';
import FileAll from '../core/components/FileList/All';
import FileAdd from '../core/components/FileList/Add';
import ChanceStage from '../core/components/ChanceStage/ChanceStage';
import CloseForm from '../core/components/ChanceStage/CloseForm';

module.exports = React.createClass({

    getInitialState: function () {
        return {
            routeId: this.props.params.chanceId,
            tableData: {                       //详情首行表格
                firstList: [
                    {
                        name: '客户',
                        value: '',
                        field: 'customerName',
                        iconClass: 'yellow pcicon-customer'
                    }, {
                        name: '联系人',
                        value: '',
                        field: 'customerLinkman',
                        iconClass: 'blue pcicon-contacts'
                    }, {
                        name: '联系方式',
                        value: '',
                        field: 'contactWay',
                        iconClass: 'green pcicon-phone'
                    }, {
                        name: '责任人',
                        value: '',
                        field: 'createdName',
                        iconClass: 'red pcicon pcicon-head'
                    }
                ],
                lists: []
            },
            trackData: {            //跟进记录
                pageNo: 1,
                pageSize: 5,
                totalSize: 0
            },
            chanceData: {            //商机列表
                pageNo: 1,
                pageSize: 5
            },
            detailList: [                  //详情
                {
                    name: '商机类型',
                    field: 'stageTypeText',
                    value: ''
                },
                {
                    name: '商机状态',
                    field: 'statusText',
                    value: ''
                },
                {
                    name: '预测金额',
                    field: 'forecastAmount',
                    value: ''
                },
                {
                    name: '预计成交日期',
                    field: 'extimateDealDate',
                    value: ''
                },
                {
                    name: '成交金额',
                    field: 'dealAmount',
                    value: '',
                    isHide: true
                },
                {
                    name: '成交日期',
                    field: 'dealDate',
                    value: '',
                    isHide: true
                },
                {
                    name: '输单金额',
                    field: 'loseAmount',
                    value: '',
                    isHide: true
                },
                {
                    name: '输单日期',
                    field: 'loseDate',
                    value: '',
                    isHide: true
                },
                {
                    name: '成功率',
                    field: 'successRatio',
                    value: ''
                },
                {
                    name: '关闭原因',
                    field: 'closeReasonText',
                    value: '',
                    isHide: true
                }
            ],
            detailData: {
                customerId: '',
                chanceName: '',
                chanceStageId: null,
                chanceStageText: "",
                saleStageList: [],
                isColsed: 0,
                chanceId: this.props.params.chanceId
            },
            closeReason: 0,
            type: 'chance',
            productList: [],      //产品列表
            quoteList: [],        //报价列表
            linkmanList: [],      //商机联系人
            taskList: [],         //未完成任务
            teamList: [],         //销售团队
            competitorList: [],   //竞争对手
            competitorSearchList: [],
            remarkList: [],       //备注
            fileList: [],			 //附件
            disableFun: false //isColsed   商机已关闭时禁用功能
        }

    },
    componentWillUnmount: function () {
        $("#dowebokListDiv").remove();
        $("#dowebokAllDiv").remove();
        $(document).off('chanceDetailIdChange');
    },

    componentDidMount: function () {
        var self = this;
        $(document).on('chanceDetailIdChange', function(e, detailId){
            self.state.routeId = detailId;
            self.getAllData();
        });
        this.getAllData();
    },
    getAllData: function () {
        this.getData();  //详情首行
        this.getTracks({   //跟进记录
            pageNo: 1,
            pageSize: 5
        });
        let tab = this.props.location.query.tab;
        if (tab) {
            this.getProductQuote();
            $(`#myTab11 a[href="#${tab}"]`).tab('show');
        }
    },

    getProductQuote: function () {
        this.getProductList();
        this.getQuoteList();
    },

    getProductList: function () {
        var self = this,
            productUrl = APIS.chance_product.replace('{id}', this.state.routeId);

        AjaxRequest.get(productUrl, null, function (data) {
            if (data.code == 200 || data.code == '200') {
                self.setState({
                    productList: data.data
                })
            }
        });
    },
    getQuoteList: function () {
        var self = this,
            quoteUrl = APIS.chance_salesPrice.replace('{id}', this.state.routeId);
        ;
        AjaxRequest.get(quoteUrl, null, function (data) {
            if (data.code == 200 || data.code == '200') {
                self.setState({
                    quoteList: data.data
                })
            }
        });
    },

    setDetailData: function (data) {    //设置详情
        var list = this.state.detailList;
        var status = data['status'];

        for (var i = 0, len = list.length; i < len; i++) {
            var field = this.state.detailList[i].field;
            if (field == 'extimateDealDate' || field == 'dealDate' || field == 'loseDate') {
                var formatDate = data[field];
                if (formatDate) {
                    formatDate = formatDate.split(" ")[0];
                }
                this.state.detailList[i].value = formatDate || '------'
            } else {
                this.state.detailList[i].value = data[field] || '------'
            }

            if (status == 3) {//赢单
                if (field == 'dealAmount' || field == 'dealDate' || field == 'closeReasonText') {
                    this.state.detailList[i].isHide = false;
                } else if (field == 'loseAmount' || field == 'loseDate') {
                    this.state.detailList[i].isHide = true;
                }
            } else if (status == 4) {//丢单
                if (field == 'dealAmount' || field == 'dealDate') {
                    this.state.detailList[i].isHide = true;
                } else if (field == 'loseAmount' || field == 'loseDate' || field == 'closeReasonText') {
                    this.state.detailList[i].isHide = false;
                }
            } else {
                if (field == 'dealAmount' || field == 'dealDate' || field == 'loseAmount' || field == 'loseDate' || field == 'closeReasonText') {
                    this.state.detailList[i].isHide = true;
                }
            }
        }
        this.setState(this.state.detailList);

        this.state.detailData.customerId = data["customerId"];//chanceName
        this.state.detailData.chanceName = data["chanceName"];
        this.state.detailData.chanceStageId = data["chanceStageId"];
        this.state.detailData.chanceStageText = data["chanceStageText"];
        this.state.detailData.saleStageList = data["saleStageList"];
        this.state.detailData.isColsed = data["isColsed"];
        //statusText status
        this.state.detailData.status = data["status"];
        this.state.detailData.statusText = data["statusText"];
        //closeReason closeReasonText
        this.state.detailData.closeReason = data["closeReason"];
        this.state.detailData.closeReasonText = data["closeReasonText"];

        this.refs.ChanceStage.setStageList(data.saleStageList);
        this.setState(this.state.detailData);
    },

    setFirstList: function (data) {      //设置首行列表
        var list = this.state.tableData.firstList;
        for (var i = 0, len = list.length; i < len; i++) {
            var field = list[i].field;
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
        if (self.state.routeId) {
            AjaxRequest.get(APIS.chance_detail + self.state.routeId, null, function (data) {
                if (data.code == 200 || data.code == '200') {
                    self.state.tableData.lists = data.data;  //设置首页表格数据
                    self.setFirstList(data.data);
                    self.setState(self.state.tableData);
                    self.setDetailData(data.data);    //设置详情

                    //添加滚动
                    self.refs.ChanceStage.scrollLayer();
                    if (data.data.isColsed == 1) {
                        self.setState({disableFun: true});
                    }
                }
            });
        }

    },
    getTracks: function (param) {
        if (this.state.routeId) {
            var self = this,
                thisUrl = APIS.chance_follow.replace('{id}', this.state.routeId);
            AjaxRequest.get(thisUrl + '?pageSize=' + param.pageSize + '&pageNo=' + param.pageNo, null, function (data) {
                if (data.code == 200 || data.code == '200') {
                    self.refs.tracksList.setPagerData(data);
                    window.scroll(0, 0);
                    if (data.data.length > 0) {
                        self.refs.tracksList.setNoData(true, data.totalSize);
                    } else {

                        self.refs.tracksList.setNoData(false, 0);
                    }
                }
            });
        }
    },

    getLinkman: function () {
        var self = this,
            linkmanUrl = APIS.chance_detail + self.state.routeId + '/linkmans';
        AjaxRequest.get(linkmanUrl, null, function (data) {
            if (data.code == 200 || data.code == '200') {
                self.setState({
                    linkmanList: data.data
                })
            }
        });
    },

    getTaskList: function () {
        var self = this,
            taskUrl = APIS.chance_detail + self.state.routeId + '/not_finished_task';
        AjaxRequest.get(taskUrl, null, function (data) {
            if (data.code == 200 || data.code == '200') {
                self.setState({
                    taskList: data.data
                })
            }
        });
    },

    getSaleTeam: function () {
        var self = this,
            teamUrl = APIS.chance_team.replace('{id}', self.state.routeId);
        AjaxRequest.get(teamUrl, null, function (data) {
            if (data.code == 200 || data.code == '200') {
                self.setState({
                    teamList: data.data
                })
            }
        });
    },
    bindInputValue: function () {
        this.refs.competitorAll.setInputValue();
    },
    getCompetitor: function () {
        var self = this,
            competitorUrl = APIS.chance_rival.replace('{id}', self.state.routeId);
        AjaxRequest.get(competitorUrl, null, function (data) {
            if (data.code == 200 || data.code == '200') {
                self.setState({
                    competitorList: data.data
                })
            }
        });
    },
    addCompetitor: function (params) {
        var self = this;
        AjaxRequest.post(APIS.chance_rival_save_pc.replace('{id}', self.state.routeId), params, function (data) {
            if (data.code == 200 || data.code == '200') {
                self.getCompetitor();
            }
        });
    },
    initCompetitorList: function () {
        this.refs.competitorAdd.setSelectValue();
        var self = this;
        AjaxRequest.get(APIS.competitors_list + "?chanceId=" + self.state.routeId, null, function (data) {
            if (data.code == 200 || data.code == '200') {
                var newList = [];
                var list = data.data;
                if (list && list.length > 0) {
                    for (var i = 0; i < list.length; i++) {
                        var obj = {};
                        obj.id = list[i].id;
                        obj.text = list[i].competitorName;
                        newList.push(obj);
                    }
                }
                self.setState({
                    competitorSearchList: newList
                })
            }
        });
    },
    //更新商机竞争对手优劣势
    saveBtn: function (params) {
        var self = this;
        AjaxRequest.put(APIS.chance_rival_good_bad.replace("{id}", params.id), params, function (data) {
            if (data.code == "200") {
                toastr.success("保存成功");
                self.getCompetitor();
            }
        });
    },
    getRemark: function () {
        var self = this,
            remarkUrl = APIS.remark_text_list.replace('{type}', 'chance').replace('{id}', self.state.routeId);
        AjaxRequest.get(remarkUrl, null, function (data) {
            if (data.code == 200 || data.code == '200') {
                self.setState({
                    remarkList: data.data
                });
            }
        });
    },
    getFiles: function () {
        var self = this,
            fileUrl = APIS.remark_files_list.replace('{type}', 'chance').replace('{id}', self.state.routeId);
        AjaxRequest.get(fileUrl, null, function (data) {
            if (data.code == 200 || data.code == '200') {

                //将amr后缀改为mp3
                for (var i = 0; i < data.data.length; i++) {
                    var fileUrl = data.data[i].fileUrl;
                    var originName = data.data[i].originName;
                    if (fileUrl.length > 3 && fileUrl.substring(fileUrl.length - 4, fileUrl.length).toLowerCase() == '.amr') {
                        data.data[i].fileUrl = fileUrl.substring(0, fileUrl.length - 4) + '.mp3';
                        data.data[i].extension = 'mp3';
                        data.data[i].originName = originName.substring(0, originName.length - 4) + '.mp3';
                    }
                }

                self.setState({
                    fileList: data.data
                });
                if (data.data && data.data.length > 0) {
                    //附件列表图片预览
                    $('#dowebokList').viewer({
                        url: 'data-original',
                        built: function () {
                            var ht = $("#dowebokListDiv");
                            $("#dowebokListDiv").remove();
                            $(document.body).append(ht);
                        }
                    });
                    //全部附件图片预览
                    $('#dowebokAll').viewer({
                        url: 'data-original',
                        built: function () {
                            var ht = $("#dowebokAllDiv");
                            $("#dowebokAllDiv").remove();
                            $(document.body).append(ht);
                        }
                    });
                }
            }
        });
    },
    getOtherMsg: function () {
        this.getLinkman();
        this.getTaskList();
        this.getSaleTeam();
        this.getCompetitor();
        this.getRemark();
        this.getFiles();
    },
    //备注
    addRemark: function (val) {
        var self = this;
        if (!val) {
            toastr.error('请输入备注内容');
        }
        var param = {
            content: val,
            entityId: self.state.routeId,
            remarkType: "chance"
        };
        AjaxRequest.post(APIS.notes_add, param, function (data) {
            if (data.code == 200 || data.code == '200') {
                toastr.success('新增备注成功!');
                self.getRemark();
            }
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
            "remarkType": "chance",
            "picFileIds": ids,
            "entityId": self.state.routeId
        };
        AjaxRequest.post(APIS.notes_add, param, function (data) {
            if (data.code == 200 || data.code == '200') {
                toastr.success('上传成功!');
                self.getFiles();
            }
        });
    },

    //销售团队
    addTeams: function (arr) {
        var self = this,
            param = {
                chanceId: self.state.routeId,
                saleStaffIdList: arr
            };
        AjaxRequest.post(APIS.chance_team_add_save, param, function (data) {
            if (data.code == 200 || data.code == '200') {
                toastr.success('添加销售人员成功!');
                self.getSaleTeam();
            }
        });
    },
    deleteTeams: function (id) {
        var self = this;
        AjaxRequest.delete(APIS.chance_team_delete.replace('{id}', id), null, function (data) {
            if (data.code == 200 || data.code == '200') {
                toastr.success('删除销售人员成功!');
                self.getSaleTeam();
            }
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
    initTeamList: function () {
        var lists = this.state.teamList;
        for (var i = 0, len = lists.length; i < len; i++) {
            lists[i].checked = false;
        }
        this.setState({
            teamList: lists
        })
    },
    //添加联系人
    addLinkmans: function (arr) {
        var self = this,
            param = {
                chanceId: self.state.routeId,
                linkmanIdList: arr
            },
            url = APIS.chance_contact.replace('{id}', self.state.routeId);
        AjaxRequest.post(url, param, function (data) {
            if (data.code == 200 || data.code == '200') {
                toastr.success('新增联系人成功!');
                self.getLinkman();
            }
        });
    },
    //修改产品的单价和数量
    btnSave: function (params) {
        var self = this;
        AjaxRequest.put(APIS.chance_product_save + "/" + params.id, params, function (data) {
            if (data.code == 200 || data.code == '200') {
                //alert('修改产品的单价和数量成功!');
                self.getProductList();
                self.hideEditForm(params.id);
            }
        });
    },
    addProduct: function (arr) {
        if (arr.length == 0) {
            return;
        }
        var self = this,
            param = {
                chanceId: self.state.routeId,
                productIdList: arr
            };
        AjaxRequest.post(APIS.chance_product_save, param, function (data) {
            if (data.code == 200 || data.code == '200') {
                toastr.success('添加产品成功!');
                self.getProductList();
            }
        });
    },
    cancelBtn: function (type) {
        if (type == 'del') {//如果是删除操作，那么取消时重新获取列表数据
            this.getProductList();
        }
    },

    showEditForm: function (id, key) {
        var num = $("#productNumber" + id).val();
        $('#spinner' + id).spinner({value: parseInt(num)});

        $("div.modal-preview").hide();
        $("div.modal-preview").eq(key).show();
    },

    hideEditForm: function (id) {
        $("#editDiv" + id).hide();
    },

    initLinkmanSearch: function () {
        this.refs.LinkmansAdd.initLinkmanSearch()
    },
    clearUpList: function () {
        this.refs.fileAdd.clearList();
    },

    /**
     * @param v1 该商机阶段id
     * @param v2 获取是否关闭商机:0开启 1关闭
     * @param v3 关闭商机原因:0 我方签单、1项目丢单、2项目取消
     * @param v4 是否设为已完成， 否：代表设为当前阶段
     */
    finishedTask: function (params) {
        var self = this;
        var url = APIS.finished_stage_task.replace('{id}', this.state.routeId).replace('{stageId}', params.stageId);
        AjaxRequest.put(url, params, function (data) {
            if (data.code == 200) {
                self.getData();
            }
        })
    },
    contextTypes: {
        router: React.PropTypes.object
    },
    /*listen: function () {
        var self = this;
        self.context.router.listen(function (location) {
            var oldId = self.state.routeId;
            var nid = location.pathname.split('/')[2];
            if (location.pathname.match(/chance/)) {
                if (oldId && nid != oldId) {
                    self.state.routeId = nid;
                    self.componentDidMount();
                }
            }
        });
    },*/
    addLinkman: function () {
        /*this.context.router.push({
            pathname: '/linkman/add/0',
            query: {
                customerId: this.state.routeId,
                type: 'chance',
                customerName: this.state.tableData.lists.chanceName
            }
        });*/
        var chanceId = this.state.routeId;
        var customerId = this.state.detailData.customerId;
        hashHistory.push(`/chance/${chanceId}/addLinkman?customerId=${customerId}`);
    },

    addTask: function () {
        /*this.context.router.push({
            pathname: '/task/add/0',
            query: {
                customerId: this.state.tableData.lists.customerId,
                chanceId: this.state.routeId,
                type: 'chance'
            }
        });*/

        var chanceId = this.state.routeId;
        var customerId = this.state.detailData.customerId;
        hashHistory.push(`/chance/${chanceId}/addTask?customerId=${customerId}`);
    },
    selectAllTask: function () {
        /*this.context.router.push({
            pathname: '/task',
            query: {
                customerId: this.state.tableData.lists.customerId,
                chanceId: this.state.routeId,
                type: 'chance'
            }
        });*/

        var chanceId = this.state.routeId;
        var customerId = this.state.detailData.customerId;
        hashHistory.push(`/chance/${chanceId}/task?customerId=${customerId}`);
    },
    addActivity: function () {
        /*this.context.router.push({
            pathname: '/activity/add/0',
            query: {
                customerId: this.state.tableData.lists.customerId,
                chanceId: this.state.routeId,
                type: 'chance'
            }
        });*/
        var chanceId = this.state.routeId;
        var customerId = this.state.detailData.customerId;
        hashHistory.push(`/chance/${chanceId}/addActive?customerId=${customerId}`);
    },
    selectAllProduct: function () {
        /*this.context.router.push({
            pathname: '/product',
            query: {
                customerId: this.state.tableData.lists.customerId,
                chanceId: this.state.routeId,
                type: 'chance'
            }
        });*/
        return null;
    },
    addQuote: function () {
        /*this.context.router.push({
            pathname: '/price/add/0',
            query: {
                customerId: this.state.tableData.lists.customerId,
                chanceId: this.state.routeId,
                type: 'chance'
            }
        });*/
        var chanceId = this.state.routeId;
        hashHistory.push(`/chance/${chanceId}/addPrice`);
    },
    selectAllQuote: function () {
        /*this.context.router.push({
            pathname: '/price',
            query: {
                chanceId: this.state.routeId,
                type: 'chance'
            }
        });*/
        var chanceId = this.state.routeId;
        var chanceName = this.state.detailData.chanceName;
        hashHistory.push(`/chance/${chanceId}/price?chanceName=${chanceName}`);
    },
    closeForm: function (closeReason) {
        this.refs.closeForm.clearValue(closeReason);
        /*this.setState({
         closeReason:closeReason
         });*/
        this.getData();
    },
    render: function () {

        return (
            <div>
                <CurrentPosition routes={this.props.routes} params={this.props.params} />
                <div className="page-body noTopPadding">
                    <div className="row">
                        <div className="page-header position-relative">
                            <div className="header-title">
                                <h1>
                                    {this.state.tableData.lists.chanceName}
                                    <Link to={'/chance/'+this.state.routeId+'/edit'}
                                          style={this.state.disableFun ? {display:'none'} : {}}>
                                        <span className="crm_edit pcicon pcicon-edit"></span>
                                    </Link>
                                </h1>
                            </div>
                            <div className="header-buttons" style={this.state.disableFun ? {display:'none'} : {}}>
                                <div className="glyphicon glyphicon-plus" onClick={this.addActivity}>活动</div>
                                <div className="glyphicon glyphicon-plus" onClick={this.addTask}>任务</div>
                                <div className="glyphicon glyphicon-plus" onClick={this.addQuote}>报价</div>
                                <div className="glyphicon glyphicon-plus" onClick={this.initLinkmanSearch}
                                     data-toggle="modal" data-target="#addLinkmanSearchModal">联系人
                                </div>
                                <div className="glyphicon glyphicon-plus" onClick={this.initCompetitorList}
                                     data-toggle="modal" data-target="#addCompetitorModal">竞争对手
                                </div>

                            </div>
                        </div>
                    </div>
                    <DetailTable lists={this.state.tableData.firstList}/>
                    <ChanceStage ref="ChanceStage" detailData={this.state.detailData} finishedTask={this.finishedTask}
                                 disableFun={this.state.disableFun} closeForm={this.closeForm}/>


                    <div className="row">
                        <div className="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                            <div className="dashboard-box">
                                <div className="box-tabbs">
                                    <div className="tabbable">
                                        <ul className="nav nav-tabs myTab" id="myTab11">
                                            <li className="active">
                                                <a data-toggle="tab" href="#chance-detail">
                                                    商机详情
                                                </a>
                                            </li>
                                            <li onClick={this.getProductQuote}>
                                                <a data-toggle="tab" href="#product-quote">
                                                    产品/报价
                                                </a>
                                            </li>
                                            <li onClick={this.getOtherMsg}>
                                                <a data-toggle="tab" href="#chance-other">
                                                    其他相关
                                                </a>
                                            </li>
                                        </ul>
                                        <div className="tab-content tabs-flat detail-left">
                                            <div id="chance-detail" className="animated fadeInUp tab-pane in active">
                                                <DetailList lists={this.state.detailList}/>
                                            </div>

                                            <div id="product-quote" className="tab-pane animated fadeInUp">
                                                <div className="detail-tab3">
                                                    <ProductList lists={this.state.productList}
                                                                 chanceId={this.state.routeId}
                                                                 selectAllProduct={this.selectAllProduct}
                                                                 cancelBtn={this.cancelBtn} addProduct={this.addProduct}
                                                                 btnSave={this.btnSave} hideEditForm={this.hideEditForm}
                                                                 initCompetitorList={this.initCompetitorList}
                                                                 showEditForm={this.showEditForm}/>
                                                    <QuoteList lists={this.state.quoteList} addQuote={this.addQuote}
                                                               selectAllQuote={this.selectAllQuote}/>
                                                </div>
                                            </div>
                                            <div id="chance-other" className="tab-pane animated fadeInUp">
                                                <div className="detail-tab3">
                                                    <Linkmans lists={this.state.linkmanList}
                                                              initLinkmanSearch={this.initLinkmanSearch}
                                                              type={this.state.type}/>
                                                    <TaskList lists={this.state.taskList} addTask={this.addTask}
                                                              selectAllTask={this.selectAllTask}/>
                                                    <TeamList lists={this.state.teamList}
                                                              initTeamSearch={this.initTeamSearch}
                                                              initTeamList={this.initTeamList}/>
                                                    <CompetitorList lists={this.state.competitorList}
                                                                    bindInputValue={this.bindInputValue}
                                                                    initCompetitorList={this.initCompetitorList}
                                                                    getCompetitor={this.getCompetitor}/>
                                                    <NoteList lists={this.state.remarkList}/>
                                                    <FileList lists={this.state.fileList}
                                                              clearUpList={this.clearUpList}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12" style={{marginTop: -1+'px'}}>
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
                    <CloseForm ref="closeForm" chanceStageId={this.state.detailData.chanceStageId}
                               closeReason={this.state.closeReason} finishedTask={this.finishedTask}/>

                    <LinkmansAll lists={this.state.linkmanList}/>
                    <LinkmansAdd ref="LinkmansAdd" addLinkmans={this.addLinkmans} chanceId={this.state.routeId}/>

                    <TeamAll lists={this.state.teamList}/>
                    <TeamAdd ref="TeamAdds" addTeams={this.addTeams} chanceId={this.state.routeId}/>
                    <TeamDelete deleteTeams={this.deleteTeams}
                                selectTeams={this.selectTeams}
                                lists={this.state.teamList}/>

                    <CompetitorAdd ref="competitorAdd" addCompetitor={this.addCompetitor}
                                   competitorSearchList={this.state.competitorSearchList}/>
                    <CompetitorAll ref="competitorAll" lists={this.state.competitorList} saveBtn={this.saveBtn}/>

                    <NoteAll lists={this.state.remarkList}/>
                    <NoteAdd addNotes={this.addRemark}/>

                    <FileAll lists={this.state.fileList}/>
                    <FileAdd addFile={this.addFile} ref="fileAdd"/>

                </div>
            </div>
        )
    }
});