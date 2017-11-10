import React from 'react';
import {APIS} from '../../common/config.js';
import Tools from '../../common/tools.js';

module.exports = React.createClass({

	getInitialState:function(){
		return {

		}
	},
	componentDidUpdate:function(){
		playAudio();
	},

	componentDidMount:function(){
	},
	componentDidUpdate:function(){
		if(this.props.lists && this.props.lists.length > 0){
			Tools.imgLoadError();
		}
	},
	openUrl:function(url, extension){
		if(extension.match(/jpg|png|gif|jpeg|bmp|mp3/i)){
			return;
		}else{
			if(url){
				window.open(url);
			}
		}
	},
	render:function(){
		var lists = this.props.lists;

		var lis = lists.map(function(qst,key){
			var imgSrc = "";//图片路径
			var fileUrl = qst.fileUrl;//文件地址
			var originName = qst.originName;//文件名
			var fileSize = qst.fileSize;//文件大小
			var imgPlace = null;
			var extension = qst.extension ? qst.extension.toLocaleLowerCase() : "";//文件格式
			if (".doc|.docx|".indexOf(extension) !=-1) {
				imgSrc = APIS.img_path+"/assets/img/ic-word.png";
			}else if (".xls|.xlsx|".indexOf(extension) !=-1) {
				imgSrc = APIS.img_path+"/assets/img/ic-excel.png";
			}else if (".ppt|.pptx|".indexOf(extension) !=-1) {
				imgSrc = APIS.img_path+"/assets/img/ic-ppt.png";
			}else if (".pdf|".indexOf(extension) !=-1) {
				imgSrc = APIS.img_path+"/assets/img/ic-pdf.png";
			}else if (".amr|.mp3".indexOf(extension) !=-1) {
				imgSrc = APIS.img_path+"/assets/img/audio2.png";
			}else{
				imgSrc = fileUrl;
			}

			if(extension=='mp3'){
				imgPlace = (
					<div className="audioBox" style={(fileUrl && fileUrl.length>0)? {margin:'0px',marginLeft:'-63px', position:'absolute'} : {display:'none'}}>
						<audio  src={fileUrl ? fileUrl.replace('.amr', '.mp3'):''} onError={loadAudioError}>你的浏览器不支持audio</audio>
						{/*<p className='audioInfo'>
							<span className="currentTime"></span><span className="duration"></span>
						</p>*/}
					</div>
				);
			}else{
				imgPlace = (
					<div className="tx-img">
						<img name="defaultPic" src={imgSrc?imgSrc:APIS.img_path+"/assets/crm/images/ic-defalut-pic.png"} data-original={imgSrc?imgSrc:APIS.img_path+"/assets/crm/images/ic-defalut-pic.png"} width="55" height="55" alt=""/>
					</div>
				);
			}

			return <li key={key} onClick={this.openUrl.bind(this, fileUrl, extension)}>
				{imgPlace}
				<h5>{originName}</h5>
				<p>{fileSize}&nbsp;&nbsp;{extension}</p>
				<span className="time">{qst.createdOn}</span>
			</li>
		}.bind(this));

		return (
			<div className="modal fade" id="fileModal" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-hidden="true">
								&times;
							</button>
							<h4 className="modal-title" id="myNoteModalLabel">附件</h4>
						</div>
						<div className="modal-body layer-public">
							<div className="detail-tab3">
								<div className="ppLi">
									<ul className="fujian beizhu row" id="dowebokAll">
										{lis}
									</ul>
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-danger" data-dismiss="modal">
								确定
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
});