import React, {Component} from 'react';
import {Link, hashHistory} from 'react-router';
import AjaxRequest from '../core/common/ajaxRequest';
import DetailTable from '../core/components/DetailTable/List';
import UserInfo from '../core/common/UserInfo.js';

import DataList from '../linkman/components/DataList';
import AllData from '../linkman/components/AllData';
import PriceList from './components/PriceList';
import Approval from './components/Approval';

import NoteAdd from '../core/components/NoteList/Add';
import FileAdd from '../core/components/FileList/Add';
import {APIS} from '../core/common/config';
import CurrentPosition from '../core/components/layout/CurrentPosition';
/**
 *
     var url = APIS.sales_price_detail+'/'+self.state.routeId, //报价详情
     thisUrl = APIS.sales_price_detail_approvalsList + self.state.routeId + '/approvals',//报价审批
 *
 */
module.exports = React.createClass({
    getInitialState: function () {
        return {
            routeId: parseInt(this.props.params.priceId),
            optProductUrl: CONFIG.SERVICE+'v1/products?q={keyword}&quotationId={quotationId}',//商机中可选商品列表
            modifyQuotations: CONFIG.SERVICE+'v1/chance_quotation_products/{quotationProductId}',//PUT:修改产品单价和数量; DELETE:删除报价中的产品
            quotationsDetail: CONFIG.SERVICE+'v1/chance_quotations/',
            showEditBtn: false,//编辑按钮
            showApprovedBtn: false,//审批按钮
            totalMoney:'',//报价总金额
            quotationName:'暂无报价名称',
            statusText:'',//报价状态文本
            status:'',//报价状态
            chanceId:0,
            firstList: [
                {
                    name: '客户',
                    value: '',
                    filed: 'customerName',
                    iconClass: 'yellow pcicon-customer'
                }, {
                    name: '商机',
                    value: '',
                    filed: 'chanceName',
                    iconClass: 'blue pcicon-business'
                }, {
                    name: '过期日',
                    value: '',
                    filed: 'overdueDate',
                    iconClass: 'green pcicon pcicon-Expiration'
                }, {
                    name: '责任人',
                    value: '',
                    filed: 'saler',
                    iconClass: 'red pcicon pcicon-head'
                }
            ],
            memoList: [],
            appendixList: [],
            memoDailogId: "memoModal",
            appendixDailogId: "appendixModal",
            productList: [],//属于当前报价的产品列表
            optProductList:[],//可选商品列表（变化）
            approvalList:[],//审批数据列表
            priceInfo: {
                "id": 0,
                "quotationName": "",
                "status": 0,
                "statusText": "拟定",
                "chanceName":"",
                "chanceId":0,
                "customerName": "",
                "customerId": 0,
                "overdueDate": "",
                "fromEntityType": "",
                "inputSource": 0
            },
            approvedArgs: {
                "createdBy": 0,
                "chanceQuotationId": 0,
                "approvedResult": '',
                "approvedContent": ''
            }
        }

    },

    componentWillMount: function () {

    },

    componentDidMount: function () {
        this.getData();  //报价详细数据
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
            thisUrl = self.state.quotationsDetail + self.state.routeId;
        AjaxRequest.get(thisUrl, '', function (res) {
            if (res.code = "200") {
                self.setFirstList(res.data);
                self.setDetailState(res.data);
            } else {
                console.log('请求失败!')
            }
        });
    },

    setDetailState:function(data){
        this.setState({totalMoney: data.amount});
        this.setState({quotationName: data.quotationName});
        this.setState({statusText: data.statusText});
        this.setState({status: data.status});
        this.setState({chanceId: data.chanceId});

        var permit = UserInfo.getRolePermit();
        var currentUser = UserInfo.staffId();

        if(currentUser == data.createdBy){//创建者角色
            if(data.status===0 || data.status===3){//status ，报价状态：0拟定，3已拒绝
                this.setState({showEditBtn: true});
            }
        }
        if(currentUser === data.approvedBy){//默认审批人为：提交审批者的直属上级(后台确定)
            //0拟定，1审批中，2已同意，3已拒绝
            if( data.status ==1 ){
                this.setState({showApprovedBtn: true});
            }
        }

        var info = this.state.priceInfo;
        for (var key in info) {
            info[key] = data[key];
        }

        this.setState({priceInfo: info});

        this.refs.productList.setPropsToState();
        this.setState({productList: data.productList});

        this.state.approvedArgs.createdBy = data.createdBy;
        this.state.approvedArgs.chanceQuotationId = data.id;

        this.getOptProductList();
    },

    getOptProductList:function(kw){
        var self = this,
            productUrl = self.state.optProductUrl.replace('{quotationId}',self.state.routeId).replace('{keyword}',kw||'');

        AjaxRequest.get(productUrl, null, function(body) {
            self.state.optProductList = body.data;
            self.setState(self.state.optProductList);
        });
    },//获取可选商品列表

    getNewProductList:function(){
        var self = this;
        this.getOptProductList();

        var url = this.state.quotationsDetail + this.state.routeId;
        AjaxRequest.get(url, null, function(body) {
            self.setState({productList: body.data.productList});
        });
    },//更新报价的产品列表，可选产品列表

    handleAddProduct: function(idList){
        var tmp = this.state.optProductList;
        var pdList = this.state.productList;
        var list = new Array();

        for(var i=0; i < idList.length; i++){
            var id = idList[i];

            for(var j=0; j<tmp.length; j++){
                if(id == tmp[j].id){
                    tmp[j].quantity = 1;//添加时默认数量设为1
                    tmp[j].amount = tmp[j].productPrice;
                    list.push(tmp[j]);
                    tmp.splice(j,1);
                    break;
                }
            }
        }
        pdList = pdList.concat(list);

        var quotationsId = this.state.routeId;//报价ID
        if(quotationsId > 0){
            var self = this;
            var url = this.state.quotationsDetail+this.state.routeId;
            var args = this.state.priceInfo;
            args.productList = pdList;
            AjaxRequest.put(url, args, function(data){
                self.getNewProductList();//更新报价的产品列表，可选产品列表
            });
        }else{//模拟添加
            this.state.productList = pdList;
            this.setState(this.state.productList);
            this.state.optProductList = tmp;
            this.setState(this.state.optProductList);
        }
    },//添加产品

    handleDelProduct: function(id){
        var pdList = this.state.productList;

        for(var i=0; i < pdList.length; i++){
            if(id == pdList[i].id){
                id = pdList[i].quotationProductId||0;//产品报价Id
                pdList.splice(i,1);
                break;
            }
        }

        var quotationsId = this.state.routeId;
        if(quotationsId > 0 && id>0){//报价ID 和 报价中的产品Id同时存在
            var self = this;
            AjaxRequest.delete(
                this.state.modifyQuotations.replace('{quotationProductId}', id),
                null,
                function(data){
                    self.getNewProductList();//更新报价的产品列表，可选产品列表
            });
        }else{//模拟删除
            this.state.productList = pdList;
            this.setState(this.state.productList);
        }
    },//删除产品

    editProductPriceNum:function(obj){
        console.log('--->');
        var list = this.state.productList, id=0;

        for(var i=0; i<list.length; i++){
            if(obj.id == list[i].id){
                id = list[i].quotationProductId || 0;//产品报价Id
                list[i].productPrice = obj.productPrice;
                list[i].quantity = obj.quantity;
                break;
            }
        }

        var quotationsId = this.state.routeId;
        if(quotationsId > 0 && id>0){//报价ID 和 报价中的产品Id同时存在
            var self = this;
            AjaxRequest.put(
                this.state.modifyQuotations.replace('{quotationProductId}', id),
                {
                    "productPrice":obj.productPrice,
                    "quantity":obj.quantity
                }
                ,
                function(data){
                    self.getNewProductList();//更新报价的产品列表，可选产品列表
                });
        }else{//模拟修改
            this.state.productList = list;
            this.setState(this.state.productList);
        }
    },//修改产品单价和数量

    getApprovalList:function(){
        var self = this,
            url = CONFIG.SERVICE+"v1/chance_quotations/"+self.state.routeId+"/approvals?pageNo=1&pageSize=100";
        AjaxRequest.get(url, "", function (res) {
            if (res.code = "200") {
                self.state.approvalList = (res.data.approvalList instanceof Array)? res.data.approvalList : [];
                self.refs.approvalList.renderApproval(res.data);
            } else {
                console.log('请求失败!')
            }
        });
    },//获取审批数据

    getOtherMsg: function () {
        this.getMemoList();
        this.getAppendixList();
    },

    addMemo: function (val) {
        var self = this;
        if (!val) {
            toastr.error('请输入备注内容');
            return;
        }
        AjaxRequest.post(APIS.notes_add, {
            content: val,
            entityId: self.state.routeId,
            remarkType: "price"
        }, function (res) {
            if (res.code = "200") {
                toastr.success('新增备注成功!');
                self.getMemoList();
            } else {
                console.log('请求失败!')
            }
        });
    },//添加备忘

    getMemoList: function () {//"v1/remarks/{type}/{id}"
        var self = this,

        thisUrl = APIS.remark_text_list.replace('{type}', 'price').replace('{id}', self.state.routeId);
        AjaxRequest.get(thisUrl, null, function(res) {
            self.setMemoList(res.data);
        });

    },//获取备注列表

    setMemoList: function (data) {
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

    addAppendix: function (data) {
        var self = this,
            ids = [];
        for (var i = 0, len = data.length; i < len; i++) {
            ids.push(data[i].fId);
        }
        ids = ids.join(',');

        AjaxRequest.post(APIS.notes_add, {
            "content": "",
            "remarkType": "price",
            "picFileIds": ids,
            "entityId": self.state.routeId
        }, function (res) {
            if (res.code = "200") {
                alert('新增附件成功!');
                self.getAppendixList();
            } else {
                console.log('请求失败!')
            }
        });
    },//添加附件

    getAppendixList: function () {
        var self = this,
            thisUrl = APIS.remark_files_list.replace('{type}', 'price').replace('{id}', self.state.routeId);
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

    setAppendixList: function (data) {
        var list = new Array();

        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            item.originName = item.originName.split('.')[0];
            item.extension = item.extension.replace(/.*?\./, '').toUpperCase();
            list.push(item);
        }
        this.state.appendixList = list;
        this.setState(this.state.appendixList);
    },//更新状态appendixList

    contextTypes: {
        router: React.PropTypes.object
    },
    addQuotation:function () {
        this.context.router.push({
            pathname: '/price/add/0'
        });
    },

    approval:function(content, type){
        var self = this;
        var args = self.state.approvedArgs;

        args.approvedResult = type;
        args.approvedContent = content;

        AjaxRequest.post(APIS.priceApproval, args, function(res){
            toastr.success('报价审批已确认');
            self.getData();
        });
    },//报价审批

    goEdit: function(){
        var rPath = this.props.routes[1].path;
        var chanceId = this.props.params.chanceId;
        var priceId = this.state.routeId;

        if(rPath == 'price'){
            hashHistory.push(`/price/${priceId}/edit`);
        }else if(rPath == 'chance'){
            hashHistory.push(`/chance/${chanceId}/price/${priceId}/edit`);
        }
    },

    render: function () {
        var minH_74 = {minHeight:'74px'};
        var add_del, approvalBtn;

        if(this.state.showApprovedBtn){
            approvalBtn = (
                <div className="header-buttons">
                    <div className="glyphicon" data-toggle="modal" data-target="#approvalDailog">审批</div>
                </div>
            );
        }else{
            approvalBtn = '';
        }
        if(this.state.showEditBtn){
            add_del = (
                <h5 className="row-title before-darkorange">
                    <span>
                        产品报价行&nbsp;&nbsp;总金额：<span className="fColorRed">¥{toThousands(this.state.totalMoney)}</span>
                    </span>
                    <a className="btn" data-toggle="tab" href="#delPriceRow">
                        <i className="fa fa-minus"></i>
                        删除产品
                    </a>
                    <a className="btn" data-toggle="tab" href="#addPriceRow">
                        <i className="fa fa-plus"></i>
                        添加产品
                    </a>
                </h5>
            );
        }else{
            add_del = (
                <h5 className="row-title before-darkorange">
                    <span>
                        产品报价行&nbsp;&nbsp;总金额：<span className="fColorRed">¥{toThousands(this.state.totalMoney)}</span>
                    </span>
                </h5>

            );
        }

        return (
            <div>
                <CurrentPosition routes={this.props.routes} params={this.props.params} />
                <div className="page-body noTopPadding">
                    <div className="row">
                        {/* Page Header */}
                        <div className="page-header position-relative">
                            <div className="header-title">
                                <h1>
                                    {this.state.quotationName} - <b className="fColorRed">{this.state.statusText}</b>
                                    <a className={this.state.showEditBtn ? "crm_edit pcicon pcicon-edit" : ""}
                                          onClick={this.goEdit}></a>
                                </h1>
                            </div>
                            {/*Header Buttons */}
                            {approvalBtn}
                            {/*Header Buttons End*/}
                        </div>
                        {/* /Page Header */}
                    </div>
                    {/*首行4块*/}
                    <DetailTable lists={this.state.firstList}/>
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="dashboard-box">
                                <div className="box-tabbs">
                                    <div className="tabbable">
                                        <ul className="nav nav-tabs myTab" id="myTab">
                                            <li className="active">
                                                <a data-toggle="tab" href="#priceRow">报价行</a>
                                            </li>
                                            <li onClick={this.getApprovalList}>
                                                <a data-toggle="tab" href="#approval">审批记录</a>
                                            </li>
                                            <li onClick={this.getOtherMsg}>
                                                <a data-toggle="tab" href="#other">其他相关</a>
                                            </li>
                                        </ul>
                                        <div className="tab-content tabs-flat no-padding">
                                            <div id="addPriceRow" className="tab-pane animated fadeInUp" style={minH_74}>
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <PriceList target={'#priceRow'} opt={'add'} getOptProductList={this.getOptProductList} lists={this.state.optProductList} handleAddProduct={this.handleAddProduct}></PriceList>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="delPriceRow" className="tab-pane animated fadeInUp" style={minH_74}>
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <PriceList target={'#priceRow'} opt={'del'} lists={this.state.productList} handleDelProduct={this.handleDelProduct}></PriceList>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="priceRow" className="tab-pane animated fadeInUp active" style={minH_74}>
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <div className="dataItem">
                                                            {add_del}
                                                            <PriceList ref="productList" status={this.state.priceInfo.status} lists={this.state.productList} editProductPriceNum={this.editProductPriceNum}></PriceList>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="approval" className="tab-pane animated fadeInUp" style={minH_74}>
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <div className="dataItem">
                                                            <div className="dataItem-body">
                                                                <Approval ref="approvalList"></Approval>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="other" className="tab-pane padding-10 animated fadeInUp" style={minH_74}>
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <DataList type={"memo"} title={"备注"} btntext={" 备注"}
                                                                  lists={this.state.memoList}
                                                                  target={this.state.memoDailogId}
                                                                  addTarget="addNoteModal"></DataList>
                                                        <hr className="mid"/>
                                                        <DataList type={"appendix"} title={"附件"} btntext={" 附件"}
                                                                  lists={this.state.appendixList}
                                                                  target={this.state.appendixDailogId}
                                                                  addTarget="addFileModal"></DataList>
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
                        <AllData type={"memo"} title={"备注"} lists={this.state.memoList}
                                 modalId={this.state.memoDailogId}></AllData>
                        <AllData type={"appendix"} title={"附件"} lists={this.state.appendixList}
                                 modalId={this.state.appendixDailogId}></AllData>


                        <NoteAdd addNotes={this.addMemo}/>
                        <FileAdd addFile={this.addAppendix} ref="fileAdd"/>

                        <NoteAdd target={"approvalDailog"} approval={this.approval} title={'报价审批'}/>
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