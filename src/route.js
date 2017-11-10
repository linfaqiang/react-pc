'use strict';
import React from 'react';
import {
    Router,
    Route,
    Link,
    Redirect,
    IndexRoute,
    hashHistory
} from 'react-router';
import CONFIG  from './core/common/config' //CONFIG.Exclude

import asyncLoader from './async-loader';

import Index from './index';
import Home from './home/main';
import Login from './login/login';

import Customer from 'bundle?lazy!./customer/Index';
import CustomerListNew from 'bundle?lazy!./customer/ListNew';
import CustomerAdd from 'bundle?lazy!./customer/Add';
import CustomerDetail from 'bundle?lazy!./customer/Detail';

import Remark from 'bundle?lazy!./remark/index';
import RemarkList from 'bundle?lazy!./remark/list';
import RemarkFileList from 'bundle?lazy!./remark/file/list';
import RemarkAdd from 'bundle?lazy!./remark/detail';
import RemarkDetail from 'bundle?lazy!./remark/detail';
import RemarkFileDetail from 'bundle?lazy!./remark/file/detail';

import Clue from 'bundle?lazy!./clue/index';
import ListNew from 'bundle?lazy!./clue/ListNew';
import ClueAdd from 'bundle?lazy!./clue/add';
import DetailIndex from 'bundle?lazy!./clue/detail/Index';
import ClueDetail from 'bundle?lazy!./clue/detail/detail';
import ClueTrack from 'bundle?lazy!./clue/detail/track';
import ClueAssignStaffList from 'bundle?lazy!./clue/detail/staff';
import ClueToChance from 'bundle?lazy!./clue/detail/chance';

import ClueLinkmanIndex from 'bundle?lazy!./clue/linkman/Index';
import ClueLinkmanList from 'bundle?lazy!./clue/linkman/list';
import ClueLinkmanDetail from 'bundle?lazy!./clue/linkman/detail';
import ClueLinkmanAdd from 'bundle?lazy!./clue/linkman/add';

import Linkman from 'bundle?lazy!./linkman/index';
import LinkmanListNew from 'bundle?lazy!./linkman/listNew';
import LinkmanAdd from 'bundle?lazy!./linkman/add';
import LinkmanDetail from 'bundle?lazy!./linkman/detail';

import Salesplan from 'bundle?lazy!./Salesplan/index';
import SalesplanList from 'bundle?lazy!./Salesplan/list';
import SalesplanAdd from 'bundle?lazy!./Salesplan/addPlan';
import SalesplanDetail from 'bundle?lazy!./Salesplan/detail';

import Chance from 'bundle?lazy!./chance/Index';
import ChanceListNew from 'bundle?lazy!./chance/ListNew';
import ChanceAdd from 'bundle?lazy!./chance/Add';
import ChanceDetail from 'bundle?lazy!./chance/Detail';
import StageTask from 'bundle?lazy!./chance/StageTask';
import ChanceCompetitorList from 'bundle?lazy!./chance/competitor/List';
import ChanceCompetitorDetail from 'bundle?lazy!./chance/competitor/Detail';

import Marketing from 'bundle?lazy!./marketing/Index';
import MarketingList from 'bundle?lazy!./marketing/List';
import MarketingDetail from 'bundle?lazy!./marketing/Detail';
import MarketingAdd from 'bundle?lazy!./marketing/add';
import MarketingTaskList from 'bundle?lazy!./marketing/AllTask';
import MarketingClueList from 'bundle?lazy!./marketing/AllClue';
import MarketingChanceList from 'bundle?lazy!./marketing/AllChance';

import Document from 'bundle?lazy!./document/Index';
import DocumentList from 'bundle?lazy!./document/List';
import DocumentAdd from 'bundle?lazy!./document/Add';
import DocumentDetail from 'bundle?lazy!./document/Detail';

import Info from 'bundle?lazy!./info/Index';
import InfoList from 'bundle?lazy!./info/List';
import AddInfo from 'bundle?lazy!./info/AddInfo';
import AddNotice from 'bundle?lazy!./info/AddNotice';
import InfoDetail from 'bundle?lazy!./info/Detail';

import Price from 'bundle?lazy!./price/Index';
import PriceList from 'bundle?lazy!./price/List';
import PriceDetail from 'bundle?lazy!./price/Detail';
import PriceAdd from 'bundle?lazy!./price/Add';

