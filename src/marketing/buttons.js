import React from 'react';
import TabSelect2 from '../core/components/PublicSelect/TabSelect2.js';
import Constants from '../core/common/constants.js';
import dicts from '../core/common/dicts.js';
import CONFIG from '../core/common/config.js';
import AjaxRequest from '../core/common/ajaxRequest.js';
import UserInfo from '../core/common/UserInfo.js';
import store from './store';

export default class Buttons extends React.Component {
    constructor(props) {
        super(props);
        var self = this;
        self.state = store.data;
        dicts.get(function () {
            store.data.marketingSourceList = Dicts.MARKETING_SOURCE_LIST;
            self.state = store.data;

        });

        AjaxRequest.get(CONFIG.APIS.staffs_subs, null, function (body) {
            self.state.staffList = body.data;
            store.data.staffList = body.data;
        });

        self.unsubscribe = store.listen(self.onStatusChange.bind(self));
    }

    componentWillUnmount() {
        this.unsubscribe();

    }

    onStatusChange(data) {
        this.setState(data);
    }

    handleListTypeChange(index, name) {
        var self = this;
        var selectType = {name: name, index: index};
        store.data.listType = selectType;

        store.data.queryParam.q = "";
        store.data.queryParam.status = "";


        self.setState({queryParam: store.data.queryParam, listType: selectType});

        self.props.getData(store.data.queryParam);
    }

    handleMarketingSelectChange() {
        var self = this;
        var val = self.refs.marketingSelect.el.val();
        store.data.queryParam.sourceId = val;
        self.setState({queryParam: store.data.queryParam});

    }

    handleClueStaffChange() {
        var self = this;
        var val = self.refs.clueStaff.el.val();
        store.data.queryParam.staffId = val;
        self.setState({queryParam: store.data.queryParam});
    }

    handleCustomerNameChange(e) {
        var self = this;
        var val = e.target.value;
        store.data.queryParam.q = val;
        self.setState({queryParam: store.data.queryParam});
    }

    handleClueNameChange(e) {
        var self = this;
        var val = e.target.value;
        store.data.queryParam.needs = val;
        self.setState({queryParam: store.data.queryParam});
    }

    handlerToggleFilterLayer(e) {
        var self = this;
        //e.preventDefault();
        self.setState({
            showFilterLayer: !self.state.showFilterLayer
        })
    }

    handlerConfirmFilter() {
        var self = this;


        var val = self.refs.createdOnStartAndEnd.value;
        var subStr = val.split("/");
        store.data.queryParam.startStartTime = subStr[0];
        store.data.queryParam.endStartTime = subStr[1];
        self.setState({queryParam: store.data.queryParam});

        self.setState({showFilterLayer: false});
        self.props.getData(store.data.queryParam);

    }

    handleTimeChange(e) {
        var self = this;
        var val = e.target.value;

        var subStr = val.split("/");
        store.data.queryParam.startCreatedOn = subStr[0];
        store.data.queryParam.endCreatedOn = subStr[1];
        self.setState({queryParam: store.data.queryParam});

    }

    handlerResetFilter() {
        var self = this;
        self.refs.createdOnStartAndEnd.value = '';
        store.data.queryParam.q = "";
        store.data.queryParam.needs = "";
        store.data.queryParam.sourceId = 0;
        store.data.queryParam.staffId = 0;

        self.setState({queryParam: store.data.queryParam})
    }

