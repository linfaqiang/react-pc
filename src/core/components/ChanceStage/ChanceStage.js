import React from 'react';
import {Link} from 'react-router';

module.exports = React.createClass({

	getInitialState:function(){
		return {
			dataLis:[
				{
					stageName:'我方签单',
					isClosed:1,
					closeReason:0//关闭商机原因:0 我方签单、1项目丢单、2项目取消
				},
				{
					stageName:'项目丢单',
					isClosed:1,
					closeReason:1//关闭商机原因:0 我方签单、1项目丢单、2项目取消
				},
				{
					stageName:'项目取消',
					isClosed:1,
					closeReason:2//关闭商机原因:0 我方签单、1项目丢单、2项目取消
				}
			],
			stageListLength:0
		}
	},
	renderComponent: function() {

	},
	componentDidUpdate :function() {
		//this.scrollLayer();
	},
	componentDidMount:function(){
	},

    scrollLayer:function(){
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

	/**
	 *
	 * @param v1 商机阶段
	 * @param v2 获取是否关闭商机:0开启 1关闭
	 * @param v3 关闭商机原因:0 我方签单、1项目丢单、2项目取消
	 * @param v4 是否设为已完成， 否：代表设为当前阶段
	 */
	finishedTask:function(v1,v2,v3,v4){
		var list = this.state.stageList;
		var chanceStageId = parseInt(v1);
		var n = list.length;

		var i=0;
		for(i=0; i<list.length; i++){
			if(chanceStageId == list[i].stageId){
				break;
			}
		}
		i++;

		var params = {
			stageId: v1,
			isClosed:v2,
			closeReason:v3,
			isFinished:v4,
			isLastStage:( i<n ? false : true )
		};
		this.props.finishedTask(params);
	},
	setStageList: function(list){
		this.setState({stageList:list});
	},
	closeForm:function(closeReason){
		this.props.closeForm(closeReason);
	},
	render:function(){
		var detailData = this.props.detailData;
		var lists = detailData.saleStageList;
		var chanceStageText = detailData.chanceStageText;
		var chanceStageId = detailData.chanceStageId;
		var customerId = detailData.customerId;
		var isColsed = detailData.isColsed;
		var closeReason = detailData.closeReason;
		var closeReasonText = detailData.closeReasonText;
		var chanceId = detailData.chanceId;
		var disableFun = this.props.disableFun;
		if( !Array.isArray(lists) ) throw new Error('this.props.lists必须是数组');

		var lis = lists.map(function(qst,key){
			var stageId = qst.stageId;
			var licls = "";
			var linkhf = <a href="javascript:void(0)" onClick={this.finishedTask.bind(this,qst.stageId,0,'',false)}>设为当前阶段</a>;
			if(stageId < chanceStageId){
				licls = "complete";
			}else if(stageId == chanceStageId && isColsed == 1){
				licls = "complete";
			}else if(stageId == chanceStageId){
				licls = "active";
				linkhf = <a href="javascript:void(0)" onClick={this.finishedTask.bind(this,qst.stageId,0,'',true)}>标记为已完成</a>;
			}

			return <li data-level={qst.stageName} key={key} className={licls}>
						<span>{qst.startedOn}</span>
						<div className="btn-group">
							<button className="dropdown-toggle" data-toggle="dropdown">
								<i className="fa fa-map-marker"></i>
								{qst.stageName}
								<i className="fa fa-caret-down"></i>
							</button>
							<div className="dropdown-menu">
								<div style={{display:(isColsed==1? 'none': 'block')}}>
									{linkhf}
								</div>
								<div>
									<Link to={'/chance/'+chanceId+'/stageTask/'+qst.stageId+'?disableFun='+disableFun+'&customerId='+customerId}>
										查看阶段任务
									</Link>
								</div>
								{/*<div>'#/chance/'+chanceId+'/stageTask/'+chanceStageId+'?disableFun='+disableFun
									<Link to={'/chance/'+chanceId+'/stageTask/'+qst.stageId}>
										编辑阶段任务
									</Link>
								</div>*/}
							</div>
						</div>
					</li>
		}.bind(this) );

		var dataLis = this.state.dataLis;
		if(isColsed == 1){
			var tmp = new Array();
			if(closeReason){
				tmp.push(dataLis[parseInt(closeReason)]);
			}
			dataLis = tmp;
		}
		var lisd = dataLis.map(function(qst,key){
			var link = <a href="javascript:void(0)" onClick={this.closeForm.bind(this,qst.closeReason)} data-target="#closeFormModal" data-toggle="modal">设为当前阶段</a>;
			if(qst.closeReason == 2){
				link = <a href="javascript:void(0)" onClick={this.finishedTask.bind(this,chanceStageId,qst.isClosed,qst.closeReason,false)}>设为当前阶段</a>;
			}
			if(isColsed ==1){
				link = null;
			}
			return <li data-level={qst.stageName} key={key} className={isColsed ==1 ? 'active' : ''}>
						<span></span>
						<div className="btn-group">
							<button className="dropdown-toggle" data-toggle={isColsed ==1 ? '' : 'dropdown'}>
								<i className="fa fa-map-marker" style={isColsed ==1 ? {display:'none'} : {}}></i>
								{qst.stageName}
								<i className="fa fa-caret-down" style={isColsed ==1 ? {display:'none'} : {}}></i>
							</button>
							<div className="dropdown-menu">
								<div>
									{link}
								</div>
							</div>
						</div>
					</li>
		}.bind(this) );

		return (
			<div>
				<div className="row">
					<div className="col-xs-12 col-md-12">
						<div className="orders-container">
							<div className="orders-header">
								<h6>
									<span>销售阶段 <a href={'#/chance/'+chanceId+'/stageTask/'+chanceStageId+'?disableFun='+disableFun+'&customerId='+customerId} style={disableFun ? {display:'none'} : {}}><i className="crm_edit pcicon pcicon-edit stateTitle"></i></a></span>
								</h6>
							</div>
							<div className="orders-footer" style={{padding:'22px 0px',zIndex:'9',overflow:'hidden'}}>
								<p className="currentP">
									当前阶段：<span id="currentL">{isColsed==1 ? (closeReasonText||chanceStageText) : chanceStageText}</span>
								</p>
								<div className="scrollwrap">
									<button id="scrollBack" className="scrollbtn backward"></button>
									<button id="scrollFor" className="scrollbtn forward"></button>
									<div className="scrollframe steps" id="basic">
										<ul className="clearfix mysteps">
											{lis}
											{lisd}
										</ul>
									</div>
								</div>
								<p className="allP">
									<a href={'#/chance/'+chanceId+'/stageTask/'+chanceStageId+'?disableFun='+disableFun+'&customerId='+customerId} className="alla">查看全部</a>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
});