import React from 'react';
import CurrentPosition from '../core/components/layout/CurrentPosition'
import CONFIG from '../core/common/config.js';
import AjaxRequest from '../core/common/ajaxRequest.js';
import Alert from '../core/components/alert.js';
import PriceList from './components/PriceList';
import Select2 from '../core/components/Select2/Select2.js';
import { Modal, Button } from 'antd';
import '../core/components/Select2/select2.css';
const confirm = Modal.confirm;

module.exports = React.createClass({

    getInitialState: function() {
        return {
            routeId: (this.props.params.priceId ? parseInt(this.props.params.priceId) : 0),
            chanceId: this.props.params.chanceId || 0,
            changed: false,
            showSubmit: false,//拟定状态报价显示一个提交按钮
            priceSourceList: [],
            optProductUrl: CONFIG.SERVICE+'v1/products?q={keyword}&quotationId={quotationId}',//商机中可选商品列表
            modifyQuotations: CONFIG.SERVICE+'v1/chance_quotation_products/{quotationProductId}',//PUT:修改产品单价和数量; DELETE:删除报价中的产品
            quotationsDetail: CONFIG.SERVICE+'v1/chance_quotations/',
            priceInfo: {
                "id": 0,
                "quotationName": "",
                "status": 0,
                "statusText": "拟定",
                "chanceName":"",
                "chanceId":(this.props.params.chanceId ? parseInt(this.props.params.chanceId) : 0),
                "customerName": "",
                "customerId": 0,
                "overdueDate": "",
                "fromEntityType": "",
                "inputSource": 0
            },
            approveStatus: 1,//如果用户要提交审批时则priceInfo.status=1
            productList:[],//已选产品列表
            totalMoney: 0,
            chanceListArgs:{
                "q": "",
                "isSelf": 0,
                "pageNo": 1,
                "pageSize": ''
            },//查询商机列表的参数
            chanceList:[],
            customerList:[],//和商机一一对应的客户列表
            optProductList:[],//可选商品列表（变化）
            srcProductList:[]//原始的可选商品列表
        };

    },
    componentDidMount: function(param) {
        console.log('--->');
        this.initOverdueDate();

        this.getChanceList();
        this.getQuotationData();
        this.getOptProductList();
        //this.formValidator();

        //日期控件特殊处理
        var self = this;
        var dpicker = $('.date-picker');
        dpicker.datepicker({
            format:'yyyy-mm-dd',
            viewMode:'days',
            minViewMode:'days',
            local:'ZH_CN'
        })
    },
    initOverdueDate:function(){
        var n = new Date();
        var t = new Date(n.getFullYear(), n.getMonth()+1, n.getDate(), 0, 0, 0);
        var str = t.Format('yyyy-MM-dd');
        this.state.priceInfo.overdueDate = str;
        this.setState(this.state.priceInfo);
    },//初始化日期，默认为当前日期后一个月
    getQuotationData:function(){
        var self = this;
        var id = this.state.routeId;
        if (id && id > 0) {
            var url = this.state.quotationsDetail+id;
            AjaxRequest.get(url, null, function(body) {
                var info = self.state.priceInfo;
                for (var key in info) {
                    info[key] = body.data[key];
                }

                self.setState({priceInfo: info});
                self.setState({productList: body.data.productList});
                if(info.status == 0){
                    self.setState({showSubmit: true});
                }
            });
        }else{
            self.setState({showSubmit: true});
        }
    },//已存在的报价，则获取报价详情
    getChanceList:function(){
        var self = this,
            param= self.state.chanceListArgs;
        AjaxRequest.post(CONFIG.APIS.chance_list, param, function(body) {
            var tmp1 = new  Array();
            var tmp2 = new  Array();
            var list = body.data;
            var chanceId = self.state.chanceId;
            var priceInfo = self.state.priceInfo;

            if(list.length===0) return;

            for(var i=0; i<list.length; i++){
                tmp1.push({id:list[i].id, text:list[i].chanceName});
                tmp2.push({customerId:list[i].customerId, customerName:list[i].customerName});
                if(chanceId && chanceId == list[i].id){
                    priceInfo.customerId = list[i].customerId;
                    priceInfo.customerName = list[i].customerName;
                }
            }
            self.setState({
                chanceList: tmp1,
                customerList: tmp2,
                priceInfo: priceInfo
            });
            //self.setState({customerList: tmp2});
        });
    },//获取商机列表
    getOptProductList:function(kw){
        var self = this,
            productUrl = self.state.optProductUrl.replace('{quotationId}',this.state.routeId).replace('{keyword}',kw||'');

        AjaxRequest.get(productUrl, null, function(body) {
            self.setState({optProductList: body.data});

            if(self.state.routeId === 0)
                self.setState({srcProductList: body.data});
        });
    },//获取可选商品列表
    handleChange: function(e){
        var field = e.target.name;
        this.state.priceInfo[field] = jQuery.trim(e.target.value);
        this.setState(this.state.priceInfo);
        this.setState({changed: true});
    },//处理一般字段改变的情况
    handleChanceChange: function(e){
        var id = parseInt(e.target.value);
        var chanceList = this.state.chanceList;
        var customerList = this.state.customerList;

        for(var i=0; i<chanceList.length; i++){
            if(chanceList[i].id == id){
                this.state.priceInfo.customerId = customerList[i].customerId;
                this.state.priceInfo.customerName = customerList[i].customerName;
                this.state.priceInfo.chanceId = chanceList[i].id;
                this.state.priceInfo.chanceName = chanceList[i].chanceName;

                this.setState(this.state.priceInfo);
                break;
            }
        }
        this.setState({changed: true});
        return null;
    },//处理商机改变的情况
    handleSave: function(approveFlag) {
        var self = this;
        var canSubmit = true;
        var info = self.state.priceInfo;

        info.productList = self.state.productList;
        info.overdueDate = self.refs.overdueDate.value;

        if(info.quotationName.length===0){
            toastr.error('报价名称必填');
            canSubmit = false;
        }
        if(info.chanceId === 0){
            toastr.error('商机必选');
            canSubmit = false;
        }
        if(info.overdueDate.length === 0){
            toastr.error('过期日期必选');
            canSubmit = false;
        }
        if(info.productList.length === 0){
            toastr.error('产品报价行为必填项，请选择产品');
            canSubmit = false;
        }
        if(!canSubmit) return;
        confirm({
            title: '是否提交报价?',
            content: '点击取消则只保存,点击确定则保存并提交审批!',
            onOk() {
                info.status = 1;//self.state.approveStatus;
                self.saveFun(info);
            },
            onCancel() {
                self.saveFun(info);
            }
        });
    },//提交保存
    saveFun: function(info){
        var id = this.state.routeId;
        if(id && id > 0) {//修改，编辑
            if(info.status == 3){//已拒绝的报价修改之后，状态置为0
                info.status = 0;
            }
            AjaxRequest.put(this.state.quotationsDetail+id, info, function(data) {
                /*if (data.code == 200) {
                    toastr.success('保存成功!');
                    history.go(-1);
                } else {
                    toastr.error('保存失败：'+data.msg);
                }*/
                showAjaxCallbackModal(data);
            });
        } else {//新增
            AjaxRequest.post(CONFIG.APIS.sales_price_detail, info, function(data) {
                /*if (data.code == 200) {
                    toastr.success('保存成功');
                    history.go(-1);
                } else {
                    toastr.error('保存失败：'+data.body.msg);
                }*/
                showAjaxCallbackModal(data);
            });
        }
    },

    handleCancel:function(){
        if (this.state.changed) {
            bootbox.confirm("表单已修改，你确定不保存退出吗?", function(result) {
                if (result) {
                    history.go(-1);
                }
            });

        } else {
            history.go(-1);
        }
    },//取消保存

    /*handleSubmit:function(){
        this.handleSave(true);
    },//提交审批*/

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
        var src = this.state.srcProductList;
        var opt = this.state.optProductList;
        var quotationProductId = 0;

        for(var i=0; i < pdList.length; i++){
            if(id == pdList[i].id){
                quotationProductId = pdList[i].quotationProductId||0;//产品报价Id
                pdList.splice(i,1);
                break;
            }
        }
        for(var i=0; i < src.length; i++){
            if(id == src[i].id){
                opt.push(src[i]);
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
            this.state.optProductList = opt;
            this.setState(this.state.optProductList);
        }
    },//删除产品

    editProductPriceNum:function(obj){
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

        //this.updateExistQuotations(list);
    },//修改报价信息


    render: function() {
        var style_button = {
            textAlign: 'left',
            padding: "10px 0 10px 0"
        };
        var style100 = {width:"100%"};

        return (
            <div>
                <CurrentPosition routes={this.props.routes} params={this.props.params} />
                <div className="page-body">
                    <div className="dashboard-box my">
                        <div className="box-tabbs">
                            <div className="tabbable my" >
                                <ul className="nav nav-tabs myTab noBorLR">
                                    <li className="dropdown active">
                                        <a>
                                            {this.props.route.name}
                                        </a>
                                    </li>
                                </ul>

                                <form id="priceForm">
                                    <div className="widget-body padding-20" style={{boxShadow: 'none'}}>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="quotationName">报价名称<sup>*</sup></label>
                                                    <div className="input-icon icon-right">
                                                        <input type="text" ref="quotationName" name="quotationName"  value={this.state.priceInfo.quotationName} onChange={this.handleChange} className="form-control"  />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="status">报价状态<sup>*</sup></label>
                                                    <div className="input-icon icon-right">
                                                        <input type="hidden" ref="status" name="status" className="form-control"
                                                               value={this.state.priceInfo.chanceId} />
                                                        <input type="text" ref="statusText" name="statusText" className="form-control"
                                                               value={this.state.priceInfo.statusText} disabled/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>商机<sup>*</sup></label>
                                                    <div className="input-icon icon-right">
                                                        <Select2
                                                            style={style100}
                                                            ref="chanceName"
                                                            multiple={false}
                                                            onSelect={this.handleChanceChange}
                                                            data={this.state.chanceList}
                                                            value={this.state.priceInfo.chanceId}
                                                            options={{placeholder: '请选择商机'}}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>客户名称<sup>*</sup></label>
                                                    <div className="input-icon icon-right">
                                                        <input type="text" ref="customerName" name="customerName" readOnly className="form-control"
                                                               value={this.state.priceInfo.customerName} placeholder="请先选择商机"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="startDate">过期日期<sup>*</sup></label>
                                                    <div className="input-icon icon-right">
                                                        <div className="input-group">
                                                            <input ref="overdueDate" type="text" className="form-control date-picker" value={this.state.priceInfo.overdueDate} style={{cursor: 'default'}} readOnly="readOnly" placeholder="请选择过期日期" data-date-format="yyyy-mm-dd" />
                                                            <span className="input-group-addon"><i className="fa fa-calendar"></i></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                <div className="tab-content tabs-flat borderTB" style={{paddingLeft:'20px', paddingRight:'20px'}}>
                                    <div id="addPriceRow" className="tab-pane animated fadeInUp">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <PriceList target={'#priceRow'} opt={'add'} lists={this.state.optProductList} getOptProductList={this.getOptProductList} handleAddProduct={this.handleAddProduct}></PriceList>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="delPriceRow" className="tab-pane animated fadeInUp">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <PriceList target={'#priceRow'} opt={'del'} lists={this.state.productList} handleDelProduct={this.handleDelProduct}></PriceList>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="priceRow" className="tab-pane animated fadeInUp active">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="dataItem paddingLF_0">
                                                    <h5 className="row-title before-darkorange">
                                                        <span>
                                                            产品报价行
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
                                                    <PriceList status={this.state.priceInfo.status} lists={this.state.productList} editProductPriceNum={this.editProductPriceNum}></PriceList>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="dashboard-box padding-20">
                                    <div className="buttons-preview" style={style_button}>
                                        <input type="button" onClick={this.handleCancel} className="btn btn-cancer" value="取消" />
                                        <button id="btnSave" onClick={this.handleSave} className="btn btn-danger">保存</button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>


                <Alert result="succees"></Alert>
                <Alert result="danger"></Alert>
            </div>


        )
    }
});