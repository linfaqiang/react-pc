/**
 * Created by Administrator on 2016/8/23 0023.
 */
import React, { Component } from 'react';

module.exports = React.createClass({

    getInitialState:function(){
        return {}

    },



    componentDidMount:function(){

    },

    render:function(){

        return (
            <div>
                {this.props.children}
            </div>
        )
    }
});