import React from 'react';
import CurrentPosition from '../core/components/layout/CurrentPosition'
import ListTable from '../core/components/TableList/ListTable.js';
import AjaxRequest from '../core/common/ajaxRequest.js';

module.exports = React.createClass({
    getInitialState: function() {
        var url = `marketing/${this.props.params.marketId}/clue`;
        return {
            tableData: {
                url: CONFIG.APIS.myClue,
                tableName: url,//'clue',
                th: [ //列表表头
                    {
                        name: '需求',
                        width: 300
                    }, {
                        name: '客户',
                        width: 300
                    }, {
                        name: '线索来源',
                        width: 60
                    }, {
                        name: '最后跟进时间',
                        width: 120
                    }, {
                        name: '责任人',
                        width: 60
                    }, {
                        name: '状态',
                        width: 60
                    }
                ],
                tr: ['needs', 'customerName', 'sourceName', 'lastOperatedOn', 'ownerStaffName', 'statusName'] //列表每列显示属性定义
            },
            clueList:[]
        };
    },

    componentDidMount: function() {
        this.getData();
    },

    getData() {

        var self = this,
            thisUrl = CONFIG.APIS.market_detail+'/'+self.props.params.marketId + '/clue';
        AjaxRequest.get(thisUrl, null, function(data){
            var list = data.data;
            /*for(var i=0; i<list.length; i++){
                list[i].sourceName = '市场活动';
            }*/
            self.setState({
                clueList:list
            });
        });
    },

    render: function() {
        var id = this.props.params.marketId;

        return (
            <div>
                <CurrentPosition routes={this.props.routes} params={this.props.params} />
                <div className="page-body">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="dashboard-box">
                                <div className="box-tabbs">
                                    <div className="tabbable">
                                        <ul className="nav nav-tabs myTab">
                                            <li>
                                                <a className="btnBack" href={`#/marketing/${id}?tab=otherInfo`}></a>
                                            </li>
                                            <li className="active">
                                                <a>{this.props.route.name}</a>
                                            </li>
                                        </ul>
                                        <div className="tab-content tabs-flat no-padding">
                                            <div id="visits" className="tab-pane animated fadeInUp active">
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <ListTable lists={this.state.clueList}
                                                                   tableData={this.state.tableData}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});