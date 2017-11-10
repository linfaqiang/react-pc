import React from 'react';
import { Progress } from 'antd';

var Download = React.createClass({
    getInitialState: function () {
        return {
        };
    },
    componentDidMount: function () {
    },
    downloadTemplate: function(){
        window.open(this.props.tempUrl);
    },
    render: function () {
        var step = this.props.step;

        return (
            <div className="importBox" style={{display: (step==1 ? 'block' : 'none')}}>
                <p style={{fontSize: '18px', marginBottom:'10px'}}>第一步：下载模板</p>
                <div className="importIcon" style={{marginBottom:'10px'}}></div>
                <p><span className="uploadeBtn" onClick={this.downloadTemplate}>下载模板</span><span style={{marginLeft:'10px', color:'red'}}>如果已下载模板可直接进行下一步</span></p>
            </div>
        );
    }
});
var ImportDiv = React.createClass({
    getInitialState: function () {
        return {
            step: this.props.step,
            startUpload: false,
            percentage: 0,
            fileName: ''
        };
    },
    componentDidMount: function () {
    },
    resetStep: function(step){
        this.setState({
            step: step||2,
            startUpload: false,
            percentage: 0,
            fileName: ''
        });
        this.refs.fileForm.reset();
    },
    selectHandle: function() {
        this.resetStep();
        this.refs.filed.click();
    },
    handleFiles: function (e) {
        var fileList = e.target.files;
        var tmp = fileList[0].name.split('.')[1];
        if (!tmp.match(/xls|xlsx/i)) {
            toastr.error('只支持xls、xlsx格式文件');
            return null;
        }
        this.importData(fileList[0]);
    },
    importData:function(f){
        var self = this;
        var fd = new FormData();
        fd.append("file", f);
        var req = new XMLHttpRequest();
        var url = this.props.importUrl;

        req.open("POST", url, true);
        req.onload = function (oEvent) {
            self.refs.fileForm.reset();
            var data = JSON.parse(req.response);

            if (req.status == 200) {
                if (data.code == 200) {
                    $('#modal-success').modal();
                    self.props.getData();
                } else {
                    $('#modal-danger').modal().find('.modal-body').html('<p  class="exportTipText">'+'操作失败: '+data.msg+'</p>');
                }
            } else {
                $('#modal-danger').modal().find('.modal-body').html('<p  class="exportTipText">'+'操作失败: '+req.statusText+'</p>');
            }
        };
        req.onprogress = function(e) {
            if (e.lengthComputable) {
                var percentage = Math.round((e.loaded * 100) / e.total);
                self.setState({percentage: percentage});
            }
        };
        req.send(fd);
        self.setState({startUpload: true, fileName: f.name});
    },//导入
    render: function () {
        var step = this.state.step;
        return (
            <div className="importBox" style={{display: (step==2 ? 'block' : 'none')}}>
                <form ref="fileForm" style={{display:'none'}}>
                    <input ref="filed" type="file"
                           onChange={this.handleFiles}
                           style={{display:'none'}}/>
                </form>
                <p style={{fontSize: '18px', marginBottom:'10px'}}>第二步：上传文件</p>
                <div className="importIcon up" style={{marginBottom:'10px'}}></div>
                <div className="remind_opt">
                    <div style={{marginBottom:'10px', position: 'relative', paddingLeft:'10px', textAlign: (this.state.startUpload ? 'left' : 'center')}}>
                        <span className="uploadeBtn" onClick={this.selectHandle}>上传文件</span>
                        <div className="importProgressBox" style={{display: (this.state.startUpload ? 'block' : 'none')}}>
                            <p>{this.state.fileName}</p>
                            <Progress percent={this.state.percentage} strokeWidth={5} />
                        </div>
                    </div>
                    <p className="text-left" style={{color:'red', marginBottom:'10px'}}>选择要上传的文件 【只支持XLS/XLSX文件格式】</p>
                    <p className="text-left" style={{color:'#777'}}>重要提示</p>
                    <p className="text-left" style={{color:'#777'}}>给定文件的第一行将视为字段名，请确定您的文件大小不超过5MB</p>
                    <p className="text-left" style={{color:'#777'}}>除指定格式以外的任何时间日期格式，都会因无法识别而导入失败</p>
                </div>
            </div>
        );
    }
});

module.exports = React.createClass({
    getInitialState: function () {
        return {
            step: 1
        };
    },
    componentDidMount: function () {
    },
    resetStep: function() {
        this.setState({step: 1});
        this.refs.importDiv.resetStep(1);
    },
    nextStep: function() {
        this.setState({step: 2});
        this.refs.importDiv.resetStep(2);
    },
    renderFooter: function(){
        var self = this;
        if(self.state.step == 1){
            return (
                <div className="modal-footer">
                    <button type="button" className="btn btn-default" data-dismiss="modal" onClick={self.resetStep}>取消</button>
                    <button type="button" className="btn btn-danger" onClick={self.nextStep}>下一步</button>
                </div>
            );
        }else if(self.state.step == 2){
            return (
                <div className="modal-footer">
                    <button type="button" className="btn btn-default" onClick={self.resetStep}>上一步</button>
                    <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={self.resetStep}>确认</button>
                </div>
            )
        }
    },
    render: function () {
        return (
            <div className="modal fade" id="importDataModal"  role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true" onClick={this.resetStep}>
                                &times;
                            </button>
                            <h4 className="modal-title" id="myNoteModalLabel">数据导入</h4>
                        </div>
                        <div className="modal-body">
                            <Download step={this.state.step} tempUrl={this.props.tempUrl}></Download>
                            <ImportDiv ref="importDiv" step={this.state.step} getData={this.props.getData} importUrl={this.props.importUrl}></ImportDiv>
                        </div>
                        {this.renderFooter()}
                    </div>
                </div>
            </div>
        )
    }
});