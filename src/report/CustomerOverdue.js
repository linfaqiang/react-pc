import React from 'react';
import {APIS} from '../core/common/config';
import CurrentPosition from '../core/components/layout/CurrentPosition';
import AjaxRequest from '../core/common/ajaxRequest.js';
import {Pagination, Select, Progress} from 'antd';
import Select2 from '../core/components/Select2/Select2.js';
import '../core/components/Select2/select2.css';

//客户超期未跟进
module.exports = React.createClass({
  getInitialState: function () {
    return {
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
        url: APIS.sales_report + 'customer_overtime_not_follows',
        th: [
          {
            name: '超期未跟进',
            width: 200
          }, {
            name: '客户',
            width: 200
          }, {
            name: '客户等级',
            width: 150
          }, {
            name: '责任人',
            width: 150
          }, {
            name: '所在部门',
            width: 150
          }, {
            name: '创建日期',
            width: 180
          }, {
            name: '最后跟进日期',
            width: 180
          }
        ],
        tr: ['overdueDays', 'customerName', 'customerLevelName', 'ownerStaffName', 'deptName', 'createdOn', 'lastOperatedOn']
      },
      lists: [], // 列表数据集合
      groupArr: {},  // 分组(自己拼接的)
      groupObj: {},  // 分组(接口返回的)
      pageData: {
        pageNo: 1,
        totalSize: 0,
        pageSize: 10
      },
      hideNoData: true,
      showLoding: false,
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
    self.getGroupData();
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
    if (this.state.lists.length == 0) {
      toastr.error('当前查询结果为空，请重设查询条件');
      return;
    }
    window.open(APIS.sales_report + 'export-customer-overtime-excel');
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

    this.getGroupData();
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
  /* 筛选—客户创建日期起 */
  renderStartTime: function () {
    return (
      <div>
        客户创建日期起<br/>
        <div className="input-group">
          <input className="form-control date-picker" ref="startTime"
                 id="startTime" type="text" placeholder="选择客户创建日期起"
                 data-date-format="yyyy-mm-dd"/>
          <span className="input-group-addon">
												<i className="fa fa-calendar"/>
											</span>
        </div>
      </div>
    );
  },
  /* 筛选—客户创建日期止 */
  renderEndTime: function () {
    return (
      <div>
        客户创建日期止<br/>
        <div className="input-group">
          <input className="form-control date-picker" ref="endTime"
                 id="endTime" type="text" placeholder="选择客户创建日期止"
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
    // 加载中
    self.setState({
      showLoding: true
    });
    $('#shCircleLoader').shCircleLoader({
      //color: '#d61518',
      dots: 12,
      dotsRadius: 4
    });
    AjaxRequest.post(self.state.tableData.url + '?pageSize=' + param.pageSize + '&pageNo=' + param.pageNo, param, function (body) {
      if (body.msg == 'OK') {
        if (body.code == '200' && body.data) {
          self.setPagerData(body);
          // 移除加载中
          self.setState({
            showLoding: false
          });
          $('#shCircleLoader').shCircleLoader('destroy');
        }
        if (body.data.length) {
          self.setState({
            hideNoData: true
          });
          window.scroll(0, 0);
        } else {
          self.setState({
            hideNoData: false
          });
        }
      } else {
        console.log('请求失败!')
      }
    });
  },
  /* 阻止事件冒泡 */
  stopEvent: function (e) {
    e.stopPropagation();
    e.preventDefault();
  },
  /* 获取分组字段 */
  getGroupField: function (overdueDays) {
    var fieldName = '';
    if (overdueDays > 90) {
      fieldName = "overDue90"
    } else if (overdueDays <= 90 && overdueDays > 60) {
      fieldName = "overDue60"
    } else if (overdueDays <= 60 && overdueDays > 30) {
      fieldName = "overDue30"
    } else if (overdueDays <= 30 && overdueDays > 20) {
      fieldName = "overDue20"
    } else if (overdueDays <= 20 && overdueDays > 10) {
      fieldName = "overDue10"
    }
    return fieldName;
  },
  /* 获取分组数据 */
  getGroupData:function () {
    var self = this;
    AjaxRequest.post(APIS.sales_report + 'customer_overday_group', self.state.initParam, function (body) {
      if (body.msg == 'OK') {
        if (body.code == '200' && body.data) {
          self.setState({groupObj: body.data});
        }
      } else {
        console.log('请求失败!')
      }
    });
  },
  PageChange: function (page) {
    var self = this;
    var initParam = self.state.initParam;

    initParam.pageNo = page;
    self.setState({initParam: initParam});
    self.getData(initParam);
  },
  setPagerData: function (data) {
    var self = this;
    var param = self.state.pageData;

    param.pageNo = self.state.initParam.pageNo || data.pageNo || 1;
    param.totalSize = data.totalSize || 0;
    param.pageSize = self.state.initParam.pageSize || data.pageSize || 10;

    // 获取分组信息
    var groupField = self.state.tableData.tr[0];
    var groupArr = {
      "overDue90": 0,
      "overDue60": 0,
      "overDue30": 0,
      "overDue20": 0,
      "overDue10": 0
    };

    // 遍历出分组信息
    data.data.map(function (qst, key) {
      var overdueDays = qst[groupField];
      groupArr[self.getGroupField(overdueDays)]++;
    });

    self.setState({
      lists: data.data,
      pageData: param,
      groupArr: groupArr
    });
  },
  render: function () {
    // th
    var th = this.state.tableData.th;
    var thStr = th.map(function (qst, key) {
      return <th key={key} className="sorting" width={qst.width}>
        {qst.name}
      </th>
    }.bind(this));

    // tr
    var tr = this.state.lists,
      td = this.state.tableData.tr,
      alreadyFill = [],  // 已经填充过的字段名称
      groupArr = this.state.groupArr,
      self = this;

    var trStr = tr.map(function (qst, key) {
      var tdHtml = td.map(function (qstTd, keyTd) {
        var tdVal = qst[qstTd]; // 填充td的值
        if (keyTd == 0) {
          // 排序字段
          var filedName = self.getGroupField(tdVal);
          if (!alreadyFill.includes(filedName)) {
            alreadyFill.push(filedName);
            var rowSpan = groupArr[filedName], // 需要合并的行数
              valStr = '>' + filedName.substr(filedName.length - 2) + '天';
            return <td style={{verticalAlign: 'middle'}} key={keyTd} rowSpan={rowSpan}>
              {valStr}<br/>({self.state.groupObj[filedName]}个记录)
            </td>;
          }
          return;
        } else if (keyTd == 1) {
          // 超链接字段
          var link = ('#/customer/' + qst.id);
          return <td className="textLeft" key={keyTd}>
            <a href={link}>{tdVal}</a>
          </td>
        } else {
          return <td className="textLeft" key={keyTd}>
            {tdVal}
          </td>
        }
      });

      var trHtml = <tr key={key}>
        {tdHtml}
      </tr>;
      return trHtml;
    }.bind(this));

    return (
      <div>
        <CurrentPosition routes={this.props.routes} params={this.props.params}/>
        <div className="page-body">
          <div className="dashboard-box my">
            <div className="box-tabbs">
              <div className="tabbable my">
                <ul className="nav nav-tabs myTab">
                  <li className="dropdown active">
                    <a>客户超期未跟进</a>
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
                  <div id="irregular" className="tab-pane animated fadeInUp active">
                    <div style={{overflow: 'hidden', position: 'relative', minHeight: '450px'}}>
                      <table
                        className={"table table-striped table-hover table-bordered dataTable no-footer firstCenter"}
                        id="editabledatatable" aria-describedby="editabledatatable_info" style={{marginBottom: '40px'}}>
                        <thead>
                        <tr role="row">
                          {thStr}
                        </tr>
                        </thead>
                        <tbody className="public-body">
                        {trStr}
                        </tbody>
                      </table>
                      <br />
                      <div className={this.state.hideNoData ? "no-massage hide" : "no-massage"} style={{top: '45%'}}>
                        <div className='crmNoData'>暂无数据</div>
                      </div>
                      <div className="shCircleLoaderBox" onClick={this.stopEvent}
                           style={{display: (this.state.showLoding ? 'block' : 'none')}}>
                        <div id="shCircleLoader" className="shCircleLoader"></div>
                      </div>
                      <div style={{position: 'absolute', right: '0px', bottom: '10px'}}>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
});