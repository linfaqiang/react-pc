import React from 'react'
import ListPager from '../../core/components/TableList/ListPager';
import {Pagination, Select} from 'antd';

var RecordItem = React.createClass({
    fomartTime:function(t){
        if(t){
            t = t.split(' ')[1];
            t = t.substr(0, 5);
            return t;
        }else{
            return t;
        }
    },

    render:function(){
        var self = this;
        var lists = this.props.list;

        function renderTime(item){
            if(item.startTime){
                return (self.fomartTime(item.startTime))+'-'+(self.fomartTime(item.endTime));
            }else if(item.trackOn){
                return (self.fomartTime(item.trackOn))
            }
        }

        if( !Array.isArray(lists) ) throw new Error('this.props.lists必须是数组');
        var divs = lists.map(function(item,key){
            return (
                <div key={key} className="record-item">
                    <h6 className="time">{renderTime(item)}</h6>
                    <p>{item.createdName}</p>
                    <p>{item.content||item.subject}</p>
                    <div className="audioBox" style={item.audioSubjectFileUrl && item.audioSubjectFileUrl.length>0? {} : {display:'none'}}>
                        <audio  src={item.audioSubjectFileUrl ? item.audioSubjectFileUrl.replace('.amr', '.mp3') : 'javascript:void(0);'}>你的浏览器不支持audio</audio>
                        <p className='audioInfo'>
                            <span className="currentTime"></span><span className="duration"></span>
                        </p>
                    </div>
                    {/*<audio controls="controls">你的浏览器不支持audio</audio>*/}
                    <h6 className="map">{item.address||'地址数据暂无'}</h6>
                </div>
            )
        }.bind(this) );

        return (
            <div>
                {divs}
            </div>
        )
    }
});

module.exports = React.createClass({
    getInitialState:function(){
        return {
            pageData: this.props.trackData,
            lists:[],
            hideNoData: true
        }
    },
    componentDidUpdate:function(){
        playAudio();
    },
    setListData:function(data){
        var list = new Array();
        var d = data;

        /*var ex = [{
            "createdName": "ymt008",
            "createdOn": "2016-11-25 15:15:41",
            "id": 244,
            "createdBy": 671,
            "trackOn": "2016-11-25 15:15:41",
            "address": "广东省深圳市南山区高新南一道靠近联想大厦",
            "subject": "Dkkdkd",
            "RN": 1,
            "addressId": 2418,
            "clueId": 793
        }];*/

        for(var i=0; i<d.length; i++){
            var str = d[i].startTime || d[i].trackOn;
            var tmp = str.split(' ')[0];//日期

            if(list.length === 0){
                list.push({date:tmp, data:[]});
            }else{
                var flag = false;
                for(var j=0; j<list.length; j++){
                    if(list[j].date == tmp){
                        flag = true;
                        break;
                    }
                }
                if(!flag){
                    list.push({date:tmp, data:[]});
                }
            }
        }

        if(list.length === 0) return null;

        for(var i=0; i<d.length; i++){
            var str = d[i].startTime || d[i].trackOn;
            var tmp = str.split(' ')[0];//日期
            //var tmp = d[i].startTime.split(' ')[0];//日期
            var index = 0;

            while(index < list.length){
                if(tmp === list[index].date){
                    list[index].data.push(d[i]);
                    break;
                }
                index++;
            }
        }
        this.setState({lists: list});
    },//组织数据

    fomartDate:function(d){
        var tmp = d;
        var dd = tmp.split('-');
        dd = new Date(parseInt(dd[0]), (parseInt(dd[1]) -1), parseInt(dd[2]), 0, 0, 0).getTime();
        var today = new Date();
        today = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0).getTime();

        if(dd === today){
            return "今天";
        }else{
            return tmp;
        }
    },

    setPagerData:function(data){
        var self = this;
        var param = self.state.pageData;

        param.pageNo = self.state.pageNo || data.pageNo || 1;
        param.totalSize = data.totalSize || 0;
        param.pageSize = data.pageSize || self.props.trackData.pageSize || 10;

        self.setState({pageData:param});
        self.setListData(data.data);
    },
    PageChange:function(page){
        var self = this;
        var pageData = self.state.pageData;
        pageData.pageNo = page;
        self.props.getData(pageData);
    },
    setNoData: function(bl, totalSize){
        var self = this;
        var pageData = self.state.pageData;
        pageData.totalSize = totalSize;
        self.setState({
            hideNoData: bl,
            pageData: pageData
        });
    },

    render:function(){
        var lists = this.state.lists;

        if( !Array.isArray(lists) ) throw new Error('this.props.lists必须是数组');
        var lis = lists.map(function(item,key){
            return (
                <li key={key}>
                    <p>
                        <span>{this.fomartDate(item.date)}</span>
                    </p>
                    <RecordItem list={item.data}></RecordItem>
                </li>
            )
        }.bind(this) );

        return (
            <div style={{minHeight: '383px', paddingBottom:'48px', position:'relative', border:'solid 1px #ddd', borderTop:'0px'}}>
                <ul className="record-list" style={{border:'0px'}}>
                    {lis}
                </ul>
                <div className={this.state.hideNoData ? "no-massage hide" : "no-massage"} style={{top: '20%', left:'50%', position:'absolute', marginLeft:'-15px'}}><div className='crmNoData'>暂无数据</div></div>
                <div style={{position:'absolute', right:'10px', bottom:'10px'}}>
                    <Pagination
                        size="small"
                        selectComponentClass={Select}
                        total={this.state.pageData.totalSize}
                        showTotal={total => `共 ${total} 条记录`}
                        pageSize={this.state.pageData.pageSize}
                        defaultCurrent={this.state.pageData.pageNo}
                        current={this.state.pageData.pageNo}
                        onChange={this.PageChange}
                        showQuickJumper
                    />
                </div>
            </div>
        )
    }
});