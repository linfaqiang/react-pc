import Reflux from 'reflux'
import actions from './actions'
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
            listType:Constants.competitorListTypesLang[0],    //当前选中的列表类型
            competitorSelectList:[],
            staffList:[],          
            queryParam:{//初始化过滤参数
                "q": "",
                "pageNo":1,
                "pageSize":10,
                "status":""
            },
            tableData:{               //存放表格数据
                tableName:'competitor',
                url:CONFIG.APIS.competitors_list,
                th:[
                    {
                        name:'竞争对手名称',
                        width:240
                    },{
                        name:'地址',
                        width:260
                    },{
                        name:'电话',
                        width:120
                    },{
                        name:'竞争总额',
                        width:130
                    }
                ],
                tr:['competitorName','address.address','competitorPhone','totalAmount']
            },
            
        }
      
});