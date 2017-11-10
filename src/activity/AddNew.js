import React from 'react';
import {APIS} from '../core/common/config';
import CurrentPosition from '../core/components/layout/CurrentPosition';
import AjaxRequest from '../core/common/ajaxRequest.js';
import Select2 from '../core/components/Select2/Select2.js';
import '../core/components/Select2/select2.css';
import Alert from '../core/components/alert.js';
import ThreeLevel from '../core/components/ThreeLevel/threeLevel';
import FileUpload from '../core/components/FileUpload/FileUpload';
import { Modal, Button, DatePicker } from 'antd';
const RangePicker = DatePicker.RangePicker;
var AreaComponents = React.createFactory(ThreeLevel);

module.exports = React.createClass({
    getInitialState: function () {
        var id = null;
        var tmp = this.props.params.id;
        if(parseInt(tmp)){
            id = parseInt(tmp);
        }
        return {
            routeId: id,
            isRender:false,
            fileList:[],
            activityChance:[],
            activityCustomer:[],
            activityLinkMan:[],
            startActivityType:[],
            customerIdLinkMan:"",
            paramChance:{
                customerId: "",
                endCreatedOn: "",
                isOwner: 0,
                orderType: 0,
                pageNo: 1,
                pageSize: 10,
                q: "",
                staffList: [],
                stageList: [],
                startCreatedOn: "",
                statusList: []
            },
            params:{
                address: {
                    address:"",
                    province:"",
                    city:"",
                    adname:"",
                    adcode:"",
                    longitude:"",
                    latitude:""
                },
                audioFileIds: "",
                audioSubjectFileId: "",
                audioSubjectFileLength: "",
                chanceId: 0,
                content: "",
                costTypeId: "",
                costs: "",
                customerId: 0,
                customerLinkmanId: 0,
                endTime: "",
                picFileIds: "",
                startTime: "",
                subject: "",
                trackTypeId: ""
            },
            prov: '',        //三级联动
            city: '',
            county: '',
            provText: '',
            cityText: '',
            activityChanceVal:"",
            activityCustomerVal:"",
            activityLinkmanVal:"",
            activityTypeVal:"",
            endTime:"",
            startTime:"",
            activityName:"",
            changed: false
        };
    },
    componentWillMount: function(){//数据准备
        this.getCustomerList();
        this.getActivityType();
    },
    componentDidMount: function () {
        if(this.state.routeId > 0){
            this.renderEdit()
        }else{
            this.countParams();
            this.setState({
                isRender:true
            });
        }

        $("#activityForm").bootstrapValidator();
    },
    handleSave: function(e) {
        e.preventDefault();
        e.stopPropagation();
        var self = this;
        var bootstrapValidator = $("#activityForm").data('bootstrapValidator');
        bootstrapValidator.validate();
        if (!bootstrapValidator.isValid()) {
            return false;
        }
        if(!self.state.params.startTime || !self.state.params.endTime){
            toastr.error('请选择活动开始和结束时间');
            return;
        }
        self.state.params.address.adcode = self.state.county;
        self.state.params.address.address = self.refs.detailAddress.value;
        var fileId = this.refs.fileUpload.getFileIdList();
        if(fileId && fileId.length > 0) {
            fileId = fileId.join(',');
            self.state.params.picFileIds = fileId;
        }

        self.state.params.customerId = self.state.activityCustomerVal||0;
        self.state.params.customerLinkmanId = self.state.activityLinkmanVal||0;
        self.state.params.chanceId = self.state.activityChanceVal||0;

        self.setState(self.state.params);
        if(self.state.routeId > 0){
            AjaxRequest.put(APIS.activity_add+'/'+self.state.routeId, self.state.params, function(body){
                if(body.msg=='OK'){
                    $('#modal-success').modal();
                }else {
                    $('#modal-danger').modal();
                }
            });
        }else {
            AjaxRequest.post(APIS.activity_add, self.state.params, function(body){
                if(body.msg=='OK'){
                    $('#modal-success').modal();
                }else {
                    $('#modal-danger').modal();
                }
            });
        }
    },
    handleCancel: function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.state.changed) {
            bootbox.confirm("表单已修改，你确定不保存退出吗?", function(result) {
                if (result) {
                    history.go(-1);
                }
            });

        } else {
            history.go(-1);
        }
    },
    //城市地址选择
    selectProvs: function (data,text) {
        var self=this;
        self.setState({
            prov: data,
            city: '',
            county: '',
            provText:text,
            changed: true
        });
    },
    selectCitys: function(data,text){
        var self=this;
        self.setState({
            city: data,
            county: '',
            cityText:text,
            changed: true
        });
    },
    selectCountys: function(data,text){
        var self=this,
            provText=self.state.provText,
            cityText=self.state.cityText;
        self.setState({
            county: data,
            changed: true
        });
        self.refs.detailAddress.value=provText+cityText+text;
    },
    //处理用户输入
    chanceChange: function(){
        var id = this.refs.activityChance.el.val();
        this.state.activityChanceVal = id;
    },
    linkmanChange: function(){
        var id = this.refs.activityLinkman.el.val();
        this.state.activityLinkmanVal = id;
    },
    customerChange: function(){
        var id = this.refs.activityCustomer.el.val();
        this.state.activityCustomerVal = id;

        this.getChanceListByCustomerId(id);
        this.getLinkmanListByCustomerId(id);
    },
    handleChange: function(e) {
        var self=this;
        self.state.params.subject=e.target.value;
        self.setState({
            activityName:e.target.value,
            changed: true
        })
    },
    activityContent: function (e) {
        var self=this,
            activityShow=e.target.value;
        self.state.params.content=activityShow;
        self.setState({changed: true});
    },
    selectActivityType: function (e) {
        var self=this,
            activityType = e.target.value;
        self.state.activityTypeVal = activityType;
        self.state.params.trackTypeId = activityType;
        self.setState({changed: true});
    },
    detailAddress: function (e) {
        var self=this;
        self.state.params.address.address=e.target.value;
        self.setState({changed: true});
    },//详细地址
    getStartEndTime:function(value, dateString){
        var self = this;

        self.state.params.startTime = dateString[0]+':00';
        self.state.params.endTime= dateString[1]+':00';
        self.setState({
            startTime: dateString[0]+':00',
            endTime: dateString[1]+':00',
            changed: true
        });
    },
    //填充界面数据
    renderEdit: function(){
        var self = this;
        var timer = window.setInterval(function(){
            if(self.isMounted()){
                AjaxRequest.get(APIS.activity_detail+self.props.params.id, null, function(body) {
                    var thisRefs = self.refs,
                        datas = body.data;
                    self.state.workReportType=datas.reportType;
                    for(var attr in thisRefs){
                        if(attr=="activityChance"){
                            self.setState({
                                activityChanceVal:datas.chanceId
                            })
                        }else if(attr=="activityCustomer"){
                            self.setState({
                                activityCustomerVal:datas.customerId
                            })
                        }else if(attr=="activityLinkman" ){
                            self.setState({
                                customerIdLinkMan:datas.customerId
                            });
                            self.setState({
                                activityLinkmanVal:datas.customerLinkmanId
                            })
                        }else if(attr=="activityShow" ){
                            self.refs[attr].value= datas.content;
                        }else if(attr=="activityType" ){
                            self.state.activityTypeVal = datas.activityType;
                            //self.refs[attr].value= datas.activityType;
                        }else if(attr=="adcode" ){
                            var addArr = datas.addressPath.split(',');
                            self.refs.adcode.resetStates({
                                prov: parseInt(addArr[0]),
                                city: parseInt(addArr[1]),
                                county: parseInt(addArr[2])
                            });
                            self.setState({
                                prov: parseInt(addArr[0]),
                                city: parseInt(addArr[1]),
                                county: parseInt(addArr[2])
                            });
                        }else if(attr=="endTime" ){
                            self.state.endTime= datas.endTime;
                        }else if(attr=="startTime" ){
                            self.state.startTime= datas.startTime;
                        }else if(attr=="detailAddress" ){
                            self.refs[attr].value= datas.address.address;
                        }else if(attr=="activityName"){
                            self.state.activityName= datas.subject;
                        }
                    }
                    self.state.params.address.address=datas.address.address;
                    self.state.params.chanceId=datas.chanceId;
                    self.state.params.content=datas.content;
                    self.state.params.customerId=datas.customerId;
                    self.state.params.customerLinkmanId=datas.customerLinkmanId;
                    self.state.params.trackTypeId=datas.activityType;
                    self.state.params.endTime=datas.endTime;
                    self.state.params.startTime=datas.startTime;
                    self.state.params.subject=datas.subject;
                    self.setState(self.state.params);
                    var list = datas["fileList"];
                    self.setFileList(list);
                    self.getChanceListByCustomerId(datas.customerId);
                    self.getLinkmanListByCustomerId(datas.customerId);
                });
                window.clearInterval(timer);
            }
        }, 1000);
    },
    countParams: function(){
        var self = this;
        var query = self.props.location.query;
        var params = self.props.params;
        var customerId = params.customerId || query.customerId || '';
        var linkmanId = params.linkmanId || query.linkmanId || '';
        var chanceId = params.chanceId || query.chanceId || '';

        if(query.from && query.from == "schedule"){
            var start = localStorage.getItem('CRM_AddSchedule_StartTime');
            var end = localStorage.getItem('CRM_AddSchedule_EndTime');
            self.state.params.startTime = start+':00';
            self.state.params.endTime= end+':00';
            self.setState({
                activityCustomerVal: customerId,
                activityLinkmanVal: linkmanId,
                activityChanceVal: chanceId,
                startTime:start+':00',
                endTime:end+':00'
            });
        }else{
            self.setState({
                activityCustomerVal: customerId,
                activityLinkmanVal: linkmanId,
                activityChanceVal: chanceId
            });
        }

        if(customerId){
            self.getChanceListByCustomerId(customerId);
            self.getLinkmanListByCustomerId(customerId);
        }
    },
    setFileList:function(list){
        var newFileList = [];
        if(list && list.length > 0){
            for(var i=0;i<list.length;i++){
                var file = list[i];
                var fileNew = {
                    uid: file.id,
                    name: file.originName,
                    status: 'done',
                    url: file.fileUrl,
                    size:file.fileSize,
                    thumbUrl: file.fileUrl
                };
                newFileList.push(fileNew);
            }
        }
        this.setState({
            fileList: newFileList,
            isRender:true
        });
    },
    getActivityType: function () {
        var self=this;
        AjaxRequest.get(APIS.data_wordbook + "DictTrackType", null, function(body) {
            if(body.code=='200'){
                var timer = window.setInterval(function(){
                    if(self.isMounted()){
                        self.setState({startActivityType:body.data})
                        window.clearInterval(timer)
                    }
                }, 1000);
            }

        });
    },//获取活动类型
    getCustomerList: function () {
        var self = this;
        AjaxRequest.get(APIS.myCustomer_list, null, function(body) {
            if (body.code == 200 && body.data.length>0) {
                self.state.activityCustomer = body.data;

                var timer = window.setInterval(function(){
                    if(self.isMounted()){
                        self.setState({activityCustomer:body.data});
                        window.clearInterval(timer)
                    }
                }, 1000);
            }else{
                toastr.error('客户列表请求失败!')
            }
        });
    },
    getChanceListByCustomerId: function(customerId){
        var self = this;
        var paramChance = self.state.paramChance;
        paramChance.customerId = customerId;
        
        AjaxRequest.post(APIS.chance_list, paramChance, function(body) {
            if (body.code == '200' && body.data) {
                var newList = [];
                var list = body.data;
                if(list && list.length > 0){
                    for(var i=0;i<list.length;i++){
                        var obj = list[i];
                        obj.text = obj.chanceName;
                        newList.push(obj);
                    }
                }
                self.setState({activityChance:newList});
            }else{
                toastr.error('商机列表请求失败!')
            }
        });
    },
    getLinkmanListByCustomerId: function(CustomerId){
        var self = this;
        AjaxRequest.get(APIS.customerDetail + CustomerId+ '/linkman', null, function(body) {
            if(body.code == 200 || body.code == '200'){
                var list = body.data;
                if(list && list.length > 0){
                    for(var i=0;i<list.length;i++){
                        list[i].text = list[i].name;
                    }
                }
                self.setState({activityLinkMan:list})
            }
        });
    },
    render: function () {
        var style100 = {
            width: "100%"
        };
        var style_button = {
            textAlign: 'left',
            padding: "10px 0 10px 0"
        };
        var self=this;
        var lists=self.state.startActivityType;
        var ops = lists.map(function(qst,key){
            return<option key={key} value={qst.id}>{qst.name}</option>
        }.bind(this));
        function renderChanceField(){
            if(CONFIG.Exclude && CONFIG.Exclude.chance) return null;
            return (
                <div className="col-sm-6">
                    <div className="form-group">
                        <label htmlFor="typeChance">商机</label>
                        <div className="input-icon icon-right">
                            <Select2
                                ref="activityChance"
                                name="activityChance"
                                value={self.state.activityChanceVal}
                                multiple={false}
                                style={{width:"100%"}}
                                onSelect={self.chanceChange}     //选择回调 ,如果是单选,只调用这个就行了
                                data={self.state.activityChance}
                                options={{placeholder: '选择商机'}}
                            />
                        </div>
                    </div>
                </div>
            );
        };
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
                                <form id="activityForm" method="post"
                                      data-bv-live={navigator.userAgent.match('Trident') ? 'disabled' : 'enabled'}
                                      data-bv-message="This value is not valid"
                                      data-bv-feedbackicons-valid="glyphicon glyphicon-ok"
                                      data-bv-feedbackicons-invalid="glyphicon glyphicon-remove"
                                      data-bv-feedbackicons-validating="glyphicon glyphicon-refresh">
                                    <div className="widget-body padding-20" style={{boxShadow: 'none'}}>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <label htmlFor="activityName">活动主题<sup className="mustRed">*</sup></label>
                                                    <div className="input-icon icon-right">
                                                        <input type="text" className="form-control"
                                                               ref="activityName"
                                                               onChange={this.handleChange}
                                                               value={this.state.activityName}
                                                               name="activityName" placeholder="请输入活动主题"
                                                               data-bv-notempty="true"
                                                               data-bv-notempty-message="活动主题必须输入"
                                                               data-bv-stringlength="true"
                                                               data-bv-stringlength-min="2"
                                                               data-bv-stringlength-max="500"
                                                               data-bv-stringlength-message="活动主题在2到500个字符之间"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="customerName">客户名称</label>
                                                    <div className="input-icon icon-right">
                                                        <Select2
                                                            ref="activityCustomer"
                                                            name="activityCustomer"
                                                            multiple={false}
                                                            style={{width:"100%"}}
                                                            value={this.state.activityCustomerVal}
                                                            onSelect={this.customerChange}     //选择回调 ,如果是单选,只调用这个就行了
                                                            data={this.state.activityCustomer}
                                                            options={{placeholder: '选择客户'}}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="activityType">活动类型<sup className="mustRed">*</sup></label>
                                                    <div className="input-icon icon-right">
                                                        <select onChange={this.selectActivityType}
                                                                ref="activityType"
                                                                className="form-control"
                                                                value={this.state.activityTypeVal}
                                                                name="activityType"
                                                                placeholder="活动类型"
                                                                data-bv-notempty="true"
                                                                data-bv-notempty-message="必须选择一项">
                                                            <option value="">--请选择--</option>
                                                            {ops}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className={CONFIG.Exclude && CONFIG.Exclude.chance ? 'col-sm-12' : 'col-sm-6'}>
                                                <div className="form-group">
                                                    <label htmlFor="activityLinkman">联系人</label>
                                                    <div className="input-icon icon-right">
                                                        <Select2
                                                            ref="activityLinkman"
                                                            name="activityLinkman"
                                                            value={this.state.activityLinkmanVal}
                                                            multiple={false}
                                                            style={{width:"100%"}}
                                                            onSelect={this.linkmanChange}     //选择回调 ,如果是单选,只调用这个就行了
                                                            data={this.state.activityLinkMan}
                                                            options={{placeholder: '选择联系人'}}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            {renderChanceField()}
                                            {/*<div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="typeChance">商机</label>
                                                    <div className="input-icon icon-right">
                                                        <Select2
                                                            ref="activityChance"
                                                            name="activityChance"
                                                            value={this.state.activityChanceVal}
                                                            multiple={false}
                                                            style={{width:"100%"}}
                                                            onSelect={this.chanceChange}     //选择回调 ,如果是单选,只调用这个就行了
                                                            data={this.state.activityChance}
                                                            options={{placeholder: '选择商机'}}
                                                        />
                                                    </div>
                                                </div>
                                            </div>*/}
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <label htmlFor="subject">开始日期时间 - 结束日期时间 <sup>*</sup></label>
                                                    <div className="input-icon icon-right">
                                                        <RangePicker ref="rangePicker" name="startEndTime" showTime format="yyyy-MM-dd HH:mm" style={{width:'100%'}} size="large" onChange={this.getStartEndTime} value={[this.state.startTime,this.state.endTime]}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="form-group activityAddress">
                                                    <label>公司地址</label>
                                                    {
                                                        AreaComponents({
                                                            ref:'adcode',
                                                            data: __areaData__,
                                                            options: {
                                                                prov:this.state.prov || '',
                                                                city:this.state.city || '',
                                                                county:this.state.county || '',
                                                                defaultText:['省份','城市','区县']
                                                            },
                                                            //notemptyThree:true,
                                                            selectProvs:this.selectProvs,
                                                            selectCitys:this.selectCitys,
                                                            selectCountys:this.selectCountys
                                                        })
                                                    }
                                                </div>
                                                <div className="form-group activityDetailAddress">
                                                    <label htmlFor="detailAddress">详细地址</label>
                                                    <div className="input-icon icon-right">
                                                        <input type="text" className="form-control"
                                                               name="detailAddress" placeholder="请输入详细地址"
                                                               ref="detailAddress"
                                                               onChange={this.detailAddress}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="remark">活动内容</label>
				                                        <span className="input-icon icon-right">
				                                            <textarea ref="activityShow" id="remark" name="remark" className="form-control" rows="4"
                                                                      onChange={this.activityContent}
                                                                      placeholder="输入活动内容"/>
				                                        </span>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <label htmlFor="description">附件</label>
                                                <div className="input-icon icon-right" id="fileDiv">
                                                    {this.state.isRender && <FileUpload
                                                        ref="fileUpload"
                                                        lists={this.state.fileList}
                                                    />}
                                                </div>
                                            </div>
                                        </div>
                                        <hr style={{marginTop: '20px', marginLeft:'-20px', marginRight:'-20px'}} />
                                        <div className="widget-header noShadow" style={{padding:'20px 0px 20px 0px'}}>
                                            <div className="buttons-preview" style={style_button}>
                                                <input type="button" onClick={this.handleCancel} className="btn btn-cancer" value="取消" />
                                                <button id="btnSave" onClick={this.handleSave} className="btn btn-danger">保存</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>

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