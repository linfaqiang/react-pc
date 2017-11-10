import React from 'react';
import SignalSearch from './SignalSearch';
import {
    LinkmenList,
    IconHead,
    OtherList
} from './ListItem';
import {
    APIS
} from '../../common/config';
import AjaxRequest from '../../common/ajaxRequest';

module.exports = React.createClass({

    getInitialState: function() {
        //console.log('--->');
        return {
            //firstFocus:"",//24小时之内输入框第一次获取焦点
            customerList: {
                title: '最近客户',
                more: '更多客户>>',
                moreUrl: '/customer',
                cls: 'orange pcicon-addCustomer',
                data: [
                    /*{
                        id:'https://www.baidu.com',
                        name:'百度'
                    }*/
                ]
            },
            chanceList: {
                cls: 'orange pcicon-addChance',
                title: '最近商机',
                more: '更多商机>>',
                moreUrl: '/chance',
                data: [
                    /*{
                        id:'https://www.youku.com',
                        name:'优酷'
                    }*/
                ]
            },
            clueList: {
                cls: 'green pcicon-addClue',
                title: '最近线索',
                more: '更多线索>>',
                moreUrl: '/clue',
                data: [
                    /*{
                        id:'22',
                        name:'2345'
                    }*/
                ]
            },
            linkmenList: {
                cls: 'blue pcicon-addContacts',
                moreUrl: '/linkman',
                data: [
                    /* {
                         id:'277',
                         name:'通天塔他'
                     }*/
                ]
            },
            keyword: '',
            resultCls: 'optItemList searchResult hide'
        }
    },

    componentDidMount: function() {},

    handleFocus: function(e) {
        var kw = e.target.value;
        if (kw.length === 0) {
            this.refs.signalSearch.setState({
                cls: 'optItemList searchResult'
            });
        }
    },
    handleChange: function(e) {
        var self = this;
        var kw = e.target.value.trim();
        var url = APIS.advSearch + '?q=' + kw;

        self.setState({
            keyword: kw
        });
        if (kw.length === 0) {
            self.clearMyState(1); //不隐藏搜索入口
            self.refs.signalSearch.setState({
                cls: 'optItemList searchResult hide'
            }); //显示搜索入口提示
        } else {
            self.setState({
                resultCls: 'optItemList searchResult'
            }); //显示搜索结果
            self.refs.signalSearch.setState({
                cls: 'optItemList searchResult hide'
            }); //隐藏搜索入口提示

            AjaxRequest.get(url, '', function(res) {
                if (res.code = "200") {
                    var data = res.data;

                    self.setListState(data.clue, 'clueList');
                    self.setListState(data.chance, 'chanceList');
                    self.setListState(data.customer, 'customerList');
                    self.setListState(data.linkman, 'linkmenList');

                } else {
                    console.log('请求失败!')
                }
            });
        }
    },

    setListState: function(data, stateName) {
        var self = this;
        var list = data.list;
        var tmp = new Array();

        if (!(list instanceof Array)) {
            console.error('list不是数组');
        }

        if (list.length > 0) {
            for (var i = 0; i < list.length; i++) {
                if (i >= 3) break;
                tmp.push({
                    id: list[i].id,
                    name: list[i].name
                });
            }
        }
        self.state[stateName].data = tmp;
        self.setState(self.state[stateName]);
    },

    contextTypes: {
        router: React.PropTypes.object
    },
    handleClick: function(e) {
        e.preventDefault();
        var self = this;
        var el = e.target;

        if (el.nodeName.toLowerCase() === 'a' || el.parentNode.nodeName.toLowerCase() === 'a') {
            self.clearMyState();
        }
        if (el.parentNode.nodeName.toLowerCase() === 'a') {
            el = el.parentNode;
        }

        var evName = el.getAttribute('data-tableName')+'DetailIdChange';
        var detailId = el.getAttribute('data-id');
        self.context.router.replace({
            pathname: el.getAttribute('data-url'),
            query: {}
        });
        $(document).trigger(evName, detailId);
    },

    handleBlur: function() {
        var self = this;
        self.clearMyState(); //隐藏搜索入口提示
    },

    clearMyState: function(flag) {
        console.log('--->');
        var self = this;

        self.setState({
            keyword: ''
        });
        self.state.customerList.data = [];
        self.state.linkmenList.data = [];
        self.state.chanceList.data = [];
        self.state.clueList.data = [];
        self.setState(self.state.customerList);
        self.setState(self.state.chanceList);
        self.setState(self.state.clueList);
        self.setState(self.state.clueList);
        self.setState(self.state.linkmenList);

        self.setState({
            resultCls: 'optItemList searchResult hide'
        }); //隐藏搜索结果
        if (!flag) {
            self.refs.signalSearch.setState({
                cls: 'optItemList searchResult hide'
            });
        }
    },

    render: function() {
        var moreSplit = '',
            noMore = '',
            otherList = '';
        if (this.state.linkmenList.data.length > 0) {
            moreSplit = (<li><p>更多搜索</p></li>);
            if(CONFIG.Exclude && CONFIG.Exclude.chance && CONFIG.Exclude.chance.clue){
                otherList = (
                    <li>
                        <ul>
                            <OtherList list={this.state.customerList}></OtherList>
                        </ul>
                    </li>
                );
            }else{
                otherList = (
                    <li>
                        <ul>
                            <OtherList list={this.state.clueList}></OtherList>
                            <OtherList list={this.state.customerList}></OtherList>
                            <OtherList list={this.state.chanceList}></OtherList>
                        </ul>
                    </li>
                );
            }
        } else {
            if(CONFIG.Exclude && CONFIG.Exclude.chance && CONFIG.Exclude.chance.clue){
                otherList = (
                    <item>
                        <OtherList list={this.state.customerList}></OtherList>
                    </item>
                );
            }else{
                otherList = (
                    <item>
                        <OtherList list={this.state.clueList}></OtherList>
                        <OtherList list={this.state.customerList}></OtherList>
                        <OtherList list={this.state.chanceList}></OtherList>
                    </item>
                );
            }
        }

        if (this.state.clueList.data.length === 0 && this.state.chanceList.data.length === 0 && this.state.customerList.data.length === 0) {
            noMore = (<li><ul><li><p className="gray"><i className="fa fa-search gray"></i>暂无其他结果</p></li></ul></li>);
        }
        // var str = '搜索线索\\商机\\客户\\联系人';
        var str = '搜索';
        if(CONFIG.Exclude){
            if(!CONFIG.Exclude.clue){
                str += '线索\\'
            }
            if(!CONFIG.Exclude.chance){
                str += '商机\\'
            }
            str += '客户\\联系人';
        }else{
            str += '线索\\商机\\客户\\联系人';
        }

        return (
            <div className="searchGroup">
                <div>
                    <i className="btnBlock fa fa-search"></i>
                    <input type="text" placeholder={str} onFocus={this.handleFocus} onBlur={this.handleBlur} onChange={this.handleChange} value={this.state.keyword} />
                </div>
                <div className="resultBox">
                    <SignalSearch ref="signalSearch"></SignalSearch>

                    <ul ref="resultList" className={this.state.resultCls} onMouseDown={this.handleClick}>
                        <li>
                            <IconHead data={this.state.keyword}></IconHead>
                            <LinkmenList list={this.state.linkmenList}></LinkmenList>
                        </li>
                        {moreSplit}
                        {otherList}
                        {noMore}
                    </ul>
                </div>
            </div>
        );
    }
});