import React from 'react';
import Constants from '../core/common/constants.js';

import store from './store'
import actions from './actions'

export default class Buttons extends React.Component{
	constructor (props) {
		super(props);

		var self = this;
		self.state = store.data;

		self.unsubscribe = store.listen(self.onStatusChange.bind(self));	
	}

	componentWillUnmount () {
		this.unsubscribe();
	}

	onStatusChange (data) {
		this.setState(data);
	}

	//联系人
	handleLinkmanChange(e) {
		var self = this;
		var val = e.target.value;
		store.data.queryParam.q = val;
		self.setState({queryParam:store.data.queryParam});

	}

	//客户
	handleCustomerNameChange(e) {
		var self = this;
		var val = e.target.value;
		store.data.queryParam.customerName = val;
		this.setState({queryParam:store.data.queryParam});
	}

	handlerToggleFilterLayer(e) {
		var self = this;
		//e.preventDefault();
		self.setState({
			showFilterLayer:!self.state.showFilterLayer
		})
	}
	handlerConfirmFilter() { 
		var self = this;
		self.setState({showFilterLayer:false});
		self.props.getData(store.data.queryParam);

	}

	handlerResetFilter() {
        var self = this;
		store.data.queryParam.q = "";
		store.data.queryParam.customerName = "";

		this.setState({queryParam:store.data.queryParam});
		self.props.getData();
	}

  	render() {
		var style100 = {width:"100%"};
		var style_form_group = {display: "block", marginBottom: "15px", verticalAlign: "middle"};

		return (
			<ul className="nav nav-tabs myTab">
				<li className="dropdown active">
					<a>联系人</a>
				</li>
				<div className="DTTT btn-group">
					<a className="btn btn-default DTTT_button_copy" href="#/linkman/addLinkman/0">
						<i className="fa fa-plus"></i>
						<span>创建 </span>
					</a>
					<a onClick={this.handlerToggleFilterLayer.bind(this)} className="btn btn-default DTTT_button_collection">
						<i className="fa fa-filter"></i>
						<span>筛选 <i className="fa fa-angle-down"></i></span>
					</a>
				</div>

				<div style={{display:this.state.showFilterLayer ? 'block' : 'none', width:380+'px',height:400+'px', zIndex:100, position:'absolute',right:1+'px',top:42+'px'}}>
					<div className="well with-header" style={{background:'#fff',height:'100%'}}>
						<div className="header bordered-blue">
							<div className="buttons-preview" style={{textAlign:'right',paddingTop:10+'px'}}>
								<button onClick={this.handlerResetFilter.bind(this)} className="btn btn-cancer">重置</button>
								<button onClick={this.handlerConfirmFilter.bind(this)} className="btn btn-danger">确定</button>
							</div>
						</div>
						<div style={{marginTop:30+'px',paddingLeft:10+'px'}}>
							<div className="form-group" style={style_form_group}>
								<label htmlFor="filterLinkman">{Constants.linkmanLang.linkman}</label>
								<input type="text"
									   value={this.state.queryParam.q||""}
									   className="form-control"
									   id="filterLinkman"
									   placeholder={Constants.linkmanLang.linkman}
									   style={style100}
									   onChange={this.handleLinkmanChange.bind(this)} />
							</div>
							<div className="form-group" style={style_form_group}>
								<label htmlFor="filterCustomerName">{Constants.clueLang.customer}</label>
								<input type="text"
									   value={this.state.queryParam.customerName||""}
									   className="form-control"
									   id="filterCustomerName"
									   placeholder={Constants.customerLang.customer}
									   style={style100}
									   onChange={this.handleCustomerNameChange.bind(this)}  />
							</div>
						</div>
					</div>
				</div>
			</ul>
		);
	    /*return (
				<div style={{marginBottom:8 + 'px'}}>

					<div className="DTTT btn-group" style={{right:0+'px'}}>
						<a className="btn btn-default DTTT_button_copy" href="#/linkman/add/0">
							<i className="fa fa-plus"></i>
							<span>创建 </span>
						</a>
						<a onClick={this.handlerToggleFilterLayer.bind(this)} className="btn btn-default DTTT_button_collection">
							<i className="fa fa-filter"></i>
							<span>筛选 <i className="fa fa-angle-down"></i></span>
						</a>
						{/!*<a className="btn btn-default DTTT_button_collection">
							<i className="glyphicon glyphicon-save"></i>
							<span>导入</span>
						</a>
						<a className="btn btn-default DTTT_button_collection">
							<i className="glyphicon glyphicon-open"></i>
							<span>导出</span>
						</a>*!/}
					</div>
					<div style={{height: 32+"px"}}></div>

					<div style={{display:this.state.showFilterLayer ? 'block' : 'none', width:380+'px',height:300+'px', zIndex:100, position:'absolute',right:-12+'px',top:34+'px'}}>
						<div className="well with-header" style={{background:'#fff',height:'100%'}}>
							<div className="header bordered-blue">
								<div className="buttons-preview" style={{textAlign:'right',paddingTop:10+'px'}}>
									<button onClick={this.handlerResetFilter.bind(this)} className="btn btn-cancer">重置</button>
									<button onClick={this.handlerConfirmFilter.bind(this)} className="btn btn-danger">确定</button>
								</div>
							</div>
							<div style={{marginTop:30+'px',paddingLeft:10+'px'}}>
								<div className="form-group" style={style_form_group}>
                                    <label htmlFor="filterLinkman">{Constants.linkmanLang.linkman}</label>
                                    <input type="text"
                                    	value={this.state.queryParam.q||""}	 
                                    	className="form-control" 
                                    	id="filterLinkman" 
                                    	placeholder={Constants.linkmanLang.linkman} 
                                    	style={style100} 
                                    	onChange={this.handleLinkmanChange.bind(this)} />
                                </div>
                               	<div className="form-group" style={style_form_group}>
                                    <label htmlFor="filterCustomerName">{Constants.clueLang.customer}</label>
                                    <input type="text" 
                                    	value={this.state.queryParam.customerName||""}
                                    	className="form-control" 
                                    	id="filterCustomerName" 
                                    	placeholder={Constants.customerLang.customer} 
                                    	style={style100} 
                                    	onChange={this.handleCustomerNameChange.bind(this)}  />
                                </div>
																														
							</div>
						</div>
					</div>	

				</div>


	    )*/
  }
}
