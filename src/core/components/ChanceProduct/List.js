import React from 'react'
import AjaxRequest from '../../common/ajaxRequest.js';
import {APIS} from '../../common/config';
import Tools from '../../common/tools.js';

module.exports = React.createClass({

	getInitialState:function(){
		return {
			listShow:true,
			addShow:false,
			delShow:false,
			allProShow:false,
			productList:[]
		}
	},

	componentDidMount:function(){
	},
	cancelBtn:function () {
		var type = null;
		if(this.state.delShow){
			type = "del";
		}
		this.setState({
			listShow:true,
			addShow:false,
			delShow:false
		})
		this.props.cancelBtn(type);
	},
	getProductList:function(type){
		var self = this,
			q = this.refs.searchVal.value;
		//默认为产品列表url
		var url = APIS.product_list+'?q='+q+"&chanceId="+this.props.chanceId;
		if(type == 'del'){//获取商机下的产品列表url
			url = APIS.chance_product.replace('{id}',this.props.chanceId)+'?q='+q;
		}
		AjaxRequest.get(url, null, function(body) {
			if (body.code == 200 || body.code == '200') {
				var newData = body.data;
				if(type == 'add'){
					for(var i=0,len=newData.length;i<len;i++){
						newData[i].checked = false;
					}
				}
				self.setState({
					productList:newData
				})
			}
		});
	},
	selectedProduct:function (key) {
		this.state.productList[key].checked = !this.state.productList[key].checked;
		this.setState(this.state.productList);
	},
	delProduct:function(key,e){
		e.stopPropagation();
		var self = this;
		bootbox.confirm("确认删除吗?", function (result) {
			if (result) {
				AjaxRequest.delete(APIS.chance_product_save+"/"+key+"?chanceId="+self.props.chanceId, null, function(body) {
					if (body.code == 200 || body.code == '200') {
						alert("删除成功！");
						self.getProductList("del");
					}
				});
			}
		});
	},
	addProduct:function(){
		this.setState({
			listShow:true,
			addShow:false
		});
		var arr = [];
		var thisObj = this.state.productList;
		for(var i=0,len=thisObj.length; i<len; i++){

			if(thisObj[i].checked){
				arr.push(thisObj[i].id)
			}
		}
		this.props.addProduct(arr)
	},
	//点击添加产品按钮时
	btnAdd:function(){
		this.refs.searchVal.value = "";
		this.setState({
			listShow:false,
			addShow:true,
			delShow:false
		});
		this.getProductList('add');
	},
	//点击删除产品按钮时
	btnDel:function(){
		this.refs.searchVal.value = "";
		this.setState({
			listShow:false,
			addShow:true,
			delShow:true
		});
		this.getProductList('del');
	},
	btnSave:function(id){
		var params = {
			id : id,
			productPrice:$("#productPrice"+id).val(),
			productNumber:$("#productNumber"+id).val()
		};
		this.props.btnSave(params);
	},

	selectAllProduct:function(){
		this.setState({
			allProShow: !this.state.allProShow
		});
	},
	showEditForm:function(id,key){
		this.props.showEditForm(id,key);
	},
	hideEditForm:function(id){
		this.props.hideEditForm(id);
	},
	componentDidUpdate:function(){
		if(this.props.lists && this.props.lists.length > 0){
			Tools.imgLoadError();
		}
	},
	render:function(){
		var lists = this.props.lists,
			len = lists.length;
		var st = {
			paddingRight: '140px',
			maxHeight:'22px',
			overflow:'hidden',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap'
		};

		var lis = lists.map(function(qst,key){
			if(key > 1 && !this.state.allProShow){
				return;
			}
			return <li className="li-border-bottom" key={key}>
				<h5 style={{paddingBottom:5+'px'}}>{qst.productName}</h5>
				<p>类别：{qst.productTypeText}</p>
				<p style={st}>描述：{qst.description}</p>{/*initCompetitorList*/}
				{/*<p><a href={`#/chance/${this.props.chanceId}/competitor/${qst.id}`}>竞争对手</a></p>*/}
				<p><a href='javascript:void(0);' onClick={this.props.initCompetitorList} data-toggle="modal" data-target="#addCompetitorModal">竞争对手</a></p>
				<span className="jine">￥{toThousands(qst.amount)}元</span>
				<span className="danjia">单价：{qst.productPrice} x {qst.quantity}</span>
				<div className="right-img" onClick={this.showEditForm.bind(this,qst.id,key)}>
					<img src={`${APIS.img_path}/assets/img/edit.png`} name="defaultPic" width="26" height="26" alt=""/>
				</div>

				<div id={'editDiv'+qst.id} className="modal-preview" style={{display:'none',position:'absolute',right:'0px',top:'45px'}}>
					<div className="modal modal-darkorange">
						<div className="modal-dialog">
							<div className="modal-content">
								<div className="modal-body">
									<div className="row">
										<div className="col-lg-6">
											<div className="form-group">
												<label className="col-lg-3 control-label">单价</label>
												<div className="col-lg-9">
													<input type="text" className="form-control" id={'productPrice'+qst.id} defaultValue={qst.productPrice}  />
												</div>
											</div>
										</div>

										<div className="col-lg-6">
											<div className="form-group">
												<label className="col-lg-3 control-label">数量</label>
												<div className="col-lg-9">
													<div className="spinner spinner-horizontal spinner-two-sided" id={'spinner'+qst.id}>
														<div className="spinner-buttons	btn-group spinner-buttons-left">
															<button type="button" className="btn spinner-down danger">
																<i className="fa fa-minus"></i>
															</button>
														</div>
														<input type="text" className="spinner-input form-control" id={'productNumber'+qst.id} defaultValue={qst.quantity} />
														<div className="spinner-buttons	btn-group spinner-buttons-right">
															<button type="button" className="btn spinner-up danger">
																<i className="fa fa-plus"></i>
															</button>
														</div>
													</div>
												</div>

											</div>
										</div>
									</div>
								</div>
								<div className="modal-footer">
									<button type="button" className="btn btn-default" onClick={this.hideEditForm.bind(this,qst.id)}>取消</button>
									<button type="button" className="btn btn-blue" onClick={this.btnSave.bind(this,qst.id)}>保存</button>
								</div>
							</div>
						</div>
					</div>

				</div>

			</li>
		}.bind(this) );

		var productList = this.state.productList;
		var proLis = productList.map(function(qst,key){
			if(key%2 == 0){
				return <li className="li-border-right" key={key}>
							<h5 style={{paddingBottom:5+'px'}}>{qst.productName}</h5>
							<p>类别：{qst.productTypeText}</p>
							<p style={{width:'70%', maxHeight:'44px', overflow:'hidden'}}>描述：{qst.description}</p>
							<span className="amount">￥{toThousands(qst.productPrice)}元</span>
							<span className="right" onClick={this.selectedProduct.bind(this,key)} style={{display:this.state.delShow ? 'none' : 'block'}}><a className={'btn btn-default '+ (qst.checked?"btn-danger":"")} style={{padding:"3px 5px"}}><i className="fa fa-check"></i>选择</a></span>
							<a onClick={this.delProduct.bind(this,qst.id)} className="btn btn-danger btn-sm" style={{display:this.state.delShow ? 'block' : 'none',position: 'absolute',right: 36+'px',top: 50+'px'}} href="javascript:void(0);"><i className="fa fa-times"></i>删除</a>
						</li>
			}else{
				return <li className="li-right" key={key}>
							<h5 style={{paddingBottom:5+'px'}}>{qst.productName}</h5>
							<p>类别：{qst.productTypeText}</p>
							<p style={{width:'70%', maxHeight:'44px', overflow:'hidden'}}>描述：{qst.description}</p>
							<span className="amount">￥{toThousands(qst.productPrice)}元</span>
							<span className="right" onClick={this.selectedProduct.bind(this,key)} style={{display:this.state.delShow ? 'none' : 'block'}}><a className={'btn btn-default '+ (qst.checked?"btn-danger":"")} style={{padding:"3px 5px"}}><i className="fa fa-check"></i>选择</a></span>
							<a onClick={this.delProduct.bind(this,qst.id)} className="btn btn-danger btn-sm" style={{display:this.state.delShow ? 'block' : 'none',position: 'absolute',right: 36+'px',top: 50+'px'}} href="javascript:void(0);"><i className="fa fa-times"></i>删除</a>
						</li>
			}
		}.bind(this));

		return (
			<div className="ppLi">
				<div style={{display:this.state.listShow ? 'block' : 'none'}}>
					<h3 className="detailOther-h3">产品 ({len})</h3>
					<div className="top-btn">
						<a href="javascript:void(0)" className="btn btn-default btn-add" onClick={this.btnAdd}>添加产品</a>
						<a href="javascript:void(0)" className="btn btn-default btn-add" onClick={this.btnDel}>删除产品</a>
					</div>
					<ul className="product row">
						{lis}
					</ul>

					<div className="detail-bottom-pp">
						<img src={this.state.allProShow?APIS.img_path+"/assets/img/up.png": APIS.img_path+"/assets/img/down.png"} width="25" height="25" alt=""/><a href="javascript:void(0)" onClick={this.selectAllProduct}>{this.state.allProShow?'收起折叠':'展开全部'}</a>
					</div>
				</div>

				<div className="well with-header" style={{display:this.state.addShow ? 'block' : 'none',background:'#fff',maxHeight:'455px',width:'100%',overflow:'auto'}}>
					<div className="header bordered-blue">
						<div style={{float:'left',width:400+'px',paddingTop:10+'px',paddingLeft:10+'px'}}>
							<div className="form-group">
									<span className="input-icon inverted">
									<input type="text" ref="searchVal" className="form-control input-sm" placeholder="搜索产品"/>
									<i className="glyphicon glyphicon-search bg-blue" onClick={this.getProductList.bind(this,this.state.delShow ? 'del' : 'add')}></i>
									</span>
							</div>
						</div>

						<div className="buttons-preview" style={{textAlign:'right',paddingTop:10+'px'}}>
							<button onClick={this.cancelBtn} className="btn btn-cancer">取消</button>
							<button style={{display:this.state.delShow ? 'none' : ''}} onClick={this.addProduct} className="btn btn-danger">确定</button>
						</div>
					</div>
					<div style={{marginTop:30+'px'}}>
						<ul className="addpro row" style={{paddingLeft: 0+'px'}}>
							{proLis}
						</ul>
					</div>
				</div>
			</div>

		)
	}
});