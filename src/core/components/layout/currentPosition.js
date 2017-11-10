import React from 'react';

module.exports = React.createClass({
    getInitialState: function() {
        return {
            routes: [],
            params: null
        };
    },
    setRoutes: function(routes, params){
        this.setState({
            routes: routes,
            params: params
        });
    },
    render: function() {
        var routes = this.props.routes || [];
        var params = this.props.params;
        var tmp = [], lis = null;
        //var regexp = new RegExp("^[\\u4e00-\\u9fa5]$");

        for(var i=0; i<routes.length; i++){
            //var t = routes[i].name;
            if(routes[i].name){
                tmp.push({name: routes[i].name, path: routes[i].path, search: (routes[i].search || '')});
            }
        }

        function createLink(route){
            var name = route.name;
            var str = '#';

            for(var i=0; i<tmp.length; i++){
                if(tmp[i].name == name){
                    str += tmp[i].path;
                    str += tmp[i].search;
                    break;
                }
                str += tmp[i].path;
                
                if(i>0) str += '/';
            }

            if(params){
                for(var key in params){
                    var s = str.replace((':'+key), params[key]);
                    str = s;
                }
            }

            return str;
        }

        lis = tmp.map(function(item, key){
            if(key == 0) return null;
            return(
                <li key={key}>
                    <a href={createLink(item)}>{item.name}</a>
                </li>
            )
        }.bind(this));

        return (
            <div className="page-breadcrumbs">
                <ul className="breadcrumb">
                    <li>
                        <i className="fa fa-home"></i>
                        <a href="#">首页</a>
                    </li>
                    {lis}
                </ul>
            </div>
        )
    }
});