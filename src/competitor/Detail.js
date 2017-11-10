import React, { Component } from 'react';
import {Link} from 'react-router';
import AjaxRequest from '../core/common/ajaxRequest.js';
import {APIS} from '../core/common/config';
import DetailTable from '../core/components/DetailTable/List';
import CompetitorChance from '../core/components/CompetitorChance/List';
import CompetitorProduct from '../core/components/CompetitorProduct/List';
import CurrentPosition from '../core/components/layout/CurrentPosition';

import Linkmans from '../core/components/CompetitorLinkman/List';
import LinkmansAdd from '../core/components/Linkmans/Add';
import LinkmansAll from '../core/components/Linkmans/All';

import NoteList from '../core/components/NoteList/List';
import NoteAll from '../core/components/NoteList/All';
import NoteAdd from '../core/components/NoteList/Add';

import FileList from '../core/components/FileList/List';
import FileAll from '../core/components/FileList/All';
import FileAdd from '../core/components/FileList/Add';

module.exports = React.createClass({

    getInitialState:function(){
        return {
            routeId: this.props.params.id,
            tableData: {                       //详情首行表格
                firstList:[
                    {
                        name: '客户地址',
                        value: '',
                        field:'address.address',
                        iconClass:'yellow pcicon-addr'
                    }, {
                        name: '公司电话',
                        value: '',
                        field:'competitorPhone',
                        iconClass:'green pcicon-phone'
                    },{
                        name: '竞争总金额',
                        value: '',
                        field:'totalAmount',
                        iconClass:'red pcicon pcicon-realMoney'
                    },{
                        name: '创建时间',
                        value: '',
                        field:'createdOn',
                        iconClass:'blue pcicon-clock'
                    }
                ],
                lists: []
            },
            chanceList:[],
            productList:[],
            linkmanList:[],
            remarkList:[],
            fileList:[],
            chanceSize:null
        }

    },
    setFirstList:function (data) {      //设置首行列表
        var list = this.state.tableData.firstList;
        for(var i=0,len=list.length; i<len; i++){
            var field = list[i].field;
            if(field == 'totalAmount'){
                list[i].value = data[field];//'￥'+toThousands(data[field]);
            }else if(field.split('.').length == 2){
                var arrs = field.split('.'),
                    arr_1 = arrs[0],
                    arr_2 = arrs[1];
                list[i].value = data[arr_1][arr_2];
            }else{
                list[i].value = data[field];
            }

        }
    },
    getData:function () {
        var self = this;
        AjaxRequest.get(APIS.competitors_detail+self.state.routeId, null, function(body){
            if(body.code == 200 || body.code == '200'){
                self.state.tableData.lists = body.data;  //设置首页表格数据
                self.setFirstList(body.data);
                self.setState(self.state.tableData);
            }
        });
    },
    getChances:function () {
        var self = this;
        AjaxRequest.get(APIS.competitors_detail+self.state.routeId+"/chances", null, function(body){
            if(body.code == 200 || body.code == '200'){
                self.setState({
                    chanceList:body.data,
                    chanceSize:body.totalSize
                })
            }
        });
    },
    getProduct:function(){
        var self = this;
        AjaxRequest.get(APIS.competitors_detail+self.state.routeId+"/products", null, function(body){
            if(body.code == 200 || body.code == '200'){
                self.setState({
                    productList:body.data
                })
            }
        });
    },

    getLinkman:function(){
        var self = this;
        AjaxRequest.get(APIS.competitors_detail+self.state.routeId+"/linkman", null, function(body){
            if(body.code == 200 || body.code == '200'){
                self.setState({
                    linkmanList:body.data
                })
            }
        });
    },
    getRemark:function(){
        var self = this,
            remarkUrl = APIS.remark_text_list.replace('{type}','competitor').replace('{id}',self.state.routeId);
        AjaxRequest.get(remarkUrl, null, function(body){
            if(body.code == 200 || body.code == '200'){
                self.setState({
                    remarkList:body.data
                })
            }
        });
    },
    getFiles:function(){
        var self = this,
            fileUrl = APIS.remark_files_list.replace('{type}','competitor').replace('{id}',self.state.routeId);
        AjaxRequest.get(fileUrl, null, function(body){
            if(body.code == 200 || body.code == '200'){

                //将amr后缀改为mp3
                for (var i = 0; i < body.data.length; i++) {
                    var fileUrl=body.data[i].fileUrl;
                    var originName=body.data[i].originName;
                    if(fileUrl.length>3 && fileUrl.substring(fileUrl.length-4,fileUrl.length).toLowerCase() =='.amr'){
                        body.data[i].fileUrl=fileUrl.substring(0,fileUrl.length-4)+'.mp3';
                        body.data[i].extension='mp3';
                        body.data[i].originName=originName.substring(0,originName.length-4)+'.mp3';
                    }
                }
                self.setState({
                    fileList:body.data
                });
                if(body.data && body.data.length > 0){
                    //附件列表图片预览
                    $('#dowebokList').viewer({
                        url: 'data-original',
                        built: function() {
                            var ht = $("#dowebokListDiv");
                            $("#dowebokListDiv").remove();
                            $(document.body).append(ht);
                        }
                    });
                    //全部附件图片预览
                    $('#dowebokAll').viewer({
                        url: 'data-original',
                        built: function() {
                            var ht = $("#dowebokAllDiv");
                            $("#dowebokAllDiv").remove();
                            $(document.body).append(ht);
                        }
                    });
                }
            }
        });
    },
    getOtherMsg:function(){
        this.getLinkman();
        this.getRemark();
        this.getFiles();
    },
    addLinkmans:function (param) {
        var self = this,
            params = param;
        params['competitorId'] = parseInt(this.state.routeId);

        AjaxRequest.post(APIS.competitors_contact_save, params, function(body){
            if(body.code == 200 || body.code == '200'){
                alert('新增联系人成功!');
                self.getLinkman();
            }
        });
    },
    addRemark:function (val) {
        var self = this;

        if(!val){
            alert('请输入备注内容')
        }
        var params = {
            content: val,
            entityId:self.state.routeId,
            remarkType: "competitor"
        };

        AjaxRequest.post(APIS.notes_add, params, function(body){
            if(body.code == 200 || body.code == '200'){
                alert('新增备注成功!');
                self.getRemark();
            }
        });
    },

    addFile:function (data) {
        var self = this,
            ids = [];
        for(var i=0,len=data.length;i<len;i++){
            ids.push(data[i].fId);
        }
        ids = ids.join(',');

        var params = {
            "content":"",
            "remarkType":"competitor",
            "picFileIds":ids,
            "entityId":self.state.routeId
        };

        AjaxRequest.post(APIS.notes_add, params, function(body){
            if(body.code == 200 || body.code == '200'){
                alert('上传成功!');
                self.getFiles();
            }
        });
    },
    clearAddValue:function () {
        this.refs.linkmansAdd.clearValue();
    },
    clearUpList:function () {
        this.refs.fileAdd.clearList();
    },

    componentWillUnmount:function(){
        $("#dowebokListDiv").remove();
        $("#dowebokAllDiv").remove();
    },
    componentDidMount:function(){
        this.getData();  //详情
        this.getChances();
    },

    render:function(){

        return (
            <div>
                <CurrentPosition routes={this.props.routes} params={this.props.params} />
                <div className="page-body noTopPadding">
                    <div className="row">
                        <div className="page-header position-relative">
                            <div className="header-title">
                                <h1>
                                    {this.state.tableData.lists.competitorName}
                                    <Link to={'/competitor/'+this.state.routeId+'/edit'}>
                                        <span className="crm_edit pcicon pcicon-edit"></span>
                                    </Link>
                                </h1>
                            </div>
                            <div className="header-buttons">
                                <div className="glyphicon glyphicon-plus" data-toggle="modal" onClick={this.clearAddValue} data-target="#addLinkmanModal">联系人</div>
                            </div>
                        </div>
                    </div>
                    <div className="detail-table">
                        <DetailTable lists={this.state.tableData.firstList} />
                    </div>

                    <div className="row">
                        <div className="col-lg-12 col-sm-12 col-xs-12">
                            <div className="dashboard-box">
                                <div className="box-tabbs">
                                    <div className="tabbable">
                                        <ul className="nav nav-tabs myTab" id="myTab11">
                                            <li className="active">
                                                <a data-toggle="tab" href="#competitor-chance">
                                                    商机({this.state.chanceSize})
                                                </a>
                                            </li>
                                            <li onClick={this.getProduct}>
                                                <a data-toggle="tab" href="#competitor-product">
                                                    产品
                                                </a>
                                            </li>
                                            <li onClick={this.getOtherMsg}>
                                                <a data-toggle="tab" href="#competitor-othermsg">
                                                    其他相关
                                                </a>
                                            </li>
                                        </ul>
                                        <div className="tab-content tabs-flat detail-left">
                                            <div id="competitor-chance" className="animated fadeInUp tab-pane in active">
                                                <div className="detail-tab3">
                                                    <CompetitorChance lists={this.state.chanceList}/>
                                                </div>
                                            </div>

                                            <div id="competitor-product" className="tab-pane animated fadeInUp">
                                                <div className="detail-tab3">
                                                    <CompetitorProduct lists={this.state.productList}/>
                                                </div>
                                            </div>
                                            <div id="competitor-othermsg" className="tab-pane animated fadeInUp">
                                                <div className="detail-tab3">
                                                    <Linkmans lists={this.state.linkmanList} clearAddValue={this.clearAddValue}/>
                                                    <NoteList lists={this.state.remarkList}/>
                                                    <FileList lists={this.state.fileList}  clearUpList={this.clearUpList}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container-fluid text-center">
                    <LinkmansAll lists={this.state.linkmanList} />
                    <LinkmansAdd ref="linkmansAdd" addLinkmans={this.addLinkmans} />

                    <NoteAll lists={this.state.remarkList} />
                    <NoteAdd addNotes={this.addRemark} />

                    <FileAll lists={this.state.fileList} />
                    <FileAdd addFile={this.addFile} ref="fileAdd"/>
                </div>
            </div>
        )
    }
});