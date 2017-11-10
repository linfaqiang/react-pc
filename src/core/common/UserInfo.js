var React = require('react');
import {APIS} from '../../core/common/config.js';

define(function(require, exports, module) {
	function getCookieByName(name){
		var cookie = document.cookie,
			cookieName = encodeURIComponent(name) + '=',
			start = cookie.indexOf(cookieName),
			value = null;

		if (start > -1) {
			var cookieEnd = document.cookie.indexOf(';', start);
			if (cookieEnd == -1) {
				cookieEnd = document.cookie.length;
			}
			value = decodeURIComponent(document.cookie.substring(start + cookieName.length, cookieEnd));
		}

		return value;
	};
	var UserInfo = {
		get: function() {
			var login_data = '';
			if(window.localStorage){
				login_data = localStorage.getItem('loginInfo_crm');
			}else{
				login_data = getCookieByName('loginInfo_crm');
			}
			if (login_data) {
				login_data = JSON.parse(login_data);
			}
			if (login_data) {
				return login_data;
			}else{
				return null;
			}
		},
		isTheOrgManager:function(OrgId){//用户是公司、组织的leader
			if(OrgId == this.mainBelongOrgId() && OrgId == this.mainManageOrgId()){
				return true;
			}
			return false;
		},
		isTheDeptManager:function(deptId){//用户是部门的leader
			if(deptId == this.mainBelongDeptId() && deptId == this.mainManageDeptId()){
				return true;
			}
			return false;
		},
		getRolePermit:function(data){
			var isLeader = false;
			var isOwner = false;
			data = data ||{
					ownerDeptId:this.mainBelongDeptId(),
					ownerOrgId:this.mainBelongOrgId(),
					ownerStaffId:this.staffId()
				};

			/* ownerDeptId  //所属部门id
			 * ownerOrgId   //所属公司id
			 * ownerStaffId //所属员工id
			 * */
			if(data.ownerOrgId > 0){
				if(this.isTheOrgManager(data.ownerOrgId)){
					isLeader = true;
					isOwner = true;
				}
			}
			if(data.ownerDeptId > 0){
				if(this.isTheDeptManager(data.ownerDeptId)){
					isLeader = true;
					isOwner = true;
				}
			}
			if(data.ownerStaffId > 0){
				if(this.staffId() == data.ownerStaffId){
					isOwner = true;
				}
			}
			return {
				isLeader: isLeader,
				isOwner: isOwner
			}
		},//是否是部门领导，是否是数据的创建者
		mainManageOrgId: function(){var info = this.get(); return ((info && info.mainManageOrgId) ? info.mainManageOrgId : null)}, //用户管理的公司
		mainBelongDeptId: function(){var info = this.get(); return ((info && info.mainBelongDeptId) ? info.mainBelongDeptId : null)}, //用户所属部门
		mainManageDeptId: function(){var info = this.get(); return ((info && info.mainManageDeptId) ? info.mainManageDeptId : null)}, //用户管理的部门
		mainBelongOrgId: function(){var info = this.get(); return ((info && info.mainBelongOrgId) ? info.mainBelongOrgId : null)}, //用户所属公司
		staffId: function(){var info = this.get(); return ((info && info.staffId) ? info.staffId : null)}, //staffId
		superId: function(){var info = this.get(); return ((info && info.superId) ? info.superId : null)}, //上级id
		headPhotoUrl: function(){
			var info = this.get(); 
			return ((info && info.headPhotoUrl) ? info.headPhotoUrl : APIS.img_path+'/assets/crm/images/default_user.png')
		},//用户头像
		isManager: function () {var info = this.get(); return ((info.isManager && info.isManager == 1) ? true : false)}//是否是管理员
	};

	module.exports = UserInfo;
});