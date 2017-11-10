import React from 'react';
// import ListTable from './ListTable.js';
import ListPager from '../../core/components/TableList/ListPager';


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
        })
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
        var lists = this.state.lists;

        if( !Array.isArray(lists) ) throw new Error('this.props.lists必须是数组');

        var divs = lists.map(function(item,key){
            return <div className="chanceBox" key={key}>
                <p className="darkcarbon">{item.name}</p>
                <p className="stage darkgray">
                    阶段：{item.chanceStageName}<span>责任人：{item.ownerStaffName}</span>
                </p>
                <p className="darkgray dpTable">
                    <span>最后跟进时间：{item.trackDate}</span>
                    <span>状态：{item.statusText}</span>
                    <span>预测金额：<i style={{color: 'red', fontStyle:'normal'}}>￥{toThousands(item.forecastAmount)}</i></span>
                </p>
            </div>
        }.bind(this) );

        return (
            <div>
                <div className="chanceList">
                    {divs}
                </div>
                <ListPager pageData={this.state.pageData}
                           num={this.state.pageData.num}
                           pagesize={this.props.trackData.pageSize}
                           prePage={this.prePage}
                           goPage={this.goPage}
                           nextPage={this.nextPage}
                />
            </div>
        )
    }
});