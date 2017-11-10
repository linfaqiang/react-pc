/**
 * @file app全局通用配置文件
 * @author baddyzhou
 * @desc  如果无特殊情况,不得另起配置文件
 */
define(function(require, exports, module) {

    var CONFIG = {};
    var serviceList = [
        'http://192.168.1.105:8181/api/', // 0开发环境地址
        'http://192.168.8.24:8081/crm-web/', //1 24环境地址
        'http://localhost:8081/crm-web/', //2 开发环境地址
        'http://192.168.8.20:8081/crm-web/', //3 测试环境地址
        'http://192.168.14.155:8081/crm-web/', //4 龚京静
        'http://192.168.14.58:8080/crm-web/', //5 姚概 
        'http://192.168.14.133:8080/crm-web/', //6 周宝*/
        'http://test.coracle.com:8386/crm-web/', //7 20环境外网地址
        'http://192.168.8.27:8081/crm-web/', //8 UAT环境内网网地址
        'http://app.kingnode.com:10111/crm-web/', //9 UAT环境外网地址
        'http://mi.coracle.com:10001/crm-web/', //10 生产环境环境外网地址 
        'http://192.168.8.209:8080/crm-web/', //11 黄家开
        'http://192.168.12.244:8080/crm-web/', //12
        'http://192.168.13.254:8081/crm-web/', //13 创意玩家 龚京静
        'http://192.168.9.117:8080/crm-web/', //14康美项目117
        'http://test.coracle.com:6081/crm-web/', //15云智慧演示版本
        'http://192.16.8.127:8081/crm-web/', //16康美项目127
        'http://crm.kmhealthcloud.com:20000/crm-web/', //17康美项目 外网
    ];
    var version = {
        "standard": {//标准版
            "exclude": {//标准版排除的功能
                "competitor": "competitor",
                "clue": "clue",
                "salesplan": "salesplan",
                "chance": "chance",
                "price": "price"
            }
        },
        "upgrade": {"exclude": null},//升级版
        "advanced": {"exclude": null}//高级版
    };
    var exclude = version.standard.exclude;

    var service = serviceList[0],
        APIS = {};

    // APIS.crm_pc = 'http://192.168.14.155:8081/crm-pc';
    // APIS.crm_mxm = 'http://192.168.14.60:8080/crm-mxm-web';

    //24环境地址
    // APIS.crm_pc = "http://192.168.8.24:8081/crm-pc";//24的内网网地址
    // APIS.crm_mxm = "http://192.168.8.24:8080/mxm";

    //测试环境内网地址
    // APIS.crm_pc = "http://192.168.8.20:8081/crm-pc";//20的内网网地址
    // APIS.crm_mxm = "http://192.168.8.20:8080/mxm";

    //测试环境外网地址
    // APIS.crm_pc = "http://test.coracle.com:8386/crm-pc";//20的外网地址
    // APIS.crm_mxm = "http://test.coracle.com:8386/mxm";//测试环境外网地址

    //康美117
    // APIS.crm_pc = "http://192.168.9.117:8080/crm-pc";//康美1
    // APIS.crm_mxm = "http://192.168.9.117:8081/mxm";

    //康美127
    // APIS.crm_pc = "http://192.16.8.127:8081/crm-pc";//康美2
    // APIS.crm_mxm = "http://192.16.8.127:8080/mxm";

    //康美 外网
    APIS.crm_pc = "http://192.168.1.105:8181/pc";//外网
    APIS.crm_mxm = "http://192.168.1.105:8180/mxm";

    //云智慧
    // APIS.crm_pc = "http://test.coracle.com:6081/crm-pc";
    // APIS.crm_mxm = "http://test.coracle.com:6081/mxm";

    //UAT环境外网地址
    // APIS.crm_pc = "http://app.kingnode.com:10111/crm-pc";//UAT环境外网地址
    // APIS.crm_mxm = "http://app.kingnode.com:10111/mxm";

    //生产环境
    // APIS.crm_pc = "http://mi.coracle.com:10001/crm-pc";
    // APIS.crm_mxm = "http://mi.coracle.com:10001/mxm";
    
    /*线索模块下载：http://localhost:8081/crm-web/v1/file/clueTemplate.xlsx
     客户模块下载：http://localhost:8081/crm-web/v1/file/customerTemplate.xlsx
     商机模块下载：http://localhost:8081/crm-web/v1/file/chanceTemplate.xlsx
    * */
    APIS.clueTemplate = service+'file/clueTemplate.xlsx';
    APIS.customerTemplate = service+'file/customerTemplate.xlsx';
    APIS.chanceTemplate = service+'file/chanceTemplate.xlsx';

    APIS.qr_code = APIS.crm_mxm + "/qrcode/num";//获取二维码
    APIS.checkIsLogin = APIS.crm_mxm + "/qrcode/check-num";//多频页面检查是否扫描过改二维码

    /**
     * 图片根路径
     */
    APIS.img_path = APIS.crm_pc;

    /**
     * 登录接口
     * @type {string}
     */
    APIS.login = service + "v1/login";

    /**
     * 首页搜索
     * @type {string} q 搜索关键词
     */
    APIS.advSearch = service + "v1/adv_search";

    /**
     * 退出接口
     * @type {string}
     */
    APIS.logout = service + "v1/logout";

    /**
     * 是否是leader
     * @type {string}
     */
    APIS.is_leader = service + "v1/staffs/get-is-leader";

    /**
     * 数据字典
     */
    APIS.data_wordbook = service + "v1/dicts/";

    /**
     * 消息列表
     * @type {string}
     */
    APIS.message_list = service + "v1/messages";

    /**
     * 所有员工
     * @type {string}
     */
    APIS.person_list = service + "v1/staffs";

    /**
     * 备注列表
     * @type {string}
     */
    APIS.notes_list = service + "v1/remarks/{type}/{id}";

    /**
     * 备注 新建、编辑
     * @type {string}
     */
    APIS.notes_add = service + "v1/remarks";

    /**
     * 附件上传
     */
    APIS.upload_file = service + "v1/upload";

    /**
     * 权限下的部门与员工
     * @type {string}
     */
    APIS.leader_dept_emp = service + "v1/staffs/get-all-dept-staff";

    /**
     * 权限下的部门
     * @type {string}
     */
    APIS.dept_list = service + "v1/staffs/subordinates_dept";

    /**
     * 部门下员工
     * @type {string}
     */
    APIS.dept_emp_list = service + "v1/departments/{id}/staffs";

    /**
     * 获取当前用户所属部门的所有领导
     * @type {string}
     */
    APIS.get_lead = service + "v1/staffs/get-all-leader";

    /**
     * 客户、线索、竞争对手联系人详情
     * @type {string}
     */
    APIS.contact_detail = service + "v1/linkman";

    /**
     * @name  测试列表带图标和不带图标的
     * @api   /api/v2/employee/login
     * @param {String} userName
     * @param {String} password
     * @example {userName:'huangjun',password:'111111'}
     * @method POST
     * @Content-Type application/json
     */
    APIS.test = service + 'crm-listsingle/crm-listJson.json';

    /**
     * @name  测试收缩展开列表
     * @api   /api/v2/employee/login
     * @param {String} userName
     * @param {String} password
     * @example {userName:'huangjun',password:'111111'}
     * @method POST
     * @Content-Type application/json
     */
    APIS.test = service + 'crm-detail/crm-detail.json';
    /**
     * @name  测试时间轴
     * @api   /api/v2/employee/login
     * @param {String} userName
     * @param {String} password
     * @example {userName:'huangjun',password:'111111'}
     * @method POST
     * @Content-Type application/json
     */
    APIS.timeList = service + 'crm-timeList/crm-timeList.json';
    /**
     * @name  测试市场活动
     * @api   /api/v2/employee/login
     * @param {String} userName
     * @param {String} password
     * @example {userName:'huangjun',password:'111111'}
     * @method POST
     * @Content-Type application/json
     */
    APIS.market = service + 'crm-market/crm-activity.json';
    /**
     * @name  测试市场活动详情
     * @api   /api/v2/employee/login
     * @param {String} userName
     * @param {String} password
     * @example {userName:'huangjun',password:'111111'}
     * @method POST
     * @Content-Type application/json
     */
    APIS.choose = service + 'crm-market/choose.json';
    /**
     * @name  测试市场管理
     * @api   /api/v2/employee/login
     * @param {String} userName
     * @param {String} password
     * @example {userName:'huangjun',password:'111111'}
     * @method POST
     * @Content-Type application/json
     */
    APIS.manage = service + 'crm-marketManage/crm-manage.json';
    /**
     * @name  测试市场管理详情
     * @api   /api/v2/employee/login
     * @param {String} userName
     * @param {String} password
     * @example {userName:'huangjun',password:'111111'}
     * @method POST
     * @Content-Type application/json
     */
    APIS.details = service + 'crm-marketManage/details.json';
    /**
     * @name  测试市场管理详情
     * @api   /api/v2/employee/login
     * @param {String} userName
     * @param {String} password
     * @example {userName:'huangjun',password:'111111'}
     * @method POST
     * @Content-Type application/json
     */
    APIS.analysis = service + 'crm-marketAnalysis/crm-analysis.json';

    /**
     * @name  测试市场活动
     * @api   /api/v2/employee/login
     * @param {String} userName
     * @param {String} password
     * @example {userName:'huangjun',password:'111111'}
     * @method POST
     * @Content-Type application/json
     */
    APIS.newtast = service + 'crm-newTast/crm-newTast.json';


    /**
     * @name  tab选项卡
     * @api   /api/v2/employee/login
     * @param {String} userName
     * @param {String} password
     * @example {userName:'huangjun',password:'111111'}
     * @method POST
     * @Content-Type application/json
     */
    APIS.tab = service + 'crm-tab/crm-tabStore.json';
    /**
     * @name  新建
     * @api   /api/v2/employee/login
     * @param {String} userName
     * @param {String} password
     * @example {userName:'huangjun',password:'111111'}
     * @method POST
     * @Content-Type application/json
     */
    APIS.newPage = service + 'crm-new/crm-newStore.json';

    /**
     * @name  新建客户   欢欢
     * @api
     * @param {String} userName
     * @param {String} password
     * @example {userName:'huangjun',password:'111111'}
     * @method POST
     * @Content-Type application/json
     */
    APIS.newCustomer = service + 'crm-tab/crm-tabStore.json';
    /**
     * @name  获取所有客户
     * @api
     * @param {String} q        搜索关键词
     * @param {Number} pageNo
     * @param {Number} pageSize
     * @example v1/customers/getAll?pageNo=1&pageSize=10&q=深圳
     * @method GET
     * @Content-Type application/json
     */
    APIS.getAllCustomer = service + 'v1/customers/getAll';
    /**
     * @name 客户销售团队
     */
    APIS.customer_team = service + 'v1/customers/{id}/sale_teams';

    /**
     * 客户销售团队 新建
     * @type {string}
     */
    APIS.customer_team_add = service + "v1/customer_sale_teams";

    /**
     * 客户销售团队 新建 删除
     * @type {string}
     */
    APIS.customer_team_delete = service + "v1/customer_sale_teams/{id}";

    /**
     * 客户销售团队 新建 设置祝联系人
     * @type {string}
     */
    APIS.customer_team_main = service + "v1/customer_sale_teams/{id}";

    /**
     * 客户地图搜索
     * @type {string}
     */
    APIS.customer_map = service + "v1/customers/map";

    /**
     * @name  我的客户   欢欢
     * @api
     * @param {String} userName
     * @param {String} password
     * @example {userName:'huangjun',password:'111111'}
     * @method POST
     * @Content-Type application/json
     */
    APIS.customer = service + 'v1/customers/search';

    /**
     * @name  客户等级   欢欢
     * @api
     * @param {String} userName
     * @param {String} password
     * @example {userName:'huangjun',password:'111111'}
     * @method POST
     * @Content-Type application/json
     */
    APIS.customerSource = service + 'customer/customer-source.json';

    /**
     * @name  客户详情   欢欢
     * @api
     * @param {String} userName
     * @param {String} password
     * @example {userName:'huangjun',password:'111111'}
     * @method POST
     * @Content-Type application/json
     */
    APIS.customerDetail = service + 'v1/customers/';
    APIS.importCustomerExcel = service + 'v1/customers/import-excel';
    APIS.exportCustomerExcel = service + 'v1/customers/export-excel';
    APIS.focusCustomer = service + 'v1/customers/focus?customerId={customerId}';
    APIS.cancelFocusCustomer = service + 'v1/customers/cancel-focus?customerId={customerId}';
    APIS.customerRelativeClues = service + 'v1/clues/opened?customerId={customerId}';

    /**
     * 位置纠偏
     * @type {string}
     */
    APIS.customer_update_address = service + "v1/address";

    /**
     * 客户联系人接口 get
     * @type {string}
     */
    APIS.customer_contact = service + "v1/customers/{id}/linkman";

    /**
     * 客户 跟进记录
     * @type {string}
     */
    APIS.customer_follow = service + "v1/customers/{id}/tracks";

    /**
     * @name  客户详情-tab根据记录列表   欢欢
     * @api
     * @param {String} userName
     * @param {String} password
     * @example {userName:'huangjun',password:'111111'}
     * @method POST
     * @Content-Type application/json
     */
    APIS.customerTab1 = service + 'customer/tab-list.json';

    /**
     * @name  线索   lism
     */
    //APIS.clueDetail = service + 'clues-distribute/clue-detail.json';
    APIS.clue = service + 'v1/clues';

    /**
     * @name  线索分配部门 or 员工list   lism
     */
    APIS.detpOrStaffList = service + 'v1/staffs/';

    /**
     * @name  获取部门员工    lism
     */
    APIS.detpStaffs = service + 'v1/departments/';

    /**
     * @name  线索详情tab   lism
     */
    APIS.clueTabList = service + 'clues-distribute/tab-list.json';


    /**
     * @name  线索管理列表   lism
     */
    APIS.myClue = service + 'v1/clues/staff';

    /**
     * @name  新增线索跟进记录   lism
     */
    APIS.clueTracks = service + 'v1/clue_tracks';

    /**
     * @name  客户分配列表   欢欢
     * @api
     * @param {String} userName
     * @param {String} password
     * @example {userName:'huangjun',password:'111111'}
     * @method POST
     * @Content-Type application/json
     */
    APIS.distribution = service + 'v1/customers/leader';

    /**
     * 线索联系人 新建、编辑
     * @type {string}
     */
    APIS.clue_contact_save = service + "v1/clue_linkmen";
    APIS.clue_linkmen_notes = service + 'v1/remarks/remarkList/clue_linkman/{id}';

    /**
     * 线索联系人 新建、编辑
     * @type {string}
     */
    APIS.clue_contact_head_save = service + "v1/clue_linkmen/{id}/headPhoto";

    /**
     * 商机  hj
     * @type {string}
     */
    APIS.chance_list = service + 'v1/chances/search';
    APIS.importChancesExcel = service + 'v1/chances/import-excel';
    APIS.exportChancesExcel = service + 'v1/chances/export-excel';

    /**
     * 商机 详情 hj
     * @type {string}
     */
    APIS.chance_detail = service + 'v1/chances/';

    /**
     * 商机 新建、编辑 hj
     * @type {string}
     */
    APIS.chance_add = service + 'v1/chances';

    /**
     * 商机 新建、编辑 hj
     * @type {string}
     */
    APIS.finished_stage_task = service + 'v1/chances/{id}/finished-task/{stageId}';

    /**
     * 商机 跟进记录 hj
     * @type {string}
     */
    APIS.chance_follow = service + "v1/chances/{id}/tracks";

    /**
     * 商机 任务列表
     * @type {string}
     */
    APIS.chance_task = service + "v1/chances/{id}/chance_sale_tasks";

    /**
     * 商机 销售产品 hj
     * @type {string}
     */
    APIS.chance_product = service + "v1/chances/{id}/products";

    /**
     * 商机 新增、编辑、删除销售产品 hj
     * @type {string}
     */
    APIS.chance_product_save = service + "v1/chance_products";

    /**
     * 商机 销售产品 对手(get)、新增对手(post) hj
     * @type {string}
     */
    APIS.chance_product_rival = service + "v1/chance_products/{id}/competitors";

    /**
     * 商机 销售报价 hj
     * @type {string}
     */
    APIS.chance_salesPrice = service + "v1/chances/{id}/quotations";

    /**
     * 商机 联系人列表、添加商机联系人 hj
     * @type {string}
     */
    APIS.chance_contact = service + "v1/chances/{id}/linkmans";

    /**
     * 商机联系人 删除
     * @type {string}
     */
    APIS.chance_contact_delete = service + "v1/chance_linkman/{id}";

    /**
     * 商机 阶段列表 任务个数
     * @type {string}
     */
    APIS.chance_stage = service + "v1/chances/{id}/stage_task_count";

    /**
     * 商机 阶段任务
     * @type {string}
     */
    APIS.chance_stage_task = service + "v1/chances/{id}/stage_task_results";

    /**
     * 商机 修改阶段任务状态
     * @type {string}
     */
    APIS.chance_update_stage_task_status = service + "v1/stage_task_results/{id}";

    /**
     * 商机 新增阶段任务
     * @type {string}
     */
    APIS.chance_update_stage_task = service + "v1/chances/stage_task";

    /**
     * 商机 销售团队 hj
     * @type {string}
     */
    APIS.chance_team = service + "v1/chances/{id}/sale_teams";

    /**
     * 商机 销售团队 新增 hj
     * @type {string}
     */
    APIS.chance_team_add_save = service + "v1/chance_sale_teams";

    /**
     * 商机 销售团队 设置主责任人 hj
     * @type {string}
     */
    APIS.chance_team_main = service + "v1/chance_sale_teams/{id}";

    /**
     * 商机 销售团队 删除成员 hj
     * @type {string}
     */
    APIS.chance_team_delete = service + "v1/chance_sale_teams/{id}";

    /**
     * 商机 销售竞争对手 hj
     * @type {string}
     */
    APIS.chance_rival = service + "v1/chances/{id}/competitors";

    /**
     * 商机 新增竞争对手 hj
     * @type {string}
     */
    APIS.chance_rival_save = service + "v1/chances/{id}/competitors";

    /**
     * 商机 竞争对手 更新优劣势、删除(delete) hj
     * @type {string}
     */
    APIS.chance_rival_good_bad = service + "v1/chance_competitors/{id}";

    /**
     * 商机 删除(delete)产品机会 hj
     * @type {string}
     */
    APIS.chance_delete_product_rival = service + "v1/chance_competitors/product/{id}";

    /**
     * 联系人列表、新建、编辑 hj
     * @type {string}
     */
    APIS.contact_list = service + "v1/customer_linkmen";

    /**
     * 查询联系人相关的商机（联系人详情页面）
     * @type {string}
     */
    APIS.contact_chance = service + "v1/customer_linkmen/{id}/chances?pageSize={pageSize}&pageNo={pageNo}";

    /**
     * 查询联系人相关的任务（联系人详情页面）
     * @type {string}
     */
    APIS.contact_task = service + "v1/customer_linkmen/{id}/tasks?pageSize={pageSize}&pageNo={pageNo}";

    /**
     * 查询联系人相关的未完成任务（联系人详情页面）
     * @type {string}
     */
    APIS.contact_undonetask = service + "v1/customer_linkmen/{id}/tasks?undone=1&pageSize={pageSize}&pageNo={pageNo}";

    /**
     * 查询联系人相关的跟踪记录（联系人详情页面）
     * @type {string}
     */
    APIS.contact_track = service + "v1/customer_linkmen/{id}/tracks?pageSize={pageSize}&pageNo={pageNo}";

    /**
     * 联系人 修改头像 hj
     * @type {string}
     */
    APIS.contact_update_head = service + "v1/customer_linkmen/headPhoto";

    /**
     * 销售报价  lism
     * @type {string}
     */
    APIS.clue = service + 'v1/clues';
    APIS.price_list = service + 'salesPrice/json/list.json';
    /**
     * 任务管理  zhaomf
     * @type {string}
     */
    APIS.tast_list = service + 'tastManage/json/list.json';
    /**
     * 任务详情  zhaomf
     * @type {string}
     */
    APIS.tast_detail = service + 'tastManage/json/clue-detail.json';

    /**
     * 销售活动列表
     */
    APIS.activity_list = service + "v1/sale_activities/list";

    /**
     * 销售活动详情
     */
    APIS.activity_detail = service + "v1/sale_activities/";

    /**
     * 新建、编辑活动
     */
    APIS.activity_add = service + "v1/sale_activities";

    /**
     * 线索池列表  lism
     *
     */
    APIS.clue_pool_lists = service + 'v1/clues/pool';

    /**
     * 线索池详情 抢单  lism
     *
     */
    //APIS.clue_pool_lists = service + 'v1/clues/';

    /**
     * 线索新增  lism
     * 
     */
    //APIS.clue_add = service + 'v1/clues/';
    /**
     * 市场活动列表接口  zmf
     * @type {string}
     */
    APIS.market_list = service + 'v1/marketing_activities';
    /**
     * 市场详情接口  zmf
     * @type {string}
     */
    APIS.market_detail = service + 'v1/marketing_activities';
    /**
     * 市场分析列表接口  zmf
     * @type {string}
     */
    APIS.analysis_list = service + 'v1/marketing_analysis';
    /**
     * 市场分析浏览次数接口  zmf
     * @type {string}
     */
    APIS.analysis_add = service + 'v1/marketing_analysis/add-readcount';
    /**
     * 市场信息列表接口  zmf
     * @type {string}
     */
    APIS.manage_list = service + 'v1/marketing_infos';

    /**
     * 产品手册列表接口  zmf
     * @type {string}
     
     */
    APIS.product_list = service + 'v1/products';
    /**
     * 产品手册关注列表接口  zmf
     * @type {string}
     
     */
    APIS.product_follows = service + 'v1/product_follows';

    /**
     * 任务管理列表接口  zmf
     * @type {string}
     */
    APIS.task_list = service + 'v1/sale_tasks';

    /**
     * 任务列表侧滑状态接口  zmf
     * @type {string}
     */
    APIS.task_result = service + 'v1/sale_task_results';

    /* 线索分配列表接口  lism
     *
     */
    APIS.clue_distribule_lists = service + 'v1/clues/leader';
    /**
     * 销售报价列表  lism
     *
     */
    APIS.sales_price_lists = service + 'v1/chance_quotations/search';
    /**
     * 销售报价详情, 编辑销售报价详情  lism
     *
     */
    APIS.sales_price_detail = service + 'v1/chance_quotations';
    /**
     * 销售报价详情-审批记录列表  lism
     * v1/chance_quotations/{id}/approvals
     */
    APIS.sales_price_detail_approvalsList = service + 'v1/chance_quotations/';

    /**
     * 工作报告
     * @type {string}
     */
    APIS.work_report_list = service + 'v1/my_reports/search';

    /**
     * 工作报告详情
     * @type {string}
     */
    APIS.work_report_detail = service + 'v1/my_reports/';

    /**
     * 工作报告详情--回复
     * @type {string}
     */
    APIS.work_report_comment = service + 'v1/my_reports/{id}/comment';

    /**
     * 工作报告 新建、编辑
     * @type {string}
     */
    APIS.work_report_add = service + 'v1/my_reports';

    /**
     * 工作报告 获取全部
     * @type {string}
     */
    APIS.work_report_getall = service + 'v1/my_reports/all';
    APIS.exportWorkReport = service + 'v1/my_reports/export-excel';

    /**
     * 获取跟进记录列表
     * @type {string}
     */
    APIS.get_sign_Record = service + 'v1/staff_signs';


    APIS.competitor = service + 'v1/competitors';
    /*
     * 竞争对手 列表
     * @type {string}
     */
    APIS.competitors_list = service + 'v1/competitors';
    /**
     * 竞争对手 详情 新增 编辑
     * @type {string}
     */
    APIS.competitors_detail = service + 'v1/competitors/';

    /**
     * 竞争对手联系人 新建、编辑
     * @type {string}
     */
    APIS.competitors_contact_save = service + "v1/competitors_linkman";

    /**
     * 销售计划
     * @type {string}
     */
    APIS.sale_plans = service + 'v1/sale_plans';

    /**
     * 销售计划详情
     * @id type {string} 销售计划id
     */
    //APIS.saleplansDetail = service + 'v1/sale_plans/planAndAssignDetail/';
    APIS.saleplansDetail = service + 'v1/sale_plans/pc/';

    /**
     * 日程
     * @type {string}
     */
    APIS.schedule = service + 'v1/my_schedules';
    /**
     * 日程详情
     * @type {string}
     */
    APIS.schedule_detail = service + 'v1/my_schedules/';
    /**
     * 销售报表
     * @type {string}
     */
    APIS.sales_report = service + 'v1/reports/';
    /**
     * 客户分配
     * @type {string}
     */
    APIS.custormer_distribute = service + 'v1/customers/';
    /**
     *数据字典-客户等级
     * @type {string}
     */
    APIS.custormerLeval = service + 'v1/dicts/DictCustomerLevel';
    /**
     * 数据字典-行业信息
     * @type {string}
     */
    APIS.custormerIndustry = service + 'v1/dicts/DictIndustry';
    /**
     * 数据字典-商机类别
     * @type {string}
     */
    APIS.chanceType = service + 'v1/dicts/DictStageType';

    /**
     * 数据字典-商机类别
     * @type {string}
     */
    APIS.dict_stage = service + 'v1/dicts/DictStage';


    /**
     * 员工、联系人搜索
     * @type {string}
     */
    APIS.search_contact_staff = service + "v1/adv_search/contact_list";

    /**
     * 客户、商机、线索搜索
     * @type {string}
     */
    APIS.search_function_list = service + "v1/adv_search";


    APIS.price = service + 'v1/chance_quotations/search';
    /**
     * 报价审批-列表  lism
     * @type {string}
     */
    APIS.priceApproval_list = service + "v1/chance_quotations/approvals";

    /**
     * 报价审批-审批操作  lism
     * @type {string}
     */
    APIS.priceApproval = service + "v1/chance_quotation_approvals";

    /**
     * 销售漏斗 图表
     * @type {string}
     */
    APIS.funnel_charts = service + "v1/reports/sales_funnel_pc";

    /**
     * 销售漏斗 数据列表
     * @type {string}
     */
    APIS.funnel_lists = service + "v1/reports/sales_funnel_list";

    /**
     * 销售漏斗 数据列表 导出
     * @type {string}
     */
    APIS.funnel_lists_export = service + "v1/reports/export-sale-excel";

    /**
     * 商机阶段持续时间分析 图表
     * @type {string}
     */
    APIS.convert_rate_charts = service + "v1/reports/sales_conversion_rate_pc";

    /**
     * 商机阶段持续时间分析 数据列表
     * @type {string}
     */
    APIS.convert_rate_lists = service + "v1/reports/sales_conversion_rate_list";

    /**
     * 商机阶段持续时间分析 数据列表 导出
     * @type {string}
     */
    APIS.convert_rate_lists_export = service + "v1/reports/export-sale-conversion-excel";


    /**********************以下为PC版新增*******************************/
    /**
     * 获取所有字典
     * @type {string}
     */
    APIS.dists_list = service + "v1/dicts";

    /**
     * 获取当前员工的直接及间接下属
     * @type {string}
     */
    APIS.staffs_subs = service + "v1/staffs/subs";

    /**
     * 获取当前员工的直接及间接部门
     * @type {string}
     */
    APIS.dept_subs = service + "v1/staffs/subordinates_dept";

    /**
     * 获取所有员工
     * @type {string}
     */
    APIS.staffs_all = service + "v1/staffs/all";

    /**
     * 客户联系人
     * @type {string}
     */
    APIS.customer_linkmen = service + "v1/customer_linkmen";

    /**
     * 获取我的客户
     * @type {string}
     */
    APIS.myCustomer_list = service + "v1/customers";

    /**
     * 获取所有客户
     * @type {string}
     */
    APIS.get_all_customer_list = service + "v1/customers/get_all_list";

    /**
     * 商机 新增竞争对手 hj
     * @type {string}
     */
    APIS.chance_rival_save_pc = service + "v1/chances/{id}/competitors-pc";

    /**
     * 获取备注文本列表
     * @type {string}
     */
    APIS.remark_text_list = service + "v1/remarks/remarkList/{type}/{id}";

    /**
     * 获取备注附件列表
     * @type {string}
     */
    APIS.remark_files_list = service + "v1/remarks/fileRemarkList/{type}/{id}";

    var clue_list_url = [];
    clue_list_url[0] = service + "v1/clues/all"; //全部线索
    clue_list_url[1] = service + "v1/clues/leader"; //待分配线索
    clue_list_url[2] = service + "v1/clues/mine"; //我的线索
    clue_list_url[3] = service + "v1/clues/today"; //今日线索
    clue_list_url[4] = service + "v1/clues/opened"; //未关闭线索
    clue_list_url[5] = service + "v1/clues/closed"; //已关闭线索
    clue_list_url[6] = service + "v1/clues/pool"; //线索池
    APIS.clue_list_url = clue_list_url;

    var marketing_list_url = [];
    marketing_list_url[0] = service + "v1/marketing_activities"; //全部
    marketing_list_url[1] = service + "v1/marketing_activities/doneActivityList"; //
    marketing_list_url[2] = service + "v1/marketing_activities/notStartActivityList"; //
    marketing_list_url[3] = service + "v1/marketing_activities/doingActivityList";

    APIS.marketing_list_url = marketing_list_url;

    var price_list_url = [];
    //我的报价列表 Method:POST
    price_list_url[0] = service + "v1/chance_quotations/search"; //全部
    price_list_url[1] = service + "v1/chance_quotations/search/proposed"; //拟定
    price_list_url[2] = service + "v1/chance_quotations/search/replyIn"; //审批中
    price_list_url[3] = service + "v1/chance_quotations/search/approving"; //已同意
    price_list_url[4] = service + "v1/chance_quotations/search/refuse"; //已拒绝
    //报价审批列表 Method:GET
    price_list_url[5] = service + "v1/chance_quotations/approvals"; //未审批
    //全部报价列表 Method:POST
    price_list_url[6] = service + "v1/chance_quotations/findAllList_new" //全部报价
        //price_list_url[6] = service + "v1/chance_quotations/approvals?isApproved=1&q=&pageNo=1&pageSize=10"; //已审批

    APIS.price_list_url = price_list_url;


    var competitor_list_url = [];
    competitor_list_url[0] = service + "v1/competitors"; //列表

    APIS.competitor_list_url = competitor_list_url;
    APIS.importCluesExcel = service+ 'v1/clues/import-excel';//线索导入
    APIS.exportCluesExcel = service+ 'v1/clues/export-excel';//线索导出

    /**
     * 销售计划,for PC
     * @type {string}
     */
    APIS.sale_plans_all = service + 'v1/sale_plans/all';
    /**
     * 销售计划保存,for PC
     * @type {string}
     */
    APIS.sale_plans_pc = service + 'v1/sale_plans/pc';
    /**
     * 获取直属部门及直属员工
     */
    APIS.staffs_direct_reports = service + 'v1/staffs/direct_reports';

    /**
     * 线索联系人
     */
    APIS.clue_linkmen = service + 'v1/clue_linkmen';

    /**
     * 权限菜单
     */
    APIS.menuList = service + 'v1/menus';
    /**
     * 市场分析列表接口
     */
    APIS.marketingAnalysis = service + 'v1/marketing_analysis';


    /**
     * 商机产品竞争对手详情  for Pc
     * @type {string}
     */
    APIS.chance_product_rival_detail = service + "v1/chance_products/competitors/{id}";

    /**
     * 商机产品竞争对手详情  for Pc
     * @type {string}
     */
    APIS.update_password = service + "v1/staff_accounts/update-psw/{loginName}";

    /**
     * 联系人
     */
    APIS.linkman = service + 'v1/linkmen';
    /**
     * 获取指定月份的所有日程信息
     */
    APIS.get_everyday = service + "v1/my_schedules/get-everyday?curDate={month}";

    /**
     * 产品分类
     * @type {string}
     */
    APIS.product_types = service + 'v1/product_types';
    /**
     * 获取公司部门组织结构树
     * @type {string}
     */
    APIS.org_dept = service + 'v1/organizations/org-dept';

    /**
     * 公告接口
     * @type {string}
     */
    APIS.notices = service + 'v1/notices';
    
    /**
     * 公告接口
     * @type {string}
     */
    APIS.products = service + 'v1/products';

    /**
     * 获取分公司列表 GET
     * @type {string}
     */
    APIS.get_org_com = service + 'v1/organizations';

    /**
     * 按周获取日程列表 GET
     * @type {string}
     */
    APIS.week_schedule = service + 'v1/my_schedules/week-schedule?pageNo={pageNo}&pageSize={pageSize}&startDate={startDate}&endDate={endDate}';
    /**
     * 报表-商机Top10
     * dimension (维度：monthly月，quarterly季度，semi-annual半年，annual年，非必填项，默认为月
     * @type {string}
     */
    APIS.chanceTop10 = service + 'v1/reports/going_chance_top';
    /**
     * 报表-工作报告日周月
     * @type {string}
     */
    APIS.work_report = service + 'v1/reports/work_report';
    /**
     * 报表-工作报告日周月导出
     * @type {string}
     */
    APIS.workReportExcel = service + 'v1/reports/export-work-report-excel';

    // 服务地址
    CONFIG.SERVICE = service;
    // API列表
    CONFIG.APIS = APIS;
    // 图片服务器地址前缀
    CONFIG.PIC = '';
    // IM通讯服务地址
    // IM通讯AppKey
    //不同版本的产品要排除的功能
    CONFIG.Exclude = exclude;
    window.CONFIG = CONFIG;
    return CONFIG;
});