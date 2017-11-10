import React from 'react';
import TabSelect2 from '../core/components/PublicSelect/TabSelect2.js'
import Constants from '../core/common/constants.js';
import store from './store';

export default class Buttons extends React.Component{
	constructor (props) {
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

	handleListTypeChange(index,name){
		var self = this;
		var selectType = {name:name,index:index};
		store.data.listType = selectType;

		store.data.queryParam.q = "";
		store.data.queryParam.status = "";


		self.setState({queryParam:store.data.queryParam,listType:selectType});

		self.props.getData(store.data.queryParam);
	}

	handleCompetitorNameChange(e) {
		var val = e.target.value;
		store.data.queryParam.q = val;
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
		store.data.queryParam.q = "";
		this.setState({queryParam:store.data.queryParam})
	}

	render() {
		var self = this;

		var style100 = {width:"100%"};
		var style_form_group = {display: "block", marginBottom: "15px", verticalAlign: "middle"};

		return (
			<ul className="nav nav-tabs myTab">

				<TabSelect2 liList={Constants.competitorListTypesLang}  curentSelect={this.state.listType} setSelectType={this.handleListTypeChange.bind(this)}/>

				<div className="DTTT btn-group">
					<a className="btn btn-default DTTT_button_copy" href="#/competitor/add/0">
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
								<label htmlFor="filterCompetitor">{Constants.competitorLang.competitorName}</label>
								<input type="text"
									   value={this.state.queryParam.q||""}
									   className="form-control"
									   id="filterCompetitor"
									   placeholder={Constants.competitorLang.competitorName}
									   style={style100}
									   onChange={this.handleCompetitorNameChange.bind(this)} />
							</div>
						</div>
					</div>
				</div>
			</ul>
		);

		/*return (
			<div style={{marginBottom:8 + 'px'}}>
				<TabSelect liList={Constants.competitorListTypesLang}  curentSelect={this.state.listType} setSelectType={this.handleListTypeChange.bind(this)}/>

				<div className="DTTT btn-group" style={{right:0+'px'}}>
					<a className="btn btn-default DTTT_button_copy" href="#/competitor/Add/0">
						<i className="fa fa-plus"></i>
						<span>创建 </span>
					</a>
					<a onClick={this.handlerToggleFilterLayer.bind(this)} className="btn btn-default DTTT_button_collection">
						<i className="fa fa-filter"></i>
						<span>筛选 <i className="fa fa-angle-down"></i></span>
					</a>
				</div>

				<div style={{display:this.state.showFilterLayer ? 'block' : 'none', width:380+'px',height:200+'px', zIndex:100, position:'absolute',right:-12+'px',top:34+'px'}}>
					<div className="well with-header" style={{background:'#fff',height:'100%'}}>
						<div className="header bordered-blue">
							<div className="buttons-preview" style={{textAlign:'right',paddingTop:10+'px'}}>
								<button onClick={this.handlerResetFilter.bind(this)} className="btn btn-cancer">重置</button>
								<button onClick={this.handlerConfirmFilter.bind(this)} className="btn btn-danger">确定</button>
							</div>
						</div>
						<div style={{marginTop:30+'px',paddingLeft:10+'px'}}>
							<div className="form-group" style={style_form_group}>
								<label htmlFor="filterCompetitor">{Constants.competitorLang.competitorName}</label>
								<input type="text"
									   value={this.state.queryParam.q||""}
									   className="form-control"
									   id="filterCompetitor"
									   placeholder={Constants.competitorLang.competitorName}
									   style={style100}
									   onChange={this.handleCompetitorNameChange.bind(this)} />
							</div>
							</div>
						</div>
					</div>
				</div>
		)*/
	}
}