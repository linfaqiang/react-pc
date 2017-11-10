import React from 'react';
import {APIS} from '../core/common/config';
import CurrentPosition from '../core/components/layout/CurrentPosition';
import AjaxRequest from '../core/common/ajaxRequest.js';
import Select2 from '../core/components/Select2/Select2.js';
import '../core/components/Select2/select2.css';
import TableView from '../core/components/TableList/TableView.js';
import Alert from '../core/components/alert.js';
import {Progress} from 'antd';

//签到报表
module.exports = React.createClass({
  getInitialState: function () {
    return {
      startUpload: false,
      percentage: 0,
      selectShow: false, // 筛选框显示/隐藏
      selectFilter: {
        startCreatedOn: "",
        endCreatedOn: "",
        staffList: [],   // 选择的人员
        dataStaff: [],   // 人员下拉框数据源
        deptList: [],   // 选择的部门
        dataDept: [],   // 部门下拉框数据源
        dataType: 1  // 显示按人员/部门筛选
      },
      dataTypeArr: [
        {text: '按人员', id: 1},
        {text: '按部门', id: 2}
      ],  //  数据筛选
      isContainSub: false,  // 是否包含下属
      isContainTeam: false,  // 是否包含团队成员
      initParam: {
        startDate: "",
        endDate: "",
        staffList: [],   // 选择的人员
        deptList: [],   // 选择的部门
        isContain:null, // “包含下属”勾选传0,“包含成员”勾选传1,两个都勾选传1,都不勾选传null
        pageNo: 1,
        pageSize: 10
      },
      tableData: {               //存放表格数据
        tableName: 'chance',
        url: APIS.sales_report + 'staff_sign_report',
        th: [
          {
            name: '人员',
            width: 200
          }, {
            name: '部门',
            width: 150
          }, {
            name: '地点',
            width: 220
          }, {
            name: '时间',
            width: 220
          }
        ],
        tr: ['staffName', 'deptName', 'address', 'createdOn']
      },
      checkInArr: []
    };
  },
  componentWillMount: function () {
    var self = this;
    /* 人员 */
    AjaxRequest.get(APIS.staffs_subs, null, function (body) {
      if (body.code == 200 || body.code == '200') {
        self.state.selectFilter.dataStaff = body.data;
        self.setState(self.state.selectFilter);
      }
    });
    /* 部门 */
    AjaxRequest.get(APIS.dept_subs, null, function (body) {
      if (body.code == 200 || body.code == '200') {
        var lists = body.data;
        var deptArr = [];
        for (var i = 0; i < lists.length; i++) {
          deptArr.push({
            "id": lists[i].deptId,
            "text": lists[i].deptName
          });
        }
        self.state.selectFilter.dataDept = deptArr;
        self.setState(self.state.selectFilter);
      }
    });
  },
  componentDidMount: function () {
    var self = this;
    $('.date-picker').datepicker({
      local: 'ZH_CN'
    }); // 初始日期控件
    self.getData(self.state.initParam);
  },
  /* 点击筛选 */
  selectShowHide: function () {
    var self = this;
    self.setState({
      selectShow: !self.state.selectShow
    });
  },
  /* 点击导出 */
  exportData: function () {
    if (this.state.checkInArr.length == 0) {
      toastr.error('当前查询结果为空，请重设查询条件');
      return;
    }
    window.open(APIS.sales_report + 'export-staff-sign-report-excel');
  },
  /* 筛选—重置 */
  handlerResetFilter() {
    this.state.selectFilter.startCreatedOn = null;
    this.state.selectFilter.endCreatedOn = null;
    this.state.selectFilter.staffList = [];
    this.state.selectFilter.deptList = [];
    this.state.selectFilter.dataType = 1;

    this.setState({
      isContainSub: false,
      isContainTeam: false
    });

    this.refs.startTime.value = null;
    this.refs.endTime.value = null;

    this.setState(this.state.selectFilter);
  },
  /* 筛选—确定 */
  confirmSelect: function () {
    this.setState({selectShow: false});

    this.state.initParam.startDate = this.refs.startTime.value;
    this.state.initParam.endDate = this.refs.endTime.value;
    this.state.initParam.staffList = this.state.selectFilter.dataType == 1 ? this.state.selectFilter.staffList : [];
    this.state.initParam.deptList = this.state.selectFilter.dataType == 2 ? this.state.selectFilter.deptList : [];

    if (this.state.selectFilter.dataType == 2) {
      this.state.initParam.isContain = null;
    } else {
      if (this.state.isContainTeam) {
        this.state.initParam.isContain = 1;
      } else {
        if (this.state.isContainSub) {
          this.state.initParam.isContain = 0;
        } else {
          this.state.initParam.isContain = null;
        }
      }
    }

    this.setState(this.state.initParam);
    this.getData(this.state.initParam);
  },
  /* 筛选—勾选 */
  changeChecked: function (e) {
    if (e.target.getAttribute('name') == 'sub') {
      this.setState({
        isContainSub: !this.state.isContainSub
      });
    } else {
      this.setState({
        isContainTeam: !this.state.isContainTeam
      });
    }
  },
  /* 筛选—选择人员 */
  setStaffsValue: function () {
    this.state.selectFilter.staffList = this.refs.staffs.el.val();
    this.setState(this.state.selectFilter);
  },
  /* 筛选—选择部门 */
  setDeptValue: function () {
    this.state.selectFilter.deptList = this.refs.depts.el.val();
    this.setState(this.state.selectFilter);
  },
  /* 筛选—部门/人员 */
  setDataValue: function () {
    this.state.selectFilter.dataType = this.refs.typeData.el.val();
    this.setState(this.state.selectFilter);
  },
  /* 筛选—签到日期起 */
  renderStartTime: function () {
    return (
      <div>
        签到日期起<br/>
        <div className="input-group">
          <input className="form-control date-picker" ref="startTime"
                 id="startTime" type="text" placeholder="选择签到日期起"
                 data-date-format="yyyy-mm-dd"/>
          <span className="input-group-addon">
												<i className="fa fa-calendar"/>
											</span>
        </div>
      </div>
    );
  },
  /* 筛选—签到日期止 */
  renderEndTime: function () {
    return (
      <div>
        签到日期止<br/>
        <div className="input-group">
          <input className="form-control date-picker" ref="endTime"
                 id="endTime" type="text" placeholder="选择签到日期止"
                 data-date-format="yyyy-mm-dd"/>
          <span className="input-group-addon">
												<i className="fa fa-calendar"/>
											</span>
        </div>
      </div>
    );
  },
  /* 筛选—数据筛选 */
  renderStaffOrDept: function () {
    return (
      <div>
        数据筛选<br/>
        <Select2
          ref="typeData"
          multiple={false}
          style={{width: "100%"}}
          onSelect={this.setDataValue}     //选择回调 ,如果是单选,只调用这个就行了
          data={this.state.dataTypeArr}
          value={ this.state.selectFilter.dataType}
        />
      </div>
    );
  },
  /* 筛选—指定人员 */
  renderStaff: function () {
    if (this.state.selectFilter.dataType == 2) {
      return '';
    }
    return (
      <div>
        指定人员<br/>
        <Select2
          multiple={true}
          ref="staffs"
          style={{width: "100%"}}
          onSelect={this.setStaffsValue}
          onUnselect={this.setStaffsValue}  //删除回调
          data={this.state.selectFilter.dataStaff}
          value={ this.state.selectFilter.staffList}
          options={{placeholder: '选择指定人员'}}
        />
      </div>
    );
  },
  /* 筛选—指定部门 */
  renderDept: function () {
    if (this.state.selectFilter.dataType == 1) {
      return '';
    }
    return (
      <div>
        指定部门<br/>
        <Select2
          multiple={true}
          ref="depts"
          style={{width: "100%"}}
          onSelect={this.setDeptValue}
          onUnselect={this.setDeptValue}  //删除回调
          data={this.state.selectFilter.dataDept}
          value={ this.state.selectFilter.deptList}
          options={{placeholder: '选择指定部门'}}
        />
      </div>
    );
  },
  /* 筛选—包含下属、包含团队成员 */
  renderIsContain: function () {
    if (this.state.selectFilter.dataType == 2) {
      return '';
    }
    return (
      <div>
        <div className="input-group" style={{width: '100%'}}>
          <label style={{width: '50%'}}><input className="form-control" ref="isContainSub"
                                               id="isContainSub" type="checkbox"
                                               checked={this.state.isContainSub}/><span name="sub"
                                                                                        onClick={this.changeChecked}
                                                                                        className="text">包含下属</span></label>
          <label style={{width: '50%'}}><input className="form-control" ref="isContainTeam"
                                               id="isContainTeam" type="checkbox"
                                               checked={this.state.isContainTeam}/><span name="team"
                                                                                         onClick={this.changeChecked}
                                                                                         className="text">包含下级部门成员</span></label>
        </div>
      </div>
    );
  },
  /* 获取数据源 */
  getData: function (param) {
    var self = this;
    self.refs.checkInList.beginLoad(param.pageNo);
    AjaxRequest.post(self.state.tableData.url + '?pageSize=' + param.pageSize + '&pageNo=' + param.pageNo, param, function (data) {
      if (data.code == 200 || data.code == '200') {
        self.refs.checkInList.setPagerData(data);
        var resultData = data.data || [];
        self.setState({checkInArr: resultData});
      }
    });
  },
  /* 阻止事件冒泡 */
  stopEvent: function (e) {
    e.stopPropagation();
    e.preventDefault();
  },
  allClick: function () {

  },
  render: function () {
    return (
      <div>
        <CurrentPosition routes={this.props.routes} params={this.props.params}/>
        <div className="page-body">
          <div className="dashboard-box my">
            <div className="box-tabbs">
              <div className="tabbable my">
                <ul className="nav nav-tabs myTab">
                  <li className="dropdown active">
                    <a>签到报表</a>
                  </li>
                  <div className="DTTT btn-group">
                    <a onClick={this.selectShowHide}
                       className="btn btn-default DTTT_button_collection">
                      <i className="fa fa-filter"></i>
                      <span>筛选 <i className="fa fa-angle-down"></i></span>
                    </a>
                    <a onClick={this.exportData} className="btn btn-default DTTT_button_collection">
                      <i className="glyphicon glyphicon-open"></i>
                      <span>导出 </span>
                    </a>
                  </div>
                  <div style={{
                    display: this.state.selectShow ? 'block' : 'none',
                    width: 380 + 'px',
                    height: 452 + 'px',
                    zIndex: 100,
                    position: 'absolute',
                    right: 1 + 'px',
                    top: 42 + 'px'
                  }}>
                    <div className="well with-header" style={{background: '#fff', height: '100%'}}>
                      <div className="header bordered-blue">
                        <div className="buttons-preview" style={{textAlign: 'right', paddingTop: 10 + 'px'}}>
                          <button onClick={this.handlerResetFilter} className="btn btn-cancer">重置</button>
                          <button onClick={this.confirmSelect} className="btn btn-danger">确定</button>
                        </div>
                      </div>
                      <div style={{marginTop: 30 + 'px', paddingLeft: 10 + 'px'}}>
                        {this.renderStartTime()}<br/>
                        {this.renderEndTime()}<br/>
                        {this.renderStaffOrDept()}<br/>
                        {this.renderStaff()}
                        {this.renderDept()}
                        {this.renderIsContain()}<br/>
                      </div>
                    </div>
                  </div>
                </ul>
                <div className="tab-content tabs-flat">
                  <div id="visits" className="tab-pane animated fadeInUp active">
                    <TableView ref="checkInList" getData={this.getData} tableData={this.state.tableData}
                               initParam={this.state.initParam}
                               allClick={true} clickBack={this.allClick}></TableView>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="uploadProgress" style={{display: (this.state.startUpload ? 'block' : 'none')}}
             onMouseDown={this.stopEvent} onTouchStart={this.stopEvent}>
          <Progress type="circle" percent={this.state.percentage}/>
        </div>

        <Alert result="succees"></Alert>
        <Alert result="danger"></Alert>
      </div>
    )
  }
});