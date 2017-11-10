import React from 'react';

module.exports = React.createClass({

    getInitialState:function(){
        return {
            cls:"optItemList searchResult hide"
        }
    },

    componentDidMount:function(){
    },
    contextTypes: {
        router: React.PropTypes.object
    },
    handleClick:function(e){
        var self = this;
        var el = e.target;
        
        if(el.parentNode.nodeName.toLowerCase() === 'a'){
            el = e.el.parentNode;
        }

        if(el.nodeName.toLowerCase() === 'a'){
            self.context.router.replace({
                pathname: el.getAttribute('data-href'),
                query: {}
            });
            self.setState({cls:'optItemList searchResult hide'});//隐藏搜索结果
        }
    },

    render:function(){
        return(
            <ul className={this.state.cls} onMouseDown={this.handleClick}>
                <li>
                    <p>更多搜索</p>
                </li>
                <li style={{display: CONFIG.Exclude && CONFIG.Exclude.clue ? 'none' : 'block'}}>
                    <a href="#/clue" data-href="clue"><i className="icon fa pcicon green pcicon-addClue"></i>线索</a>
                </li>
                <li>
                    <a href="#/customer" data-href="customer"><i className="icon fa pcicon orange pcicon-addCustomer"></i>客户</a>
                </li>
                <li style={{display: CONFIG.Exclude && CONFIG.Exclude.chance ? 'none' : 'block'}}>
                    <a href="#/chance" data-href="chance"><i className="icon fa pcicon orange pcicon-addChance"></i>商机</a>
                </li>
            </ul>
        );
    }
});