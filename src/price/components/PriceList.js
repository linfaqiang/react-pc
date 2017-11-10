import React from 'react';
import PriceProduct from './PriceProduct';

module.exports = React.createClass({

    getInitialState:function(){
        return {
            priceItemState:'normal',//normal, edit, del, add
            //editList:[],
            delList:[],
            addList:[]
        }
    },
    sureAction:function () {
    },

    componentDidMount:function(){
        this.setPropsToState();
    },

    editProductPriceNum:function(obj){
        this.props.editProductPriceNum(obj);
    },

    setPropsToState:function(){
        console.log('Debug --->');
        var status = this.props.status;//报价状态
        var opt = this.props.opt||null;//添加产品报价，删除产品报价
        var itemState = 'normal';

        if(status === 0 || status === 3){
            itemState = 'edit';
        }
        if(opt){
            itemState = opt;
        }
        this.setState({priceItemState:itemState});
    },

    pushProductId:function(id){
        var type = this.state.priceItemState;

        this.state[type+'List'].push(id);
        this.setState(this.state[type+'List']);
    },
    popProductId:function(id){
        var type = this.state.priceItemState;
        var list = this.state[type+'List'];

        for(var i=0; i<list.length; i++){
            if(list[i] == id){
                list.slice(i, 1);
            }
        }
        this.state[type+'List'] = list;
        this.setState(this.state[type+'List']);
    },

    delProductById:function(id){

        this.props.handleDelProduct(id);
    },

    handleAdd: function(){
        var addList = this.state.addList;
        var box = this.refs.productAddBox;
        var btns = box.querySelectorAll('.btn.btn-danger');

        for(var i=0; i<btns.length; i++){
            btns[i].setAttribute("class", 'btn btn-default');
        }

        this.props.handleAddProduct(addList);
        this.setState({addList:[]});
    },

    handleCancel:function(){
        var box = this.refs.productAddBox;
        var btns = box.querySelectorAll('.btn.btn-danger');

        for(var i=0; i<btns.length; i++){
            btns[i].setAttribute("class", 'btn btn-default');
        }
    },

    handleSearch:function(){
        var kinpt = this.refs.keyword;
        var kw = kinpt.value;

        this.props.getOptProductList(kw);
    },

    render:function(){
        var divs,
            lists = this.props.lists,
            cls= this.state.priceItemState;

        divs = lists.map(function(item, key){
            return (
                <PriceProduct key={key} cls={cls} data={item} delProductById={this.delProductById} popProductId={this.popProductId} pushProductId={this.pushProductId} editProductPriceNum={this.editProductPriceNum}></PriceProduct>
            )
        }.bind(this));

        if(cls === 'add'){
            return (
                <div className="myBox">
                    <div className="searchBox">
                        <span className="input-icon inverted">
                            <input type="text" ref='keyword' className="form-control input-sm" onChange={this.handleSearch} placeholder="搜索产品" />
                            <i className="glyphicon glyphicon-search bg-blue" onClick={this.handleSearch}></i>
                        </span>
                        <button data-toggle="tab" href={this.props.target} className="btn btn-cancer" onClick={this.handleCancel}>取消</button>
                        <button data-toggle="tab" href={this.props.target} className={(cls=='del')? 'btn btn-danger myBtn dipN' : 'btn btn-danger'}onClick={this.handleAdd}>确定</button>
                    </div>
                    <div className="scrollList">
                        <div ref="productAddBox" className="baseList price row otherRow">
                            {divs}
                        </div>
                    </div>
                </div>
            )
        }

        if(cls === 'del'){
            return (
                <div className="myBox">
                    <div className="searchBox">
                        {/*<span className="input-icon inverted">
                            <input type="text" ref='keyword' className="form-control input-sm" placeholder="搜索产品" />
                            <i className="glyphicon glyphicon-search bg-blue" onClick={this.handleSearch}></i>
                        </span>*/}
                        <button data-toggle="tab" href={this.props.target} className="btn btn-cancer" style={{float:'right'}}>返回</button>
                    </div>
                    <div className="scrollList">
                        <div className="baseList price row otherRow">
                            {divs}
                        </div>
                    </div>
                </div>
            )
        }

        if(cls === 'normal' || cls === 'edit'){
            return (
                <div className="baseList price row otherRow">
                    {divs}
                </div>
            )
        }
    }
});