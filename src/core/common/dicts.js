/**
 * @file 所有字典
 * @author baddyzhou
 * @desc  所有的ajax请求请都调用此文件的方法
 *		Dicts.get(function(){
 *			var list = Dicts.CUSTOMER_LEVEL_LIST;//数组，顺序访问
 *          var dict = Dicts.CUSTOMER_LEVEL;     //按键该部
 *		               
 *		})
 */

import React from 'react';
import request from 'superagent';
import CONFIG from './config.js'
import AjaxRequest from './ajaxRequest.js';

define(function (require,exports,module) {
    
    var Dicts = {
        get : function(callback){
        	if(window.Dicts){
				callback();
			}else{
				AjaxRequest.get(CONFIG.APIS.dists_list, null, function(data){
					var dicts = data.data;
					var destDicts = dicts;
					for(var key in dicts){
						var subItemArray = new Array();
					   for(var itemKey in dicts[key]){
					   		subItemArray.push( dicts[key][itemKey]);
					   }
					   destDicts[key + "_LIST"] = subItemArray;
					}
					window.Dicts = destDicts;
					callback();
				});
	        };
 		}
    };
    module.exports = Dicts;
});

	




