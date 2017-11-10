import React from 'react';

module.exports = React.createClass({

    getInitialState:function(){
        return {
        }
    },
    sureAction:function () {
    },

    componentDidMount:function(){

    },

    editClickHandle:function(productId, e){
        //console.log('productId: '+productId);
        var dom = e.target;
        var gBox = dom.parentNode.parentNode.parentNode;
        var ipts = gBox.querySelectorAll('input');


        ipts[0].removeAttribute("readonly");
        ipts[1].removeAttribute("readonly");

        var btn = gBox.querySelectorAll('.myBtn');
        btn[0].setAttribute("class", (btn[0].getAttribute('class') + ' dipN'));
        btn[1].setAttribute("class", (btn[1].getAttribute('class').replace(' dipN', '')));
        btn[2].setAttribute("class", (btn[2].getAttribute('class').replace(' dipN', '')));
    },
    cancelClickHandle:function(productId, e){
        //console.log('productId: '+productId);
        var dom = e.target;
        var gBox = dom.parentNode.parentNode.parentNode;
        var ipts = gBox.querySelectorAll('input');
        var btn = gBox.querySelectorAll('.myBtn');


        ipts[0].setAttribute("readonly","readonly");
        ipts[0].setAttribute("value",ipts[0].getAttribute('data-raw'));
        ipts[1].setAttribute("readonly","readonly");
        ipts[1].setAttribute("value",ipts[1].getAttribute('data-raw'));


        btn[0].setAttribute("class", (btn[0].getAttribute('class').replace(' dipN', '')));
        btn[1].setAttribute("class", (btn[1].getAttribute('class') + ' dipN'));
        btn[2].setAttribute("class", (btn[2].getAttribute('class') + ' dipN'));
    },
    sureClickHandle:function(productId, e){
        //console.log('productId: '+productId);
        var dom = e.target;
        var gBox = dom.parentNode.parentNode.parentNode;
        var ipts = gBox.querySelectorAll('input');
        var btn = gBox.querySelectorAll('.myBtn');
        var ret = gBox.querySelector('.fColorRed');
        var price = ipts[0].value;
        var count = ipts[1].value;
        var newAllprice = parseFloat(parseFloat(price) * parseInt(count));//新的产品总价
        var rawAllPrice = parseFloat(ret.innerText.substring(1));//原来的产品总价
        ret.innerHTML = ('￥'+ newAllprice );//.toFixed(2)

        ipts[0].setAttribute("readonly","readonly");
        ipts[0].setAttribute("data-raw",ipts[0].value);
        ipts[1].setAttribute("readonly","readonly");
        ipts[1].setAttribute("data-raw",ipts[1].value);


        btn[0].setAttribute("class", (btn[0].getAttribute('class').replace(' dipN', '')));
        btn[1].setAttribute("class", (btn[1].getAttribute('class') + ' dipN'));
        btn[2].setAttribute("class", (btn[2].getAttribute('class') + ' dipN'));

        this.props.editProductPriceNum({
            id:productId,
            productPrice:price,
            quantity:count,
        });
    },


    selectClickHandle:function(productId, e){//选择新加
        //console.log('productId: '+productId);
        var dom = e.target, cls;
        var cls = dom.className;

        if(dom.nodeName.toLowerCase() === 'i'){
            dom = dom.parentNode;
            cls = dom.className;
        }

        if(cls.match('btn-danger')){
            dom.setAttribute("class", (cls.replace(' btn-danger', '')));
            this.props.popProductId(parseInt(productId));
        }else {
            dom.setAttribute("class", (cls+' btn-danger'));
            this.props.pushProductId(parseInt(productId));
        }
    },

    deleteClickHandle:function(productId, e){
        //console.log('productId: '+productId);
        var dom = e.target,
            self = this;
        var gBox = dom.parentNode.parentNode.parentNode;

        if(dom.nodeName.toLowerCase() === 'i'){
            dom = dom.parentNode;
            gBox = gBox.parentNode;
        }

        bootbox.confirm("您确定从报价行中删除该产品吗?", function(result) {
            if (result) {
                self.props.delProductById(parseInt(productId));
            }
        });
    },

    render:function(){
        //console.log('Debug --->');
        //var divs;
        var data = this.props.data,
            cls= this.props.cls;

        if(cls === 'normal'){//normal, edit, del, select
            return (
                <div className="prcPrice">
                    <p>
                        {data.productName}<i className="fColorRed">￥{toThousands(data.amount)}</i>
                    </p>
                    <p className="silver">类别：{data.productTypeText}</p>
                    <p className="silver desc">描述：{data.description}</p>
                    <p className="silver">
                        单价：<em className="fColorRed">￥{toThousands(data.productPrice)}</em>
                        <span className="silver">
                            数量：<em>{data.quantity}</em>
                        </span>
                    </p>
                </div>
            )
        }
        if(cls === 'edit'){
            return (
                <div className="prcPrice">
                    <p>
                        {data.productName}<i className="fColorRed">￥{toThousands(data.amount)}</i>
                    </p>
                    <p className="silver">类别：{data.productTypeText}</p>
                    <p className="silver desc">描述：{data.description}</p>
                    <p className="silver" style={{height:26+'px'}}>
                        单价：<input type="text" readOnly data-raw={data.productPrice} defaultValue={data.productPrice} />
                        数量：<input type="text" readOnly data-raw={data.quantity} defaultValue={data.quantity} />
                        <span className="silver">
                            <i className="silver myBtn pcicon pcicon-edit" onClick={this.editClickHandle.bind(this, data.id)}></i>
                            <a className="btn myBtn dipN btn-default" onClick={this.cancelClickHandle.bind(this, data.id)}>取消</a>
                            <a className="btn myBtn dipN btn-danger" onClick={this.sureClickHandle.bind(this, data.id)}>确定</a>
                        </span>
                    </p>
                </div>
            )
        }
        if(cls === 'del'){
            return (
                <div className="prcPrice">
                    <p>
                        {data.productName}<i className="fColorRed">￥{toThousands(data.amount)}</i>
                    </p>
                    <p className="silver">类别：{data.productTypeText}</p>
                    <p className="silver desc">描述：{data.description}
                        <span className="btnBoxInLine">
                            <a className="btn btn-danger" onClick={this.deleteClickHandle.bind(this, data.mainKeyId||data.id)}><i className="fa fa-times"></i>删除</a>
                        </span>
                    </p>
                </div>
            )
        }
        if(cls === 'add'){
            return (
                <div className="prcPrice">
                    <p>{data.productName}<i className="fColorRed">￥{toThousands(data.productPrice)}</i>
                    </p>
                    <p className="silver">类别：{data.productTypeText}</p>
                    <p className="silver desc">描述：{data.description}</p>
                    <p className="silver">
                        <span className="silver">
                             <a className="btn btn-default" onClick={this.selectClickHandle.bind(this, data.id)}><i className="fa fa-check"></i>选择</a>
                        </span>
                    </p>
                </div>
            )
        }
    }
});