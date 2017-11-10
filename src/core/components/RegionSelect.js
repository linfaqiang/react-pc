import React, { Component } from 'react';
import ThreeLevel from './ThreeLevel/threeLevel';

var AreaComponents = React.createFactory(ThreeLevel);

module.exports = React.createClass({
    getInitialState:function(){
        return {
            prov:this.props.value.provinceId,
            city:this.props.value.cityId,
            county:this.props.value.county,
        }
    },
    componentDidMount:function(param){
        this.setState({
            prov:this.props.value.provinceId,
            city:this.props.value.cityId,
            county:this.props.value.county,
        });        
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
    render:function() {           //地址
        var self = this;
        return (
                AreaComponents({
                    data: __areaData__,
                    options: {
                        prov:self.state.prov || '110000',
                        city:self.state.city || '110100',
                        county:self.state.county || '110101',
                        defaultText:['省份','城市','区县']
                    },
                    selectProvs:self.selectProv,
                    selectCitys:self.selectCity,
                    selectCountys:self.selectCounty
                })
        );

    },

});