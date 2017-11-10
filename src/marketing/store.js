import Reflux from 'reflux';
import actions from './actions';
import CONFIG from '../core/common/config.js'

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
            listType:Constants.marketingListTypesLang[0],    //当前选中的列表类型
            marketingSelectList:[],
            staffList:[],
            selectPP:
            {
                startCreatedOn: "",
                endCreatedOn: ""
            },
            queryParam:{//初始化过滤参数
                "q": "",
                "pageNo":1,
                "pageSize":10,
                "status":"",
                "startStartTime":"",
                "endStartTime":""
                
            },
            list:[],
            tableData:{
                tableName:'marketing',
                // url:'http://192.168.8.24:8081/crm-web/v1/marketing_activities',
                url:CONFIG.APIS.market_list,
                th:[
                    {
                        name:'市场活动名称',
                        width:240
                    },{
                        name:'活动类型',
                        width:120
                    },{
                        name:'状态',
                        width:100
                    },{
                        name:'开始时间',
                        width:200
                    },{
                        name:'结束时间',
                        width:200
                    }
                ],
                tr:['subject','activityType','status','startTime','endTime']
            }
            
        }
      
});