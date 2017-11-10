import React from 'react'
import ListTable from './ListTable.js';
import ListPager from '../TableList/ListPager';


module.exports = React.createClass({

	getInitialState:function(){
		return {
			pageData:{
				currentPage:1,
				totalSize:0,
				num:0
			},
			lists:[

			]
		}
	},

	componentDidMount:function(){

	},

	setPagerData:function (list) {    //设置页码信息

		var totalSize = list.totalSize,
			pageSize = this.props.trackData.pageSize,
			num =  (totalSize % pageSize == 0) ? totalSize/pageSize : parseInt(totalSize/pageSize)+1;

		this.setState({
			lists:list.data,
			pageData:{
				currentPage:this.state.pageData.currentPage,
				totalSize:list.totalSize,
				num:num
			}
		});
		this.refs.list.render();
	},


	setCurrentPage:function (num) {
		
		this.state.pageData.currentPage = num;
		
		this.setState(this.state.pageData);
		
	},

	goPage:function (num,cb) {

		var param = {
			pageSize:this.props.trackData.pageSize,
			pageNo:num
		};

		if(typeof cb == 'function'){
			cb();
		}else{
			this.setCurrentPage(num);
		}

		this.props.getData(param);


	},

	prePage:function (num) {
		var self = this;
		if(num-1 < 1){
			return;
		}

		this.goPage(num-1,function () {
			self.setCurrentPage(num-1);
		})
	},

	nextPage:function (num) {
		var self = this;
		if(num+1 > this.state.pageData.num){
			return;
		}

		this.goPage(num+1,function () {
			self.setCurrentPage(num+1);
		})
	},

	render:function(){
		return (
			<div>
				<ListTable ref="list" list={this.state.lists} />
				<ListPager pageData={this.state.pageData}
						   num={this.state.pageData.num}
						   prePage={this.prePage}
						   pagesize={this.props.trackData.pageSize}
						   goPage={this.goPage}
						   nextPage={this.nextPage}
				/>
			</div>
		)
	}
});