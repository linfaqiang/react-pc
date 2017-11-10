import React from 'react';

import CurrentPosition from '../core/components/layout/CurrentPosition'
import TableView from '../core/components/TableList/TableView.js';

import AjaxRequest from '../core/common/ajaxRequest.js';
import Buttons from './buttons.js';
import store from './store'

module.exports = React.createClass({

    getInitialState: function() {
        return store.data;
    },
    componentWillUnmount() {},
    componentDidMount: function() {
        this.getData();
    },
    getData(args) {
        var self = this;

        var url = store.data.tableData.url;
        var params = this.state.queryParam;

        for(var key in args){
            params[key] = args[key];
        }
        self.refs.linkmanList.beginLoad(params.pageNo);
        AjaxRequest.get(url, params, function(data) {
            self.refs.linkmanList.setPagerData(data);
        })
    },
    render: function() {
        return (
            <div>
                <CurrentPosition routes={this.props.routes} params={this.props.params} />
                <div className="page-body">
                    <div className="dashboard-box my">
                        <div className="box-tabbs">
                            <div className="tabbable my" >
                                <Buttons ref="buttons" getData={this.getData}></Buttons>

                                <div className="tab-content tabs-flat">
                                    <div id="visits" className="tab-pane animated fadeInUp active">
                                        <TableView ref="linkmanList" getData={this.getData} tableData={this.state.tableData} initParam={this.state.queryParam}></TableView>
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