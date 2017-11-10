import React from 'react';
import {APIS} from '../core/common/config';
import AjaxRequest from '../core/common/ajaxRequest.js';
import TableView from '../core/components/TableList/TableView';
import CurrentPosition from '../core/components/layout/CurrentPosition';
import { Modal, Button } from 'antd';
const confirm = Modal.confirm;

module.exports = React.createClass({
    getInitialState: function () {
        return {
            changed: false,
            tableData: {
                url: APIS.product_types,
                tableName: 'product_class',
                th: [ //列表表头
                    {
                        name: 'checkBox',
                        width: '10%'
                    },
                    {
                        name: '名称',
                        width: '35%'
                    }, {
                        name: '描述',
                        width: '35%'
                    },
                    {
                        name: '操作',
                        width: '20%'
                    }
                ],
                tr: ['', 'name', 'description', 'optAction'] //列表每列显示属性定义
            },
            initParam: {
                q:'',
                pageNo: 1,
                pageSize: 10
            },
            list:[],
            selectShow: false, //帅选框显示/隐藏
            info:{
                "id": '',
                "name": "",
                "description": ""
            },
            allSelect: false,
            isEdit: false
        };
    },
    componentDidMount: function () {
        this.getData();
    },
    getData: function (param) {
        var self = this;
        var args = param || self.state.initParam;

        self.refs.classList.beginLoad(args.pageNo);
        self.setState({allSelect: false});
        AjaxRequest.get(APIS.product_types, args, function (data) {
            if (data.code == '200') {
                self.setState({list: data.data});
                self.refs.classList.setPagerData(data);
            }
        });

    },
    confirmSelect: function (e) { //保存后进行查询
        var self = this;
        var tmp = self.state.initParam;

        tmp.q = self.refs.className.value;
        tmp.pageNo = 1;
        self.setState({initParam: tmp});

        self.getData();
        self.selectShowHide();
    },
    clearMoreSelect: function (e) {
        var self = this;
        self.refs.className.value = '';
        self.setState({
            initParam: {
                q:'',
                pageNo: 1,
                pageSize: 10
            }
        });
    },
    selectShowHide: function () {
        this.setState({selectShow: !this.state.selectShow})
    },//隐藏/显示筛选功能
    selectClick: function(index){
        var list = this.state.list;

        list[index].haschecked = !list[index].haschecked;
        this.setState({list: list});
    },//单选
    selectAllClick: function(){
        /*var list = this.state.list;

        for(var i=0; i<list.length; i++){
            list[i].haschecked = !list[i].haschecked;
        }
        this.setState({list: list});*/

        var allSelect = !this.state.allSelect;
        var list = this.state.list;

        for(var i=0; i<list.length; i++){
            list[i].haschecked = allSelect;
        }
        this.setState({
            list: list,
            allSelect: allSelect
        });
    },//全选
    deleteData: function(){
        var self = this;
        var list = this.state.list;
        var t = [];
        for(var i=0; i<list.length; i++){
            if(list[i].haschecked){
                t.push(list[i].id);
            }
        }
        if(t.length==0){
            toastr.error('请勾选要删除的产品分类');
            return false;
        }

        confirm({
            title: '是否删除',
            content: '数据删将被删除',
            onOk() {
                AjaxRequest.delete(APIS.product_types+'/del?ids='+ t.join(), null, function (data) {
                    if (data.code == '200') {
                        self.setState({initParam: {
                            q:'',
                            pageNo: 1,
                            pageSize: 10
                        }});
                        self.getData();
                    }
                });
            },
            onCancel() {
                return false;
            }
        });
        
    },
    editClick: function(index){
        var item = this.state.list[index];
        this.refs.name.value = item.name;
        this.refs.description.value = item.description;
        this.state.info = null;

        var tmp = {
            "id": item.id,
            "name": item.value,
            "description": item.description
        }

        this.setState({
            info: tmp,
            isEdit: true
        });
        $('#addProductClass').modal('show');
    },//打开编辑功能
    handleChange: function(){
        this.setState({changed: true});
    },
    saveProductClass: function(){
        var self = this;
        var data = this.state.info;
        data.name = this.refs.name.value;
        data.description = this.refs.description.value;

        if(data.name.length==0){
            toastr.error('名称必填');
            return;
        }
        
        if(data.id){
            AjaxRequest.put(APIS.product_types, data, function (data) {
                if (data.code == '200') {
                    self.getData();
                }
            });
        }else{
            AjaxRequest.post(APIS.product_types, data, function (data) {
                if (data.code == '200') {
                    self.getData();
                }
            });
        }
    },//保存编辑结果
    addNewData: function(){
        this.refs.name.value = '';
        this.refs.description.value = '';
        
        this.setState({isEdit: false});

        $('#addProductClass').modal('show');
    },
    render: function () {
        return (
            <div>
                <CurrentPosition routes={this.props.routes} params={this.props.params} />

                <div className="page-body">
                    <div className="dashboard-box my">
                        <div className="box-tabbs">
                            <div className="tabbable my" >
                                <ul className="nav nav-tabs myTab">
                                    <li className="dropdown active">
                                        <a>产品分类</a>
                                    </li>
                                    <div className="DTTT btn-group">
                                        <a className="btn btn-default DTTT_button_collection" onClick={this.addNewData}>
                                            <i className="fa fa-plus" data-toggle="modal"
                                               data-target='#addProductClass'></i>
                                            <span>新建</span>
                                        </a>
                                        <a className="btn btn-default DTTT_button_collection" onClick={this.deleteData}>
                                            <i className="fa fa-trash-o"></i>
                                            <span>删除 </span>
                                        </a>
                                        <a className="btn btn-default DTTT_button_collection" onClick={this.selectShowHide}>
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
                                                <div className="form-group form-li">
                                                    <label>名称</label><br/>
                                                    <input type="text" ref="className" className="form-control"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </ul>


                                <div className="tab-content tabs-flat">
                                    <div id="visits" className="tab-pane animated fadeInUp active">
                                        <TableView ref="classList"
                                                   getData={this.getData}
                                                   initParam={this.state.initParam}
                                                   tableData={this.state.tableData}
                                                   allSelect={this.state.allSelect}
                                                   selectClick={this.selectClick}
                                                   selectAllClick={this.selectAllClick}
                                                   editClick={this.editClick}></TableView>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                {/*

                <div className="page-body">
                    <div className="widget lists">
                        <div className="widget-body">
                            <div role="grid" id="editabledatatable_wrapper"
                                 className="dataTables_wrapper form-inline no-footer">
                                <div
                                    style={{display:this.state.selectShow ? 'block' : 'none', width:380+'px',height:400+'px', zIndex:100, position:'absolute',right:'0px',top:'0px'}}>
                                    <div className="well with-header" style={{background:'#fff',height:'100%'}}>
                                        <div className="header bordered-blue">
                                            <div className="buttons-preview"
                                                 style={{textAlign:'right',paddingTop:10+'px'}}>
                                                <button onClick={this.clearMoreSelect} className="btn btn-cancer">重置
                                                </button>
                                                <button onClick={this.confirmSelect} className="btn btn-danger">确定
                                                </button>
                                            </div>
                                        </div>
                                        <form style={{marginTop:30+'px',paddingLeft:10+'px'}}>
                                            <div className="form-group form-li">
                                                <label>名称</label><br/>
                                                <input type="text" ref="className" className="form-control"/>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="DTTT btn-group" style={{right:'0px',zIndex:100, top: '-40px'}}>
                                    <a className="btn btn-default DTTT_button_collection" onClick={this.addNewData}>
                                        <i className="fa fa-plus" data-toggle="modal"
                                           data-target='#addProductClass'></i>
                                        <span>新建</span>
                                    </a>
                                    <a className="btn btn-default DTTT_button_collection" onClick={this.deleteData}>
                                        <i className="fa fa-trash-o"></i>
                                        <span>删除 </span>
                                    </a>
                                    <a className="btn btn-default DTTT_button_collection" onClick={this.selectShowHide}>
                                        <i className="fa fa-filter"></i>
                                        <span>筛选 <i className="fa fa-angle-down"></i></span>
                                    </a>
                                </div>
                                <div style={{marginTop: '40px'}}>
                                    <TableView ref="classList"
                                               getData={this.getData}
                                               initParam={this.state.initParam}
                                               tableData={this.state.tableData}
                                               allSelect={this.state.allSelect}
                                               selectClick={this.selectClick}
                                               selectAllClick={this.selectAllClick}
                                               editClick={this.editClick}
                                    ></TableView>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                 */}


                <div className="container-fluid text-center">
                    <div className="modal fade" id="addProductClass" role="dialog" aria-labelledby="myModalLabel"
                         aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                                        &times;
                                    </button>
                                    <h4 className="modal-title">{this.state.isEdit ? '编辑产品分类' : '新增产品分类'}</h4>
                                </div>
                                <div className="modal-body layer-public">
                                    <div id="horizontal-form">
                                        <form className="form-horizontal" role="form">
                                            <div className="row otherRow">
                                                <div className="col-sm-12">
                                                    <div className="form-group">
                                                        <label>分类名称<sup>*</sup></label>
                                                        <div className="input-icon icon-right">
                                                            <input ref="name" type="text" className="form-control"
                                                                   onChange={this.handleChange}
                                                                   name="activityName" placeholder="请输入产品分类名称"/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row otherRow">
                                                <div className="col-sm-12">
                                                    <div className="form-group">
                                                        <label htmlFor="needs">分类描述</label>
                                                        <div className="input-icon icon-right">
																	<textarea ref="description" type="text"
                                                                              className="form-control"
                                                                              onChange={this.handleChange}
                                                                              rows="4"
                                                                              placeholder="请输入产品分类描述"/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default" data-dismiss="modal">取消
                                    </button>
                                    <button type="button" onClick={this.saveProductClass} className="btn btn-danger"
                                            data-dismiss="modal">
                                        保存
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});