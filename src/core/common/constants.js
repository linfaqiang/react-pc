/**
 * @file app全局通用常量文件
 * @author baddyzhou
 * @desc  如果无特殊情况,不得另起配置文件
 */
define(function(require, exports, module) {

    var lang = "cn";

    var Constants = {};

    /**
     * 客户模块常量
     */
    var customer = {};
    customer.customer = {
        "cn": "客户",
        "en": "customer"
    };
    customer.address = {
        "cn": "地址",
        "en": "address"
    };
    customer.ownerStaff = {
        "cn": "责任人",
        "en": "owner staff"
    };
    customer.createdOn = {
        "cn": "创建时间",
        "en": "created on"
    };
    customer.lastOperatedOn = {
        "cn": "最后跟进时间",
        "en": "last operated on"
    };

    var customerLang = {};
    customerLang.customer = customer.customer[lang];
    customerLang.address = customer.address[lang];
    customerLang.ownerStaff = customer.ownerStaff[lang];
    customerLang.createdOn = customer.createdOn[lang];
    customerLang.lastOperatedOn = customer.lastOperatedOn[lang];
    Constants.customerLang = customerLang;

    var customerType = {};
    customerType.all = {
        "cn": "所有客户",
        "en": "all"
    };
    customerType.mine = {
        "cn": "我的客户",
        "en": "my customer"
    };
    customerType.recent = {
        "cn": "最近查看客户",
        "en": "recent customer"
    };
    Constants.customerType = customerType;

    /************************************************************************
     * 线索模块常量
     ************************************************************************/
    var clue = {};
    clue.clue = {
        "cn": "线索",
        "en": "clue"
    };
    clue.source = {
        "cn": "线索来源",
        "en": "source"
    };
    clue.needs = {
        "cn": "需求",
        "en": "needs"
    };
    clue.customer = {
        "cn": "客户",
        "en": "customer"
    };
    clue.lastOperatedOn = {
        "cn": "最后跟进时间",
        "en": "last operated on"
    };
    clue.ownerStaff = {
        "cn": "责任人",
        "en": "owner staff"
    };
    clue.status = {
        "cn": "状态",
        "en": "status"
    };
    clue.staff = {
        "cn": "指定人员",
        "en": "staff"
    };

    var clueLang = {};
    clueLang.clue = clue.clue[lang];
    clueLang.source = clue.source[lang];
    clueLang.needs = clue.needs[lang];
    clueLang.customer = clue.customer[lang];
    clueLang.lastOperatedOn = clue.lastOperatedOn[lang];
    clueLang.ownerStaff = clue.ownerStaff[lang];
    clueLang.status = clue.status[lang];
    clueLang.staff = clue.staff[lang];
    Constants.clueLang = clueLang;

    var clueType = {};
    clueType.all = {
        "cn": "全部线索",
        "en": "all"
    };
    clueType.pending = {
        "cn": "待分配线索",
        "en": "pending"
    };
    clueType.mine = {
        "cn": "我的线索",
        "en": "my clue"
    };
    clueType.today = {
        "cn": "今日线索",
        "en": "today clue"
    };
    clueType.opened = {
        "cn": "未关闭线索",
        "en": "opened clue"
    };
    clueType.closed = {
        "cn": "已关闭线索",
        "en": "closed clue"
    };
    clueType.pool = {
        "cn": "线索池",
        "en": "pool"
    };
    var clueListTypesLang = [{
        name: clueType.all[lang],
        index: 0
    }, {
        name: clueType.pending[lang],
        index: 1
    }, {
        name: clueType.mine[lang],
        index: 2
    }, {
        name: clueType.today[lang],
        index: 3
    }, {
        name: clueType.opened[lang],
        index: 4
    }, {
        name: clueType.closed[lang],
        index: 5
    }, {
        name: clueType.pool[lang],
        index: 6
    }];
    Constants.clueListTypesLang = clueListTypesLang;

    /************************************************************************
     * 线索模块常量
     ************************************************************************/
    var linkman = {};
    linkman.linkman = {
        "cn": "联系人",
        "en": "linkman"
    };



    var linkmanLang = {};
    linkmanLang.linkman = linkman.linkman[lang];
    Constants.linkmanLang = linkmanLang;

    /************************************************************************/


    /************************************************************************
     * 市场活动模块常量
     ************************************************************************/
    var marketing = {};
    marketing.subject = {
        "cn": "市场活动名称",
        "en": "subject"
    };
    marketing.activityType = {
        "cn": "活动类型",
        "en": "activityType"
    };
    marketing.status = {
        "cn": "状态",
        "en": "status"
    };
    marketing.startTime = {
        "cn": "开始时间",
        "en": "startTime"
    };
    marketing.endTime = {
        "cn": "结束时间",
        "en": "endTime"
    };

    var marketingLang = {};
    marketingLang.subject = marketing.subject[lang];
    marketingLang.activityType = marketing.activityType[lang];
    marketingLang.status = marketing.status[lang];
    marketingLang.startTime = marketing.startTime[lang];
    marketingLang.endTime = marketing.endTime[lang];
    Constants.marketingLang = marketingLang;

    var marketingType = {};
    marketingType.all = {
        "cn": "全部市场活动",
        "en": "all"
    };
    marketingType.done = {
        "cn": "已结束的市场活动",
        "en": "done"
    };
    marketingType.notStarted = {
        "cn": "未开始的市场活动",
        "en": "not started"
    };
    marketingType.doing = {
        "cn": "进行中的市场活动",
        "en": "doing"
    };
    Constants.marketingType = marketingType;

    var marketingListTypesLang = [{
        name: marketingType.all[lang],
        index: 0
    }, {
        name: marketingType.done[lang],
        index: 1
    }, {
        name: marketingType.notStarted[lang],
        index: 2
    }, {
        name: marketingType.doing[lang],
        index: 3
    }];
    Constants.marketingListTypesLang = marketingListTypesLang;
    /************************************************************************/

    /************************************************************************
     * 竞争对手模块常量
     ************************************************************************/
    var competitor = {};
    competitor.competitorName = {
        "cn": "竞争对手名称",
        "en": "competitorName"
    };
    competitor.addressId = {
        "cn": "地址",
        "en": "addressId"
    };
    competitor.competitorPhone = {
        "cn": "电话",
        "en": "competitorPhone"
    };
    competitor.totalAmount = {
        "cn": "竞争总额",
        "en": "totalAmount"
    };


    var competitorLang = {};
    competitorLang.competitorName = competitor.competitorName[lang];
    competitorLang.addressId = competitor.addressId[lang];
    competitorLang.competitorPhone = competitor.competitorPhone[lang];
    competitorLang.totalAmount = competitor.totalAmount[lang];
    Constants.competitorLang = competitorLang;

    var competitorType = {};
    competitorType.all = {
        "cn": "全部竞争对手",
        "en": "all"
    };
    Constants.competitorType = competitorType;

    var competitorListTypesLang = [{
        name: competitorType.all[lang],
        index: 0
    }, ];
    Constants.competitorListTypesLang = competitorListTypesLang;
    /************************************************************************/
    /************************************************************************
     * 报价模块常量
     ************************************************************************/
    var price = {};
    price.quotationName = {
        "cn": "报价名称",
        "en": "quotationName"
    };
    price.chanceName = {
        "cn": "销售机会名称",
        "en": "chanceName"
    };
    price.statusText = {
        "cn": "状态",
        "en": "statusText"
    };
    price.approavalText = {
        "cn": "是否已审批",
        "en": "isApproval"
    };
    price.amount = {
        "cn": "报价金额",
        "en": "amount"
    };
    price.overdueDate = {
        "cn": "过期日",
        "en": "overdueDate"
    };
    price.createdName = {
        "cn": "责任人",
        "en": "createdName"
    };


    var priceLang = {};
    priceLang.quotationName = price.quotationName[lang];
    priceLang.chanceName = price.chanceName[lang];
    priceLang.statusText = price.statusText[lang];
    priceLang.approavalText = price.approavalText[lang];
    priceLang.amount = price.amount[lang];
    priceLang.overdueDate = price.overdueDate[lang];
    priceLang.createdName = price.createdName[lang];
    Constants.priceLang = priceLang;

    var priceType = {};
    priceType.all = {
        "cn": "全部报价",
        "en": "all"
    };
    priceType.proposed = {
        "cn": "拟定",
        "en": "proposed"
    };
    priceType.replyIn = {
        "cn": "审批中",
        "en": "reply in"
    };
    priceType.approving = {
        "cn": "已同意",
        "en": "approving"
    };
    priceType.refuse = {
        "cn": "已拒绝",
        "en": "refuse"
    };

    Constants.priceType = priceType;

    var listType = {};//报价列表页，列表类型
    listType.all = {
        "cn": "全部报价",
        "en": "all"
    };
    listType.mine = {
        "cn": "我的报价",
        "en": "mine"
    };
    listType.approval = {
        "cn": "报价审批",
        "en": "approval"
    };
    Constants.listType = listType;

    var priceListTypesLang = [{
        name: listType.all[lang],
        index: 0
    }, {
        name: listType.mine[lang],
        index: 1
    }, {
        name: listType.approval[lang],
        index: 2
    }];
    Constants.priceListTypesLang = priceListTypesLang;
    /************************************************************************/


    /************************************************************************ 
     * 正则表达式
     * 其它通用验证参照：http://bv.doc.javake.cn/validators/
     *************************************************************************/
    var reg = {};
    reg.mobile = "^(0?86)?1[\d]{10}$";
    reg.phone = "^0\d{2,3}-?\d{7,8}$";
    reg.certificate = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    Constants.reg = reg;



    window.Constants = Constants;
    return Constants;
});