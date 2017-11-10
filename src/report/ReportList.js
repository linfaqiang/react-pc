import React from 'react';
import {APIS} from '../core/common/config';
import CurrentPosition from '../core/components/layout/CurrentPosition';

module.exports = React.createClass({
    getInitialState: function () {
        return {};
    },
    componentDidMount: function () {
    },
    render: function () {
        var exculde = CONFIG.Exclude;
        var noChance = false;
        var urlHead = '#/report/list/';
        if( (exculde !== null) ){
            if(exculde.hasOwnProperty('chance')){
                noChance = true;
                urlHead = '#/report/';
            }
        }

        return (
            <div>
                <CurrentPosition routes={this.props.routes} params={this.props.params}/>
                <div className="page-body">
                    <div className="dashboard-box my">
                        <div className="box-tabbs">
                            <div className="tabbable my">
                                <ul className="nav nav-tabs myTab">
                                    <li className="dropdown active">
                                        <a>{noChance? '报表': '我的报表'}</a>
                                    </li>
                                    <div className="DTTT btn-group" style={{display: (noChance? 'none': 'inherit')}}>
                                        <a className="btn btn-default DTTT_button_copy" href="#/report/">
                                            图&nbsp;&nbsp;&nbsp;&nbsp;表
                                        </a>
                                        <a className="btn btn-default DTTT_button_copy" href="#/report/list">
                                            报&nbsp;&nbsp;&nbsp;&nbsp;表
                                        </a>
                                    </div>
                                </ul>

                                <div className="tab-content tabs-flat">
                                    <div id="visits" className="tab-pane animated fadeInUp active">
                                        <div style={{overflow:'hidden', position:'relative', minHeight:'450px'}}>
                                            <table
                                                className={"table table-striped table-hover table-bordered dataTable no-footer"+(1==1 ? ' firstCenter' : '')}
                                                id="editabledatatable" aria-describedby="editabledatatable_info"
                                                style={{marginBottom:'40px'}}>
                                                <thead>
                                                <tr role="row">
                                                    <th>报表</th>
                                                    <th>类型</th>
                                                    <th>描述</th>
                                                </tr>
                                                </thead>

                                                <tbody className="public-body">
                                                <tr style={{display: (noChance? 'none': 'table-row')}}>
                                                    <td><a href={`${urlHead}SalesFunnel`}>销售漏斗</a></td>
                                                    <td>商机报表</td>
                                                    <td>无</td>
                                                </tr>
                                                <tr style={{display: (noChance? 'none': 'table-row')}}>
                                                    <td><a href={`${urlHead}ConvertRate`}>商机阶段持续时间阶段分析</a></td>
                                                    <td>商机报表</td>
                                                    <td>销售周期和转化率</td>
                                                </tr>
                                                <tr>
                                                    <td><a href={`${urlHead}CustomerOverdue`}>客户超期未跟进</a></td>
                                                    <td>客户报表</td>
                                                    <td>客户逾期未拜访</td>
                                                </tr>
                                                <tr>
                                                    <td><a href={`${urlHead}WorkReport`}>工作报告统计</a></td>
                                                    <td>日常报表</td>
                                                    <td>工作日报、周报、月报</td>
                                                </tr>
                                                <tr>
                                                    <td><a href={`${urlHead}CheckIn`}>签到报表</a></td>
                                                    <td>日常报表</td>
                                                    <td>员工签到</td>
                                                </tr>
                                                </tbody>
                                            </table>
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