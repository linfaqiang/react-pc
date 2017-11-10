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
    selectHandle: function(){
        this.refs.filed.click();
    },
    handleFiles: function(e){
        var self = this;
        var fileList = e.target.files;
        var name = fileList[0].name;
        var reg = new RegExp(self.props.reg);
        if(!reg.test(name)){
            toastr.error('文件格式不支持');
            return null;
        }
        self.uploadFile(fileList[0]);
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
        return (
            <div>
                <p><span onClick={this.selectHandle} className="uploadeBtn">选择文件</span><span style={{marginLeft:'10px', color:'red'}}>文件格式仅支持doc、docx、xls、xlsx、pdf、pptx、ppt格式</span></p>
                <p style={{lineHeight: '30px'}} ref="fileList"></p>
                <input ref="filed" type="file" onChange={this.handleFiles} style={{display:'none'}} />
            </div>
        )
    }
});