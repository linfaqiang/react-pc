import React from 'react';
import {
    APIS
} from '../core/common/config.js';
import Tools from '../core/common/tools.js';

module.exports = React.createClass({

    getInitialState: function () {
        return {}
    },

    componentDidMount: function (param) {
        Tools.imgLoadError(APIS.img_path + "/assets/crm/images/default_user.png");
    },

    render: function () {
        let lists = this.props.lists;
        let len = this.props.remarkLen;
        let type = this.props.type;
        let typeId = this.props.typeId;
        var clueId = this.props.clueId;
        var linkmanId = this.props.linkmanId;

        var lis = lists.map(function (qst, key) {
            if (key > 1) {
                return;
            }

            return <li key={key}>
                <div className="tx-img">
                    <img src={qst.headPhotoUrl?qst.headPhotoUrl:APIS.img_path+"/assets/crm/images/default_user.png"}
                         width="55" height="55" alt=""/>
                </div>
                <h5>{qst.createdBy}</h5>
                <p>{qst.content}</p>
                <span className="time">{qst.createdOn}</span>
            </li>
        }.bind(this));

        function viewAll() {
            if(type == 'clue_linkman'){
                return <p><a href={`#/clue/${clueId}/linkman/${linkmanId}/remark?type=${type}&typeId=${typeId}`}>查看全部&nbsp;&nbsp;&gt;</a></p>
            }else if(type == 'clue'){
                return <p><a href={`#/clue/${clueId}/remark?type=${type}&typeId=${typeId}`}>查看全部&nbsp;&nbsp;&gt;</a></p>
            }
        }
        function addBtn() {
            if(type == 'clue_linkman'){
                return (
                    <a className="btn" href={`#/clue/${clueId}/linkman/${linkmanId}/addRemark/0?type=${type}&typeId=${typeId}`}>
                        <i className="fa fa-plus"></i>备&nbsp;&nbsp;&nbsp;&nbsp;注
                    </a>
                );
            }else if(type == 'clue'){
                return (
                    <a className="btn" href={`#/clue/${clueId}/addRemark/0?type=${type}&typeId=${typeId}`}>
                        <i className="fa fa-plus"></i>备&nbsp;&nbsp;&nbsp;&nbsp;注
                    </a>
                );
            }
        }

        return (
            <div className="dataItem">
                <h5 className="row-title before-darkorange">
                    <span>备注&nbsp;(&nbsp;<span className="num-count">{len}</span>&nbsp;)</span>
                    {/*<a className="btn" href={`#/remark/0?type=${type}&typeId=${typeId}`}>
                        <i className="fa fa-plus"></i>备&nbsp;&nbsp;&nbsp;&nbsp;注
                    </a>*/}
                    {addBtn()}
                </h5>
                <div className="dataItem-body detail-tab3">
                    <ul className="beizhu row">
                        {lis}
                    </ul>
                    {/*<p><a href={`#/remark?type=${type}&typeId=${typeId}&title=备注`}>查看全部&nbsp;&nbsp;&gt;</a></p>*/}
                    {viewAll()}
                </div>
            </div>
        )
    }

});