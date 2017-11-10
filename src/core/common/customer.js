/**
 * @file 我的客户
 * @author baddyzhou
 * @desc  所有的ajax请求请都调用此文件的方法
 *		MyCustomers.get(function(){
 *			var list = MyCustomers;         
 *		})
 */
import React from 'react';
import request from 'superagent';
import CONFIG from './config.js'
import AjaxRequest from './ajaxRequest.js';

define(function (require,exports,module) {
    var MyCustomers = {
        get : function(callback){
        	if(window.MyCustomers){
				callback();
			}else{
				AjaxRequest.get(CONFIG.APIS.myCustomer_list, null, function(data){
					window.MyCustomers = data.data;
					callback();
				});
	        };
 		}
    };
	exports = MyCustomers;
});