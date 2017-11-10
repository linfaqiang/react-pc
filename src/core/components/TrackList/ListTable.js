import React from 'react';


var ListList = React.createClass({

	componentDidUpdate:function(){
		playAudio();
	},

    getLiList:function (data) {

		var lis = data.map(function(qst,key){
			return  <li key={key} className="content">
				<p style={{display:(qst.time? {} : 'none')}}>{qst.time}</p>
				<p className="block" style={{display:(qst.createdName? {} : 'none')}}>{qst.createdName}</p>
				<p className="block" style={{display:(qst.subject? {} : 'none')}}><span>{qst.subject}</span></p>
				{/*<audio style={(qst.audioSubjectFileUrl && qst.audioSubjectFileUrl.length>0) ? {} : {display:'none'}} src={qst.audioSubjectFileUrl} controls="controls">你的浏览器不支持audio</audio>*/}
				<div className="audioBox" style={(qst.audioSubjectFileUrl && qst.audioSubjectFileUrl.length>0)? {marginTop:'10px', marginLeft:'42px'} : {display:'none'}}>
					<audio  src={qst.audioSubjectFileUrl ? qst.audioSubjectFileUrl.replace('.amr', '.mp3'):''} onError={loadAudioError}>你的浏览器不支持audio</audio>
					<p className='audioInfo'>
						<span className="currentTime"></span><span className="duration"></span>
					</p>
				</div>
				<p className="block" style={{display:(qst.time? {} : 'none')}}><span>{qst.address||'暂无地址信息'}</span></p>
				<span className="point"></span>
				<div  className="line_left"></div>
			</li>
		}.bind(this) );

		return lis;
	},

	render:function(){
		var lists = this.props.list;

		if( !Array.isArray(lists) ) throw new Error('this.props.lists必须是数组');
		var Uls = lists.map(function(qst,key){
			return <ul key={key}>
					  <li className="group">
						<span className="title">{qst.date}</span>
						<span className="line"></span>
					   </li>
				       {this.getLiList(qst.list)}
			       </ul>
		}.bind(this) );

		return (
			<div className="activity_list">{Uls}</div>
		)
	}
});


module.exports = React.createClass({
	getToday:function () {
		var now = new Date(),
			year = now.getFullYear(),
			month = now.getMonth()+ 1,
			day = now.getDate();
		return year + "-" + ((month < 10)?("0" + month):month) + "-" + ((day < 10)?("0" + day):day)
	},

	disposeData: function (listData) {
		var ele = [];
		var yearMonth = "";
		var list=[];
		var bl=false;
		for( var i = 0; i < listData.length; i++ ) {
			var dataEle = listData[i],
				str = dataEle.createdOn.split(" "),
				strData = str[0];
			dataEle.time = str[1];
			if(strData != yearMonth){
				if(bl){
					var dateTi = yearMonth;
					if (yearMonth == this.getToday()) {
						dateTi = "今天";
					}
					ele.push({
						date : dateTi,
						list : list
					});
					bl=false;
				}
				list=[];
				yearMonth = strData;

				list.push(dataEle);
				bl=true;
			}else{
				list.push(listData[i]);
			}
			if(i == (listData.length-1)){
				ele.push({
					date : strData,
					list : list
				});
			}
		}
		return ele;
	},
	render:function(){

		return (
			<ListList list={this.disposeData(this.props.list)}/>
		)
	}
});