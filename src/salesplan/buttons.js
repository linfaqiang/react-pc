import React  from 'react';
import {
	Form,
	DatePicker
} from 'antd';
import TabSelect2 from '../core/components/PublicSelect/TabSelect2.js';
import store from './store'

export default class Buttons extends React.Component {
	constructor(props) {
		super(props);

		var self = this;
		self.state = store.data;

		self.unsubscribe = store.listen(self.onStatusChange.bind(self));
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	onStatusChange(data) {
		this.setState(data);
	}


	handleFromDateChange(value, strValue) {
		store.data.queryParam.fromDate = strValue;
		this.setState({
			queryParam: store.data.queryParam
		})
	}
	handleToDateChange(value, strValue) {
		store.data.queryParam.toDate = strValue;
		this.setState({
			queryParam: store.data.queryParam
		})
	}

	handlerToggleFilterLayer(e) {
		var self = this;
		//e.preventDefault();
		self.setState({
			showFilterLayer: !self.state.showFilterLayer
		})
	}
	handlerConfirmFilter() {
		var self = this;
		self.setState({
			showFilterLayer: false
		});
		self.props.getData(store.data.queryParam);

	}

	handlerResetFilter() {
		store.data.queryParam.fromDate = "";
		store.data.queryParam.toDate = "";

		this.setState({
			queryParam: store.data.queryParam
		})
	}

	render() {
		const MonthPicker = DatePicker.MonthPicker;
		const createForm = Form.create;
		const FormItem = Form.Item;

		var self = this;

		var style100 = {
			width: "100%"
		};
		var style_form_group = {
			display: "block",
			marginBottom: "15px",
			verticalAlign: "middle"
		};

		return (

			<ul className="nav nav-tabs myTab">
				<li className="dropdown active">
					<a>销售计划</a>
				</li>
				<div className="DTTT btn-group">
					<a className="btn btn-default DTTT_button_copy" href="#/salesplan/add/0">
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
								<label htmlFor="fromDate">计划日期起</label>
								<MonthPicker style={style_form_group}
											 size="large"
											 onChange={this.handleFromDateChange.bind(this)}
											 value={this.state.queryParam.fromDate}
											 format="yyyy-MM"
											 name="fromDate"
											 id="fromDate"
											 ref="fromDate"/>
							</div>
							<div className="form-group" style={style_form_group}>
								<label htmlFor="toDate">计划日期止</label>
								<MonthPicker style={style_form_group}
											 size="large"
											 onChange={this.handleToDateChange.bind(this)}
											 value={this.state.queryParam.toDate}
											 format="yyyy-MM"
											 name="toDate"
											 id="toDate"
											 ref="toDate"/>
							</div>
						</div>
					</div>
				</div>
			</ul>
		);

		/*return (
			<div style={{marginBottom:8 + 'px'}}>

					<div className="DTTT btn-group" style={{right:0+'px'}}>
						<a className="btn btn-default DTTT_button_copy" href="#/salesplan/add/0">
							<i className="fa fa-plus"></i>
							<span>创建 </span>
						</a>
						<a onClick={this.handlerToggleFilterLayer.bind(this)} className="btn btn-default DTTT_button_collection">
							<i className="fa fa-filter"></i>
							<span>筛选 <i className="fa fa-angle-down"></i></span>
						</a>
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
                                    <label htmlFor="fromDate">计划日期起</label>
                                    <MonthPicker style={style_form_group}
                                    	size="large"
                                    	onChange={this.handleFromDateChange.bind(this)}
                                    	value={this.state.queryParam.fromDate}
                                    	format="yyyy-MM"
                                    	name="fromDate"
                                    	id="fromDate"
                                    	ref="fromDate"/>
                                </div>
                               	<div className="form-group" style={style_form_group}>
                                    <label htmlFor="toDate">计划日期止</label>
                                     <MonthPicker style={style_form_group}
                                     	size="large"
                                     	onChange={this.handleToDateChange.bind(this)}
                                     	value={this.state.queryParam.toDate}
                                    	format="yyyy-MM"
                                    	name="toDate"
                                    	id="toDate"
                                    	ref="toDate"/>
                                </div>
																														
							</div>
						</div>
					</div>	

				</div>


		)*/
	}
}