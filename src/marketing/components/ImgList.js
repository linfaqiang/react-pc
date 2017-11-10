import React from 'react';
import Tools from '../../core/common/tools.js';
import {APIS} from '../../core/common/config.js';

module.exports = React.createClass({

    getInitialState:function(){
        return {
            hideBtn:false,
            imgList:[]
        }
    },

    componentDidMount:function(){
        //this.initPrevwer();
    },
    componentDidUpdate:function(){
        if(this.state.imgList && this.state.imgList.length > 0){
            Tools.imgLoadError();
        }
    },

    initPrevwer:function(){
        var self = this;
        var list = self.state.imgList;

        if(list && list.length===0) {
            self.setState({hideBtn:true});
        };

        if(list && list.length===0) return;

        $(self.refs.imgPrevwer).PicCarousel({
            "width":600,
            "height":205,
            "posterWidth":390,
            "posterHeight":205,
            "scale":0.8,
            "speed":500,
            "verticalAlign":"middle",
            "prevBtn":".pic-btn.prev-btn",
            "nextBtn":".pic-btn.next-btn"
        });
    },

    render:function(){
        var hBtn = {display:'none'};

        var imgs = this.state.imgList;

        if( imgs.length > 0 ){
            var lis = imgs.map(function(item,key){
                return (
                    <li key={key} className="poster-item"><img name="defaultPic" src={item?item:APIS.img_path+"/assets/crm/images/ic-defalut-pic.png"} /></li>
                )
            }.bind(this) );

            return (
                <div className="PicCarousel">
                    <button className="pic-btn prev-btn" style={(this.state.hideBtn ? hBtn : {})}></button>
                    <button className="pic-btn next-btn" style={(this.state.hideBtn ? hBtn : {})}></button>
                    <div ref="imgPrevwer" className="poster-main A_Demo">
                        <ul className="poster-list">
                            {lis}
                        </ul>
                    </div>
                </div>
            )
        }else{
            return null;
        }
    }
});