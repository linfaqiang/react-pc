import Reflux from 'reflux'
import actions from '../actions'

import request from 'superagent';
import CONFIG from '../../core/common/config.js'
import AjaxRequest from '../../core/common/ajaxRequest.js'
import Dicts from '../../core/common/dicts.js'

export default Reflux.createStore({
    //监听所有的actions
    listenables: [actions],

    //on开头的都是action触发后的回调函数
    onListTypeChange(index, name) {
        //更新状态（就是个对象）
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
        trackData: {            //跟进记录
            pageNo: 1,
            pageSize: 5,
            totalSize:0
        },
        customerTrack: [],
        remarkMsg: [],
        remarkLen: 0,
        remarkFile: [],
        remarkFileLen: 0,
        linkman: [],
        linkmanLen: 0,
        assignHistory: [],
        mainInfo: [{
            name: "",
            value: "",
            color: "",
            icon: ""
        }],
        info: {
            id: 0,
            ownerStaffId: 0,
            ownerDeptId: 0,
            ownerStaffName: "",
            customerName: "",
            needs: "",
            remarkId: 0,
            remark: "",
            status: 5,
            sourceId: 0,
            sourceTxt: "",
            source: "",
            fromEntityType: "",
            inputSource: 0,
            chanceId: 0,
            chanceName: "",
            address: {
                id: 0,
                address: "",
                country: "中国",
                province: "",
                city: "",
                cityCode: "",
                adname: "",
                adcode: "",
                longitude: "",
                latitude: "",
                provinceId: "",
                cityId: ""
            },
            linkman: {
                id: 0,
                name: "",
                title: "",
                mobile: "",
                telephone: ""
            }
        }
    }


});