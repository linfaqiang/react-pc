import React from 'react';
import {APIS} from '../../core/common/config.js';
import Tools from '../../core/common/tools.js';

module.exports = React.createClass({

    getInitialState:function(){
        return {
            lists:[]
        }
    },
    sureAction:function () {
    },

    componentDidMount:function(){
    },
    componentDidUpdate:function(){
        if(this.state.lists && this.state.lists.length > 0){
            Tools.imgLoadError();
        }
    },
    renderApproval:function(data){
        if((data instanceof Array) && data.length >0){
            this.setState({lists: data});
        }
    },

    ex: {
        "id": 187,
        "createdBy": 10,
        "createdOn": "2016-10-13 09:50:53",
        "updatedOn": "2016-10-13 09:50:53",
        "chanceQuotationId": 239,
        "approvedBy": 10,
        "isApproved": 0,
        "approvedContent": "提交审核",
        "approvedResult": "",
        "startCreatedOn": "",
        "endCreatedOn": "",
        "startUpdatedOn": "",
        "endUpdatedOn": "",
        "status": 0,
        "approvalName": "test1223",
        "headPhotoId": "1203",
        "headPhotoUrl": "http://192.168.8.24:8080/crm-web//uf/employee/photo/7005.jpg",
        "createdName": "test1223"
    },

    render:function(){
        var divs,
            lists = this.state.lists;

        divs = lists.map(function(item, key){
            return (
                <div key={key} className="databox-top">
                    <div className="imgbox">
                        <img src={item.headPhotoUrl?item.headPhotoUrl:APIS.img_path+"/assets/crm/images/default_user.png"} name="headPhoto"/>
                    </div>
                    <div className="infoBox">
                        <p className="databox-header carbon no-margin">
                            {item.approvalName}
                        </p>
                        <p className="databox-header carbon no-margin">
                            {item.approvedContent||'暂无回应'}
                        </p>
                        <p className="databox-text silver no-margin">
                            {item.createdOn||'\u3000'}
                        </p>
                    </div>
                </div>
            )
        }.bind(this));
        
        if(lists.length>0){
            return (
                <div className="baseList exe approval">
                    {divs}
                </div>
            )
        }else{
            return (
                <div className="no-massage"><div className='crmNoData'>暂无数据</div></div>
            )
        }
    }
});