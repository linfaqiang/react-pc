import React from 'react';
import Tools from '../core/common/tools.js';
import AjaxRequest from '../core/common/ajaxRequest.js';
import {APIS} from '../core/common/config';
import UserInfo from '../core/common/UserInfo.js';
import { Modal, Button } from 'antd';
const confirm = Modal.confirm;

module.exports = React.createClass({

	getInitialState:function(){
		var isManger = UserInfo.isManager();
		return {
			isManger: isManger,
			hideNoData: true
		}
	},
	follows:function () {
		this.props.follows()
	},
	componentDidMount:function(){
	},
	componentDidUpdate:function(){
		if(this.props.detailData.picUrls && this.props.detailData.picUrls.length > 0){
			Tools.imgLoadError();
		}
	},
	deleteData: function(e){
		e.preventDefault();
		e.stopPropagation();
		var self = this;
		var	thisUrl = APIS.product_list + '/' + self.props.currentProductId;
		confirm({
			title: '是否删除',
			content: '数据删将被删除',
			onOk() {
				AjaxRequest.delete(thisUrl, null, function(data){
					if (data.code == 200) {
						self.props.getData();
					} else {
						toastr.error('删除数据失败：'+data.msg);
					}
				});
			},
			onCancel() {
				return false;
			}
		});
	},
	setNoData: function(bl){
		this.setState({hideNoData: bl});
	},
	render:function(){
		var self = this;
		var isManger = self.state.isManger;
		var currentProductId = self.props.currentProductId;
		var lists = this.props.detailData.picUrls || [];
		var st = {
			border: 'solid 1px #ccc',
			borderRight: '0px',
			minHeight: '580px',
			position: 'relative'
		};
		var imgs = lists.map(function(qst,key){
			return <div key={key} className={'item '+ (key==0 ? 'active' : '')}>
						<img src={qst?qst:APIS.img_path+"/assets/crm/images/ic-defalut-pic.png"} name="defaultPic" />
				   </div>
		}.bind(this));
		var lis = lists.map(function(qst,key){
			return <li key={key} className={(key == 0)?'active':''}
					   data-target="#myCarousel" data-slide-to={key}>

					</li>
		}.bind(this));
		function renderEditBtn(){
			if(!isManger) return null;
			return (
				<a className="crm_edit pcicon pcicon-edit" href={"#/product/edit/"+currentProductId}></a>
			);
		}
		function renderDelBtn(){
			if(!isManger) return null;
			return (
				<span className="crm_edit fa fa-trash-o" onClick={self.deleteData}></span>
			);
		}

		return (
			<div className="dashboard-box" style={{marginTop:'20px'}}>
				<div className="tabbable" style={st}>
					<div className="right-detail" style={{display: (this.state.hideNoData ? 'block' : 'none')}}>
						<div className="product-top">
							<h3>
								{this.props.detailData.productName}
								{renderEditBtn()}
								{renderDelBtn()}
							</h3>
							<p><span className="fColorRed">￥{toThousands(this.props.detailData.productPrice)}</span>元<span className={(this.props.detailData.isFollow == 0)? "fa fa-star collect" : "fa fa-star collect active"} onClick={this.follows} style={{float:'right', marginRight:'10px'}}></span></p>
						</div>
						<div id="myCarousel" className="carousel slide">
							<ol className="carousel-indicators">
								{lis}
							</ol>
							<div className="carousel-inner" style={{height:220+'px'}}>
								{imgs}
							</div>
							<a className="carousel-control left" href="#myCarousel"
							   data-slide="prev">&lsaquo;</a>
							<a className="carousel-control right" href="#myCarousel"
							   data-slide="next">&rsaquo;</a>
						</div>
						<ul className="right-detail-ul">
							<li>
								<p className="p-title">类别</p>
								<p>{this.props.detailData.productTypeText}</p>
							</li>
							<li>
								<p className="p-title">公司</p>
								<p>{this.props.detailData.organizationText}</p>
							</li>
							<li style={{borderBottom: '0px'}}>
								<p className="p-title">描述</p>
								<p>{this.props.detailData.description}</p>
							</li>
						</ul>
					</div>
					<div className={this.state.hideNoData ? "no-massage hide" : "no-massage"} style={{top: '31%', marginTop:'-2px', left:'50%', marginLeft:'-15px', position:'absolute'}}><div className='crmNoData'>暂无数据</div></div>
				</div>
			</div>
		)
	}
});