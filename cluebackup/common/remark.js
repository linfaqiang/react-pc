import React from 'react';
import {APIS} from '../../core/common/config.js';
import Tools from '../../core/common/tools.js';

module.exports = React.createClass({

  getInitialState: function() {
    return {}
  },

  componentDidMount: function(param) {
      Tools.imgLoadError(APIS.img_path+"/assets/crm/images/default-user.png");
  },

  render: function() {
    let lists = this.props.lists;
    let len = this.props.remarkLen;
    let clueId = this.props.clueId;

    var lis = lists.map(function(qst, key) {
      if (key > 1) {
        return;
      }

      return <li key={key}>
              <div className="tx-img">
                  <img src={qst.headPhotoUrl?qst.headPhotoUrl:APIS.img_path+"/assets/crm/images/default-user.png"} width="55" height="55" alt=""/>
              </div>
              <h5>{qst.createdBy}</h5>
              <p>{qst.content}</p>
              <span className="time">{qst.createdOn}</span>
          </li>
    }.bind(this));

    return (
      <div className="dataItem">
            <h5 className="row-title before-darkorange">
                <span>备注&nbsp;(&nbsp;<span className="num-count">{len}</span>&nbsp;)</span>
                <a className="btn" href={`#/clue/remark/0?clueId=${clueId}`}>
                    <i className="fa fa-plus"></i>备&nbsp;&nbsp;&nbsp;&nbsp;注
                </a>
            </h5>
                <div className="dataItem-body detail-tab3">
                    <ul className="beizhu row">
                        {lis}
                    </ul>        
                    <p><a href={"#/clue/"+clueId+"/remark"}>查看全部&nbsp;&nbsp;&gt;</a></p>
                </div>
        </div>
    )
  }

});