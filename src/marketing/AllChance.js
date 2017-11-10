import React from 'react';
import CurrentPosition from '../core/components/layout/CurrentPosition'
import ListTable from '../core/components/TableList/ListTable.js';
import AjaxRequest from '../core/common/ajaxRequest.js';

module.exports = React.createClass({
    getInitialState: function() {
        var url = `marketing/${this.props.params.marketId}/chance`;
        return {
            tableData:{               //存放表格数据
                tableName: url,//'clue',
                th:[
                    {
                        name:'商机名称',
                        width:200
                    },{
                        name:'商机类型',
                        width:150
                    },{
                        name:'商机阶段',
                        width:150
                    },{
                        name:'预测成交金额',
                        width:150
                    },{
                        name:'客户名称',
                        width:220
                    },/*{
                        name:'最后跟进时间',
                        width:200
                    },*/{
                        name:'预计成交日期',
                        width:200
                    },{
                        name:'责任人',
                        width:150
                    }
                ],
                tr:['name','stageTypeText','chanceStageName','forecastAmount','customerName','trackDate',/*'extimateDealDate',*/'ownerStaffName']
            },
            chanceList:[]
        };
    },

    componentDidMount: function() {
        this.getData();
    },

    getData() {
        var self = this,
            thisUrl = CONFIG.APIS.market_detail+'/'+self.props.params.marketId  + '/chance';
        AjaxRequest.get(thisUrl, null, function(data){

            self.setState({
                chanceList:data.data
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
                                                        <ListTable lists={this.state.chanceList}
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