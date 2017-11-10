import React, { Component } from 'react';
import Select2 from '../Select2/Select2.js';
import '../Select2/select2.css';
import ThreeLevel from '../ThreeLevel/threeLevel';

var AreaComponents = React.createFactory(ThreeLevel);

module.exports = React.createClass({
    getInitialState:function(){
        return {
            prov: '',
            city: '',
            county: ''
        }
    },

    renderData:function(data) {     //单选
        return (
            <div>
                <Select2
                    ref={data.field}
                    multiple={false}
                    data={data.data.datas}
                    value={data.data.value1}
                    onSelect={this.selectOne}
                />
            </div>
        );
    },

    renderData1:function(data) {    //多选
        return (
            <div>
                <Select2
                    ref={data.field}
                    multiple
                    data={data.data.datas}
                    value={data.data.value1}
                    onSelect={this.selectMany}
                />
            </div>
        );
    },

    renderData2:function () {           //地址
        var self = this;
        return (
            <div>
                {
                    AreaComponents({
                        data: __areaData__,
                        options: {
                            prov:self.prov || '110000',
                            city:self.city || '110100',
                            county:self.county || '110101',
                            defaultText:['省份','城市','区县']
                        },
                        selectProvs:self.selectProv,
                        selectCitys:self.selectCity,
                        selectCountys:self.selectCounty
                    })
                }
            </div>
        );

    },
    selectProv: function (data) {
        this.setState({
            prov: data,
            city: '',
            county: ''
        })
    },
    selectCity: function(data){
        this.setState({
            city: data,
            county: ''
        })
    },
    selectCounty: function(data){
        this.setState({
            county: data
        })
    },
    selectOne:function () {
        
    },
    selectMany:function () {
        
    },

    saveAdd:function () {
        var param = {},
            lists = this.props.list1.concat(this.props.list2);

        for(var i = 0, len = lists.length; i<len; i++){
            var thisField = lists[i].field;
            switch(lists[i].type){
                case 'normal':
                    param[thisField] = this.refs[thisField].value;
                    break;
                case 'base':
                    param[thisField] = this.refs[thisField].el.val();
                    break;
                case 'many' :
                    param[thisField] = lists[i].data.value1;
                    break;
                case 'adr' :
                    param['prov'] = this.state.prov;
                    param['city'] = this.state.city;
                    param['county'] = this.state.county;
                    break;
                default:
                    break;
                    

            }
        }

        console.log(JSON.stringify(param));

        this.props.saveAdd(param)

    },
    saveCancer:function () {

    },

    renderInputType:function (data,type) {

        var html = '';
        switch(type){
            case 'normal':
                html = <input type="text" ref={data.field} className="form-control"/>;
                break;
            case 'base':
                html = this.renderData(data);
                break;
            case 'many':
                html = this.renderData1(data);
                break;
            case 'adr':
                html = this.renderData2(data);
                break;
            default:
                break;
        }
        return html;
    },

    render:function () {

        var self = this,
            lists1 = this.props.list1,
            lists2 = this.props.list2,

            Lists1 = lists1.map(function(qst,key){
                return <div className="form-group" key={key}>
                    <label for="definpu">{qst.name}</label>
                    {self.renderInputType(qst,qst.type)}
                </div>
            }.bind(this) ),

            Lists2 = lists2.map(function(qst,key){
                return <div className="form-group" key={key}>
                    <label for="definpu">{qst.name}</label>
                    {self.renderInputType(qst,qst.type)}
                </div>
            }.bind(this) );


        return (
            <div>
                <div className="widget addForms">
                    <div className="widget-body" style={{margin:'20px'}}>
                        <div className="collapse in">
                            <div className="row" style={{margin:'10px'}} >
                                <div className="col-lg-6 col-sm-6 col-xs-12">
                                    <form role="form">
                                        {Lists1}
                                    </form>
                                </div>
                                <div className="col-lg-6 col-sm-6 col-xs-12">
                                    <form role="form">
                                        {Lists2}
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="buttons-preview" style={{textAlign:'left',padding:'20px 0 20px 25px'}}>
                            <button onClick={this.saveAdd} className="btn btn-danger">提交</button>
                            <button onClick={this.saveCancer} className="btn btn-cancer">取消</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});