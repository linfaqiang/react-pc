import React from 'react';
import Tools from '../../core/common/tools.js';
import {APIS} from '../../core/common/config.js';

module.exports = React.createClass({

  getInitialState: function() {
    return {}
  },

  componentDidMount: function() {
  },
  componentDidUpdate:function(){
    if(this.props.lists && this.props.lists.length > 0){
      Tools.imgLoadError();
    }
  },
  render: function() {
    let lists = this.props.lists;
    let len = this.props.linkmanLen;
    let clueId = this.props.clueId;

    let divs = lists.map(function(qst, key) {
      if (key > 3) {
        return;
      }

      return (
        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12" key={key}>
                <div className="databox databox-graded">
                  <div className="databox-left no-padding">
                    <img src={qst.headPhotoUrl?qst.headPhotoUrl:APIS.img_path+"/assets/crm/images/default_user.png"} name="headPhoto"/>
                  </div>
                  <div className="databox-right">
                    <div className="databox-text">{qst.name}</div>
                    <div className="databox-text darkgray">{qst.department}--{qst.title}<br />{qst.mobile||qst.telephone}</div>
                  </div>
                </div>
              </div>
      )

    }.bind(this));

    return (
      <div className="dataItem">
      <h5 className="row-title before-darkorange">
        <span>联系人&nbsp;(&nbsp;<span className="num-count">{len}</span>&nbsp;)</span>
        <a className="btn" href={`#/clue/${clueId}/addLinkman/0`}>
          <i className="fa fa-plus"></i>联系人
        </a>
      </h5>
      <div className="dataItem-body">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="row">
                  {divs}
              </div>
            </div>
          </div>
          <p><a href={"#/clue/" + clueId + "/linkman"}>查看全部&nbsp;&nbsp;&gt;</a></p>
      </div>
    </div>
    )
  }
});