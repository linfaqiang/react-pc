import React from 'react';
import {DatePicker} from 'antd';
import {APIS} from '../core/common/config';
import AjaxRequest from '../core/common/ajaxRequest.js';
import CurrentPosition from '../core/components/layout/CurrentPosition';
import Alert from '../core/components/alert.js';

module.exports = React.createClass({

    getInitialState: function () {
        return {
            routeId: this.props.params.id||0,
            info: {
                id: '',
                infoCatagoryId: 1,//栏目固定为市场资讯
                picId: '',
                //picUrlList: [],
                content: '',
                //endDate: '',
                subject: ''
            },
            changed: false,
            titleImg: null
        };
        /*{
            "id":1,
            "picId":1,//标题图
            "picIds":"1,2,3",
            "infoCatagoryId":1,
            "subject":"活动主题",
            "content":"内容",
            "startDate":"开始时间",
            "endDate":"结束时间",
        }*/
    },
    componentDidMount: function () {
        this.generateEditor();
        this.getExistInfo();
    },
    getExistInfo: function () {
        var self = this;
        if (self.state.routeId > 0 ){
            AjaxRequest.get(APIS.manage_list + "/" + self.state.routeId, null, function (body) {
                var res = body.data;
                // var res = JSON.parse(Base64.decode(body.data));
                var info = self.state.info;

                for (var key in info) {
                    info[key] = res[key];
                }
                self.setState({info: info});

                if (info.subject) {
                    self.refs.subject.value = info.subject;
                }
                if (res.picUrl && res.picUrl.length > 0) {
                    var tmp = res.picUrl.split('/');
                    var name = tmp[tmp.length - 1];
                    self.setState({titleImg: {fId: res.picId, fileUrl: res.picUrl, fileName: name}});
                }
                if (info.content) {
                    $('#content1').next().find('.panel-body').html(info.content);
                }
            });
        }
    },
    generateEditor: function () {
        var conBox = $('#content1');
        conBox.summernote({
            height: 300,
            lang: 'zh-CN',
            toolbar: [
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                ['view', ['fullscreen', 'codeview']],
                ['insert', ['link', 'picture']],
                ['help', ['help']]
            ],
            callbacks: {
                onImageUpload: function (files) {
                    var data = new FormData();
                    data.append("file", files[0]);
                    $.ajax({
                        data: data,
                        type: "POST",
                        url: APIS.upload_file,
                        cache: false,
                        contentType: false,
                        processData: false,
                        success: function (res) {
                            conBox.summernote('insertImage', res.fileUrl);
                        }
                    });
                },
                onBlur: function () {
                    conBox.next().find('input[type="text"]').val('');
                }
            }
        });
    },//生成编辑器
    //保存
    handleSave: function (e) {
        e.preventDefault();
        e.stopPropagation();
        var self = this;
        var params = self.state.info;

        params.subject = self.refs.subject.value;
        if (params.subject.length == 0) {
            toastr.error('标题必填');
            return;
        }
        if (params.subject.length > 30) {
            toastr.error('标题不能超过30个汉字');
            return;
        }

        var code = $('#content1').summernote('code');//$('#content1').code();
        var temp = code;
        code = self.delHtmlTag(code);
        code = $.trim(code);
        if (code.length == 0) {
            toastr.error('内容不能为空');
            return;
        }
        if (code.length > 2000) {
            toastr.error('内容不能超过2000个汉字');
            return;
        }
        params.content = temp;
        
        if (self.state.titleImg) {
            params.picId = self.state.titleImg.fId;
        }else{
            params.picId = '';
        }
        
        if(self.state.routeId>0){
            //params.id = self.state.routeId;
            AjaxRequest.put(APIS.manage_list, params, function (res) {
                if (res.code == 200) {
                    $('#modal-success').modal();
                } else {
                    $('#modal-danger').modal().find('.modal-body').html('操作失败: ' + res.msg);
                }
            });
        }else{
            AjaxRequest.post(APIS.manage_list, params, function (res) {
                if (res.code == 200) {
                    $('#modal-success').modal();
                } else {
                    $('#modal-danger').modal().find('.modal-body').html('操作失败: ' + res.msg);
                }
            });
        }
    },
    delHtmlTag: function (str) {
        return str.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, '');//去掉所有的html标记
    },
    handleCancel: function () {
        if (this.state.changed) {
            bootbox.confirm("表单已修改，你确定不保存退出吗?", function (result) {
                if (result) history.go(-1);
            });
        } else {
            history.go(-1);
        }
    },
    handleChange: function () {
        this.setState({changed: true});
    },
    selectHandle: function () {
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
                self.setState({titleImg: {fId: res.fId, fileUrl: res.fileUrl, fileName: f.name}});
                self.setState({changed: true});
            } else {
                toastr.error('操作失败：' + res.msg);
            }
        };
        req.send(fd);
    },
    removeImg: function () {
        this.setState({titleImg: null});
    },
    render: function () {
        var self = this;
        var style100 = {width: "100%"};
        var style_button = {textAlign: 'left', padding: "10px 0 10px 0"};

        function titleImg(img) {
            if (img) {
                return (
                    <span className="viewImgBox">
                        <img src={img.fileUrl}/>
                        <span className="delImg" onClick={self.removeImg}></span>
                        {img.fileName}
                    </span>
                );
            }
            return null;
        }

        return (
            <div>
                <CurrentPosition routes={this.props.routes} params={this.props.params} />
                <div className="page-body">
                    <div className="dashboard-box my">
                        <div className="box-tabbs">
                            <div className="tabbable my" >

                                <ul className="nav nav-tabs myTab noBorLR">
                                    <li className="dropdown active">
                                        <a>{this.props.route.name}</a>
                                    </li>
                                </ul>

                                <form id="activityForm" method="post" data-bv-message="This value is not valid"
                                      data-bv-feedbackicons-valid="glyphicon glyphicon-ok"
                                      data-bv-feedbackicons-invalid="glyphicon glyphicon-remove"
                                      data-bv-feedbackicons-validating="glyphicon glyphicon-refresh">

                                    <div className="widget-body padding-20" style={{boxShadow: 'none'}}>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <label>标题<sup>*</sup></label>
                                                    <div className="input-icon icon-right">
                                                        <input type="text" className="form-control"
                                                               ref="subject"
                                                               onChange={this.handleChange}
                                                               name="subject" placeholder="请输入标题"
                                                               data-bv-notempty="true"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

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
                                                                        图片格式仅支持jpg、jpeg、png、gif、bmp格式。建议图片大小750*300像素，仅上传1张图片。
                                                                    </span>
                                                        </p>
                                                        <p style={{lineHeight: '30px'}} ref="fileList">
                                                            {titleImg(this.state.titleImg)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <label htmlFor="description">正文<sup>*</sup></label>
                                                <div className="input-icon icon-right">
                                                    <div id="content1"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="widget-header noShadow padding-20">
                                        <div className="buttons-preview" style={style_button}>
                                            <input type="button" onClick={this.handleCancel}
                                                   className="btn btn-cancer" value="取消"/>
                                            <button id="btnSave" onClick={this.handleSave}
                                                    className="btn btn-danger">保存
                                            </button>
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