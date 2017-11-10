import React from 'react';
import Tools from '../../core/common/tools.js';
import {APIS} from '../../core/common/config.js';

module.exports = React.createClass({

  getInitialState: function() {
    return {}
  },

  componentDidMount: function(param) {
    Tools.imgLoadError(APIS.img_path+"/assets/crm/images/ic-defalut-pic.png");
  },
  render: function() {
    let lists = this.props.lists;
    let len = this.props.remarkFileLen;
    let clueId = this.props.clueId;

    var lis = lists.map(function(qst, key) {
      if (key > 1) {
        return;
      }

      return <li key={key}>
            <div className="tx-img">
              <img src={qst.fileUrl?qst.fileUrl:APIS.img_path+"/assets/crm/images/ic-defalut-pic.png"} width="55" height="55" alt=""/>
            </div>
            <h5>{qst.originName}</h5>
            <p>{qst.fileSize}&nbsp;&nbsp;{qst.extension}</p>
            <span className="time">{qst.createdOn}</span>
          </li>
    }.bind(this));


    return (
      <div className="dataItem">
        <h5 className="row-title before-darkorange">
          <span>附件&nbsp;(&nbsp;<span className="num-count">{len}</span>&nbsp;)</span>
          <a className="btn" href={`#/clue/file/0?clueId=${clueId}`}>
            <i className="fa fa-plus"></i>附&nbsp;&nbsp;&nbsp;&nbsp;件
          </a>
        </h5>
        <div className="dataItem-body detail-tab3">
          <ul className="fujian beizhu row">
              {lis}
          </ul>        
          <p><a href={"#/clue/"+clueId+"/file"}>查看全部&nbsp;&nbsp;&gt;</a></p>
        </div>
      </div>
    )
  }
});