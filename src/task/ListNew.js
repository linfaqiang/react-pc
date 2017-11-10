import React from 'react';
import Select2 from '../core/components/Select2/Select2.js';
import '../core/components/Select2/select2.css';
import TabSelect2 from '../core/components/PublicSelect/TabSelect2.js';
import {APIS} from '../core/common/config';
import AjaxRequest from '../core/common/ajaxRequest.js';
import CurrentPosition from '../core/components/layout/CurrentPosition';
import {Pagination, Select} from 'antd';
import Detail from './Detail';
import Tools from '../core/common/tools';

module.exports = React.createClass({
    getInitialState:function(){
        var params = this.props.params;
        var rPath = this.props.routes[1].path;
        var addUrl = `#/task/addTask/0`;

        if(rPath == 'customer'){
            addUrl = `#/customer/${params.customerId}/task/addTask/0`;
        }else if(rPath == 'chance'){
            addUrl = `#/chance/${params.chanceId}/task/addTask/0`;
        }else if(rPath == 'linkman'){
            addUrl = `#/linkman/${params.linkmanId}/task/addTask/0`;
        }
        return {
            addUrl: addUrl,
            initParam:{           //筛选参数
                "id":"",
                "pageNo":1,
                "pageSize":10,
                "status":-1,
                "priorityLevel":-1,
                "subject":"",
                "type":0,
                "chanceId":null,
                "customerId":null
            },
            selectShow:false,      //筛选框显示/隐藏
            liList:[{
                name:'我收到的任务',
                index:0
            },{
                name:'我发起的任务',
                index:1
            }],
            curentSelect:{         //当前筛选到的类型
                name:'我收到的任务',
                index:0
            },
            selectPP:{//存放筛选框的数据
                subject:"",
                status:-1,
                priorityLevel:-1,
                dataStatus: [
                    { text: '所有', id: -1 },
                    { text: '未开始', id: 0 },
                    { text: '进行中', id: 1 },
                    { text: '已完成', id: 2 }
                ],
                dataLevel: [
                    { text: '所有', id: -1 },
                    { text: '一般', id: 0 },
                    { text: '较急', id: 1 },
                    { text: '紧急', id: 2 },
                    { text: '非常紧急', id: 3 }
                ]
            },
            detailList: [                  //详情
                {
                    name: '客户名称',
                    field:'customerName',
                    value: ''
                },
                {
                    name: '商机',
                    field:'chanceName',
                    value: ''
                },
                {
                    name: '联系人',
                    field:'linkmanName',
                    value: ''
                },
                {
                    name: '联系人电话',
                    field:'mobile',
                    value: ''
                },
                {
                    name: '开始时间',
                    field:'startTime',
                    value: ''
                },
                {
                    name: '结束时间',
                    field:'endTime',
                    value: ''
                },
                {
                    name: '优先级',
                    field:'priorityLevelText',
                    value: ''
                },
                {
                    name: '执行人',
                    field:'executorList',
                    value: ''
                }
            ],
            currentId:null,
            detailData:{
                id:null,
                status:null,
                checked:false,
                subject:"",
                owner:false
            },
            executeList:[],      //执行情况列表
            lists:[],
            /*pageData:{
             currentPage:1,
             totalSize:0,
             num:0
             }*/
            pageData: {
                pageNo: 1,
                totalSize: 0,
                pageSize: 10
            },
            hideNoData: true
        }
    },

    setSelectType:function (index,text) {
        this.setState({
            curentSelect:{
                name:text,
                index:index
            }
        });
        this.initParams(index);
        this.initSelectValue();
        var initParam = this.state.initParam;
        initParam.type = index;
        this.getData(initParam);
    },

    //初始化请求参数
    initParams:function(index){
        var initParam = {
            "pageNo":1,
            "pageSize":10,
            "status":-1,
            "priorityLevel":-1,
            "subject":"",
            "type":index,
            "chanceId":null,
            "customerId":null
        };

        this.setState({
            initParam:initParam,
            pageData:{
                pageNo: 1,
                totalSize: 0,
                pageSize: 10
            },
            hideNoData: true
        });
    },

    //初始化筛选值
    initSelectValue:function(){
        this.state.selectPP.status = -1;
        this.state.selectPP.priorityLevel = -1;
        this.state.selectPP.subject = "";
        this.refs.taskName.value = "";
        this.setState(this.state.selectPP);
    },
    componentWillUnmount:function(){
        $("#dowebokListDiv").remove();
        $("#dowebokAllDiv").remove();
    },
    componentWillMount:function(){

    },
    componentDidMount:function(){
        this.getData(this.state.initParam);
    },
    componentDidUpdate:function(){
        if(this.state.lists && this.state.lists.length > 0){
            Tools.imgLoadError();
        }
        playAudio();
    },
    confirmSelect:function () {      //保存后进行查询
        this.setState({
            selectShow:false
        });

        this.state.initParam.status= this.state.selectPP.status;
        this.state.initParam.priorityLevel= this.state.selectPP.priorityLevel;
        this.state.initParam.subject=this.state.selectPP.subject;
        this.setState(this.state.initParam);
        this.getData(this.state.initParam);
    },
    clearValue:function () {
        this.state.initParam={
            "reportType":-1,
            "pageNo":1,
            "pageSize":10,
            "isViewMe":0,
            "endEndTime":"",
            "startStartTime":""
        }
    },
    handlerResetFilter() {
        this.initSelectValue();
    },
    selectShowHide:function (e) {
        //e.preventDefault();
        this.setState({
            selectShow:!this.state.selectShow
        })
    },

    setDetailList:function (data) {    //设置详情
        if(data){
            var list = this.state.detailList;
            for(var i=0,len=list.length; i<len; i++){
                var field = list[i].field;
                if(field == 'executorList'){
                    var executorList = data[field];
                    var nameArry = [];
                    if(executorList){
                        for(var j=0,s=executorList.length; j<s; j++){
                            nameArry.push(executorList[j].name);
                        }
                    }

                    list[i].value = nameArry.join(",") || '------'
                }else{
                    list[i].value = data[field] || '------'
                }

            }

            this.setState({
                detailList:list
            })
        }
    },

    setPagerData:function(data){
        var self = this;
        var param = self.state.pageData;

        param.pageNo = self.state.initParam.pageNo || data.pageNo || 1;
        param.totalSize = data.totalSize || 0;
        param.pageSize = self.state.initParam.pageSize || data.pageSize || 10;

        var newData = data.data;
        for(var i=0,len=newData.length;i<len;i++){
            if(newData[i].status == 2){
                newData[i].checked = true;
            }else{
                newData[i].checked = false;
            }
        }

        self.setState({
            lists: newData,
            pageData: param
        });
        if(newData && newData[0]){
            self.clickBack(newData[0].id);
            self.refs.detailRef.setNoData(true);

            self.setState({
                hideNoData: true
            });
            window.scroll(0,0);
        }else{
            self.setState({
                detailData:{},
                hideNoData: false
            });
            self.refs.detailRef.setNoData(false);
        }
    },
    PageChange:function(page){
        var self = this;
        var initParam = self.state.initParam;

        initParam.pageNo = page;
        self.setState({initParam: initParam});
        self.getData(initParam);
    },

    getData:function (param) {
        var reqParams = this.props.location.query;
        var self = this,
            queryFn=self.props.location.query;
        if(queryFn){
            self.state.initParam.id=queryFn.messegeId;
            self.setState(self.state.initParam);
        }
        if(reqParams){
            if(reqParams.type == 'chance'){
                param.chanceId= reqParams.chanceId;

                this.state.initParam.chanceId= reqParams.chanceId;
                this.setState(this.state.initParam);
            }else if(reqParams.type == 'customer'){
                param.customerId= reqParams.customerId;

                this.state.initParam.customerId= reqParams.customerId;
                this.setState(this.state.initParam);
            }
        }

        AjaxRequest.get(APIS.task_list, param, function(body){
            if(body.code == 200){
                self.setPagerData(body);
            }
        });
    },
    changeBackground:function(id){
        var h = document.getElementsByClassName("taskListBackground");
        for(var i=0;i<h.length;i++){
            //先重置所有默认颜色
            h[i].style.backgroundColor="#fbfbfb";
        }
        //设置当前的样式
        document.getElementById("libg"+id).style.backgroundColor="#f2f5f5";
    },
    //获取详情
    getDetail:function(id){
        var self = this;
        AjaxRequest.get(APIS.task_list+"/"+id, null, function(body){
            if(body.code == 200 || body.code == '200'){
                var detail = body.data;
                //由于详情接口没有返回status字段，那么从lists中获取
                var list = self.state.lists;
                for(var i=0;i<list.length;i++){
                    var obj = list[i];
                    if(detail.id == obj.id){
                        detail.status = obj.status;
                        detail.checked = obj.checked;
                        break;
                    }
                }
                self.setState({
                    detailData:detail,
                    executeList:detail.executeList?detail.executeList:[]
                });
                self.setDetailList(detail);
            }
        });
    },

    clickBack:function (id) {
        this.setState({
            currentId:id
        });
        this.getDetail(id);
        //调用子组件的方法
        this.refs.detailRef.getRemark(id);
        this.refs.detailRef.getFiles(id);
    },
    setStatusValue:function () {
        var status = this.refs.taskStatus.el.val();
        if(status == -1){
            status = null;
        }
        this.state.selectPP.status = status;
        this.setState(this.state.selectPP);
    },
    //执行任务
    executeTask:function(param){
        var self = this;
        var id = this.state.detailData.id;
        param.saleTaskId = id;

        AjaxRequest.post(APIS.task_result, param, function(body){
            if(body.code == 200 || body.code == '200'){
                self.updateData(id,param.status);
            }
        });
    },
    //勾选复选框，状态变为已完成或未开始状态
    finishedTask:function(id,status,e){
        e.stopPropagation();

        if(status == 2){
            status = 0;
        }else{
            status = 2;
        }
        var param = {
            "saleTaskId":id,
            "status":status,
            "resultDesc":""
        };
        var self = this;
        AjaxRequest.post(APIS.task_result, param, function(body){
            if(body.code == 200 || body.code == '200'){
                self.updateData(id,status);
            }
        });
        e.preventDefault();
    },
    //更新state对应的lists和detailData
    updateData:function(id,status){
        var self = this;
        var list = self.state.lists;
        for(var i=0;i<list.length;i++){
            var obj = list[i];
            if(id == obj.id){
                obj.status = status;
                obj.checked = !obj.checked;
                break;
            }
        }
        self.setState({
            lists:list
        });
        //如果与当前的任务详情是同一个，那么实时获取任务详情，为了实时改变右边详情的数据
        var detailData = self.state.detailData;
        if(id == detailData.id){
            self.getDetail(id);
        }
    },
    renderSelectStatus:function() {
        return (
            <div>
                状态<br/>
                <Select2
                    ref="taskStatus"
                    multiple={false}
                    style={{width:"100%"}}
                    onSelect={this.setStatusValue}
                    onUnselect={this.setStatusValue}  //删除回调
                    data={this.state.selectPP.dataStatus}
                    value={this.state.selectPP.status}
                    options={{placeholder: '选择任务状态' }}
                />
            </div>
        );
    },
    setLevelValue:function () {
        var level = this.refs.taskLevel.el.val();
        if(level == -1){
            level = null;
        }
        this.state.selectPP.priorityLevel = level;
        this.setState(this.state.selectPP);
    },
    renderSelectLevel:function() {
        return (
            <div>
                紧急程度<br/>
                <Select2
                    ref="taskLevel"
                    multiple={false}
                    style={{width:"100%"}}
                    onSelect={this.setLevelValue}
                    onUnselect={this.setLevelValue}  //删除回调
                    data={this.state.selectPP.dataLevel}
                    value={this.state.selectPP.priorityLevel}
                    options={{placeholder: '选择任务状态' }}
                />
            </div>
        );
    },
    setTaskNameValue: function(event) {
        this.state.selectPP.subject = event.target.value;
        this.setState(this.state.selectPP);
    },
    //任务名称输入框
    renderInputTaskName:function() {
        return (
            <div>
                任务名称<br/>
                <input type="text" className="form-control" ref="taskName" placeholder="输入任务名称"  onChange={this.setTaskNameValue} />
            </div>
        );
    },

    render:function(){
        var lists = this.state.lists;
        var currentId = this.state.currentId;
        var lis = lists.map(function(qst,key){
            var level = qst.priorityLevel;
            var flagUrl = "";
            if(level == 0){//一般
                flagUrl = APIS.img_path+"/assets/img/blue.png";
            }else if(level == 1){//较急
                flagUrl = APIS.img_path+"/assets/img/yellow.png";
            }else if(level == 2){//紧急
                flagUrl = APIS.img_path+"/assets/img/violet.png";
            }else if(level == 3){//非常紧急
                flagUrl = APIS.img_path+"/assets/img/red.png";
            }
            var bgcolor = "#fbfbfb";
            if(qst.id == currentId){
                bgcolor = "#f2f5f5";
            }

            return	<li id={'libg'+qst.id} style={{backgroundColor:bgcolor,cursor:'pointer'}} key={key} onClick={this.clickBack.bind(this,qst.id)}>
                <div className="checkbox div-checkbox" onClick={this.finishedTask.bind(this,qst.id,qst.status)}>
                    <label>
                        <input type="checkbox" checked={qst.checked} className="colored-success"/>
                        <span className="text"></span>
                    </label>
                </div>
                <div className="div-flag"><img src={flagUrl} width="32" height="32" alt="" name="defaultPic" /></div>
                <h5 className={qst.status == 2 ? 'line-font':''}>{qst.subject?qst.subject:""}</h5>
                <h5 className="line-font" style={qst.audioSubjectFileUrl? {} : {display:'none'}}>
                    <div className="audioBox">
                        <audio  src={qst.audioSubjectFileUrl.replace('.amr', '.mp3')}>你的浏览器不支持audio</audio>
                        <p className='audioInfo'>
                            <span className="currentTime"></span><span className="duration"></span>
                        </p>
                    </div>
                </h5>
                {/*<h5 className={qst.status == 2 ? 'line-font':''}>{qst.subject?qst.subject:""}<audio style={{display:qst.audioSubjectFileUrl ? 'block':'none'}} src={qst.audioSubjectFileUrl} controls="controls" preload="auto"></audio></h5>*/}
                <p>{qst.customerName?qst.customerName:"----------"}</p>
                <span className="taskTime">{qst.createdOn}</span>
            </li>
        }.bind(this) );

        return (
            <div>
                <CurrentPosition routes={this.props.routes} params={this.props.params} />


                <div className="page-body">
                    <div className="dashboard-box my">
                        <div className="box-tabbs">
                            <div className="tabbable my" >
                                <ul className="nav nav-tabs myTab">
                                    <TabSelect2 liList={this.state.liList}
                                               curentSelect={this.state.curentSelect}
                                               setSelectType={this.setSelectType}/>

                                    <div className="DTTT btn-group">
                                        <a className="btn btn-default DTTT_button_copy" href={this.state.addUrl}>
                                            <i className="fa fa-plus"></i>
                                            <span>创建 </span>
                                        </a>
                                        <a onClick={this.selectShowHide} className="btn btn-default DTTT_button_collection">
                                            <i className="fa fa-filter"></i>
                                            <span>筛选 <i className="fa fa-angle-down"></i></span>
                                        </a>
                                    </div>

                                    <div style={{display:this.state.selectShow ? 'block' : 'none', width:380+'px',height:400+'px', zIndex:100, position:'absolute',right:1+'px',top:42+'px'}}>
                                        <div className="well with-header" style={{background:'#fff',height:'100%'}}>
                                            <div className="header bordered-blue">
                                                <div className="buttons-preview" style={{textAlign:'right',paddingTop:10+'px'}}>
                                                    <button onClick={this.handlerResetFilter} className="btn btn-cancer">重置</button>
                                                    <button onClick={this.confirmSelect} className="btn btn-danger">确定</button>
                                                </div>
                                            </div>
                                            <div style={{marginTop:30+'px',paddingLeft:10+'px'}}>
                                                {this.renderSelectStatus()}<br/>
                                                {this.renderSelectLevel()}<br/>
                                                {this.renderInputTaskName()}<br/>
                                            </div>
                                        </div>
                                    </div>
                                </ul>

                                <div className="row">
                                    <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                                        <div className="taskList" style={{minHeight: '768px', paddingBottom:'48px', position:'relative'}}>
                                            <ul className="taskList_ul">
                                                {lis}
                                            </ul>

                                            <div className={this.state.hideNoData ? "no-massage hide" : "no-massage"} style={{top: '20%', left:'50%', position:'absolute'}}><div className='crmNoData'>暂无数据</div></div>
                                            <div style={{position:'absolute', right:'0px', bottom:'10px'}}>
                                                <Pagination
                                                    selectComponentClass={Select}
                                                    total={this.state.pageData.totalSize}
                                                    showTotal={total => `共 ${total} 条记录`}
                                                    pageSize={this.state.pageData.pageSize}
                                                    defaultCurrent={this.state.pageData.pageNo}
                                                    current={this.state.pageData.pageNo}
                                                    onChange={this.PageChange}
                                                    showQuickJumper
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                        <Detail getData={this.getData} routes={this.props.routes} params={this.props.params} finishedTask={this.finishedTask} executeTask={this.executeTask} detailData={this.state.detailData} ref="detailRef" detailList={this.state.detailList} executeList={this.state.executeList}/>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/*<div className="page-body">
                    <div className="widget">
                        <div className="widget-body">
                            <div role="grid" id="editabledatatable_wrapper" className="dataTables_wrapper no-footer">
                                <div className="head-select">
                                    <TabSelect liList={this.state.liList}
                                               curentSelect={this.state.curentSelect}
                                               setSelectType={this.setSelectType}/>

                                    <div className="DTTT btn-group" style={{right:0+'px',zIndex:100}}>
                                        <a className="btn btn-default DTTT_button_copy" href="#/task/add/0">
                                            <i className="fa fa-plus"></i>
                                            <span>创建 </span>
                                        </a>
                                        <a onClick={this.selectShowHide} className="btn btn-default DTTT_button_collection">
                                            <i className="fa fa-filter"></i>
                                            <span>筛选 <i className="fa fa-angle-down"></i></span>
                                        </a>
                                    </div>

                                    <div style={{display:this.state.selectShow ? 'block' : 'none', width:380+'px',height:400+'px', zIndex:100, position:'absolute',right:-12+'px',top:34+'px'}}>
                                        <div className="well with-header" style={{background:'#fff',height:'100%'}}>
                                            <div className="header bordered-blue">
                                                <div className="buttons-preview" style={{textAlign:'right',paddingTop:10+'px'}}>
                                                    <button onClick={this.handlerResetFilter} className="btn btn-cancer">重置</button>
                                                    <button onClick={this.confirmSelect} className="btn btn-danger">确定</button>
                                                </div>
                                            </div>
                                            <form style={{marginTop:30+'px',paddingLeft:10+'px'}}>
                                                {this.renderSelectStatus()}<br/>
                                                {this.renderSelectLevel()}<br/>
                                                {this.renderInputTaskName()}<br/>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>*/}




                
            </div>
        )
    }
});