import Competitor from 'bundle?lazy!./competitor/Index';
import CompetitorList from 'bundle?lazy!./competitor/List';
import CompetitorDetail from 'bundle?lazy!./competitor/Detail';
import CompetitorAdd from 'bundle?lazy!./competitor/Add';

import Product from 'bundle?lazy!./product/Index';
import ProductList from 'bundle?lazy!./product/List';
import ProductAdd from 'bundle?lazy!./product/Add';
import ProductClassList from 'bundle?lazy!./product/ClassList';

import Working from 'bundle?lazy!./working/Index';
import WorkingList from 'bundle?lazy!./working/List';
import WorkingAdd from 'bundle?lazy!./working/Add';

import Activity from 'bundle?lazy!./activity/Index';
import ActivityList from 'bundle?lazy!./activity/List';
//import ActivityAdd from 'bundle?lazy!./activity/Add';
import ActivityAdd from 'bundle?lazy!./activity/AddNew';

import Task from 'bundle?lazy!./task/Index';
import TaskListNew from 'bundle?lazy!./task/ListNew';
import TaskAdd from 'bundle?lazy!./task/Add';

import Report from 'bundle?lazy!./report/Index';
//import MyChart from 'bundle?lazy!./report/report';
import MyChart from 'bundle?lazy!./report/MyChart';
import MyReport from 'bundle?lazy!./report/ReportList';
import SalesFunnel from 'bundle?lazy!./report/SalesFunnel';
import ConvertRate from 'bundle?lazy!./report/ConvertRate';
import CustomerOverdue from 'bundle?lazy!./report/CustomerOverdue';
import WorkReport from 'bundle?lazy!./report/WorkReport';
import CheckIn from 'bundle?lazy!./report/CheckIn';
/*

 <Route name="销售漏斗" path="SalesFunnel" component={asyncLoader(SalesFunnel)}/>
 <Route name="商机阶段持续时间阶段分析" path="ConvertRate" component={asyncLoader(ConvertRate)}/>
 <Route name="客户超期未跟进" path="birthday/:id" component={asyncLoader(CustomerOverdue)}/>
 <Route name="工作报告统计" path="WorkReport" component={asyncLoader(WorkReport)}/>
 <Route name="签到报表" path="CheckIn" component={asyncLoader(CheckIn)}/>
* */
//import ReportList from 'bundle?lazy!./report/report';

import Messege from 'bundle?lazy!./messege/Index';
import MessegeList from 'bundle?lazy!./messege/List';
import MessegeDetail from 'bundle?lazy!./messege/Detail';

import Schedule from 'bundle?lazy!./schedule/Index';
import ScheduleList from 'bundle?lazy!./schedule/List';
import ScheduleDetail from 'bundle?lazy!./schedule/Detail';

const requireAuth = (nextState, replace) => {
    if(!navigator.userAgent.match('Trident')){
        var loginInfo_crm = localStorage.getItem('loginInfo_crm') || null;
        if (!loginInfo_crm) {
            replace({
                pathname: '/login',
                state: {
                    nextPathname: nextState.location.pathname
                }
            })
        }
    }
};
const toastSearch = (pPath, nextState, replace) => {
    nextState.routes.map(function(item, key){
        if(item.path && item.path==pPath){
            item.search = nextState.location.search;
        }
    });
};

