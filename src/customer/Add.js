import React from 'react';
import {APIS} from '../core/common/config';
import AjaxRequest from '../core/common/ajaxRequest.js';
import UserInfo from '../core/common/UserInfo';
import Dicts from '../core/common/dicts.js';

import CurrentPosition from '../core/components/layout/CurrentPosition';
import ThreeLevel from '../core/components/ThreeLevel/threeLevel';

import Select2 from '../core/components/Select2/Select2.js';
import '../core/components/Select2/select2.css';
import Alert from '../core/components/alert.js';
import {Modal, Button} from 'antd';
const confirm = Modal.confirm;

var AreaComponents = React.createFactory(ThreeLevel);
var ProvSel = {ProvCode: '', ProvVal: ''}
    , CitySel = {CityCode: '', CityVal: ''}
    , CountySel = {CountyCode: '', CountyVal: ''};

module.exports = React.createClass({
    getInitialState: function () {
        console.log('--->');
        return {
            canGoBack: false,
            changed: false,
            prov: '',        //三级联动
            city: '',
            county: '',
            customerLevels: [],
            industrys: [],
            linkmanId: '',
            userMsg: UserInfo.get(),
            customerList: [],//父客户列表
            parentCustomer: {id: "", name: ""},
            args: {
                pageSize: 200,
                pageNo: 1,
                q: ""
            }//获取所有客户
        }
    },
    componentWillMount: function () {

    },
    componentDidMount: function () {
        var self = this;

        AjaxRequest.get(APIS.custormerLeval, null, function (body) {
            self.setState({
                customerLevels: body.data
            })
        });

        AjaxRequest.get(APIS.custormerIndustry, null, function (body) {
            self.setState({
                industrys: body.data
            })
        });

        this.formValidator();

        if (this.props.params.customerId != 'a' && this.props.params.customerId > 0) {
            //this.renderEdit();
            self.getAllCustomer();
        } else {
            self.refs.ownerStaffName.value = self.state.userMsg.name;

            self.getAllCustomer();
        }

        $('input[name="shortname"]').on('change blur', function (e) {
            var bootstrapValidator = $("#addCustomerForm").data('bootstrapValidator');
            bootstrapValidator.updateStatus('shortname', 'NOT_VALIDATED').validateField('shortname');
        });
        Dicts.get(function () {

        });
    },

    getAllCustomer: function () {
        var self = this;
        AjaxRequest.get(APIS.getAllCustomer, self.state.args, function (body) {
            var tmp1 = new Array();
            var list = body.data;

            if (list.length === 0) return;

            for (var i = 0; i < list.length; i++) {
                tmp1.push({id: list[i].id, text: list[i].name});
                /*if (self.state.parentCustomer.id == list[i].id) {
                 self.state.parentCustomer.name = list[i].name;
                 }*/

            }
            self.setState({customerList: tmp1});
            self.refs.parentId.setValue('');
            //self.setState(self.state.parentCustomer);

            if (self.props.params.customerId > 0) {
                self.renderEdit();
            }
        });
    },//获取所有客户

    handleParentCustomerChange: function (e) {
        var id = parseInt(e.target.value);
        var customerList = this.state.customerList;

        this.setState({changed: true});
        for (var i = 0; i < customerList.length; i++) {
            if (customerList[i].id == id) {
                this.state.parentCustomer.id = customerList[i].id;
                this.state.parentCustomer.name = customerList[i].text;
                //self.refs.parentId.setValue(datas.parentId)
                this.setState(this.state.parentCustomer);
                break;
            }
        }
    },

    renderEdit: function () {
        var self = this;
        if (this.props.params.customerId > 0) {
            AjaxRequest.get(APIS.customerDetail + this.props.params.customerId, null, function (body) {
                var thisRefs = self.refs,
                    datas = body.data;
                for (var attr in thisRefs) {
                    if (attr == 'adcode' && datas.regionPath) {
                        var addArr = datas.regionPath.split(',');
                        var province = addArr[0];
                        var city = addArr[1];
                        var county = '0';
                        if (addArr.length > 2) {
                            county = addArr[2];
                        }

                        ProvSel.ProvCode = province;
                        CitySel.CityCode = city;
                        CountySel.CountyCode = county;

                        ProvSel.ProvVal = __areaData__.provinces[province].name;
                        CitySel.CityVal = __areaData__.provinces[province].citys[city].name;
                        if (addArr.length > 2) {
                            CountySel.CountyVal = __areaData__.provinces[province].citys[city].countys[county].name;
                        }
                        self.refs.adcode.resetStates({
                            prov: parseInt(province),
                            city: parseInt(city),
                            county: parseInt(county)
                        });

                        self.setState({
                            prov: parseInt(province),
                            city: parseInt(city),
                            county: parseInt(county)
                        });

                    } else if (attr == 'linkman') {
                        self.refs[attr].value = (datas.linkman && datas.linkman.name) ? datas.linkman.name : '';
                        self.state.linkmanId = (datas.linkman && datas.linkman.id) ? datas.linkman.id : '';
                    } else if (attr == 'linkmanMobile') {
                        self.refs[attr].value = (datas.linkman && datas.linkman.mobile) ? datas.linkman.mobile : '';
                    } else if (attr == 'adrDetail') {
                        self.refs[attr].value = (datas.address && datas.address.address) ? datas.address.address : '';
                    } else if (attr == 'parentId') {
                        //parentCustomer:{id:"", name:""},
                        self.state.parentCustomer.id = datas.parentId;
                        self.state.parentCustomer.name = datas.parentName;
                        self.setState(self.state.parentCustomer);
                        self.refs.parentId.setValue(datas.parentId);
                    } else {
                        self.refs[attr].value = datas[attr]
                    }
                }
                //self.getAllCustomer();
            });
        }
    },
    selectProvs: function (data) {
        this.setState({
            prov: data,
            city: '',
            county: ''
        })

        if (ProvSel.ProvCode != data) {

            var changeProv = data == '' ? '' : __areaData__.provinces[data].name;

            var inputVal = $('input[name="adrDetail"]').val();
            var havaProv = inputVal.indexOf(ProvSel.ProvVal) == 0
                , haveCity = inputVal.indexOf(CitySel.CityVal) == ProvSel.ProvVal.length
                , haveCounty = inputVal.indexOf(CountySel.CountyVal, (ProvSel.ProvVal.length + CitySel.CityVal.length)) == (ProvSel.ProvVal.length + CitySel.CityVal.length);
            if (havaProv) {
                inputVal = changeProv + inputVal.substring(ProvSel.ProvVal.length);//替换省
            }
            if (haveCity) {
                inputVal = changeProv + inputVal.substring(changeProv.length + CitySel.CityVal.length);//移除市
            }
            if (haveCounty) {
                inputVal = changeProv + inputVal.substring(changeProv.length + CountySel.CountyVal.length);//移除区
            }
            $('input[name="adrDetail"]').val(inputVal);

            ProvSel = {ProvCode: data, ProvVal: changeProv};
            CitySel = {CityCode: '', CityVal: ''};
            CountySel = {CountyCode: '', CountyVal: ''};
        }


    },
    selectCitys: function (data) {
        this.setState({
            city: data,
            county: ''
        })

        if (CitySel.CityCode != data) {

            var changeCity = data == '' ? '' : __areaData__.provinces[ProvSel.ProvCode].citys[data].name;

            var inputVal = $('input[name="adrDetail"]').val();
            var haveCity = inputVal.indexOf(CitySel.CityVal) == ProvSel.ProvVal.length
                , haveCounty = inputVal.indexOf(CountySel.CountyVal, (ProvSel.ProvVal.length + CitySel.CityVal.length)) == (ProvSel.ProvVal.length + CitySel.CityVal.length);
            //替换
            if (haveCity || CitySel.CityCode == '') {
                if (haveCounty) {
                    inputVal = ProvSel.ProvVal + changeCity + inputVal.substring(ProvSel.ProvVal.length + CitySel.CityVal.length + CountySel.CountyVal.length);//替换市  移除区
                } else {
                    inputVal = ProvSel.ProvVal + changeCity + inputVal.substring(ProvSel.ProvVal.length + CitySel.CityVal.length);//替换市
                }
            }
            $('input[name="adrDetail"]').val(inputVal);

            CitySel = {CityCode: data, CityVal: changeCity};
            CountySel = {CountyCode: '', CountyVal: ''};
        }

    },
    selectCountys: function (data) {
        this.setState({
            county: data
        })

        if (CountySel.CountyCode != data) {

            var changeCounty = data == '' ? '' : __areaData__.provinces[ProvSel.ProvCode].citys[CitySel.CityCode].countys[data].name;

            var inputVal = $('input[name="adrDetail"]').val();
            var haveCounty = inputVal.indexOf(CountySel.CountyVal, (ProvSel.ProvVal.length + CitySel.CityVal.length)) == (ProvSel.ProvVal.length + CitySel.CityVal.length);

            //替换||新增
            if (haveCounty || CountySel.CountyCode == '') {
                inputVal = ProvSel.ProvVal + CitySel.CityVal + changeCounty + inputVal.substring(ProvSel.ProvVal.length + CitySel.CityVal.length + CountySel.CountyVal.length);//替换区
            }
            $('input[name="adrDetail"]').val(inputVal);

            CountySel = {CountyCode: data, CountyVal: changeCounty};
        }
    },
    throttle: function (method, val, context) {   //事件节流,避免onchange时间频繁触发事件
        clearTimeout(method.tId);
        method.tId = setTimeout(function () {
            method.call(context, val);
        }, 500);
    },
    setShortName: function (e) {
        var val = e.target.value;
        this.throttle(this.shortNames, val, window);
    },
    shortNames: function (value) {
        var num = 0,
            name = value;
        /*截取“省”前面的文字*/
        num = name.indexOf("省") + 1;
        name = name.substring(num, name.length);
        /*截取“市”前面的文字*/
        num = name.indexOf("市") + 1;
        name = name.substring(num, name.length);
        /*截掉“责任有限公司”*/
        name = name.replace(/有限责任公司/g, "");
        /*截掉“股份有限公司”*/
        name = name.replace(/股份有限公司/g, "");
        /*截掉“集团有限公司”*/
        name = name.replace(/集团有限公司/g, "");
        /*截掉“有限公司”*/
        name = name.replace(/有限公司/g, "");
        /*截掉“集团公司”*/
        name = name.replace(/集团公司/g, "");
        /*截掉“集团”*/
        name = name.replace(/集团/g, "");

        //this.refs.shortname.value = name;
        var shortname = $('input[name="shortname"]');
        shortname.val(name);
        shortname.trigger('change');
    },
    saveCencer: function () {
        if (this.state.changed) {
            bootbox.confirm("表单已修改，你确定不保存退出吗?", function (result) {
                if (result) {
                    history.go(-1);
                }
            });

        } else {
            history.go(-1);
        }
    },
    saveAdd: function (e) {
        /*e.preventDefault();
         e.stopPropagation();*/
        var param = {},
            self = this,
            allRef = this.refs,
            thisType = this.props.params.customerId;
        for (var attr in allRef) {
            switch (attr) {
                case 'adcode' :
                    param['address'] = {
                        adcode: this.state.county,
                        address: this.refs.adrDetail.value
                    };
                    break;
                case 'linkman' :
                    param['linkman'] = {
                        name: this.refs[attr].value,
                        mobile: this.refs['linkmanMobile'].value
                    };
                    break;
                case 'linkmanMobile' :
                    param['linkman'] = {
                        name: this.refs['linkman'].value,
                        mobile: this.refs[attr].value
                    };
                    break;
                /*case 'parentId' :
                 param['parentId'] = this.state.parentCustomer.id;
                 break;*/
                default:
                    if (attr != 'adrDetail') {
                        param[attr] = this.refs[attr].value;
                    }
                    break;
            }
        }
        param['parentId'] = this.state.parentCustomer.id;

        if (param.parentId) {
            var list = this.state.customerList;
            for (var i = 0; i < list.length; i++) {
                if (list[i].id == param.parentId) {
                    if (param.name == list[i].text) {
                        toastr.error('新建客户不能与父客户重名');
                        return;
                    }
                    break;
                }
            }
        }

        //console.log(JSON.stringify(param));
        if (thisType != 'a' && thisType > 0) {
            param['hasRepeat'] = 1;
            if (self.state.linkmanId) {
                param.linkman.id = self.state.linkmanId;
            }
        }
        this.getPoint(param.address.address, function(point){
            if(point){
                param.address.longitude = point.lng;
                param.address.latitude = point.lat;
            }

            if (thisType != 'a' && thisType > 0) {
                AjaxRequest.put(APIS.customerDetail + thisType, param, function (body) {
                    self.showModal(body, param);
                })
            } else {
                AjaxRequest.post(APIS.myCustomer_list, param, function (body) {
                    self.showModal(body, param);
                });
            }
        })
    },
    getPoint: function (str, callback) {
        // 创建地址解析器实例
        var myGeo = new BMap.Geocoder();
        myGeo.getPoint(str, function (point) {
            if (point) {
                console.log(JSON.stringify(point));
                callback(point);
            }else{
                callback(null);
            }
        });
    },
    showModal: function (body, args, saveAgin) {
        var self = this;
        var txt = '';
        if (body.data[0].hasRepeat == 'customerOther') {
            txt = '客户信息已存在';
        } else if (body.data[0].hasRepeat == 'customer') {
            txt = '客户简称重复';
        } else if (body.data[0].hasRepeat == 'outOfMaxCount') {
            txt = '客户数量超标';
        } else if (body.data[0].hasRepeat == 'linkman') {
            txt = '客户编辑成功，但联系人编辑失败';
            self.setState({canGoBack: true});
        } else if (body.data[0].hasRepeat == 'customerOwn') {
            txt = '你已创建过该客户';
        }

        if (txt == '客户简称重复') {
            if (saveAgin) {
                txt = '';
            } else {
                this.saveAgin(args);
                return;
            }
        }

        if (!txt) {
            $('#modal-success').modal();
        } else {
            $('#modal-danger').modal().find('.modal-body').html('操作失败: ' + txt);
        }
    },
    saveAgin: function (args) {
        var self = this;
        confirm({
            title: '客户简称重复',
            content: '可能存在相同客户，是否继续创建客户',
            onOk() {
                args.hasRepeat = 1;
                var id = self.props.params.customerId;

                if (id > 0) {
                    AjaxRequest.put(APIS.customerDetail + id, args, function (body) {
                        self.showModal(body, args, true);
                    })
                } else {
                    AjaxRequest.post(APIS.myCustomer_list, args, function (body) {
                        self.showModal(body, args, true);
                    });
                }
            },
            onCancel() {
                return false;
            }
        });
    },
    formValidator: function () {
        var self = this,
            thisForm = $('#addCustomerForm');
        thisForm.bootstrapValidator({
            live: 'enabled',
            message: 'This value is not valid',
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            submitHandler: function (validator, thisForm, thisBtn) {
                self.saveAdd();
            },
            fields: {
                countyId: {
                    validators: {
                        notEmpty: {
                            message: '请选择具体地址'
                        }
                    }
                },
                customerName: {
                    validators: {
                        notEmpty: {
                            message: '客户名称不能为空'
                        }
                    }
                },
                shortname: {
                    validators: {
                        notEmpty: {
                            message: '客户简称不能为空'
                        }
                    }
                },
                linkmanName: {
                    validators: {
                        notEmpty: {
                            message: '联系人不能为空'
                        }
                    }
                },
                employeesTotal: {
                    validators: {
                        numeric: {
                            message: '年度收入必须为数字'
                        }
                    }
                },
                linkmanMobile: {
                    validators: {
                        notEmpty: {
                            message: '联系人手机不能为空'
                        },
                        phone: {
                            message: '联系人手机格式不对'
                        }

                    }
                },
                customerLevel: {
                    validators: {
                        notEmpty: {
                            message: '请选择客户等级'
                        }
                    }
                },
                industry: {
                    validators: {
                        notEmpty: {
                            message: '请选择行业类别'
                        }
                    }
                },
                email: {
                    validators: {
                        emailAddress: {
                            message: '邮箱格式不对'
                        }
                    }
                },

                annualIncome: {
                    validators: {
                        numeric: {
                            message: '年度收入必须为数字'
                        }
                    }
                },
                modile: {
                    validators: {
                        phone: {
                            message: '手机号码格式不对'
                        }
                    }
                }/*,
                 url: {
                 validators: {
                 uri: {
                 message: 'url格式不对'
                 }
                 }
                 }*/
            }
        });
    },
    render: function () {
        var style100 = {width: "100%"};
        var bigWide = {
            marginLeft: '-24px',
            marginRight: '-24px'
        };
        var levels = this.state.customerLevels,
            industry = this.state.industrys;

        var levelOptions = levels.map(function (qst, key) {
            return <option key={key} value={qst.id}>{qst.name}</option>
        }.bind(this));

        var industryOptions = industry.map(function (qst, key) {
            return <option key={key} value={qst.id}>{qst.name}</option>
        }.bind(this));


        return (
            <div>
                {/*<CurrentPosition name={"客户 / " + ( (this.props.params.customerId != 'a' && this.props.params.customerId>0) ? '编辑客户' : '新增客户')}></CurrentPosition>*/}

                <CurrentPosition routes={this.props.routes} params={this.props.params}/>
                <div className="page-body">
                    <div className="dashboard-box my">
                        <div className="box-tabbs">
                            <div className="tabbable my">
                                <ul className="nav nav-tabs myTab noBorLR">
                                    <li className="dropdown active">
                                        <a>
                                            {this.props.route.name}
                                        </a>
                                    </li>
                                </ul>
                                <form id="addCustomerForm">
                                    <div className="widget-body padding-20" style={{boxShadow: 'none'}}>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>客户名称 <sup>*</sup></label>
                                                    <div className="input-icon icon-right">
                                                        <input type="text"
                                                               onChange={this.setShortName}
                                                               name="customerName"
                                                               className="form-control"
                                                               ref="name"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>客户简称 <sup>*</sup></label>
                                                    <div className="input-icon icon-right">
                                                        <input className="form-control"
                                                               name="shortname"
                                                               ref="shortname" type="text"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>行业类别<sup>*</sup></label>
                                                    <div className="input-icon icon-right">
                                                        <select ref="industryId" name="industry"
                                                                className="add-select"
                                                                style={style100}>
                                                            <option value="">请选择</option>
                                                            {industryOptions}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>客户等级 <sup>*</sup></label>
                                                    <div className="input-icon icon-right">
                                                        <select name="customerLevel"
                                                                className="add-select"
                                                                ref="customerLevelId"
                                                                onChange={this.findStageByTypeId}
                                                                style={style100}>
                                                            <option value="">请选择</option>
                                                            {levelOptions}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>客户责任人</label>
                                                    <div className="input-icon icon-right">
                                                        <input className="form-control"
                                                               disabled="true"
                                                               name="staffName"
                                                               ref="ownerStaffName"
                                                               type="text"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>父客户</label>
                                                    <div className="input-icon icon-right">
                                                        <Select2
                                                            style={style100}
                                                            ref="parentId"
                                                            multiple={false}
                                                            onSelect={this.handleParentCustomerChange}
                                                            data={this.state.customerList}
                                                            options={{placeholder: '请选择父客户'}}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/*this.renderAddLinkman()*/}
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>联系人 <sup>*</sup></label>
                                                    <div className="input-icon icon-right">
                                                        <input className="form-control" name="linkmanName"
                                                               ref="linkman" type="text"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>联系人手机 <sup>*</sup></label>
                                                    <div className="input-icon icon-right">
                                                        <input className="form-control" name="linkmanMobile"
                                                               ref="linkmanMobile" type="text"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-xs-12">
                                                <label>地址
                                                    <sup>*</sup></label><br />
                                                <div className="add-area">
                                                    {
                                                        AreaComponents({
                                                            ref: 'adcode',
                                                            data: __areaData__,
                                                            options: {
                                                                prov: this.state.prov || '',
                                                                city: this.state.city || '',
                                                                county: this.state.county || '',
                                                                defaultText: ['省份', '城市', '区县']
                                                            },
                                                            selectProvs: this.selectProvs,
                                                            selectCitys: this.selectCitys,
                                                            selectCountys: this.selectCountys
                                                        })
                                                    }
                                                    <input className="form-control"
                                                           name="adrDetail"
                                                           placeholder="详细街道" ref="adrDetail"
                                                           type="text"/>
                                                    <br />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>电子邮箱</label>
                                                    <div className="input-icon icon-right">
                                                        <input type="text" ref="email"
                                                               name="email"
                                                               className="form-control"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>公司电话</label>
                                                    <div className="input-icon icon-right">
                                                        <input type="text" ref="telephone"
                                                               name="telephone"
                                                               className="form-control"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>员工总数</label>
                                                    <div className="input-icon icon-right">
                                                        <input type="text" ref="employeesTotal"
                                                               name="employeesTotal"
                                                               className="form-control"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>公司网址</label>
                                                    <div className="input-icon icon-right">
                                                        <input type="text" ref="url" name="url"
                                                               className="form-control"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>CEO</label>
                                                    <div className="input-icon icon-right">
                                                        <input type="text" ref="ceoName"
                                                               name="ceo"
                                                               className="form-control"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>年度收入</label>
                                                    <div className="input-icon icon-right">
                                                        <input type="text" ref="annualIncome"
                                                               name="annualIncome"
                                                               className="form-control"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <hr style={bigWide}/>
                                        <div className="form-group">
                                            <div>
                                                <div className="buttons-preview"
                                                     style={{textAlign:'left',paddingTop:10+'px'}}>
                                                    <button onClick={this.saveCencer}
                                                            className="btn btn-cancer">取消
                                                    </button>
                                                    <button id="save-btn" type="submit"
                                                            className="btn btn-danger">保存
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <Alert result="succees"></Alert>
                <Alert result="danger" canGoBack={this.state.canGoBack}></Alert>
                <div id="allmap" style={{display:'none'}}></div>
            </div>
        )
    }
});