import React from 'react';

var ListTr = React.createClass({
    clickBack: function() {
        // 新增了参数fileUrl(备注 / 附件 ,点击标题需要查看图片)
	    this.props.clickBack(this.props.list.id,this.props.list.fileUrl);
	},
	deleteClick: function() {
		this.props.deleteClick(this.props.list.id);
	},
	editClick: function(index) {
		this.props.editClick(index);
	},
	selectClick: function(index) {
		this.props.selectClick(index);
	},
	allClickBack: function() { //整行都要点击的情况
		if (!this.props.allClick) {
			return;
		}
		this.clickBack();
		this.props.changeCurrentTr(this.props.list.id);
	},

	render: function() {
		var self = this;
		var index = this.props.index;
		var haschecked = this.props.haschecked ? true : false;
		var lists = this.props.tableData.tr;
		var tableName = this.props.tableData.tableName;
		var detailUrl = this.props.clickBack ?
			'javascript:void(0)' :
			('#/' + tableName + '/' + this.props.list.id);
		if (this.props.tableData && this.props.tableData.type == "islink") { //表格新增一个字段类型,当type=="islink"时候,表示是链接地址,而不是路由地址配置
			detailUrl = this.props.list.fileUrl;
		}

		if (!Array.isArray(lists)) throw new Error('this.props.lists必须是数组');

		var flag = false;//如果列表的第一列是选择框时，则 flag = true
		if(this.props.selectClick && typeof this.props.selectClick == 'function'){
			flag = true;
		}

		var tds = lists.map(function(qst, key) {
			if(!qst){
				return (
					<td key={key}>
						<div className="checkbox" style={{margin:'0px'}}>
							<label style={{paddingLeft:'0px'}}>
								<input type="checkbox" className="colored-danger" checked={haschecked ? true : false} />
									<span className="text noMargin" onClick={self.selectClick.bind(this, index)}></span>
							</label>
						</div>
					</td>
				);
			}
			if(qst == 'optAction'){
				return (
					<td key={key}>
						<a className="btn btn-primary btn-xs" onClick={self.editClick.bind(this, index)}>
							<i className="fa fa-edit"></i> 编辑
						</a>
					</td>
				);
			}
			var field = '';
			var arrs = qst.split('.'),
				val;

			if (arrs.length == 2) {
				var ar1 = arrs[0],
					ar2 = arrs[1];
				val = this.props.list[ar1];
				field = ar1;
				if (typeof val == 'object') {
					val = val[ar2];
					field = ar2;
				}
			} else if (arrs.length == 1) {
				val = this.props.list[qst];
				field = qst;
			}
			var htl = "";
			if (key == 0 && !this.props.allClick) {
				htl = <a href={detailUrl} onClick={this.props.clickBack?this.clickBack:''}>{val}</a>;
			}else if(flag && key == 1){
				htl = <a href={detailUrl} onClick={this.props.clickBack?this.clickBack:''}>{val}</a>;
			} else if (qst == 'del') {
				htl = <a onClick={this.deleteClick} className="btn btn-danger btn-sm" href="javascript:void(0);"><i className="fa fa-times"></i>删除</a>;
			} else if (qst == 'extimateDealDate') {
				htl = val ? val.split(" ")[0] : val;
			} else {
				htl = fomartAmount(field, val);
			}

			return <td key={key} className="sorting_1">
				     {htl}
			       </td>
		}.bind(this));

		function fomartAmount(field, val){//dealAmount
			if( field.match(/amount/i) || field.match(/price/i)){
				var r = new RegExp("^\\d+(\\.\\d+)?$");
				if((typeof val == 'number') || r.test(val)){
					return (<span style={{color: '#d61518'}}>￥{toThousands(val)}</span>);
				}
			}
			if(/\d{4}-\d{1,2}-\d{1,2}/.test(field) ){
				return (
					<span className={"fa pcicon pcicon-"+val} style={{color: val=='hook' ? 'green' : 'red'}}>&nbsp;</span>
				);
			}
			return val;
		}

		return (
			<tr className={this.props.selected?'selected':''} onClick={this.props.deleteClick} onClick={this.allClickBack}>
				{tds}
			</tr>
		)
	}
});

var ListThead = React.createClass({

	render: function() {
		var self = this;
		var allSelect = this.props.allSelect;
		var lists = this.props.tableData.th;

		if (!Array.isArray(lists)) throw new Error('this.props.lists必须是数组');
		var ths = lists.map(function(qst, key) {
			if(qst.name == 'checkBox'){
				return (
					<th key={key} className="sorting"  width={qst.width}>
						<div className="checkbox" style={{margin:'0px'}}>
							<label style={{paddingLeft:'0px'}}>
								<input type="checkbox" className="colored-danger" checked={allSelect ? true : false} />
								<span className="text noMargin" onClick={self.props.selectAllClick}></span>
							</label>
						</div>
					</th>
				);
			}
			return <th key={key} className="sorting"  width={qst.width}>
				{qst.name}
			</th>
		}.bind(this));

		return (
			<tr role="row">
				{ths}
			</tr>
		)
	}
});


module.exports = React.createClass({

	render: function() {
		var centeralgin = this.props.tableData[0] ? false : true;

		var lists = this.props.lists;
		if (!Array.isArray(lists)) throw new Error('this.props.lists必须是数组');
		var ListTrs = lists.map(function(qst, key) {
			var index = key;
			return <ListTr key={key} list= {qst} index={index}
						   tableData={this.props.tableData}
						   clickBack={this.props.clickBack}
						   selected={qst.selected}
						   haschecked={qst.haschecked}
						   changeCurrentTr={this.props.changeCurrentTr}
						   allSelect={this.props.allSelect}
						   selectClick={this.props.selectClick}
						   editClick={this.props.editClick}
						   allClick={this.props.allClick}
						   deleteClick={this.props.deleteClick}/>
		}.bind(this));// style={this.props.noDate ? {display:'none'} : {}}
		//minHeight:'590px', 
		return (
			<table className={"table table-striped table-hover table-bordered dataTable no-footer "+this.props.alignClass+(centeralgin ? ' firstCenter' : '')} id="editabledatatable" aria-describedby="editabledatatable_info" style={{marginBottom:'40px'}}>
				<thead>
				  <ListThead tableData={this.props.tableData} allSelect={this.props.allSelect} selectAllClick={this.props.selectAllClick}/>
				</thead>

				<tbody className="public-body">
				    {ListTrs}
				</tbody>
			</table>
		)
	}
})