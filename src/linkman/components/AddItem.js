import React from 'react'
var Task = React.createClass({
    render: function() {

        return (
            <textarea ref="taskContent" className="form-control"  placeholder="输入任务内容（临时模块）"></textarea>
        )
    }
});//任务

var Memo = React.createClass({
    render: function() {

        return (
            <textarea ref="noteContent" className="form-control"  placeholder="输入备忘"></textarea>
        )
    }
});//备忘

var Appendix = React.createClass({
    render: function() {
        return (
            <tr role="row">
                {ths}
            </tr>
        )
    }
});//附件
module.exports = React.createClass({

    getInitialState:function(){
        return {

        }
    },
    sureAction:function () {
        var val = this.refs.noteContent.value;
        this.props.action(val);
    },

    componentDidMount:function(){

    },

    render:function(){
        var divs;
        var type = this.props.type;
        var title = this.props.title;
        var modalId = "add_"+this.props.modalId;

        if(type === 'task'){
            divs = (<Task></Task>);
        }

        return (
            <div className="modal fade" id={modalId}  role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                                &times;
                            </button>
                            <h4 className="modal-title">{title}</h4>
                        </div>
                        <div className="modal-body layer-public">
                            <div id="horizontal-form">
                                <form className="form-horizontal" role="form">
                                    {divs}
                                </form>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">取消
                            </button>
                            <button type="button" onClick={this.sureAction} className="btn btn-danger" data-dismiss="modal">
                                确定
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});