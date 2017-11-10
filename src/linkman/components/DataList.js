import React from 'react';
import Tools from '../../core/common/tools.js';
import {APIS} from '../../core/common/config.js';

module.exports = React.createClass({

	getInitialState:function(){
		return {
			title: this.props.title,
			btntext: this.props.btntext,
			viewAllTarget: (this.props.target ? ('#'+this.props.target) : ''),
			addItemTarget: (this.props.addTarget ? ('#'+this.props.addTarget) : '')
		}
	},

	componentDidMount:function(){
	},
	componentDidUpdate:function(){
		if(this.props.lists && this.props.lists.length > 0){
			Tools.imgLoadError();
		}
		playAudio();
	},
	fomartTime:function(time, fomartStyle){
		var t = new Date(time);

		return t.Format(fomartStyle);
	},

	doAddAction:function(){
		if(this.props.addAction){
			this.props.addAction();
		}
		if(this.props.clearUpList){
			this.props.clearUpList();
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
		var type = this.props.type;
		var divs = null, cls="";
		var self = this;
        var len = (lists instanceof Array) ? lists.length : 0;
        var dpn =  (len===0) ? {display:'none'} : {};

		if(type === 'task'){//任务
			cls="baseList text";
			divs = lists.map(function(item, key){
				if(key < 2){
					return (
						<div key={key} className="databox-top">
							<p className="databox-text no-margin">{item.title}<span>{this.fomartTime(item.startTime, 'yyyy-MM-dd\u3000hh:mm')} - {this.fomartTime(item.endTime, 'hh:mm')}</span></p>
							<div className="audioBox" style={item.fileUrl ? {} : {display:'none'}}>
								<audio  src={item.fileUrl ? item.fileUrl.replace('.amr', '.mp3'):''} onError={loadAudioError}>你的浏览器不支持audio</audio>
								<p className='audioInfo'>
									<span className="currentTime"></span><span className="duration"></span>
								</p>
							</div>
						</div>
					)
				}
			}.bind(this));
		}

		if(type === 'memo'){//备忘
			cls="baseList";
			divs = lists.map(function(item, key){
				if(key < 2){
					return (
						<div key={key} className="databox-top">
							<div className="imgbox">
								<img src={item.headImg?item.headImg:APIS.img_path+"/assets/crm/images/default_user.png"} name="headPhoto"/>
							</div>
							<div className="infoBox">
								<p className="databox-header carbon no-margin">{item.Name}</p>
								<p className="databox-text gray no-margin">{item.content}&nbsp;<span>{item.time}</span></p>
							</div>
						</div>
					)
				}
			}.bind(this));
		}

		if(type === 'appendix'){//附件
			cls="baseList appendixList";
			divs = lists.map(function(item, key){
				var imgSrc = "";//图片路径
				var fileUrl = item.fileUrl;//文件地址
				var originName = item.originName;//文件名
				var fileSize = item.fileSize;//文件大小
				var imgPlace = null;
				
				var extension = item.extension ? item.extension.toLowerCase() : '';//文件格式
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
				if(key > 1){
					return;
				}
				if(extension=='mp3'){
					imgPlace = (
						<div className="audioBox" style={(fileUrl && fileUrl.length>0)? {margin:'0px', position:'absolute'} : {display:'none'}}>
							<audio  src={fileUrl ? fileUrl.replace('.amr', '.mp3'):''} onError={loadAudioError}>你的浏览器不支持audio</audio>
							{/*<p className='audioInfo'>
							 <span className="currentTime"></span><span className="duration"></span>
							 </p>*/}
						</div>
					);
				}else{
					imgPlace = (
						<div className="imgbox">
							{/*<img name="defaultPic" src={item.fileUrl?item.fileUrl:APIS.img_path+"/assets/crm/images/ic-defalut-pic.png"} />*/}
							<img name="defaultPic" src={imgSrc?imgSrc:APIS.img_path+"/assets/crm/images/ic-defalut-pic.png"} data-original={imgSrc?imgSrc:APIS.img_path+"/assets/crm/images/ic-defalut-pic.png"}/>
						</div>
					);
				}
				if(key < 2){
					return (
						<div key={key} className="databox-top" onClick={this.openUrl.bind(self, item.fileUrl, extension)}>
							{imgPlace}
							<div className="infoBox">
								<p className="databox-header carbon no-margin">{item.originName}</p>
								<p className="databox-text gray no-margin">{item.fileSize}&nbsp;&nbsp;&nbsp;&nbsp;{item.extension}<span>{item.updatedOn}</span></p>
							</div>
						</div>
					)
				}
			}.bind(this));
		}
		
		return (
			<div className="dataItem">
				<h5 className="row-title before-darkorange">
					<span>{this.state.title}&nbsp;(&nbsp;<span className="num-count">{lists.length}</span>&nbsp;)</span>
					<a className="btn"  data-toggle="modal" data-target={this.state.addItemTarget} onClick={this.doAddAction}>
						<i className="fa fa-plus"></i>{this.state.btntext}
					</a>
				</h5>
				<div className="dataItem-body">
					<div className={cls} id={type === 'appendix'? 'appendixList':''}>
						{divs}
					</div>
					<p style={dpn}><a href={this.props.dataHref ? this.props.dataHref : 'javascript:void(0);'} className="viewall" data-toggle="modal" data-target={this.state.viewAllTarget}>查看全部&nbsp;&nbsp;&gt;</a></p>
				</div>
			</div>
		)
	}
});