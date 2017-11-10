import React from 'react';
import {DatePicker} from 'antd';
import {APIS} from '../core/common/config';
import AjaxRequest from '../core/common/ajaxRequest.js';
import CurrentPosition from '../core/components/layout/CurrentPosition';
import Alert from '../core/components/alert.js';

module.exports = React.createClass({

    getInitialState: function () {
        return {
            changed: false,
            fileName: '',
            fileInfo: null
        };
    },

    componentDidMount: function () {
    },
    //保存
    handleSave: function (e) {
        e.preventDefault();
        e.stopPropagation();
        var self = this;
        var params = {
            "fileId": self.state.fileInfo.fId,//文件id
            "fileName": self.state.fileName,//文件名称
            "analysisCatagoryId":1//市场分析栏目id
        };

        if(!params.fileId){
            toastr.error('请选择文件');
            return;
        }
        if(!params.fileName){
            toastr.error('文件名称必填');
            return;
        }

        AjaxRequest.post(APIS.marketingAnalysis, params, function(res){
            if (res.code == 200) {
                $('#modal-success').modal();
            } else {
                $('#modal-danger').modal().find('.modal-body').html('操作失败: '+res.msg);
            }
        });
    },
    handleCancel: function () {
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
    handleChange: function(e){
        this.setState({fileName: e.target.value});
        this.setState({changed: true});
    },
    selectHandle: function(){
        this.refs.fileForm.reset();
        this.refs.filed.click();
    },
    handleFiles: function(e){
        var fileList = e.target.files;
        var tmp = fileList[0].name.split('.')[1];
        if(!tmp.match(/doc|docx|xls|xlsx|pdf|pptx|ppt/i)){
            toastr.error('文件格式不支持');
            return null;
        }
        this.uploadFile(fileList[0]);
    },
    uploadFile: function(f){
        var self = this;
        var fd = new FormData();
        fd.append("file", f);
        var req = new XMLHttpRequest();
        req.open("POST",  APIS.upload_file, true);
        req.onload = function(oEvent) {
            if (req.status == 200) {
                //{"fId":3166,"code":"200","msg":"OK","fileUrl":"http://192.168.8.20:8081/uf/2016/11/16/1479265677470.ttf"}

                var res = JSON.parse(req.response);
                console.log(res);
                self.setState({
                    fileInfo:{fId: res.fId, fileUrl: res.fileUrl},
                    fileName: f.name,
                    changed: true
                });
                self.refs.fileList.innerHTML = f.name; //'<a href="'+ res.fileUrl +'">' + f.name + '</a>';
            } else {
                toastr.error('操作失败');
            }
        };
        req.send(fd);
    },
    render: function () {
        var style100 = {
            width: "100%"
        };
        var style_button = {
            textAlign: 'left',
            padding: "10px 0 10px 0"
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
                                        <a>{this.props.route.name}</a>
                                    </li>
                                </ul>
                                <form id="activityForm">
                                    <div className="widget-body padding-20" style={{boxShadow: 'none'}}>

                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <label>文件名称<sup>*</sup></label>
                                                    <div className="input-icon icon-right">
                                                        <input type="text" className="form-control"
                                                               ref="fileName"
                                                               onChange={this.handleChange}
                                                               value={this.state.fileName}
                                                               name="activityName" placeholder="请输入文件名称" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <label htmlFor="description">上传文件<sup>*</sup></label>
                                                <div className="input-icon icon-right">
                                                    <div>
                                                        <p><span onClick={this.selectHandle} className="uploadeBtn">选择文件</span><span style={{marginLeft:'10px', color:'red'}}>文件格式仅支持doc、docx、xls、xlsx、pdf、pptx、ppt格式</span></p>
                                                        <p style={{lineHeight: '30px'}} ref="fileList"></p>

                                                    </div>
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