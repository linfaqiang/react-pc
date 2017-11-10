import React from 'react';
import Tools from '../../core/common/tools.js';
import {APIS} from '../../core/common/config.js';

module.exports = React.createClass({

	getInitialState: function() {
		return {}
	},

	renderComponent: function() {
		var $frame = $('#basic');
		$frame.sly({
			horizontal: 1,
			itemNav: 'basic',
			smart: 1,
			activateOn: 'click',
			activeClass: 'kkkksss',
			mouseDragging: 1,
			touchDragging: 1,
			releaseSwing: 1,
			startAt: 0,//代表从哪个阶段开始
			speed: 300,
			elasticBounds: 1,
			easing: 'easeOutExpo',
			dragHandle: 1,
			dynamicHandle: 1,
			clickBar: 1,

			// Buttons
			// forward: $('#scrollFor'),
			// backward: $('#scrollBack'),
			prev: $('#scrollBack'),
			next: $('#scrollFor')
		});
	},

	componentDidMount: function() {
	},
	componentDidUpdate:function(){
		if(this.props.lists && this.props.lists.length > 0){
			Tools.imgLoadError();
		}
	},
	render: function() {
		let lists = this.props.lists;
		let iconName = "pcicon-clock";
		let name = "未处理";
		//转移方式：0leder分配到部门，1leader分配到员工，2员工转移到其它销售，3转到资源池，4转商机，5销售抢单，6分配到分公司,7员工新建
		let divs = lists.map(function(qst, key) {

			let type = "分配";
			if (qst.assignType == 2) {
				type = "转移";
			} else if (qst.assignType == 3) {
				type = "放弃";
				name = "资源池";
				iconName = "pcicon-pool";
			} else if (qst.assignType == 4) {
				type = "转商机";
				name = "商机";
				iconName = "pcicon-task";
			} else if (qst.assignType == 5) {
				type = "抢单";
			} else if (qst.assignType == 7) {
				type = "新建";
			}
			return (
				<li key={key}>
					<div>
						<img src={qst.headPhotoUrl?qst.headPhotoUrl:APIS.img_path+"/assets/crm/images/default_user.png"} name="headPhoto" className="image-circular bordered-1 bordered-white" />
						<span className="name">{qst.toStaffName}</span>
						<span>{qst.createdOn}</span>
					</div>
					<em>{type}</em>
				</li>
			)

		}.bind(this));


		if (lists)
			return (
				<div className="scrollwrap clue">
					<button id="scrollBack" className="scrollbtn backward"></button>
					<button id="scrollFor" className="scrollbtn forward"></button>
					<div className="scrollframe clue" id="basic">
						<ul className="clearfix clue">
		{
			divs
		}
							<li>
								<div>
									<div className={"wait image-circular bordered-1 bordered-gray pcicon " + iconName}></div>
									<span className="name">{name}</span>
								</div>
							</li>
						</ul>
					</div> 
				</div>
			)
	}
});