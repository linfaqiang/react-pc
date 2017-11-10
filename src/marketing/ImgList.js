import React from 'react';
import me_pic from './scroll-img';
import Tools from '../core/common/tools.js';
import {APIS} from '../core/common/config.js';

module.exports = React.createClass({

	getInitialState:function(){
		return {

		}
	},
	
	componentDidMount:function(){

		new me_pic('marketingImg');

		//this.DY_scroll('.img-scroll','.prev','.next','.img-list',3,false);// true为自动播放，不加此参数或false就默认不自动
		Tools.imgLoadError();
	},
	
    // DY_scroll : function(wraper,prev,next,img,speed,or)
	 // {
	 //  var wraper = $(wraper);
	 //  var prev = $(prev);
	 //  var next = $(next);
	 //  var img = $(img).find('ul');
	 //  var w = img.find('li').outerWidth(true);
	 //  var s = speed;
	 //  next.click(function() {
	 //        img.animate({'margin-left':-w},function() {
	 //                   img.find('li').eq(0).appendTo(img);
	 //                   img.css({'margin-left':0});
	 //                   });
	 //        });
	 //   prev.click(function(){
	 //        img.find('li:last').prependTo(img);
	 //        img.css({'margin-left':-w});
	 //        img.animate({'margin-left':0});
	 //        });
	 //  if (or == true){
	 //  var ad = setInterval(function() { next.click();},s*1000);
	 //   wraper.hover(function(){clearInterval(ad);},function(){ad = setInterval(function() { next.click();},s*1000);});
	 //  }
	 // },
 

	render:function(){
		var lists=[];
		lists[0]= APIS.img_path+"/assets/img/avatars/divyia.jpg";
		lists[1]= APIS.img_path+"/assets/img/avatars/adam-jansen.jpg";
		lists[2]= APIS.img_path+"/assets/img/avatars/bing.png";
		lists[3]= APIS.img_path+"/assets/img/avatars/John-Smith.jpg";
		//var lists = this.props.lists,
		var	len = lists.length;

		var lis = lists.map(function(qst,key){
			
			return <li key={key}>
						<img name="defaultPic" src={qst?qst:APIS.img_path+"/assets/crm/images/ic-defalut-pic.png"} width="100%" height="100%" alt=""/>
					</li>
		}.bind(this) );
		
		
		return (

			<div id="marketingImg">
				<ul>
					{lis}
				</ul>
				<span><i style={{float:'left'}}></i><i style={{float:'right'}}></i></span>
			</div>
		)
	}
});