module.exports = (
    <Router history={hashHistory}>
        <Route name="login" path="/login" component={Login}/>
        <Route name="首页" path="/" component={Index} onEnter={requireAuth}>
            <IndexRoute name="home" component={Home} />
            <Route name="客户" path="customer" component={asyncLoader(Customer)}>
                <IndexRoute component={asyncLoader(CustomerListNew)} />
                <Route name="新增客户" path="add/:customerId"  component={asyncLoader(CustomerAdd)}/>
                <Route name="客户详情" path=":customerId" component={asyncLoader(Customer)}>
                    <IndexRoute component={asyncLoader(CustomerDetail)} />
                    <Route name="编辑客户" path="edit"  component={asyncLoader(CustomerAdd)}/>
                    <Route name="新增活动" path="addActive"  component={asyncLoader(ActivityAdd)}/>
                    <Route name="新增任务" path="addTask"  component={asyncLoader(TaskAdd)}/>
                    <Route name="新增商机" path="addChance"  component={asyncLoader(ChanceAdd)}/>
                    <Route name="新增联系人" path="addLinkman"  component={asyncLoader(LinkmanAdd)}/>
                    <Route name="任务" path="task" component={asyncLoader(Customer)}>
                        <IndexRoute component={asyncLoader(TaskListNew)} />
                        <Route name="新增任务" path="addTask/:taskId"  component={asyncLoader(TaskAdd)}/>
                        <Route name="编辑任务" path="edit/:taskId"  component={asyncLoader(TaskAdd)}/>
                    </Route>
                </Route>
                {/*<Route name="add" path="add/:id"  component={asyncLoader(CustomerAdd)}/>
                <Route name="detail" path=":id"  component={asyncLoader(CustomerDetail)}/>*/}
            </Route>
            <Route name="线索" path="clue" component={asyncLoader(Clue)}>
                <IndexRoute component={asyncLoader(ListNew)} />
                <Route name="新增线索" path="add/:id"  component={asyncLoader(ClueAdd)}/>
                <Route name="线索详情" path=":id" component={asyncLoader(DetailIndex)}>
                    <IndexRoute component={asyncLoader(ClueDetail)} />
                    <Route name="编辑线索" path="edit"  component={asyncLoader(ClueAdd)}/>
                    <Route name="新增跟进记录" path="track"  component={asyncLoader(ClueTrack)}/>
                    <Route name="线索分配" path="assign"  component={asyncLoader(ClueAssignStaffList)}/>
                    <Route name="线索转商机" path="tochance"  component={asyncLoader(ClueToChance)}/>
                    <Route name="新增联系人" path="addLinkman/:linkmanId"  component={asyncLoader(ClueLinkmanAdd)}/>
                    <Route name="备注" path="remark" onEnter={toastSearch.bind(this, 'remark')} component={asyncLoader(ClueLinkmanIndex)}>
                        <IndexRoute component={asyncLoader(RemarkList)} />
                        <Route name="编辑备注" path=":remarkId" onEnter={toastSearch.bind(this, ':remarkId')} component={asyncLoader(RemarkDetail)}/>
                        <Route name="新增备注" path="addRemark/:fileId" onEnter={toastSearch.bind(this, 'addRemark/:fileId')} component={asyncLoader(RemarkDetail)}/>
                    </Route>
                    <Route name="附件" path="file" onEnter={toastSearch.bind(this, 'file')} component={asyncLoader(ClueLinkmanIndex)}>
                        <IndexRoute component={asyncLoader(RemarkFileList)} />
                        <Route name="编辑附件" path=":fileId" onEnter={toastSearch.bind(this, ':fileId')} component={asyncLoader(RemarkFileDetail)}/>
                        <Route name="新增附件" path="addFile/:fileId" onEnter={toastSearch.bind(this, 'addFile/:fileId')} component={asyncLoader(RemarkFileDetail)}/>
                    </Route>
                    <Route name="新增备注" path="addRemark/:remarkId" onEnter={toastSearch.bind(this, 'addRemark/:remarkId')} component={asyncLoader(RemarkDetail)}/>
                    <Route name="新增附件" path="addFile/:fileId" onEnter={toastSearch.bind(this, 'addFile/:fileId')} component={asyncLoader(RemarkFileDetail)}/>
                    <Route name="联系人" path="linkman" component={asyncLoader(ClueLinkmanIndex)}>
                        <IndexRoute component={asyncLoader(ClueLinkmanList)} />
                        <Route name="联系人详情" path=":linkmanId" component={asyncLoader(ClueLinkmanIndex)}>
                            <IndexRoute component={asyncLoader(ClueLinkmanDetail)} />
                            <Route name="编辑联系人" path="edit"  component={asyncLoader(ClueLinkmanAdd)}/>
                            <Route name="备注" path="remark" onEnter={toastSearch.bind(this, 'remark')} component={asyncLoader(ClueLinkmanIndex)}>
                                <IndexRoute component={asyncLoader(RemarkList)} />
                                <Route name="编辑备注" path=":remarkId" onEnter={toastSearch.bind(this, ':remarkId')} component={asyncLoader(RemarkDetail)}/>
                                <Route name="新增备注" path="addRemark/:fileId" onEnter={toastSearch.bind(this, 'addRemark/:fileId')} component={asyncLoader(RemarkDetail)}/>
                            </Route>
                            <Route name="附件" path="file" onEnter={toastSearch.bind(this, 'file')} component={asyncLoader(ClueLinkmanIndex)}>
                                <IndexRoute component={asyncLoader(RemarkFileList)} />
                                <Route name="编辑附件" path=":fileId" onEnter={toastSearch.bind(this, ':fileId')} component={asyncLoader(RemarkFileDetail)}/>
                                <Route name="新增附件" path="addFile/:fileId" onEnter={toastSearch.bind(this, 'addFile/:fileId')} component={asyncLoader(RemarkFileDetail)}/>
                            </Route>
                            <Route name="新增备注" path="addRemark/:remarkId" onEnter={toastSearch.bind(this, 'addRemark/:remarkId')} component={asyncLoader(RemarkDetail)}/>
                            <Route name="新增附件" path="addFile/:fileId" onEnter={toastSearch.bind(this, 'addFile/:fileId')} component={asyncLoader(RemarkFileDetail)}/>
                        </Route>
                        <Route name="新增联系人" path="add/:linkmanId"  component={asyncLoader(ClueLinkmanAdd)}/>
                    </Route>
                </Route>
                {/*<Route name="detail" path=":id"  component={asyncLoader(ClueDetail)}/>
                <Route name="track" path="track/:clueId"  component={asyncLoader(ClueTrack)}/>
                <Route name="assign" path="assign/:clueId"  component={asyncLoader(ClueAssignStaffList)}/>
                <Route name="tochance" path="tochance/:clueId"  component={asyncLoader(ClueToChance)}/>
                <Route name="linkman-detail" path="linkman/:id"  component={asyncLoader(ClueLinkmanDetail)}/>
                <Route name="linkman-add" path=":clueId/linkman/add/:id"  component={asyncLoader(ClueLinkmanAdd)}/>
                <Route name="linkman-list" path=":clueId/linkman"  component={asyncLoader(ClueLinkmanList)}/>*/}
            </Route>
            <Route name="remark" path="remark" component={asyncLoader(Remark)}>
                <IndexRoute name="list" component={asyncLoader(RemarkList)} />
                <Route name="add" path="add/:id"  component={asyncLoader(RemarkAdd)}/>
                <Route name="file-list" path="file"  component={asyncLoader(RemarkFileList)}/>
                <Route name="detail" path=":id"  component={asyncLoader(RemarkDetail)}/>
                <Route name="file-detail" path="file/:id"  component={asyncLoader(RemarkFileDetail)}/>
            </Route>
            <Route name="商机" path="chance" component={asyncLoader(Chance)}>
                <IndexRoute component={asyncLoader(ChanceListNew)} />
                <Route name="新增商机" path="add/:chanceId"  component={asyncLoader(ChanceAdd)}/>
                <Route name="商机详情" path=":chanceId"  component={asyncLoader(Chance)}>
                    <IndexRoute component={asyncLoader(ChanceDetail)} />
                    <Route name="销售阶段任务" path="stageTask/:chanceStageId" onEnter={toastSearch.bind(this, 'stageTask/:chanceStageId')} component={asyncLoader(Chance)}>
                        <IndexRoute component={asyncLoader(StageTask)}/>
                        <Route name="添加销售任务" path="addTask" onEnter={toastSearch.bind(this, 'stageTask/:chanceStageId')} component={asyncLoader(TaskAdd)}/>
                    </Route>
                    <Route name="编辑商机" path="edit"  component={asyncLoader(ChanceAdd)}/>
                    <Route name="新增联系人" path="addLinkman" onEnter={toastSearch.bind(this, 'addLinkman')} component={asyncLoader(LinkmanAdd)}/>
                    <Route name="新增活动" path="addActive" onEnter={toastSearch.bind(this, 'addActive')} component={asyncLoader(ActivityAdd)}/>
                    <Route name="新增任务" path="addTask" onEnter={toastSearch.bind(this, 'addTask')} component={asyncLoader(TaskAdd)}/>
                    <Route name="新增报价" path="addPrice" component={asyncLoader(PriceAdd)}/>
                    <Route name="任务" path="task" component={asyncLoader(Customer)} onEnter={toastSearch.bind(this, 'task')}>
                        <IndexRoute component={asyncLoader(TaskListNew)} />
                        <Route name="新增任务" path="addTask/:taskId" onEnter={toastSearch.bind(this, 'task')} component={asyncLoader(TaskAdd)}/>
                        <Route name="编辑任务" path="edit/:taskId" component={asyncLoader(TaskAdd)}/>
                    </Route>
                    <Route name="报价" path="price" onEnter={toastSearch.bind(this, 'price')} component={asyncLoader(Price)}>
                        <IndexRoute component={asyncLoader(PriceList)} />
                        <Route name="新增报价" path="addPrice/:priceId" component={asyncLoader(PriceAdd)}/>
                        <Route name="报价详情" path=":priceId"  component={asyncLoader(Price)}>
                            <IndexRoute component={asyncLoader(PriceDetail)} />
                            <Route name="编辑报价" path="edit"  component={asyncLoader(PriceAdd)}/>
                        </Route>
                    </Route>
                </Route>
                {/*<Route name="detail" path=":id"  component={asyncLoader(ChanceDetail)}/>
                <Route name="stage_task" path=":chanceId/stageTask/:id"  component={asyncLoader(StageTask)}/>
                <Route name="competitor-list" path=":chanceId/competitor/:id"  component={asyncLoader(ChanceCompetitorList)}/>
                <Route name="competitor-detail" path="competitor/:id"  component={asyncLoader(ChanceCompetitorDetail)}/>*/}
            </Route>
            <Route name="联系人" path="linkman" component={asyncLoader(Linkman)}>
                <IndexRoute component={asyncLoader(LinkmanListNew)} />
                <Route name="新增联系人" path="addLinkman/:linkmanId"  component={asyncLoader(LinkmanAdd)}/>
                <Route name="联系人详情" path=":linkmanId"  component={asyncLoader(Linkman)}>
                    <IndexRoute component={asyncLoader(LinkmanDetail)} />
                    <Route name="编辑联系人" path="edit"  component={asyncLoader(LinkmanAdd)}/>
                    <Route name="新增活动" path="addActive"  component={asyncLoader(ActivityAdd)}/>
                    <Route name="新增任务" path="addTask"  component={asyncLoader(TaskAdd)}/>
                    <Route name="任务" path="task" component={asyncLoader(Customer)}>
                        <IndexRoute component={asyncLoader(TaskListNew)} />
                        <Route name="新增任务" path="addTask/:taskId"  component={asyncLoader(TaskAdd)}/>
                        <Route name="编辑任务" path="edit/:taskId"  component={asyncLoader(TaskAdd)}/>
                    </Route>
                </Route>
                {/*<Route name="detail" path=":id"  component={asyncLoader(LinkmanDetail)}/>*/}
            </Route>
            <Route name="销售计划" path="salesplan" component={asyncLoader(Salesplan)}>
                <IndexRoute component={asyncLoader(SalesplanList)} />
                <Route name="新增销售计划" path="add/:id"  component={asyncLoader(SalesplanAdd)}/>
                <Route name="销售计划详情" path=":id" component={asyncLoader(Salesplan)}>
                    <IndexRoute component={asyncLoader(SalesplanDetail)}/>
                    <Route name="编辑销售计划" path="edit"  component={asyncLoader(SalesplanAdd)}/>
                </Route>
            </Route>
            <Route name="市场活动" path="marketing"  component={asyncLoader(Marketing)}>
                <IndexRoute component={asyncLoader(MarketingList)} />
                <Route name="新增市场活动" path="add/:marketId"  component={asyncLoader(MarketingAdd)}/>
                <Route name="市场活动详情" path=":marketId"  component={asyncLoader(Marketing)}>
                    <IndexRoute component={asyncLoader(MarketingDetail)}/>
                    <Route name="编辑市场活动" path="edit"  component={asyncLoader(MarketingAdd)}/>
                    <Route name="新增任务" path="addTask/:taskId" onEnter={toastSearch.bind(this, 'addTask/:taskId')} component={asyncLoader(TaskAdd)}/>
                    <Route name="新增线索" path="addClue/:id" onEnter={toastSearch.bind(this, 'addClue/:id')} component={asyncLoader(ClueAdd)}/>
                    <Route name="新增商机" path="addChance/:chanceId" onEnter={toastSearch.bind(this, 'addChance/:chanceId')} component={asyncLoader(ChanceAdd)}/>
                    <Route name="任务" path="task"  component={asyncLoader(MarketingTaskList)} />
                    <Route name="线索" path="clue"  component={asyncLoader(Marketing)}>
                        <IndexRoute component={asyncLoader(MarketingClueList)}/>
                        <Redirect from=":id" to="/clue/:id" />
                    </Route>
                    <Route name="商机" path="chance"  component={asyncLoader(Marketing)}>
                        <IndexRoute component={asyncLoader(MarketingChanceList)}/>
                        <Redirect from=":chanceId" to="/chance/:chanceId" />
                    </Route>
                </Route>
            </Route>
            <Route name="市场资讯" path="info"  component={asyncLoader(Info)}>
                <IndexRoute component={asyncLoader(InfoList)} />
                <Route name="新增资讯" path="add/news/:id"  component={asyncLoader(AddInfo)}/>
                <Route name="新增公告" path="add/notice/:id"  component={asyncLoader(AddNotice)}/>
                <Route name="资讯详情" path="news/:id"  component={asyncLoader(Info)}>
                    <IndexRoute component={asyncLoader(InfoDetail)} />
                    <Route name="编辑资讯" path="edit"  component={asyncLoader(AddInfo)}/>
                </Route>
                <Route name="公告详情" path="notice/:id"  component={asyncLoader(Info)}>
                    <IndexRoute component={asyncLoader(InfoDetail)} />
                    <Route name="编辑公告" path="edit"  component={asyncLoader(AddNotice)}/>
                </Route>
            </Route>
            <Route name="文档" path="document"  component={asyncLoader(Document)}>
                <IndexRoute component={asyncLoader(DocumentList)} />
                <Route name="新增文档" path="add/:id"  component={asyncLoader(DocumentAdd)}/>
            </Route>
            <Route name="报价" path="price"  component={asyncLoader(Price)}>
                <IndexRoute component={asyncLoader(PriceList)} />
                <Route name="新增报价" path="addPrice/:priceId"  component={asyncLoader(PriceAdd)}/>
                <Route name="报价详情" path=":priceId"  component={asyncLoader(Price)}>
                    <IndexRoute component={asyncLoader(PriceDetail)} />
                    <Route name="编辑报价" path="edit"  component={asyncLoader(PriceAdd)}/>
                </Route>
            </Route>
            <Route name="竞争对手" path="competitor"  component={asyncLoader(Competitor)}>
                <IndexRoute component={asyncLoader(CompetitorList)} />
                <Route name="新增竞争对手" path="add/:id"  component={asyncLoader(CompetitorAdd)}/>
                <Route name="对手详情" path=":id"  component={asyncLoader(Competitor)}>
                    <IndexRoute component={asyncLoader(CompetitorDetail)}/>
                    <Route name="编辑竞争对手" path="edit"  component={asyncLoader(CompetitorAdd)}/>
                </Route>
            </Route>
            <Route name="产品" path="product" component={asyncLoader(Product)}>
                <IndexRoute component={asyncLoader(ProductList)} />
                <Route name="产品分类" path="classList"  component={asyncLoader(ProductClassList)}/>
                <Route name="新增产品" path="add/:id"  component={asyncLoader(ProductAdd)}/>
                <Route name="编辑产品" path="edit/:id"  component={asyncLoader(ProductAdd)}/>
            </Route>
            <Route name="工作报告" path="working" component={asyncLoader(Working)}>
                <IndexRoute component={asyncLoader(WorkingList)} />
                <Route name="新增报告" path="add/:id"  component={asyncLoader(WorkingAdd)}/>
                <Route name="编辑报告" path="edit/:id"  component={asyncLoader(WorkingAdd)}/>
            </Route>
            <Route name="活动" path="activity" component={asyncLoader(Activity)}>
                <IndexRoute component={asyncLoader(ActivityList)} />
                {/*<Route name="新增活动" path="add/:id"  component={asyncLoader(ActivityAdd)}/>*/}
                <Route name="新增活动" path="add/:id"  component={asyncLoader(ActivityAdd)}/>
                <Route name="编辑活动" path="edit/:id"  component={asyncLoader(ActivityAdd)}/>
            </Route>
            <Route name="任务" path="task" component={asyncLoader(Task)}>
                <IndexRoute component={asyncLoader(TaskListNew)} />
                <Route name="新增任务" path="addTask/:taskId"  component={asyncLoader(TaskAdd)}/>
                <Route name="编辑任务" path="edit/:taskId"  component={asyncLoader(TaskAdd)}/>
            </Route>
            {/*<Route name="task" path="task" component={asyncLoader(Task)}>
                <IndexRoute name="list" component={asyncLoader(TaskListNew)} />
                <Route name="add" path="add/:id"  component={asyncLoader(TaskAdd)}/>
            </Route>*/}
            {
                (function(){
                    if(CONFIG.Exclude){
                        if(CONFIG.Exclude.chance)
                            return (
                                <Route name="报表" path="report" component={asyncLoader(Report)}>
                                    <IndexRoute component={asyncLoader(MyReport)} />
                                    <Route name="销售漏斗" path="SalesFunnel" component={asyncLoader(SalesFunnel)}/>
                                    <Route name="商机阶段持续时间阶段分析" path="ConvertRate" component={asyncLoader(ConvertRate)}/>
                                    <Route name="客户超期未跟进" path="CustomerOverdue" component={asyncLoader(CustomerOverdue)}/>
                                    <Route name="工作报告统计" path="WorkReport" component={asyncLoader(WorkReport)}/>
                                    <Route name="签到报表" path="CheckIn" component={asyncLoader(CheckIn)}/>
                                </Route>
                            )
                    }else{
                        return <Route name="报表" path="report" component={asyncLoader(Report)}>
                            <IndexRoute component={asyncLoader(MyChart)} />
                            <Route name="我的报表" path="list" component={asyncLoader(Report)}>
                                <IndexRoute component={asyncLoader(MyReport)} />
                                <Route name="销售漏斗" path="SalesFunnel" component={asyncLoader(SalesFunnel)}/>
                                <Route name="商机阶段持续时间阶段分析" path="ConvertRate" component={asyncLoader(ConvertRate)}/>
                                <Route name="客户超期未跟进" path="CustomerOverdue" component={asyncLoader(CustomerOverdue)}/>
                                <Route name="工作报告统计" path="WorkReport" component={asyncLoader(WorkReport)}/>
                                <Route name="签到报表" path="CheckIn" component={asyncLoader(CheckIn)}/>
                            </Route>
                        </Route>
                    }
                })()
            }
            {/*<Route name="报表" path="report" component={asyncLoader(Report)}>
                <IndexRoute component={asyncLoader(MyChart)} />
                <Route name="我的报表" path="list" component={asyncLoader(Report)}>
                    <IndexRoute component={asyncLoader(MyReport)} />
                    <Route name="销售漏斗" path="SalesFunnel" component={asyncLoader(SalesFunnel)}/>
                    <Route name="商机阶段持续时间阶段分析" path="ConvertRate" component={asyncLoader(ConvertRate)}/>
                    <Route name="客户超期未跟进" path="CustomerOverdue" component={asyncLoader(CustomerOverdue)}/>
                    <Route name="工作报告统计" path="WorkReport" component={asyncLoader(WorkReport)}/>
                    <Route name="签到报表" path="CheckIn" component={asyncLoader(CheckIn)}/>
                </Route>
            </Route>*/}
            <Route name="日程" path="schedule" component={asyncLoader(Schedule)}>
                <IndexRoute component={asyncLoader(ScheduleList)} />
                <Route name="日程详情" path="schedule/:id" component={asyncLoader(ScheduleDetail)}/>
                <Route name="生日详情" path="birthday/:id" component={asyncLoader(ScheduleDetail)}/>
            </Route>
            <Route name="消息" path="messege" component={asyncLoader(Messege)}>
                <IndexRoute component={asyncLoader(MessegeList)} />
                <Route name="消息详情" path=":id"  component={asyncLoader(MessegeDetail)}/>
            </Route>
        </Route>
    </Router>
);