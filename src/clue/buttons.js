import React from 'react';
import TabSelect2 from '../core/components/PublicSelect/TabSelect2.js';
import Constants from '../core/common/constants.js';
import dicts from '../core/common/dicts.js';
import CONFIG from '../core/common/config.js';
import AjaxRequest from '../core/common/ajaxRequest.js';
import Select2 from '../core/components/Select2/Select2.js';
import '../core/components/Select2/select2.css';
import store from './store';
import actions from './actions'

export default class Buttons extends React.Component {
	constructor(props) {
		super(props);

		var self = this;
		self.state = store.data;
		dicts.get(function() {
			store.data.clueSourceList = Dicts.CLUE_SOURCE_LIST;
			self.state = store.data;

		});

		AjaxRequest.get(CONFIG.APIS.staffs_subs, null, function(body) {
			self.state.staffList = body.data;
			store.data.staffList = body.data;
		});

		self.unsubscribe = store.listen(self.onStatusChange.bind(self));
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	onStatusChange(data) {
		this.setState(data);
	}

	handleListTypeChange(index, name) {
		var self = this;
		var selectType = {
			name: name,
			index: index
		}
		store.data.listType = selectType;

		store.data.queryParam.q = "";
		store.data.queryParam.needs = "";
		store.data.queryParam.sourceId = 0;
		store.data.queryParam.staffId = 0;

		self.setState({
			queryParam: store.data.queryParam,
			listType: selectType
		})

		self.props.getData(store.data.listType, store.data.queryParam);
	}
	handleClueSourceChange() {
		var self = this;
		var val = this.refs.clueSource.el.val();
		store.data.queryParam.sourceId = val;
		self.setState({
			queryParam: store.data.queryParam
		});

	}
	handleClueStaffChange() {
		var self = this;
		var val = self.refs.clueStaff.el.val();
		store.data.queryParam.staffId = val;
		self.setState({
			queryParam: store.data.queryParam
		});
	}
	handleCustomerNameChange(e) {
		var self = this;
		var val = e.target.value;
		store.data.queryParam.q = val;
		this.setState({
			queryParam: store.data.queryParam
		});
	}
	handleClueNameChange(e) {
		var self = this;
		var val = e.target.value;
		store.data.queryParam.needs = val;
		this.setState({
			queryParam: store.data.queryParam
		});
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
		self.props.getData(store.data.listType, store.data.queryParam);

	}

	handlerResetFilter() {
		store.data.queryParam.q = "";
		store.data.queryParam.needs = "";
		store.data.queryParam.sourceId = 0;
		store.data.queryParam.staffId = 0;

		this.setState({
			queryParam: store.data.queryParam
		})
	}


	/*selectHandle () {
		this.refs.fileForm.reset();
		this.refs.filed.click();
	}
	handleFiles (e) {
		var fileList = e.target.files;
		var tmp = fileList[0].name.split('.')[1];
		if (!tmp.match(/xls|xlsx/i)) {
			toastr.error('只支持xls、xlsx格式文件');
			return null;
		}
		this.uploadFileByFormData(fileList[0]);
	}
	uploadFileByFormData (f) {
		this.props.importData(f);
	}*/
	exportData (){
		this.props.exportData();
	}

	render() {
		var self = this;

		var style100 = {
			width: "100%"
		};
		var style_form_group = {
			display: "block",
			marginBottom: "15px",
			verticalAlign: "middle"
		};

        function setListTypes(){
            var data = new Array();
            var permit = self.state.Permit;

            if(!permit.isLeader){
                var t1 = Constants.clueListTypesLang.slice(0, 1);
                var t2 = Constants.clueListTypesLang.slice(2);
                data = t1.concat(t2);
                return data;
            }else{
                data = Constants.clueListTypesLang;
                return data;
            }
        }
		
		return (
			<ul className="nav nav-tabs myTab">
				<TabSelect2 liList={setListTypes()}  curentSelect={this.state.listType} setSelectType={this.handleListTypeChange.bind(this)}/>

				<div className="DTTT btn-group">
					<a className="btn btn-default DTTT_button_copy" href="#/clue/add/0">
						<i className="fa fa-plus"></i>
						<span>创建 </span>
					</a>
					<a onClick={this.handlerToggleFilterLayer.bind(this)} className="btn btn-default DTTT_button_collection">
						<i className="fa fa-filter"></i>
						<span>筛选 <i className="fa fa-angle-down"></i></span>
					</a>
					<a className="btn btn-default DTTT_button_collection" data-toggle="modal" data-target="#importDataModal">
						<i className="glyphicon glyphicon-save"></i>
						<span>导入</span>
						{/*<form ref="fileForm" style={{display:'none'}}>
							<input ref="filed" type="file"
								   onChange={this.handleFiles.bind(this)}
								   style={{display:'none'}}/>
						</form>*/}
					</a>
					<a className="btn btn-default DTTT_button_collection" onClick={this.exportData.bind(this)}>
						<i className="glyphicon glyphicon-open"></i>
						<span>导出</span>
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
								<label htmlFor="filterCustomer">{Constants.customerLang.customer}</label>
								<input type="text"
									   value={this.state.queryParam.q||""}
									   className="form-control"
									   id="filterCustomer"
									   placeholder={Constants.customerLang.customer}
									   style={style100}
									   onChange={this.handleCustomerNameChange.bind(this)}>
								</input>
							</div>
							<div className="form-group" style={style_form_group}>
								<label htmlFor="filterCustomer">{Constants.clueLang.clue}</label>
								<input type="text"
									   value={this.state.queryParam.needs||""}
									   className="form-control"
									   id="filterClue"
									   placeholder={Constants.clueLang.clue}
									   style={style100}
									   onChange={this.handleClueNameChange.bind(this)}>
								</input>
							</div>
							<div className="form-group" style={style_form_group}>
								<label>{Constants.clueLang.source}</label>
								<Select2
									style={style100}
									ref="clueSource"
									multiple={false}
									onSelect={this.handleClueSourceChange.bind(this)}
									data={this.state.clueSourceList}
									value={ this.state.queryParam.sourceId}
									options={{placeholder: Constants.clueLang.source}}
								/>
							</div>
							<div className="form-group" style={style_form_group}>
								<label>{Constants.clueLang.staff}</label>
								<Select2
									style={style100}
									ref="clueStaff"
									multiple={false}
									onSelect={this.handleClueStaffChange.bind(this)}
									data={this.state.staffList}
									value={ this.state.queryParam.staffId}
									options={{placeholder: Constants.clueLang.staff}}
								/>
							</div>
						</div>
					</div>
				</div>
			</ul>
		);

		/*return (
			<div style={{marginBottom:8 + 'px'}}>
					<TabSelect liList={setListTypes()}  curentSelect={this.state.listType} setSelectType={this.handleListTypeChange.bind(this)}/>

					<div className="DTTT btn-group" style={{right:0+'px'}}>
						<a className="btn btn-default DTTT_button_copy" href="#/clue/add/0">
							<i className="fa fa-plus"></i>
							<span>创建 </span>
						</a>
						<a onClick={this.handlerToggleFilterLayer.bind(this)} className="btn btn-default DTTT_button_collection">
							<i className="fa fa-filter"></i>
							<span>筛选 <i className="fa fa-angle-down"></i></span>
						</a>
						<a className="btn btn-default DTTT_button_collection" onClick={this.selectHandle.bind(this)}>
							<i className="glyphicon glyphicon-save"></i>
							<span>导入</span>

							<form ref="fileForm" style={{display:'none'}}>
								<input ref="filed" type="file"
									   onChange={this.handleFiles.bind(this)}
									   style={{display:'none'}}/>
							</form>
						</a>
						<a className="btn btn-default DTTT_button_collection" onClick={this.exportData.bind(this)}>
							<i className="glyphicon glyphicon-open"></i>
							<span>导出</span>
						</a>
					</div>

					<div style={{display:this.state.showFilterLayer ? 'block' : 'none', width:380+'px',height:400+'px', zIndex:100, position:'absolute',right:-12+'px',top:34+'px'}}>
						<div className="well with-header" style={{background:'#fff',height:'100%'}}>
							<div className="header bordered-blue">
								<div className="buttons-preview" style={{textAlign:'right',paddingTop:10+'px'}}>
									<button onClick={this.handlerResetFilter.bind(this)} className="btn btn-cancer">重置</button>
									<button onClick={this.handlerConfirmFilter.bind(this)} className="btn btn-danger">确定</button>
								</div>
							</div>
							<div style={{marginTop:30+'px',paddingLeft:10+'px'}}>
								<div className="form-group" style={style_form_group}>
                                    <label htmlFor="filterCustomer">{Constants.customerLang.customer}</label>
                                    <input type="text"
                                    	value={this.state.queryParam.q||""}	 
                                    	className="form-control" 
                                    	id="filterCustomer" 
                                    	placeholder={Constants.customerLang.customer} 
                                    	style={style100} 
                                    	onChange={this.handleCustomerNameChange.bind(this)}>
                                    </input>
                                </div>
                               	<div className="form-group" style={style_form_group}>
                                    <label htmlFor="filterCustomer">{Constants.clueLang.clue}</label>
                                    <input type="text" 
                                    	value={this.state.queryParam.needs||""}
                                    	className="form-control" 
                                    	id="filterClue" 
                                    	placeholder={Constants.clueLang.clue} 
                                    	style={style100} 
                                    	onChange={this.handleClueNameChange.bind(this)}>
                                    </input>
                                </div>
								<div className="form-group" style={style_form_group}>
									<label>{Constants.clueLang.source}</label>
									<Select2
										style={style100}
										ref="clueSource"
										multiple={false}
										onSelect={this.handleClueSourceChange.bind(this)}    
										data={this.state.clueSourceList}
										value={ this.state.queryParam.sourceId}
										options={{placeholder: Constants.clueLang.source}}
										/>
								</div>		
								<div className="form-group" style={style_form_group}>
									<label>{Constants.clueLang.staff}</label>
									<Select2
										style={style100}
										ref="clueStaff"
										multiple={false}
										onSelect={this.handleClueStaffChange.bind(this)}    
										data={this.state.staffList}
										value={ this.state.queryParam.staffId}
										options={{placeholder: Constants.clueLang.staff}}
										/>
								</div>																														
							</div>
						</div>
					</div>	

				</div>


		)*/
	}
}