import Reflux from 'reflux'
import actions from './actions'

import request from 'superagent';
import CONFIG from '../core/common/config.js'
import AjaxRequest from '../core/common/ajaxRequest.js'
import Dicts from '../core/common/dicts.js'

export default Reflux.createStore({
    //监听所有的actions
    listenables: [actions],

    //on开头的都是action触发后的回调函数
    onAdd(item) {
        console.log('onAdd');
    },
    onFilter(i) {
        console.log('onFilter');
    },
    onImport(i) {
        console.log('onImport');
    },
    onExport(i) {
        console.log('onExport');
    },

    data: {
        showFilterLayer: false,
        queryParam: { //初始化过滤参数
            "fromDate": "",
            "toDate": "",
            "pageNo": 1,
            "pageSize": 10,
        },
        tableData: {
            url: CONFIG.APIS.sale_plans_all,
            tableName: 'salesplan',
            th: [ //列表表头 
                {
                    name: '计划期间',
                    width: 100
                }, {
                    name: '目标金额(万元)',
                    width: 100
                }, {
                    name: '实际完成金额(万元)',
                    width: 100
                }, {
                    name: '目标完成率',
                    width: 60
                }, {
                    name: '计划组织',
                    width: 60
                }
            ],
            tr: ['name', 'targetAmount', 'finishedAmount', 'finishedRate', 'owner'] //列表每列显示属性定义
        }

    }

});