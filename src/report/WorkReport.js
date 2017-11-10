import React from 'react';
import {APIS} from '../core/common/config';
import TableView from '../core/components/TableList/TableView.js';
import CurrentPosition from '../core/components/layout/CurrentPosition';
import Select2 from '../core/components/Select2/Select2.js';
import '../core/components/Select2/select2.css';
import AjaxRequest from '../core/common/ajaxRequest.js';
import DMYPicker from './components/DMYPicker.js';
//工作报告统计

module.exports = React.createClass({
    getInitialState: function () {
        return {
            canExport: false,
            queryType: 'day',
            queryByDep: false,
            selectShow: false,
            staffsList: [],
            depList: [],
            days: '',
            weeks: '',
            months: '',
            baseTh: [
                {
                    name:'人员',
                    width:'100'
                },{
                    name:'部门',
                    width:'150'
                },{
                    name:'已提交',
                    width:'60'
                },{
                    name:'未提交',
                    width:'60'
                }
            ],
            baseTr: ['staffName','deptName','hasSubmit','noneSubmit'],
            tableData:{                                      //存放表头
                tableName:'',
                th:[],
                tr:[]
            },
            initParam:{
                "pageNo":1,
                "pageSize":10,
                "reportType":0,//报告类型：0日报，1周报，2月报
                "startDate":"",
                "endDate":"",
                "staffList":[],
                "isContain":null,
                "deptList":[]
            }
        };
    },
    componentWillMount: function () {
        this.getDeptList();
        this.getStaffList();
    },
    componentDidMount: function () {
        this.getData(null);
    },
    getDeptList: function(){
        var self = this;
        AjaxRequest.get(APIS.dept_list, null, function(data){
            var list = data.data;
            var arr = [];
            for(var i=0; i<list.length; i++){
                arr.push({id:list[i].deptId, text:list[i].deptName})
            }
            arr.unshift({id:'', text:'-- 请选择部门 --'});
            var timer = window.setInterval(function(){
                if(self.isMounted()){
                    self.setState({depList: arr});
                    window.clearInterval(timer);
                }
            }, 200);
        });
    },
    getStaffList: function(){
        var self = this;
        AjaxRequest.get(APIS.staffs_subs, null, function(data){
            var timer = window.setInterval(function(){
                if(self.isMounted()){
                    self.setState({staffsList: data.data});
                    window.clearInterval(timer);
                }
            }, 200);
        });
    },
    getData: function(arg){
        var queryType = this.state.queryType;
        switch(queryType){
            case 'day':
                this.getDayList(arg);
                break;
            case 'week':
                this.getWeekList(arg);
                break;
            case 'month':
                this.getMonthList(arg);
                break;
            default:
                break;
        }
    },
    getDayList: function (arg) {
        var param = arg||this.state.initParam;
        /*if(arg){
            param = arg;
        }else{
            param = this.state.initParam;
            param.startDate = this.state.days[0].value;
            param.endDate = this.state.days[6].value;
        }
        param.reportType = 0;*/
        this.refs.dayList.beginLoad(param.pageNo);

        AjaxRequest.post(APIS.work_report, param, function(data){
            var days = this.state.days;
            data.data = this.formatServiceData(data.data, days, 'value');
            console.log(JSON.stringify(data));
            this.refs.dayList.setPagerData(data);
        }.bind(this));
    },
    getWeekList: function (arg) {
        var param = arg||this.state.initParam;
        /*if(arg){
            param = arg;
        }else{
            param = this.state.initParam;
            var weeks = this.state.weeks;
            param.startDate = weeks[0].start;
            param.endDate = weeks[weeks.length -1].end;
        }
        param.reportType = 1;*/
        this.refs.weekList.beginLoad(param.pageNo);

        AjaxRequest.post(APIS.work_report, param, function(data){
            var weeks = this.state.weeks;
            data.data = this.formatServiceData(data.data, weeks, 'end');
            console.log(JSON.stringify(data));
            this.refs.weekList.setPagerData(data);
        }.bind(this));
    },
    getMonthList: function (arg) {
        var param = arg||this.state.initParam;
        /*if(arg){
            param = arg;
        }else{
            param = this.state.initParam;
            var months = this.state.months;
            param.startDate = months[0].start;
            param.endDate = months[months.length - 1].end;
        }
        param.reportType = 2;*/
        this.refs.monthList.beginLoad(param.pageNo);

        AjaxRequest.post(APIS.work_report, param, function(data){
            var months = this.state.months;
            data.data = this.formatServiceData(data.data, months, 'end');
            console.log(JSON.stringify(data));
            this.refs.monthList.setPagerData(data);
        }.bind(this));
    },
    formatServiceData: function(data, template, key){
        var arr = [];
        if(data.length>0){
            this.state.canExport = true;
        }else{
            this.state.canExport = false;
        }
        for(var i=0; i<data.length; i++){
            var tmp = {
                'staffName':data[i].staffName,
                'deptName':data[i].deptName,
                'hasSubmit':data[i].hasSubmit,
                'noneSubmit':data[i].noneSubmit
            };

            var list = data[i].list;
            for(var j=0; j<template.length; j++){
                var hasFound = false;
                for(var k=0; k<list.length; k++){
                    if(list[k].endTime == template[j][key]){
                        //status: 0未提交，1已提交
                        if(list[k].status == 0){
                            tmp[template[j][key]] = 'cross';//叉叉，已提交
                        }else if(list[k].status == 1){
                            tmp[template[j][key]] = 'hook';//钩钩，已过期，未提交
                        }
                        hasFound = true;
                        break;
                    }
                }
                if(!hasFound){
                    tmp[template[j][key]] = ' ';//未过期，未提交
                }
            }
            arr.push(tmp);
        }
        return arr;
    },
    tabChange: function (type) {
        console.log('type: '+type);
        this.state.queryType = type;
        this.setState({queryType: type});
        console.log('queryType: '+this.state.queryType);
        this.clearMoreSelect();
    },
    selectShowHide: function () {
        this.setState({selectShow: !this.state.selectShow});
    },
    clearMoreSelect: function(){
        this.refs.deptList.setValue([]);
        this.refs.staffList.setValue([]);
        this.refs.filterForm.reset();

        var param = this.state.initParam;

        param.pageNo = 1;
        param.startDate = "";
        param.endDate = "";
        param.staffList = [];
        param.isContain = null;
        param.deptList = [];
        var type = this.state.queryType;
        if(type == 'day'){
            param.reportType = 0;
        }else if(type == 'week'){
            param.reportType = 1;
        }else if(type == 'month'){
            param.reportType = 2;
        }
        this.state.initParam = param;
        this.setState(this.state.initParam);

        this.refs.picker.changeQueryType(type);
        this.getData(null);
    },
    confirmSelect: function(){
        var param = this.state.initParam;
        param.pageNo = 1;
        /*var type = this.state.queryType;
        var list = this.state[type+'s'];
        var start = list[0].value || list[0].start;
        var end = list[list.length-1].value || list[list.length-1].end;
        
        var flag = null;
        var includeUnder = this.refs.includeUnder.checked;
        var includeMem = this.refs.includeMem.checked;
        if(includeUnder) flag = 0;
        if(includeMem) flag = 1;
        this.state.initParam.pageNo = 1;
        this.state.initParam.reportType = param.reportType;
        this.state.initParam.startDate = start;
        this.state.initParam.endDate = end;
        this.state.initParam.staffList = this.refs.staffs.el.val();
        this.state.initParam.isContain = flag;
        this.state.initParam.deptId = this.refs.dept.el.val();*/
        this.state.initParam = param;
        this.setState(this.state.initParam);
        this.getData(null);
        this.selectShowHide();
    },
    setDays: function(data){
        this.state.days = data;
        this.setTableField(data);
        this.setInitParamTime(data);
    },
    setWeeks: function(data){
        this.state.weeks = data;
        this.setTableField(data);
        this.setInitParamTime(data);
    },
    setMonths: function(data){
        this.state.months = data;
        this.setTableField(data);
        this.setInitParamTime(data);
    },
    formChange: function(field){
        var param = this.state.initParam;
        if(param[field]){
            param[field] = this.refs[field].el.val();
        }else{
            if(this.refs.includeUnder.checked){
                param.isContain = 0;
            }
            if(this.refs.includeMem.checked){
                param.isContain = 1;
            }
            if( !this.refs.includeUnder.checked && !this.refs.includeMem.checked){
                param.isContain = null;
            }
        }
        this.state.initParam = param;
        this.setState(this.state.initParam);
    },
    setInitParamTime: function(data){
        if(data.length>0){
            var param = this.state.initParam;
            param.startDate = data[0].value||data[0].start;
            param.endDate = data[data.length-1].value||data[data.length-1].end;
            this.state.initParam = param;
            this.setState(this.state.initParam);
        }
    },//设置查询时间
    setTableField: function(data){
        var tmp1 = this.state.baseTh;
        var arr1 = [];

        for(var i=0; i< data.length; i++){
            arr1.push({name:data[i].text, width:''});
        }
        this.state.tableData.th = null;
        this.state.tableData.th = tmp1.concat(arr1);

        var tmp2 = this.state.baseTr;
        var arr2 = [];
        for(var j=0; j< data.length; j++){
            arr2.push(data[j].value||data[j].end);
        }
        this.state.tableData.tr = null;
        this.state.tableData.tr = tmp2.concat(arr2);

        this.setState(this.state.tableData.th);
        console.log(JSON.stringify(this.state.tableData.tr));
    },
    exportData: function () {
        if(this.state.canExport){
            window.open(APIS.workReportExcel);
        }else{
            toastr.error('当前查询结果为空，请重设查询条件');
        }
    },//导出
    newStyle: function () {
        return {
            width100: {width: '100%'}
        }
    },
    queryTypeChange: function(e){
        var value = e.target.value;
        this.setState({queryByDep: (value==2 ? true : false)});
        this.refs.deptList.setValue([]);
        this.refs.staffList.setValue([]);
        this.refs.includeUnder.checked = false;
        this.refs.includeMem.checked = false;
    },//数据筛选方式
    render: function () {
        var newStyle = this.newStyle();

        return (
            <div>
                <CurrentPosition routes={this.props.routes} params={this.props.params}/>
                <div className="page-body">
                    <div className="dashboard-box my">
                        <div className="box-tabbs">
                            <div className="tabbable my">
                                <ul className="nav nav-tabs myTab">
                                    <li className="active" onClick={this.tabChange.bind(this, 'day')}>
                                        <a data-toggle="tab" href="#dayReport">日报统计</a>
                                    </li>
                                    <li onClick={this.tabChange.bind(this, 'week')}>
                                        <a data-toggle="tab" href="#weekReport">周报统计</a>
                                    </li>
                                    <li onClick={this.tabChange.bind(this, 'month')}>
                                        <a data-toggle="tab" href="#monthReport">月报统计</a>
                                    </li>
                                    <div className="DTTT btn-group">
                                        <a onClick={this.selectShowHide}
                                           className="btn btn-default DTTT_button_collection">
                                            <i className="fa fa-filter"></i>
                                            <span>筛选 <i className="fa fa-angle-down"></i></span>
                                        </a>
                                        <a className="btn btn-default DTTT_button_collection" onClick={this.exportData}>
                                            <i className="glyphicon glyphicon-open"></i>
                                            <span>导出</span>
                                        </a>
                                    </div>
                                    <div
                                        style={{display:this.state.selectShow ? 'block' : 'none', width:'380px', zIndex:100, position:'absolute',right:'1px',top:'42px'}}>
                                        <div className="well with-header" style={{background:'#fff',height:'100%'}}>
                                            <div className="header bordered-blue">
                                                <div className="buttons-preview"
                                                     style={{textAlign:'right',paddingTop:10+'px'}}>
                                                    <button onClick={this.clearMoreSelect} className="btn btn-default">
                                                        重置
                                                    </button>
                                                    <button onClick={this.confirmSelect} className="btn btn-danger">确定
                                                    </button>
                                                </div>
                                            </div>
                                            <div style={{marginTop:30+'px',paddingLeft:10+'px'}}>
                                                <form ref="filterForm">
                                                    <DMYPicker ref="picker" setDays={this.setDays} setWeeks={this.setWeeks} setMonths={this.setMonths} />
                                                    <div className="form-group">
                                                        <label>数据筛选</label>
                                                        <div className="input-icon icon-right">
                                                            <select style={newStyle.width100} onChange={this.queryTypeChange}>
                                                                <option value="1">按人员</option>
                                                                <option value="2">按部门</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="form-group" style={{display: this.state.queryByDep ? 'block' : 'none'}}>
                                                        <label>指定部门</label>
                                                        <div className="input-icon icon-right">
                                                            <Select2 ref="deptList" multiple={true}
                                                                     onChange={this.formChange.bind(this, 'deptList')}
                                                                     data={this.state.depList}
                                                                     style={newStyle.width100}/>
                                                        </div>
                                                    </div>
                                                    <div className="form-group" style={{display: this.state.queryByDep ? 'none' : 'block'}}>
                                                        <label>指定人员</label>
                                                        <div className="input-icon icon-right">
                                                            <Select2 ref="staffList" multiple={true}
                                                                     data={this.state.staffsList}
                                                                     onChange={this.formChange.bind(this, 'staffList')}
                                                                     style={newStyle.width100}/>
                                                        </div>
                                                    </div>
                                                    <div className="form-group" style={{display: this.state.queryByDep ? 'none' : 'block'}}>
                                                        <div className="checkbox" style={{padding: '0px'}}>
                                                            <label style={{padding: '0px', float: 'left'}}>
                                                                <input ref="includeUnder" type="checkbox"
                                                                       className="colored-danger" onChange={this.formChange.bind(this, 'includeUnder')} />
                                                                <span className="text">包含下属</span>
                                                            </label>
                                                            <label style={{float: 'left'}}>{/*this.refs.includeMem.checked*/}
                                                                <input ref="includeMem" type="checkbox"
                                                                       className="colored-danger" onChange={this.formChange.bind(this, 'includeMem')} />
                                                                <span className="text">包含下级部门成员</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </ul>

                                <div className="tab-content tabs-flat">
                                    <div id="dayReport" className="tab-pane animated fadeInUp active">
                                        {/*日报统计*/}
                                        <TableView ref="dayList" getData={this.getData} tableData={this.state.tableData} initParam={this.state.initParam} alignClass="alignCenter"></TableView>
                                    </div>
                                    <div id="weekReport" className="tab-pane animated fadeInUp">
                                        {/*周报统计*/}
                                        <TableView ref="weekList" getData={this.getData} tableData={this.state.tableData} initParam={this.state.initParam} alignClass="alignCenter"></TableView>
                                    </div>
                                    <div id="monthReport" className="tab-pane animated fadeInUp">
                                        {/*月报统计*/}
                                        <TableView ref="monthList" getData={this.getData} tableData={this.state.tableData} initParam={this.state.initParam} alignClass="alignCenter"></TableView>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
});