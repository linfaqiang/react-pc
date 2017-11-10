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
        staffList: [],
        queryParam: { //初始化过滤参数
            "q": "",
            "customerName": "",
            "pageNo": 1,
            "pageSize": 10
        },
        tableData: {
            url: CONFIG.APIS.contact_list,
            tableName: 'linkman',
            th: [ //列表表头
                {
                    name: '姓名',
                    width: 90
                }, {
                    name: '公司',
                    width: 200
                }, {
                    name: '部门',
                    width: 60
                }, {
                    name: '职位',
                    width: 120
                }, {
                    name: '电话',
                    width: 60
                }, {
                    name: '邮箱',
                    width: 110
                }

            ],
            tr: ['name', 'customerName', 'department', 'title', 'telephone', 'email'] //列表每列显示属性定义
        }

    }

});