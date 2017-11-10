import React from 'react';
import {APIS} from '../core/common/config';
import AjaxRequest from '../core/common/ajaxRequest.js';
import CurrentPosition from '../core/components/layout/CurrentPosition';
import Select2 from '../core/components/Select2/Select2.js';
import '../core/components/Select2/select2.css';
import Alert from '../core/components/alert.js';

module.exports = React.createClass({
    getInitialState: function () {
        return {
            routeId: this.props.params.id == 'a' ? null : this.props.params.id,
            changed: false,
            info: {
                id: '',
                picIds: '',
                productTypeId: '',
                productName: '',
                productPrice: '',
                organizationId: '',
                description: ''
            },
            imgList: [],
            typeList: [],
            orgList: []
        };
    },
    componentDidMount: function () {
        this.existProduct();
        $("#addProductForm").bootstrapValidator();
    },
    existProduct: function () {
        var self = this;
        if (self.state.routeId) {
            AjaxRequest.get(APIS.product_list + '/' + self.state.routeId, null, function (data) {
                if (data.code == 200) {
                    var info = data.data;
                    var detail = self.state.info;

                    for (var key in detail) {
                        detail[key] = info[key];
                    }

                    self.setState({info: detail});

                    var picIds = info.picIds.split(',');
                    var picUrls = info.picUrls;
                    var tmp = [];

                    for (var i = 0; i < picUrls.length; i++) {
                        var name = picUrls[i].split('/');
                        tmp.push({fId: picIds[i], fileUrl: picUrls[i], fileName: name[name.length - 1]});
                    }
                    self.setState({imgList: tmp});
                    self.getClassList(info.productTypeId);
                    self.getOrgList(info.organizationId);
                }
            });
        } else {
            self.getClassList();
            self.getOrgList();
        }
    },
    getClassList: function (productTypeId) {
        var self = this;
        AjaxRequest.get(APIS.product_types, null, function (data) {
            if (data.code == '200') {
                var list = data.data;
                var t = [];

                for (var i = 0; i < list.length; i++) {
                    t.push({id: list[i].id, text: list[i].name});
                }
                self.setState({typeList: t});

                if (self.state.routeId && productTypeId) {
                    self.refs.productTypeId.setValue(productTypeId);
                }
            }
        });
    },
    getOrgList: function (organizationId) {
        var self = this;
        AjaxRequest.get(APIS.get_org_com, null, function (data) {
            if (data.code == '200') {
                var list = data.data;
                var t = [];

                for (var i = 0; i < list.length; i++) {
                    t.push({id: list[i].id, text: list[i].name});
                }
                self.setState({orgList: t});

                if (self.state.routeId && organizationId) {
                    self.refs.organizationId.setValue(organizationId);
                }
            }
        });
    },
    selectOrgFun: function (e) {
        var info = this.state.info;
        info.organizationId = this.refs.organizationId.el.val();
        this.setState({info: info});
        this.setState({changed: true});
        var bootstrapValidator = $("#addProductForm").data('bootstrapValidator');
        bootstrapValidator.validateField('organizationId');
        bootstrapValidator.updateStatus('organizationId', 'VALID');
    },
    selectTypeFun: function (e) {
        var info = this.state.info;
        info.productTypeId = this.refs.productTypeId.el.val();
        this.setState({info: info});
        this.setState({changed: true});
        var bootstrapValidator = $("#addProductForm").data('bootstrapValidator');
        bootstrapValidator.validateField('productTypeId');
        bootstrapValidator.updateStatus('productTypeId', 'VALID');
    },
    handleChange: function (e) {
        var info = this.state.info;
        info[e.target.getAttribute('name')] = e.target.value;
        this.setState({info: info});
        this.setState({changed: true});
    },
    handleSave: function (e) {
        e.preventDefault();
        e.stopPropagation();
        var self = this;

        var bootstrapValidator = $("#addProductForm").data('bootstrapValidator');
        bootstrapValidator.validate();
        if (!bootstrapValidator.isValid()) {
            return false;
        }

        var info = self.state.info;
        var imgList = self.state.imgList;
        var t = [];

        for (var i = 0; i < imgList.length; i++) {
            t.push(imgList[i].fId);
        }
        info.picIds = t.join();

        if (self.state.routeId) {
            AjaxRequest.put(APIS.product_list + '/' + info.id, info, function (data) {
                if (data.code == "200") {
                    $('#modal-success').modal();
                } else {
                    $('#modal-danger').modal().find('.modal-body').html('操作失败: ' + data.msg);
                }
            });
        } else {
            AjaxRequest.post(APIS.product_list, info, function (data) {
                if (data.code == "200") {
                    $('#modal-success').modal();
                } else {
                    $('#modal-danger').modal().find('.modal-body').html('操作失败: ' + data.msg);
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
    selectHandle: function () {
        var imgList = this.state.imgList;
        if (imgList.length === 3) {
            toastr.info('图片仅限三张');
            return false;
        }
        this.refs.fileForm.reset();
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
    render: function () {
        var self = this;
        var style100 = {width: "100%"};
        var bigWide = {marginLeft: '-24px', marginRight: '-24px'};
        var imgList = this.state.imgList;
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

                                <form id="addProductForm"
                                      data-bv-live={navigator.userAgent.match('Trident') ? 'disabled' : 'enabled'}
                                      data-bv-message="This value is not valid"
                                      data-bv-feedbackicons-valid="glyphicon glyphicon-ok"
                                      data-bv-feedbackicons-invalid="glyphicon glyphicon-remove"
                                      data-bv-feedbackicons-validating="glyphicon glyphicon-refresh">
                                    <div className="widget-body padding-20" style={{boxShadow: 'none'}}>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <label htmlFor="description">资讯图片</label>
                                                    <div className="input-icon icon-right">
                                                        <p>
                                                                <span onClick={this.selectHandle}
                                                                      className="uploadeBtn">
                                                                    选择图片
                                                                </span>
                                                                <span style={{marginLeft:'10px', color:'red'}}>
                                                                    图片格式仅支持jpg、jpeg、png、gif、bmp格式。建议图片大小750*450像素，仅限上传3张图片。
                                                                </span>
                                                        </p>
                                                        <p style={{lineHeight: '30px'}} ref="fileList">
                                                            {imgs}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>名称 <sup>*</sup></label>
                                                    <div className="input-icon icon-right">
                                                        <input type="text"
                                                               onChange={null}
                                                               name="productName"
                                                               value={this.state.info.productName}
                                                               onChange={this.handleChange}
                                                               className="form-control"
                                                               data-bv-notempty="true"
                                                               data-bv-notempty-message="产品名称必须输入"
                                                               ref="productName"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>价格 <sup>*</sup></label>
                                                    <div className="input-icon icon-right">
                                                        <input className="form-control"
                                                               name="productPrice"
                                                               value={this.state.info.productPrice}
                                                               onChange={this.handleChange}
                                                               data-bv-notempty="true"
                                                               data-bv-notempty-message="产品价格必须输入"
                                                               ref="productPrice" type="number"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>分类<sup>*</sup></label>
                                                    <div className="input-icon icon-right">
                                                        <Select2
                                                            style={style100}
                                                            ref="productTypeId"
                                                            multiple={false}
                                                            onSelect={this.selectTypeFun}
                                                            value={this.state.info.productTypeId}
                                                            data={this.state.typeList}
                                                            name="productTypeId"
                                                            data-bv-notempty="true"
                                                            data-bv-notempty-message="产品分类必选"
                                                            options={{placeholder: '请选择分类'}}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label>公司 <sup>*</sup></label>
                                                    <div className="input-icon icon-right">
                                                        <Select2
                                                            style={style100}
                                                            ref="organizationId"
                                                            multiple={false}
                                                            onSelect={this.selectOrgFun}
                                                            value={this.state.info.organizationId}
                                                            data={this.state.orgList}
                                                            name="organizationId"
                                                            data-bv-notempty="true"
                                                            data-bv-notempty-message="产品分类必选"
                                                            options={{placeholder: '请选择公司'}}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <label htmlFor="needs">描述<sup>*</sup></label>
                                                    <div className="input-icon icon-right">
                                                        <textarea type="text" className="form-control"
                                                                  onChange={this.handleChange} rows="4"
                                                                  value={this.state.info.description}
                                                                  name="description" id="description" placeholder="产品描述"
                                                                  data-bv-notempty="true"
                                                                  data-bv-notempty-message="产品描述必须输入"
                                                                  data-bv-stringlength="true"
                                                                  data-bv-stringlength-min="6"
                                                                  data-bv-stringlength-max="500"
                                                                  data-bv-stringlength-message="产品描述在6到500个字符之间"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/*<hr/>
                                     <div className="form-group">
                                     <div>
                                     <div className="buttons-preview"
                                     style={{textAlign:'left',paddingTop:10+'px'}}>
                                     <button onClick={this.handleCancel}
                                     className="btn btn-cancer">取消
                                     </button>
                                     <button onClick={this.handleSave}
                                     className="btn btn-danger">保存
                                     </button>
                                     </div>
                                     </div>
                                     </div>*/}
                                    <hr />
                                    <div className="widget-header noShadow padding-20">
                                        <div className="buttons-preview" style={{textAlign:'left',paddingTop:10+'px'}}>
                                            <button onClick={this.handleCancel} className="btn btn-cancer">取消</button>
                                            <button onClick={this.handleSave} className="btn btn-danger">保存</button>
                                        </div>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>

                <form ref="fileForm" style={{display:'none'}}>
                    <input ref="filed" type="file"
                           onChange={this.handleFiles}
                           style={{display:'none'}}/>
                </form>

                <Alert result="succees"></Alert>
                <Alert result="danger"></Alert>
            </div>
        )
    }
});