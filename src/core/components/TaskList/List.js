import React from 'react'

module.exports = React.createClass({

	getInitialState:function(){
		return {

		}
	},
	
	componentDidMount:function(){

	},

	render:function(){
		var lists = this.props.lists,
			len = lists.length;

		var lis = lists.map(function(qst,key){
			if(key > 1){
				return;
			}
			var fileUrl= qst.audioSubjectFileUrl;
			return <li key={key} style={{height:'auto', minHeight:'40px'}}>
						<p style={{display: (qst.subject? 'block': 'none')}}>{qst.subject}</p>
						<span className="time">{qst.createdOn}</span>
						<div className="audioBox" style={(fileUrl && fileUrl.length>0)? {} : {display:'none'}}>
							<audio  src={fileUrl ? fileUrl.replace('.amr', '.mp3'):''} onError={loadAudioError}>你的浏览器不支持audio</audio>
							<p className='audioInfo'>
								<span className="currentTime"></span><span className="duration"></span>
							</p>
						</div>
					</li>
		}.bind(this) );
		
		return (
			<div className="ppLi">
				<h3 className="padding-left-20" style={{fontSize:'14px'}}>未完成任务 ({len})</h3>
				<div className="top-btn">
					<a href="javascript:void(0)" className="btn btn-default btn-add" onClick={this.props.addTask}>添加任务</a>
				</div>
				<ul className="renwu row">
					{lis}
				</ul>
				<div className="detail-bottom-pp">
					<a href="javascript:void(0)" onClick={this.props.selectAllTask}>查看全部&nbsp;&nbsp;&gt;</a>
				</div>
			</div>
		)
	}
});