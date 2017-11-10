import React from 'react';

var Li = React.createClass({

	goPage:function (e) {
		this.props.goPage(this.props.num)
	},
	render:function(){

		var active = (this.props.num == this.props.checked) ? 'active' : '';

		return (
		    <li className={active}><a href="javascript:void(0)" onClick={this.goPage}>{this.props.num}</a></li>
		)
	}
});

module.exports = React.createClass({

	prePage:function (e) {
		this.props.prePage(this.props.pageData.currentPage)
	},
	nextPage:function(e) {
		this.props.nextPage(this.props.pageData.currentPage)
	},
	render:function(){
		var Lis = [],
		    classPre = 'prev',
			classNext = 'next';

		if(this.props.pageData.currentPage == 1){
			classPre+=' disabled'
		}else{
			classPre = classPre.replace(/disabled/,'')
		}

		if(this.props.pageData.currentPage == this.props.num){
			classNext+=' disabled'
		}else{
			classNext = classPre.replace(/disabled/,'')
		}

		for(var i=1; i< this.props.num+1; i++ ){
			Lis.push(<Li num={i} key={i} checked={this.props.pageData.currentPage} goPage={this.props.goPage}/>)
		}
		
		return (
		<div style={{overflow:'hidden'}}>
			<div className="row DTTTFooter" style={{display:(this.props.pageData.totalSize <= this.props.pagesize)?'none':'block'}}>
				<div style={{float:'right'}}>
					<div className="dataTables_paginate paging_bootstrap" id="editabledatatable_paginate">
						<ul className="pagination">
							<li className={classPre}><a href="javascript:void(0)" onClick={this.prePage}>上一页</a></li>
							{Lis}
							<li className={classNext}><a href="javascript:void(0)" onClick={this.nextPage}>下一页</a></li>
							<li style={{margin:'0 -7px'}}><a style={{border:"none"}}>总数 : {this.props.pageData.totalSize} 条</a></li>
						</ul>
					</div>
				</div>
			</div>
			<div className="no-massage" style={{display:this.props.pageData.num?'none':'block'}}><div className='crmNoData'>暂无数据</div></div>
		</div>
		)
	}
});