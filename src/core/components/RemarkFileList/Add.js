import React from 'react'
import {APIS} from '../../common/config';
var frameCount = 0;
import Tools from '../../common/tools.js';

module.exports = React.createClass({

	getInitialState:function(){
		return {
			fileType:['PNG','png','GIF','gif','JPG','jpg','JPEG','jpeg'],//支持的文件格式
			ulFileList:[]
		}
	},
	clearList:function () {
		this.setState({
			ulFileList:[]
		})
	},
	addFile:function () {

		var self = this;

		if(!this.state.ulFileList.length){
			alert('请选择附件');
			return;
		}
		
		this.props.addFile(this.state.ulFileList);

		
	},
	checkFileType:function(type){
		var isCheck = false;
		var fileType = this.state.fileType;
		for(var i=0;i<fileType.length;i++){
			if(type == fileType[i]){
				isCheck = true;
				break;
			}
		}
		return isCheck;
	},
	getFullPath:function(){
		var path = this.refs.fileName.value;
		var index = path.lastIndexOf("\\") + 1;
		var fileType = path.substring(path.lastIndexOf(".") + 1, path.length);
		if (!this.checkFileType(fileType)) {
			bootbox.alert("文件格式不支持，请重新选择上传！");
			this.refs.fileName.value = null;
		} else {
			if (index > 0) {
				$('#localPath').html(path.substr(index));
			} else {
				$('#localPath').html(path);
			}
		}
	},
	
	componentDidMount:function(){
	},
	componentDidUpdate:function(){
		if(this.state.ulFileList && this.state.ulFileList.length > 0){
			Tools.imgLoadError();
		}
	},
	uploadFile:function () {
		var self = this;
		this.uploadFileEven({
			url: APIS.upload_file,
			onSend: function () {
				//alert('发送中')
			},
			success: function (retData) {
				//loading.hide();
				if ("string" == typeof retData) {
					retData = JSON.parse(retData);
				}
				//window["photoFinish"](retData);
				alert('上传成功');
				self.state.ulFileList.push({
					"fId": retData.fId,
					"type": "image",
					"path": retData.fileUrl
				});
				self.setState(self.state.ulFileList)
			},
			error: function () {
				//loading.hide();
				mui.alert('上传失败！', '提示', function() {});
			}
		});
	},
	uploadFileEven:function(potions) {
		if($("#uploadPc").length){
			$("#uploadPc").remove();
		}

		var $form = $('<form id="uploadPc" style="display: none;" action="' + potions.url + '" method="post" ' +
			'enctype="multipart/form-data"><input id="uploadFiles" name="file" type="file" /></form>');
		$form.appendTo("body");
		var input = $form.children("input");
		input.unbind("change").bind("change", function () {
			fileUpload();
		});
		input.click();
		return;

		function fileUpload(){
			var fileValue = input.val(),
				imgExt = fileValue.substring(fileValue.lastIndexOf("."), fileValue.length),
				imgSize = document.getElementById('uploadFiles').files[0].size / 1024;
			if (!fileValue) {
				return;
			}
			if (".jpg|.jpeg|.gif|.bmp|.png|.doc|.docx|.xls|.xlsx|.ppt|.pptx|.pdf|".indexOf(imgExt.toLocaleLowerCase() + "|") == -1) {
				bootbox.alert("文件格式不支持，请重新上传！");
				return;
			}
			if (!(imgSize > 0 && imgSize <= 2048)) {
				bootbox.alert("上传的附件大小不超过2M，请重新上传！");
				return;
			}
			var form = $form[0];
			var id = 'jqFormIO' + frameCount++;
			var $io = $('<iframe id="' + id + '" name="' + id + '" />');
			var io = $io[0];
			$io.css({position: 'absolute', top: '-1000px', left: '-1000px'});
			setTimeout(function () {
				$io.appendTo('body');
				io.attachEvent ? io.attachEvent('onload', cb) : io.addEventListener('load', cb, false);
				var encAttr = form.encoding ? 'encoding' : 'enctype';
				var t = $form.attr('target');
				$form.attr({
					target: id,
					method: 'POST',
					encAttr: 'multipart/form-data',
					action: potions.url
				});
				potions.onSend();
				form.submit();
				$form.attr('target', t); // reset target
			}, 10);

			function cb() {
				io.detachEvent ? io.detachEvent('onload', cb) : io.removeEventListener('load', cb, false);
				var ok = true;
				try {
					var data, doc;
					doc = io.contentWindow ? io.contentWindow.document : io.contentDocument ? io.contentDocument : io.document;
					data = doc.body ? doc.body.innerText : null;
					if (potions.dataType == "json") {
						data = JSON.parse(data) || {};
					}
				} catch (e) {
					ok = false;
				}

				if (ok) {
					if (data) {
						console.log("===上次结果===" + data);
						potions.success(data);
					} else {
						potions.error();
					}
				} else {
					potions.error();
				}
				setTimeout(function () {
					$io.remove();
					$form.remove();
				}, 100);
			}
		}
	},

	render:function(){
		var lists = this.state.ulFileList;
		var lis = lists.map(function(qst,key){
			var fileUrl = qst.path;
			var fileExt = fileUrl.substring(fileUrl.lastIndexOf("."), fileUrl.length);
			var fileExtlc = fileExt.toLocaleLowerCase() + "|";
			if (".doc|.docx|".indexOf(fileExtlc) !=-1) {
				fileUrl = APIS.img_path+"/assets/img/ic-word.png";
			}else if (".xls|.xlsx|".indexOf(fileExtlc) !=-1) {
				fileUrl = APIS.img_path+"/assets/img/ic-excel.png";
			}else if (".ppt|.pptx|".indexOf(fileExtlc) !=-1) {
				fileUrl = APIS.img_path+"/assets/img/ic-ppt.png";
			}else if (".pdf|".indexOf(fileExtlc) !=-1) {
				fileUrl = APIS.img_path+"/assets/img/ic-pdf.png";
			}

			return <li key={key} className="">
				     <img src={fileUrl} width="55px" height="55px" name="defaultPic" />
			       </li>
		}.bind(this));
		
		return (
			<div className="modal fade" id="addFileModal"  role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-hidden="true">
								&times;
							</button>
							<h4 className="modal-title" id="myNoteModalLabel">添加附件</h4>
						</div>
						<div className="modal-body layer-public">
							<div id="horizontal-form">
								<button onClick={this.uploadFile}>选择文件</button>
							</div>
							<ul className="file-list row">
								{lis}
							</ul>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-default" data-dismiss="modal">取消
							</button>
							<button type="button" onClick={this.addFile} className="btn btn-danger" data-dismiss="modal">
								确定
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
});