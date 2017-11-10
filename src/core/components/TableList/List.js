import React from 'react'
import ListTable from './ListTable.js';
import ListPager from './ListPager.js';


module.exports = React.createClass({

	getInitialState: function() {
		return {
			pageData: {
				currentPage: 1,
				totalSize: 0,
				num: 0
			},
			lists: [

			]
		}
	},
	changeCurrentTr: function(id) {
		var datas = this.state.lists;
		for (var i = 0, len = datas.length; i < len; i++) {
			if (id == datas[i].id) {
				datas[i].selected = true;
			} else {
				datas[i].selected = false;
			}

		}
	},

	componentDidMount: function() {

	},

	setPagerData: function(list) { //设置页码信息

		var totalSize = list.totalSize,
			pageSize = this.props.initParam.pageSize,
			num = (totalSize % pageSize == 0) ? totalSize / pageSize : parseInt(totalSize / pageSize) + 1;

		if (this.props.allClick && list.data.length>0) { //如果是整行都可以点击的话
			list.data[0].selected = true;
		}
		this.setState({
			lists: list.data,
			pageData: {
				currentPage: this.state.pageData.currentPage,
				totalSize: list.totalSize,
				num: num
			}
		})
	},


	setCurrentPage: function(num) {

		this.setState({

			pageData: {
				num: this.state.pageData.num,
				currentPage: num,
				totalSize: this.state.pageData.totalSize
			}

		});
	},

	goPage: function(num, cb) {

		var param = this.props.initParam;
		param.pageNo = num;

		if (typeof cb == 'function') {
			cb();
		} else {
			this.setCurrentPage(num);
		}

		this.props.getData(param);


	},

	prePage: function(num) {
		var self = this;
		if (num - 1 < 1) {
			return;
		}

		this.goPage(num - 1, function() {
			self.setCurrentPage(num - 1);
		})
	},

	nextPage: function(num) {
		var self = this;
		if (num + 1 > this.state.pageData.num) {
			return;
		}

		this.goPage(num + 1, function() {
			self.setCurrentPage(num + 1);
		})
	},

	render: function() {
		return (
			<div>
			<ListTable lists={this.state.lists}
					   clickBack={this.props.clickBack}
					   allClick={this.props.allClick}
					   changeCurrentTr={this.changeCurrentTr}
					   tableData={this.props.tableData}
					   deleteClick={this.props.deleteClick}
			/>
			
			<ListPager pageData={this.state.pageData}
					   num={this.state.pageData.num}
					   pagesize={this.props.initParam.pageSize}
					   prePage={this.prePage}
					   goPage={this.goPage}
					   nextPage={this.nextPage}
			/>
		</div>
		)
	}
});