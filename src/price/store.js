import Reflux from 'reflux'
import actions from './actions'

import request from 'superagent';
import CONFIG from '../core/common/config.js'
import AjaxRequest from '../core/common/ajaxRequest.js'
import Dicts from '../core/common/dicts.js'
import UserInfo from '../core/common/UserInfo'

export default Reflux.createStore({
    //监听所有的actions
    listenables: [actions],

    //on开头的都是action触发后的回调函数
    onListTypeChange (index,name) {
        //更新状态（就是个对象）
        this.data.listType.index = index;
        this.data.listType.name = name;
        this.trigger(this.data);
    },
    onAdd(item){
        console.log('onAdd');
    },
    onFilter(i){
        console.log('onFilter');
    },
    onImport(i){
        console.log('onImport');
    },
    onExport(i){
        console.log('onExport');
    },

    data : 
        {
            showFilterLayer:false,
            listType:Constants.priceListTypesLang[0],    //当前选中的列表类型
            priceSourceList:[],
            staffList:[],
            selectPP:'',
            hideMineStatus:false,
            hideApprovalStatus:false,
            Permit:UserInfo.getRolePermit(),
            /*mineStatus:[//我的报价列表的数据分类信息
                { text: '全部', id: -1 },
                { text: '拟定', id: 0 },
                { text: '审批中', id: 1},
                { text: '已同意', id: 2 },
                { text: '已拒绝', id: 3 }
            ],
            approvalStatus:[//报价审批列表的数据分类信息
                '未审批','已审批'
            ],*/
            queryParam:{//初始化过滤参数, 我的报价列表
                "q": "",
                "pageNo":1,
                "pageSize":10,     
                "status":-1,
                "isApproved":"",
                "chanceName":"",
                "startCreatedOn":"",
                "endCreatedOn":""
            },
            tableData:{
            	tableName:'price',
                //url:'http://192.168.8.24:8081/crm-web/v1/chance_quotations/search',
                url:CONFIG. APIS.sales_price_lists,
                th:[
                    {
                        name:'报价名称',
                        width:210
                    },{
                        name:'商机',
                        width:150
                    },{
                        name:'状态',
                        width:150
                    },{
                        name:'报价金额（元）',
                        width:150
                    },{
                        name:'过期日',
                        width:150
                    },{
                        name:'责任人',
                        width:150
                    }
                ],
                tr:['quotationName','chanceName','statusText','amount','overdueDate','createdName']
            }
            
        }
      
});