import React from 'react';
import 'jquery';

module.exports = React.createClass({
    getInitialState: function() {
        return {
            prov: this.props.options.prov,
            city: this.props.options.city,
            county: this.props.options.county
        };
    },
    resetStates:function(obj) {
        this.setState({
           prov: obj.prov,
           city: obj.city,
           county: obj.county
        })
    },
    selectProv: function (evt) {
        console.log('1');
        var val = evt.target.value,
            thisText= evt.target.options[evt.target.selectedIndex].text;
            //thisText=evt.target.selectedOptions[0].text;
        console.log(thisText);
        this.setState({
            prov: val,
            city: '',
            county: ''
        });
        console.log('2');
        this.props.selectProvs(val,thisText);
        console.log('3');
    },
    selectCity: function(evt){
        var val = evt.target.value,
            thisText= evt.target.options[evt.target.selectedIndex].text;
            //thisText=evt.target.selectedOptions[0].text;
        this.setState({
            city: val,
            county: ''
        });
        this.props.selectCitys(val,thisText)
    },
    selectCounty: function(evt){
        var val = evt.target.value,
            thisText= evt.target.options[evt.target.selectedIndex].text;
            //thisText=evt.target.selectedOptions[0].text;
        this.setState({
            county: val
        });
        this.props.selectCountys(val,thisText)
    },
    render: function() {
        var data = this.props.data,
            options = $.extend({
                defaultName:['provinceId','cityId','countyId'],
                defaultText:['请选择','请选择','请选择']
            },this.props.options);
        var provs = [], citys = [], countys = [];
        for(var i in data.provinces){
            provs.push([i,data.provinces[i].name])
        }
        provs = provs.map(function(item,key){
            return <option key={key} value={item[0]}>{item[1]}</option>
        });

        if(this.state.prov){
            for(var i in data.provinces[this.state.prov].citys){
                citys.push([i,data.provinces[this.state.prov].citys[i].name])
            }
            citys = citys.map(function(item,key){
                return <option key={key} value={item[0]}>{item[1]}</option>
            })
        }
        if(this.state.prov && this.state.city){
            for(var i in data.provinces[this.state.prov].citys[this.state.city].countys){
                countys.push([i,data.provinces[this.state.prov].citys[this.state.city].countys[i].name])
            }
            countys = countys.map(function(item,key){
                return <option key={key} value={item[0]}>{item[1]}</option>
            })
        }

        return (
            <div className="J_area_selector form-group input-icon icon-right">
                <select className="J_area_prov" name={options.defaultName[0]} value={this.state.prov} onChange={this.selectProv}>
                    <option value="">{options.defaultText[0]}</option>
                    {provs}
                </select>
                <select className="J_area_city" name={options.defaultName[1]} value={this.state.city} onChange={this.selectCity}>
                    <option value="">{options.defaultText[1]}</option>
                    {citys}
                </select>
                <select className="J_area_county" name={options.defaultName[2]} value={this.state.county} onChange={this.selectCounty}
                    data-bv-notempty={this.props.notemptyThree || false}
                    data-bv-notempty-message="必须选择到区县" >
                    <option value="">{options.defaultText[2]}</option>
                    {countys}
                </select>
            </div>
    )
    }
});


