import React from 'react';
import {
    hashHistory
} from 'react-router';
import { Upload, Button,message,Icon } from 'antd';
import {APIS} from '../../common/config';

const Dragger = Upload.Dragger;
const fileTypes = new Set(
    ['.png','.bmp', '.gif', '.jpg', '.jpeg', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf']
);

module.exports = React.createClass({
    getInitialState() {
        return {
            fileList: []
        };
    },

    componentWillMount:function(){
        this.setState({
            fileList:this.props.lists
        });
    },

    componentDidMount:function(){

    },
    getFileIdList:function(){
        var list = this.state.fileList;
        var fileId = [];
        if(list && list.length > 0){
            for(var i=0;i<list.length;i++){
                var files = list[i];
                if(files.response){
                    fileId.push(files.response.fId);
                }else{
                    fileId.push(files.uid);
                }}
        }
        return fileId;
    },

    handleChange(info) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            var list = info.fileList;
            this.setState({
                fileList: list
            });
            message.success(`${info.file.name} 上传成功。`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败。`);
        }
    },

    handleRemove: function(file) {
        var uid = file.uid;
        var list = this.state.fileList;
        for(var i=0;i<list.length;i++){
            var fid = list[i].uid;
            if(uid == fid){
                list.splice(i,1);  //删除第一项
                break;
            }
        }
        this.setState({
            fileList: list
        });
    },

    render:function() {
        var props = {
            name: 'file',
            showUploadList: true,
            listType: 'text',
            action: APIS.upload_file,
            supportServerRender:true,
            defaultFileList: this.state.fileList,
            beforeUpload(file) {
                var filename = file.name;
                var index = filename.lastIndexOf(".");
                var fileType = filename.substring(index, filename.length).toLocaleLowerCase();
                if (!fileTypes.has(fileType)) {
                    message.error('文件格式不支持！');
                    return false;
                }
                return true;
            },
        };
        return (
            <div>
                <Dragger {...props} onChange={this.handleChange} onRemove={this.handleRemove}>
                    <p className="ant-upload-drag-icon">
                        <Icon type="inbox" />
                    </p>
                    <p className="ant-upload-text">点击或将文件拖拽到此区域上传</p>
                    <p className="ant-upload-hint">目前仅支持单个上传，严禁上传公司内部资料及其他违禁文件</p>
                </Dragger>
            </div>
        );
    }
});
