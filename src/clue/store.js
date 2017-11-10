import Reflux from 'reflux';
import actions from './actions';
import CONFIG from '../core/common/config.js';
import UserInfo from '../core/common/UserInfo';
import Constants from '../core/common/constants.js';

export default Reflux.createStore({
    //监听所有的actions
    listenables: [actions],

    //on开头的都是action触发后的回调函数
    onListTypeChange(index, name) {
        //更新状态（就是个对象）
        this.data.listType.index = index;
        this.data.listType.name = name;
        this.trigger(this.data);
    },
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
        canExport: false,
        tempUrl: CONFIG.APIS.clueTemplate,
        importUrl: CONFIG.APIS.importCluesExcel,
        /*startUpload: false,
        percentage: 0,*/
        showFilterLayer: false,
        listType: Constants.clueListTypesLang[0], //当前选中的列表类型
        clueSourceList: [],
        staffList: [],
        Permit:UserInfo.getRolePermit(),
        queryParam: { //初始化过滤参数
            "needs": "",
            "q": "",
            "sourceId": 0,
            "staffId": 0,
            "pageNo": 1,
            "pageSize": 10,
        },
        tableData: {
            url: CONFIG.APIS.myClue,
            tableName: 'clue',
            th: [ //列表表头
                {
                    name: '需求',
                    width: 120
                }, {
                    name: '客户',
                    width: 250
                }, {
                    name: '线索来源',
                    width: 80
                }, {
                    name: '创建时间',
                    width: 120
                },{
                    name: '最后跟进时间',
                    width: 120
                }, {
                    name: '责任人',
                    width: 60
                }, {
                    name: '状态',
                    width: 60
                }
            ],
            tr: ['needs', 'customerName', 'sourceName', 'createdOn', 'lastOperatedOn', 'ownerStaffName', 'statusName'] //列表每列显示属性定义
        },
        totalSize: 0

    }

});