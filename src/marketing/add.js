import React from 'react';
import CurrentPosition from '../core/components/layout/CurrentPosition';
import DictsFun from '../core/common/dicts.js';
import {APIS} from '../core/common/config.js';
import AjaxRequest from '../core/common/ajaxRequest.js';
import '../core/components/Select2/select2.css';
import Alert from '../core/components/alert.js';
import ThreeLevel from '../core/components/ThreeLevel/threeLevel';
var AreaComponents = React.createFactory(ThreeLevel);

module.exports = React.createClass({

    getInitialState: function () {
        return {
            routeId: (this.props.params.marketId == 'a' || this.props.params.marketId == 0 ) ? null : this.props.params.marketId,
            changed: false,
            prov: '',
            city: '',
            county: '',
            detailAddress: '',
            info: {
                "id": '',
                //"picId":1,//标题图
                "picIds": "",//3张图片
                "activityTypeId": 1,//活动类型
                "activityCatagoryId": 2,//固定2，市场活动
                "subject": "",//活动主题
                "organizer": "",//举办单位
                "startTime": "",//开始时间
                "endTime": "",//结束时间
                "address": {
                    "id": '',
                    "adcode": '',
                    "address": ""
                },
                "activitySize": '',//规模
                "targetGroups": "",//目标群体
                "content": ""//活动内容
            },
            activeTypeList: [],
            imgList: []
        };

    },
    //城市地址选择
    selectProvs: function (data) {
        this.setState({
            prov: data,
            city: '',
            county: '',
            changed: true
        })
    },
    selectCitys: function (data) {
        this.setState({
            city: data,
            county: '',
            changed: true
        })
    },
    selectCountys: function (data) {
        this.setState({
            county: data,
            changed: true
        })
    },
    detailAddrChange: function (e) {
        this.setState({
            detailAddress: e.target.value,
            changed: true
        })
    },
    //上传图片
    selectHandle: function () {
        var imgList = this.state.imgList;
        if (imgList.length === 3) {
            toastr.info('图片仅限三张');
            return false;
        }
        this.refs.filed.click();
    },
    handleFiles: function (e) {
        var fileList = e.target.files;
        var tmp = fileList[0].name.split('.')[1];
        if (!tmp.match(/jpg|jpeg|png|gif|bmp/i)) {
            toastr.error('图片格式不支持');
            return null;
        }
        this.uploadFileByFormData(fileList[0]);
    },
    uploadFileByFormData: function (f) {
        var self = this;
        var fd = new FormData();
        fd.append("file", f);
        var req = new XMLHttpRequest();
        req.open("POST", APIS.upload_file, true);
        req.onload = function (oEvent) {
            var res = JSON.parse(req.response);
            if (req.status == 200) {
                var tmp = self.state.imgList;
                tmp.push({fId: res.fId, fileUrl: res.fileUrl, fileName: f.name});
                self.setState({imgList: tmp});
                self.setState({changed: true});
            } else {
                toastr.error('操作失败：' + res.msg);
            }
        };
        req.send(fd);
    },
    removeImg: function (index) {
        var list = this.state.imgList;
        list.splice(index, 1);
        this.setState({imgList: list});
    },

    componentDidMount: function () {
        var self = this;
        DictsFun.get(function () {
            var t = [];
            var tmp = Dicts.ACTIVITY_TYPE;

            for (var key in tmp) {
                t.push(tmp[key]);
            }
            self.setState({
                activeTypeList: t
            });
        });
        var dpicker = $('.date-picker');
        dpicker.datepicker({
            format: 'yyyy-mm-dd',
            viewMode: 'days',
            minViewMode: 'days',
            local: 'ZH_CN'
        });
        dpicker.on('changeDate', function (ev) {
            var info = self.state.info;
            var name = ev.target.getAttribute('name');
            info[name] = ev.date.Format('yyyy-MM-dd');
            self.setState({info: info});
            var bootstrapValidator = $("#registrationForm").data('bootstrapValidator');
            bootstrapValidator.validateField(name);
            bootstrapValidator.updateStatus(name, 'VALID');
        });
        self.getActiveData();
        $("#registrationForm").bootstrapValidator();
    },

    getActiveData: function () {
        if (!this.state.routeId)return null;

        var self = this;
        AjaxRequest.get(APIS.market_list + '/' + self.state.routeId, null, function (res) {
            if (res.code == 200) {
                var data = res.data;
                // var data = JSON.parse(Base64.decode(res.data));
                var info = self.state.info;

                for (var key in info) {
                    if (key == 'address') {
                        info.address.id = data.address.id;
                        info.address.adcode = data.address.adcode;
                        info.address.address = data.address.address;
                    } else {
                        info[key] = data[key];
                    }
                }
                var tmp = data.regionPath.split(',');
                var province = tmp[0];
                var city = tmp[1];
                var county = 0;
                if (tmp.length > 2) {
                    county = tmp[2];
                }

                self.setState({
                    info: info,
                    prov: province,
                    city: city,
                    county: county,
                    detailAddress: data.address.address
                });
                self.refs.adcode.resetStates({
                    prov: province,
                    city: city,
                    county: county
                });
                //picUrlList
                var picIds = data.picIds.split(',');
                var picUrls = data.picUrlList;
                var tmp = [];

                for (var i = 0; i < picUrls.length; i++) {
                    var name = picUrls[i].split('/');
                    tmp.push({fId: picIds[i], fileUrl: picUrls[i], fileName: name[name.length - 1]});
                }
                self.setState({imgList: tmp});
            }
        });
    },

    handleChange: function (e) {
        var info = this.state.info;
        info[e.target.getAttribute('name')] = e.target.value;
        this.setState({
            info: info,
            changed: true
        });
    },
    handleSave: function (e) {
        e.preventDefault();
        e.stopPropagation();
        var self = this;

        var bootstrapValidator = $("#registrationForm").data('bootstrapValidator');
        bootstrapValidator.validate();
        if (!bootstrapValidator.isValid()) {
            return false;
        }

        var info = self.state.info;
        info.address.adcode = self.state.county;
        info.address.address = self.state.detailAddress;

        var imgList = self.state.imgList;
        var t = [];

        for (var i = 0; i < imgList.length; i++) {
            t.push(imgList[i].fId);
        }
        info.picIds = t.join();

        var t1 = info.startTime.parseDateCreateByWX();
        var t2 = info.endTime.parseDateCreateByWX();

        if ((t2.getTime() - t1.getTime()) < 0) {
            toastr.error('结束时间不能早于开始时间');
            return;
        }

        if (self.state.routeId) {
            AjaxRequest.put(APIS.market_list, info, function (data) {//+ '/' + self.state.routeId
                if (data.code == 200) {
                    $('#modal-success').modal();

                } else {
                    $('#modal-danger').modal();
                }
            });
        } else {
            AjaxRequest.post(APIS.market_list, info, function (data) {
                if (data.code == 200) {
                    $('#modal-success').modal();

                } else {
                    $('#modal-danger').modal();
                }
            });
        }
    },
    handleCancel: function (e) {
        e.preventDefault();
        e.stopPropagation();
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
    render: function () {
        var self = this;
        var style_none = {display: "none"};
        var style100 = {width: "100%"};
        var style_button = {textAlign: 'left', padding: "10px 0 10px 0"};

        var typeList = self.state.activeTypeList;
        var opts = typeList.map(function (item, key) {
            return <option value={item.id} key={key}>{item.text}</option>
        }.bind(this));

        var imgList = self.state.imgList;
        var imgs = imgList.map(function (item, key) {
            return (
                <span className="viewImgBox" key={key}>
                    <img src={item.fileUrl}/>
                    <span className="delImg" onClick={self.removeImg.bind(this, key)}></span>
                    {item.fileName}
                </span>
            );
        }.bind(this));

        return (
            <div>
                <CurrentPosition routes={this.props.routes} params={this.props.params} />
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

                                <form id="registrationForm"
                                      data-bv-live={navigator.userAgent.match('Trident') ? 'disabled' : 'enabled'}
                                      data-bv-message="This value is not valid"
                                      data-bv-feedbackicons-valid="glyphicon glyphicon-ok"
                                      data-bv-feedbackicons-invalid="glyphicon glyphicon-remove"
                                      data-bv-feedbackicons-validating="glyphicon glyphicon-refresh">

                                    <div className="widget-body padding-20" style={{boxShadow: 'none'}}>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <label htmlFor="customerName">市场图片</label>
                                                    <div className="input-icon icon-right">
                                                        <p>
																		<span onClick={this.selectHandle}
                                                                              className="uploadeBtn">
																			选择图片
																		</span>
																		<span style={{marginLeft:'10px', color:'red'}}>
																			图片格式仅支持jpg、jpeg、png、gif、bmp格式。建议图片大小750*300像素，仅限上传3张图片。
																		</span>
                                                        </p>
                                                        <p style={{lineHeight: '30px'}} ref="fileList">
                                                            {imgs}
                                                        </p>
                                                        <input ref="filed" type="file"
                                                               onChange={this.handleFiles}
                                                               style={{display:'none'}}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <label htmlFor="customerName">活动主题<sup>*</sup></label>
                                                    <div className="input-icon icon-right">
                                                        <input type="text"
                                                               className="form-control"
                                                               name="subject"
                                                               value={this.state.info.subject}
                                                               onChange={this.handleChange}
                                                               data-bv-notempty="true"
                                                               data-bv-notempty-message="活动主题必须输入"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="sourceId">开始时间<sup>*</sup></label>
                                                    <div className="input-group">
                                                        <input className="form-control date-picker" name="startTime"
                                                               value={this.state.info.startTime} type="text"
                                                               placeholder="请选择开始时间"
                                                               data-bv-notempty="true"
                                                               data-bv-notempty-message="开始时间必须输入"
                                                               data-date-format="yyyy-mm-dd"/>
																	<span className="input-group-addon">
																		<i className="fa fa-calendar"></i>
																	</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="name">结束时间<sup>*</sup></label>
                                                    <div className="input-group">
                                                        <input className="form-control date-picker" name="endTime"
                                                               value={this.state.info.endTime} type="text"
                                                               placeholder="请选择结束时间"
                                                               data-bv-notempty="true"
                                                               data-bv-notempty-message="结束时间必须输入"
                                                               data-date-format="yyyy-mm-dd"/>
																	<span className="input-group-addon">
																		<i className="fa fa-calendar"></i>
																	</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="name">活动类型<sup>*</sup></label>
                                                    <div className="input-icon icon-right">
                                                        <select className="form-control"
                                                                name="activityTypeId"
                                                                value={this.state.info.activityTypeId}
                                                                onChange={this.handleChange}
                                                                data-bv-notempty="true"
                                                                data-bv-notempty-message="活动类型必选"
                                                                style={{borderRadius: '0px'}}>
                                                            <option value="">--请选择--</option>
                                                            {opts}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="name">规模<sup>*</sup></label>
                                                    <div className="input-icon icon-right">
                                                        <input type="text" className="form-control" placeholder="请输入规模"
                                                               name="activitySize"
                                                               value={this.state.info.activitySize}
                                                               onChange={this.handleChange}
                                                               data-bv-notempty="true"
                                                               data-bv-notempty-message="活动规模必须输入"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="customerName">举办单位<sup>*</sup></label>
                                                    <div className="input-icon icon-right">
                                                        <input type="text" className="form-control" name="organizer"
                                                               value={this.state.info.organizer}
                                                               placeholder="请输入举办单位"
                                                               data-bv-notempty="true"
                                                               data-bv-notempty-message="举办单位必须输入"
                                                               onChange={this.handleChange}/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="customerName">目标群体<sup>*</sup></label>
                                                    <div className="input-icon icon-right">
                                                        <input type="text" className="form-control" name="targetGroups"
                                                               value={this.state.info.targetGroups}
                                                               placeholder="请输入目标群体"
                                                               data-bv-notempty="true"
                                                               data-bv-notempty-message="目标群体必须输入"
                                                               onChange={this.handleChange}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <label>地址</label>
                                                    <div>
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
                                                                notemptyThree: false,
                                                                selectProvs: this.selectProvs,
                                                                selectCitys: this.selectCitys,
                                                                selectCountys: this.selectCountys
                                                            })
                                                        }
                                                        <input className="form-control" name="detailAddress"
                                                               value={this.state.detailAddress} placeholder="详细街道(具体地址)"
                                                               ref="detailAddress" onChange={this.detailAddrChange}
                                                               type="text"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <label htmlFor="remark">活动内容<sup>*</sup></label>
                                                <span className="input-icon icon-right">
                                                    <textarea name="content" value={this.state.info.content}
                                                              className="form-control" rows="4"
                                                              placeholder="请输入活动内容"
                                                              data-bv-notempty="true"
                                                              data-bv-notempty-message="活动内容必须输入"
                                                              data-bv-stringlength="true"
                                                              data-bv-stringlength-min="2"
                                                              data-bv-stringlength-max="500"
                                                              data-bv-stringlength-message="活动内容在2到500个字符之间"
                                                              onChange={this.handleChange}></textarea>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="widget-header noShadow padding-20">
                                        <div className="buttons-preview" style={style_button}>
                                            <input type="button" onClick={this.handleCancel} className="btn btn-cancer"
                                                   value="取消"/>
                                            <button id="btnSave" onClick={this.handleSave} className="btn btn-danger">
                                                保存
                                            </button>
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