    render() {
        var self = this;

        var style100 = {width: "100%"};
        var style_form_group = {display: "block", marginBottom: "15px", verticalAlign: "middle"};

        function renderAddBtn() {
            var isManger = UserInfo.isManager();
            if (!isManger) return null;
            return (
                <a className="btn btn-default DTTT_button_copy" href="#/marketing/add/0">
                    <i className="fa fa-plus"></i>
                    <span>新建</span>
                </a>
            );
        }
        
        return (
            <ul className="nav nav-tabs myTab">

                <TabSelect2 liList={Constants.marketingListTypesLang} curentSelect={this.state.listType}
                            setSelectType={this.handleListTypeChange.bind(this)}/>

                <div className="DTTT btn-group">
                    {renderAddBtn()}
                    <a onClick={this.handlerToggleFilterLayer.bind(this)}
                       className="btn btn-default DTTT_button_collection">
                        <i className="fa fa-filter"></i>
                        <span>筛选 <i className="fa fa-angle-down"></i></span>
                    </a>
                </div>

                <div style={{display:this.state.showFilterLayer ? 'block' : 'none', width:380+'px',height:400+'px', zIndex:100, position:'absolute',right:1+'px',top:42+'px'}}>
                    <div className="well with-header" style={{background:'#fff',height:'100%'}}>
                        <div className="header bordered-blue">
                            <div className="buttons-preview" style={{textAlign:'right',paddingTop:10+'px'}}>
                                <button onClick={this.handlerResetFilter.bind(this)} className="btn btn-cancer">重置</button>
                                <button onClick={this.handlerConfirmFilter.bind(this)} className="btn btn-danger">确定</button>
                            </div>
                        </div>
                        <div style={{marginTop:30+'px',paddingLeft:10+'px'}}>
                            <div className="form-group" style={style_form_group}>
                                <label htmlFor="filterCustomer">{Constants.marketingLang.subject}</label>
                                <input type="text"
                                       value={this.state.queryParam.q||""}
                                       className="form-control"
                                       id="filterCustomer"
                                       placeholder={Constants.marketingLang.subject}
                                       style={style100}
                                       onChange={this.handleCustomerNameChange.bind(this)}/>
                            </div>
                            <div className="form-group" style={style_form_group}>
                                <div>
                                    开始时间起/结束时间止<br/>
                                    <div className="input-group">
                                        <input className="form-control date-picker"
                                               ref="createdOnStartAndEnd"
                                               id="createdOnStartAndEnd"
                                               type="text"
                                               style={style100} />
                                        <span className="input-group-addon">
                                            <i className="fa fa-calendar"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ul>
        );

       /* return (
            <div style={{marginBottom:8 + 'px'}}>
                <TabSelect liList={Constants.marketingListTypesLang} curentSelect={this.state.listType}
                           setSelectType={this.handleListTypeChange.bind(this)}/>

                <div className="DTTT btn-group" style={{right:0+'px'}}>
                    {renderAddBtn()}
                    <a onClick={this.handlerToggleFilterLayer.bind(this)}
                       className="btn btn-default DTTT_button_collection">
                        <i className="fa fa-filter"></i>
                        <span>筛选 <i className="fa fa-angle-down"></i></span>
                    </a>
                </div>

                <div
                    style={{display:this.state.showFilterLayer ? 'block' : 'none', width:380+'px',height:400+'px', zIndex:100, position:'absolute',right:-12+'px',top:34+'px'}}>
                    <div className="well with-header" style={{background:'#fff',height:'100%'}}>
                        <div className="header bordered-blue">
                            <div className="buttons-preview" style={{textAlign:'right',paddingTop:10+'px'}}>
                                <button onClick={this.handlerResetFilter.bind(this)} className="btn btn-cancer">重置
                                </button>
                                <button onClick={this.handlerConfirmFilter.bind(this)} className="btn btn-danger">确定
                                </button>
                            </div>
                        </div>
                        <div style={{marginTop:30+'px',paddingLeft:10+'px'}}>
                            <div className="form-group" style={style_form_group}>
                                <label htmlFor="filterCustomer">{Constants.marketingLang.subject}</label>
                                <input type="text"
                                       value={this.state.queryParam.q||""}
                                       className="form-control"
                                       id="filterCustomer"
                                       placeholder={Constants.marketingLang.subject}
                                       style={style100}
                                       onChange={this.handleCustomerNameChange.bind(this)}/>
                            </div>
                            <div className="form-group" style={style_form_group}>
                                <div>
                                    开始时间起/结束时间止<br/>
                                    <div className="input-group">
                                        <input className="form-control date-picker"
                                               ref="createdOnStartAndEnd"
                                               id="createdOnStartAndEnd"
                                               type="text"
                                               style={style100} />
                                        <span className="input-group-addon">
                                            <i className="fa fa-calendar"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )*/
    }
}