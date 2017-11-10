import React from 'react';
import Tools from '../../core/common/tools.js';
import {
    APIS
} from '../../core/common/config.js';

module.exports = React.createClass({

    getInitialState: function () {
        return {}
    },

    componentDidUpdate: function () {
        playAudio();
    },
    componentDidMount: function (param) {
        Tools.imgLoadError(APIS.img_path + "/assets/crm/images/ic-defalut-pic.png");
    },
    openUrl: function (url, extension) {
        if (extension.match(/jpg|png|gif|jpeg|bmp|mp3/i)) {
            return;
        } else {
            if (url) {
                window.open(url);
            }
        }
    },
    render: function () {
        let lists = this.props.lists;
        let len = this.props.remarkFileLen;
        let type = this.props.type;
        let typeId = this.props.typeId;
        var clueId = this.props.clueId;
        var linkmanId = this.props.linkmanId;

        var lis = lists.map(function (qst, key) {

            var imgSrc = "";//图片路径
            var fileUrl = qst.fileUrl;//文件地址
            var originName = qst.originName;//文件名
            var fileSize = qst.fileSize;//文件大小
            var imgPlace = null;

            var extension = qst.extension ? qst.extension.toLocaleLowerCase() : "";//文件格式
            if (".doc|.docx|".indexOf(extension) != -1) {
                imgSrc = APIS.img_path + "/assets/img/ic-word.png";
            } else if (".xls|.xlsx|".indexOf(extension) != -1) {
                imgSrc = APIS.img_path + "/assets/img/ic-excel.png";
            } else if (".ppt|.pptx|".indexOf(extension) != -1) {
                imgSrc = APIS.img_path + "/assets/img/ic-ppt.png";
            } else if (".pdf|".indexOf(extension) != -1) {
                imgSrc = APIS.img_path + "/assets/img/ic-pdf.png";
            } else if (".amr|.mp3".indexOf(extension) != -1) {
                imgSrc = APIS.img_path + "/assets/img/audio2.png";
            } else {
                imgSrc = fileUrl;
            }

            if (key > 1) {
                return;
            }
            if (extension == 'mp3') {
                imgPlace = (
                    <div className="audioBox"
                         style={(fileUrl && fileUrl.length>0)? {margin:'0px',marginLeft:'-63px', position:'absolute'} : {display:'none'}}>
                        <audio src={fileUrl ? fileUrl.replace('.amr', '.mp3'):''} onError={loadAudioError}>
                            你的浏览器不支持audio
                        </audio>
                        {/*<p className='audioInfo'>
                         <span className="currentTime"></span><span className="duration"></span>
                         </p>*/}
                    </div>
                );
            } else {
                imgPlace = (
                    <div className="tx-img">
                        <img name="defaultPic" src={imgSrc?imgSrc:APIS.img_path+"/assets/crm/images/ic-defalut-pic.png"}
                             data-original={imgSrc?imgSrc:APIS.img_path+"/assets/crm/images/ic-defalut-pic.png"}
                             width="55" height="55" alt=""/>
                    </div>
                );
            }

            return <li key={key} onClick={this.openUrl.bind(this, qst.fileUrl, extension)}>
                {imgPlace}
                {/*<div className="tx-img">
                 <img src={imgSrc?imgSrc:APIS.img_path+"/assets/crm/images/ic-defalut-pic.png"} width="55" height="55" alt=""/>
                 </div>*/}
                <h5>{qst.originName}</h5>
                <p>{qst.fileSize}&nbsp;&nbsp;{qst.extension}</p>
                <span className="time">{qst.createdOn}</span>
            </li>
        }.bind(this));

        function viewAll() {
            if(type == 'clue_linkman'){
                return <p><a href={`#/clue/${clueId}/linkman/${linkmanId}/file?type=${type}&typeId=${typeId}`}>查看全部&nbsp;&nbsp;&gt;</a></p>
            }else if(type == 'clue'){
                return <p><a href={`#/clue/${clueId}/file?type=${type}&typeId=${typeId}`}>查看全部&nbsp;&nbsp;&gt;</a></p>
            }
        }

        function addBtn() {
            if(type == 'clue_linkman'){
                return (
                    <a className="btn" href={`#/clue/${clueId}/linkman/${linkmanId}/addFile/0?type=${type}&typeId=${typeId}`}>
                        <i className="fa fa-plus"></i>附&nbsp;&nbsp;&nbsp;&nbsp;件
                    </a>
                );
            }else if(type == 'clue'){
                return (
                    <a className="btn" href={`#/clue/${clueId}/addFile/0?type=${type}&typeId=${typeId}`}>
                        <i className="fa fa-plus"></i>附&nbsp;&nbsp;&nbsp;&nbsp;件
                    </a>
                );
            }
        }

        return (
            <div className="dataItem">
                <h5 className="row-title before-darkorange">
                    <span>附件&nbsp;(&nbsp;<span className="num-count">{len}</span>&nbsp;)</span>
                    {addBtn()}
                    {/*<a className="btn" href={`#/remark/file/0?type=${type}&typeId=${typeId}`}>
                        <i className="fa fa-plus"></i>附&nbsp;&nbsp;&nbsp;&nbsp;件
                    </a>*/}
                </h5>
                <div className="dataItem-body detail-tab3">
                    <ul className="fujian beizhu row" id="dowebokList">
                        {lis}
                    </ul>
                    {/*<p><a href={`#/remark/file?type=${type}&typeId=${typeId}&title=附件`}>查看全部&nbsp;&nbsp;&gt;</a></p>*/}
                    {viewAll()}
                </div>
            </div>
        )
    }
});