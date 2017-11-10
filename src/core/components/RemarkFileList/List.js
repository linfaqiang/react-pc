import React from 'react';
import {APIS} from '../../common/config.js';
import Tools from '../../common/tools.js';

module.exports = React.createClass({

	getInitialState:function(){
		return {

		}
	},
	
	componentDidMount:function(){
	},
	componentDidUpdate:function(){
		if(this.props.lists && this.props.lists.length > 0){
			Tools.imgLoadError();
		}
	},
	clearUpList:function () {
		this.props.clearUpList();
	},
    openUrl:function(url, extension){
        if(extension.match(/jpg|png|gif|jpeg|bmp|mp3|amr/i)){
            return;
        }else{
            if(url){
                window.open(url);
            }
        }
    },
	render:function(){
		var lists = this.props.lists,
			len = lists.length;

		var divs = lists.map(function(qst,key){
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
			}else if (".amr|".indexOf(extension) !=-1) {
				imgSrc = APIS.img_path+"/assets/img/audio2.png";
			}else{
				imgSrc = fileUrl;
			}
			if(key > 1){
				return;
			}

            if(extension=='.mp3' || extension=='.amr'){
                imgPlace = (
					<div className="audioBox" style={(fileUrl && fileUrl.length>0)? {margin:'10px 0px 0px 0px', position:'absolute'} : {display:'none'}}>
						<audio  src={fileUrl ? fileUrl.replace('.amr', '.mp3'):''} onError={loadAudioError}>你的浏览器不支持audio</audio>
                        {/*<p className='audioInfo'>
						 <span className="currentTime"></span><span className="duration"></span>
						 </p>*/}
					</div>
                );
            }else{
                imgPlace = (
					<div className="imgbox">
						<img name="defaultPic" style={{borderRadius:0}} src={imgSrc?imgSrc:APIS.img_path+"/assets/crm/images/ic-defalut-pic.png"} data-original={imgSrc?imgSrc:APIS.img_path+"/assets/crm/images/ic-defalut-pic.png"} width="55" height="55" />
					</div>
                );
            }
			return <div className="databox-top" key={key} onClick={this.openUrl.bind(this, fileUrl, extension)}>
                		{imgPlace}
						<div className="infoBox">
							<p className="databox-header carbon no-margin">{originName.replace('amr', 'mp3')}</p>
							<p className="databox-text gray no-margin">
								{fileSize}&nbsp;&nbsp;{extension.replace('amr', 'mp3')} <span>{qst.createdOn}</span>
							</p>
						</div>
					</div>
		}.bind(this) );
		
		return (
			<div className="dataItem">
				<h5 className="row-title before-darkorange">
					<span>附件&nbsp;(&nbsp;<span className="num-count">{len}</span>&nbsp;)</span>
					<a className="btn" href="javascript:void(0);" onClick={this.clearUpList} data-toggle="modal" data-target="#addFileModal"><i className="fa fa-plus"></i>附件</a>
				</h5>
				<div className="dataItem-body">
					<div className="baseList" id="dowebokList">
						{divs}
					</div>
					<p><a href="javascript:void(0)" data-toggle="modal" data-target="#fileModal">查看全部&nbsp;&nbsp;&gt;</a></p>
				</div>
			</div>
		)
	}
});