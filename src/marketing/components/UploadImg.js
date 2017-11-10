import React from 'react';
import { Upload, Button, Icon } from 'antd';
import './upload.css';
import CONFIG from '../../core/common/config.js'

const fileTypes = new Set(['.png', '.gif', '.jpg', '.jpeg', '.doc', '.docx', '.xsl', '.xslx', '.ppt', '.pptx', '.pdf']);
const props = {
	name: 'file',
	showUploadList: true,
	listType: 'picture',
	action: CONFIG.APIS.upload_file,
	defaultFileList: [],
	beforeUpload(file) {
		var filename = file.name;
		var index = filename.lastIndexOf(".");
		var fileType = filename.substring(index, filename.length);
		if (!fileTypes.has(fileType)) {
			message.error('文件格式不正确！');
			return false;
		}
		return true;
	}
};

module.exports = React.createClass({

    getInitialState:function(){
         return null;
    },

    componentDidMount:function(){
        return null;
    },

    render:function(){

        return (
              <div>
			    <Upload {...props} className="upload-list-inline">
			      <Button type="ghost">
			        <Icon type="upload" /> 点击上传
			      </Button>
			    </Upload>
			    
			  </div>
        )
    }
});