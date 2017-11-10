import React from 'react';
import TableView from '../core/components/TableList/TableView.js';
import Select2 from '../core/components/Select2/Select2.js';
import '../core/components/Select2/select2.min.css';
import AjaxRequest from '../core/common/ajaxRequest.js';
import {APIS} from '../core/common/config';
import UserInfo from '../core/common/UserInfo.js';
import CurrentPosition from '../core/components/layout/CurrentPosition';
import {Modal, Button} from 'antd';
const confirm = Modal.confirm;

module.exports = React.createClass({

    /*初始化数据格式*/
    getInitialState: function () {
        var isManger = UserInfo.isManager();
        var tableData = {               //存放表格数据
            tableName: 'document',
            type: "islink",//类别,表示islink表示是链接,而不是路由
            th: [
                {
                    name: '标题',
                    width: 240
                }, {
                    name: '创建时间',
                    width: 170
                }, {
                    name: '浏览次数',
                    width: 150
                }, {
                    name: '类型',
                    width: 150
                }, {
                    name: '大小',
                    width: 150
                }
            ],
            tr: ['fileName', 'createdOn', 'readcount', 'fileSuffix', 'fileSize']
        };

        if (isManger) {
            tableData = {               //存放表格数据
                tableName: 'document',
                type: "islink",//类别,表示islink表示是链接,而不是路由
                th: [
                    {
                        name: 'checkBox',
                        width: '10%'
                    },
                    {
                        name: '标题',
                        width: 240
                    }, {
                        name: '创建时间',
                        width: 170
                    }, {
                        name: '浏览次数',
                        width: 150
                    }, {
                        name: '类型',
                        width: 150
                    }, {
                        name: '大小',
                        width: 150
                    }
                ],
                tr: ['', 'fileName', 'createdOn', 'readcount', 'fileSuffix', 'fileSize']
            };
        }
        return {
            isManger: isManger,
            initParam: {
                "q": "",
                "wordType": "",
                "pageNo": 1,
                "pageSize": 10
            },    //搜索列表参数
            tableData: tableData,
            selectPP: {                //存放帅选框的数据
                value1: null,
                documentName: null,
                data1: [
                    {text: 'docx', id: 'docx'},
                    {text: 'doc', id: 'doc'},
                    {text: 'xlsx', id: 'xlsx'},
                    {text: 'xls', id: 'xls'},
                    {text: 'ppt', id: 'ppt'},
                    {text: 'ppts', id: 'ppts'},
                    {text: 'pdf', id: 'pdf'}
                ]
            },
            selectShow: false,      //帅选框显示/隐藏
            totalSize: 0,
            list: [],
            allSelect: false
        }
    },
    setSelectType: function (index, text) {
        this.setState({
            curentSelect: {
                name: text,
                index: index
            }
        });
        //这里执行帅选后的回调
        this.getData();
    },

    /*调用数据处理接口*/
    componentWillMount: function () {
    },
    componentDidMount: function () {
        var self = this;
        self.getData(self.state.initParam)
    },

    setDocumentType: function () {
        var self = this;
        self.state.selectPP.value1 = self.refs.type.el.val();
        self.setState(self.state.selectPP);
    },
    setDocumentName: function () {
        var self = this;
        self.state.selectPP.documentName = event.target.value;
        self.setState(self.state.selectPP);
    },

    /*弹出框列表渲染*/
    renderDataname() {
        return (
            <div>
                文档名称<br/>
                <input type="text" className="form-control" ref="documentName" onChange={this.setDocumentName}/>
            </div>
        );
    },
    renderDatastyle() {
        return (
            <div>
                文档类型<br/>
                <Select2
                    ref="type"
                    multiple
                    onSelect={this.setDocumentType}     //选择回调 ,如果是单选,只调用这个就行了
                    onUnselect={() => console.log('onUnselect')}  //删除回调
                    data={this.state.selectPP.data1}
                    value={ this.state.selectPP.value1 }
                    options={
            {
              placeholder: '文档类型'
            }
          }
                />
            </div>
        );
    },


    confirmSelect: function () {      //保存后进行查询
        var self = this;
        self.setState({
            selectShow: false
        });
        self.state.initParam['q'] = self.refs.documentName.value;
        self.state.initParam['wordType'] = self.refs.type.el.val() || "";
        self.setState(self.state.initParam);
        self.getData(self.state.initParam);
        self.clearMoreSelect();

    },
    clearMoreSelect: function () {

    },
    cancerSelect: function () {
        var self = this;
        self.refs.documentName.value = '';
        self.refs.type.setValue('');
        self.state.initParam['q'] = '';
        self.state.initParam['wordType'] = "";
        self.setState(self.state.initParam);
    },

    selectShowHide: function (e) {
        //e.preventDefault();
        var self = this;
        self.setState({
            selectShow: !self.state.selectShow
        })
    },

    /*获取数据*/
    getData: function (args) {
        var self = this;
        var url_head = APIS.marketingAnalysis;
        var param = args || self.state.initParam;
        var thisUrl = url_head + '?pageSize=' + param.pageSize + '&pageNo=' + param.pageNo + '&q=' + param.q + '&wordType=' + param.wordType;


        self.refs.document.beginLoad(param.pageNo);
        self.setState({allSelect: false});
        AjaxRequest.get(thisUrl, param, function (res) {
            if (res.code == 200) {
                self.refs.document.setPagerData(res);
                self.setState({totalSize: res.totalSize});
                self.setState({list: res.data});
            } else {
                console.log('请求失败!')
            }
        });
    },
    selectClick: function (index) {
        var list = this.state.list;

        list[index].haschecked = !list[index].haschecked;
        this.setState({list: list});
    },//单选
    selectAllClick: function () {
        var allSelect = !this.state.allSelect;
        var list = this.state.list;

        for (var i = 0; i < list.length; i++) {
            list[i].haschecked = allSelect;
        }
        this.setState({
            list: list,
            allSelect: allSelect
        });
    },//全选
    deleteData: function () {
        var self = this;
        var list = this.state.list;
        var t = [];
        for (var i = 0; i < list.length; i++) {
            if (list[i].haschecked) {
                t.push(list[i].id);
            }
        }
        if (t.length == 0) {
            toastr.error('请勾选要删除的产品分类');
            return false;
        }

        confirm({
            title: '是否删除',
            content: '数据删将被删除',
            onOk() {
                AjaxRequest.delete(APIS.marketingAnalysis + '/del?ids=' + t.join(), null, function (data) {
                    if (data.code == '200') {
                        self.setState({
                            initParam: {
                                "q": "",
                                "wordType": "",
                                "pageNo": 1,
                                "pageSize": 10
                            }
                        });
                        self.getData();
                    }
                });
            },
            onCancel() {
                return false;
            }
        });

    },

    /*渲染*/
    render: function () {
        var self = this;
        var isManger = self.state.isManger;

        function renderAddBtn() {
            if (!isManger) return null;
            return (
                <a className="btn btn-default DTTT_button_copy" href="#/document/add/0">
                    <i className="fa fa-plus"/>
                    <span>新建 </span>
                </a>
            );
        }

        function renderDelBtn() {
            if (!isManger) return null;
            return (
                <a className="btn btn-default DTTT_button_copy" onClick={self.deleteData}>
                    <i className="fa fa-trash-o"/>
                    <span>删除 </span>
                </a>
            );
        }

        return (
            <div>
                <CurrentPosition routes={this.props.routes} params={this.props.params} />
                <div className="page-body">
                    <div className="dashboard-box my">
                        <div className="box-tabbs">
                            <div className="tabbable my" >
                                <ul className="nav nav-tabs myTab">
                                    <li className="dropdown active">
                                        <a>全部文档</a>
                                    </li>

                                    <div className="DTTT btn-group">
                                        {renderAddBtn()}
                                        {renderDelBtn()}
                                        <a onClick={this.selectShowHide}
                                           className="btn btn-default DTTT_button_collection">
                                            <i className="fa fa-filter"></i>
                                            <span>筛选 <i className="fa fa-angle-down"></i></span>
                                        </a>
                                    </div>

                                    <div style={{display:this.state.selectShow ? 'block' : 'none', width:380+'px',height:400+'px', zIndex:100, position:'absolute',right:1+'px',top:42+'px'}}>
                                        <div className="well with-header" style={{background:'#fff',height:'100%'}}>
                                            <div className="header bordered-blue">
                                                <div className="buttons-preview" style={{textAlign:'right',paddingTop:10+'px'}}>
                                                    <button onClick={this.cancerSelect} className="btn btn-cancer">重置</button>
                                                    <button onClick={this.confirmSelect} className="btn btn-danger">确定</button>
                                                </div>
                                            </div>
                                            <div style={{marginTop:30+'px',paddingLeft:10+'px'}}>

                                                {this.renderDataname()}<br/>
                                                {this.renderDatastyle()}<br/>
                                            </div>
                                        </div>
                                    </div>
                                </ul>

                                <div className="tab-content tabs-flat">
                                    <div id="visits" className="tab-pane animated fadeInUp active">
                                        <TableView ref="document"
                                                   getData={this.getData}
                                                   initParam={this.state.initParam}
                                                   tableData={this.state.tableData}
                                                   allSelect={this.state.allSelect}
                                                   selectClick={this.selectClick}
                                                   selectAllClick={this.selectAllClick}
                                        />
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
                                <div
                                    style={{display:this.state.selectShow ? 'block' : 'none', width:380+'px',height:300+'px', zIndex:100, position:'absolute',right:-12+'px',top:34+'px'}}>
                                    <div className="well with-header" style={{background:'#fff',height:'100%'}}>
                                        <div className="header bordered-blue">
                                            <div className="buttons-preview"
                                                 style={{textAlign:'right',paddingTop:10+'px'}}>
                                                <button onClick={this.cancerSelect} className="btn btn-cancer">重置
                                                </button>
                                                <button onClick={this.confirmSelect} className="btn btn-danger">确定
                                                </button>
                                            </div>
                                        </div>
                                        <div style={{marginTop:30+'px',paddingLeft:10+'px'}}>
                                            {this.renderDataname()}<br/>
                                            {this.renderDatastyle()}<br/>
                                        </div>
                                    </div>
                                </div>
                                <div style={{marginBottom:20+'px'}}>
                                    <div className="DTTT btn-group" style={{right:0+'px'}}>
                                        {renderAddBtn()}
                                        {renderDelBtn()}
                                        <a onClick={this.selectShowHide}
                                           className="btn btn-default DTTT_button_collection">
                                            <i className="fa fa-filter"></i>
                                            <span>筛选 <i className="fa fa-angle-down"></i></span>
                                        </a>
                                    </div>
                                    <div id="dropdownbuttons">
                                        全部文档
                                    </div>
                                </div>
                                <TableView ref="document"
                                           getData={this.getData}
                                           initParam={this.state.initParam}
                                           tableData={this.state.tableData}
                                           allSelect={this.state.allSelect}
                                           selectClick={this.selectClick}
                                           selectAllClick={this.selectAllClick}
                                />
                            </div>
                        </div>
                    </div>
                </div>*/}

            </div>
        )
    }
});
