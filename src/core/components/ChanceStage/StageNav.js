import React from 'react';

module.exports = React.createClass({

	getInitialState:function(){
		return {
			stageId:this.props.stageId
		}
	},
	renderComponent: function() {

	},

	scrollLayer:function(){
		var $frame = $('#basic');
		var $wrap = $frame.parent();
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
	componentWillMount:function() {

	},
	componentDidMount:function(){
	},

	getTaskList:function(stageId){
		//console.log('getTaskList');
		this.setState({
			stageId:(stageId ? parseInt(stageId) : stageId)
		});
		this.props.getTaskList(stageId);
		//console.log('this.props.getTaskList');
	},
	render:function(){
		var lists = this.props.lists;
		var chanceStageId = this.state.stageId;
		var currStage = "";
		if( !Array.isArray(lists) ) throw new Error('this.props.lists必须是数组');

		var lis = lists.map(function(qst,key){
			var stageId = qst.stageId;
			var licls = "active";
			if(stageId == chanceStageId){
				licls = "complete";
				currStage = qst.stageName;
			}

			return <li data-level={qst.stageName} key={key} className={licls}>
						<span>{qst.finishedCount}/{qst.taskCount}</span>
						<div className="btn-group">
							<button className="dropdown-toggle" onClick={this.getTaskList.bind(this,stageId)}>
								{qst.stageName}
							</button>
						</div>
					</li>
		}.bind(this) );

		return (
				<div className="row">
					<div className="col-xs-12 col-md-12">
						<div className="orders-container">
							<div className="orders-footer" style={{padding:'7px 0px',overflow:'hidden'}}>
								<p className="currentP">
									当前：<span id="currentL">{currStage}</span>
								</p>
								<div className="scrollwrap">
									<button id="scrollBack" className="scrollbtn backward"></button>
									<button id="scrollFor" className="scrollbtn forward"></button>
									<div className="scrollframe steps" id="basic">
										<ul className="clearfix mysteps">
											{lis}
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
		)
	}
});