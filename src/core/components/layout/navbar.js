import React from 'react';
import Reflux from 'reflux';
import ReactMixin from 'react-mixin';
import {APIS} from '../../common/config';
import Tools from '../../common/tools.js';

module.exports = React.createClass({

	getInitialState: function () {
		return {
			userName: ''
		}
	},

	loginOut: function () {
		var self = this;
		$.ajax({
			"url": APIS.logout,
			"type": 'get',
			"data": '',
			"contentType": "application/json",
			success: function (retData) {
				alert('退出成功!');

				localStorage.removeItem('loginInfo_crm');
				self.setState({userName: ''});
				
				location.href = '#login';
			},
			error: function () {
				alert('登录失败!');
			}
		});
	},
	componentDidMount: function () {
		var login_data = localStorage.getItem('loginInfo_crm');
		if (login_data) {
			login_data = JSON.parse(login_data);
		}

		if (login_data && login_data.name) {
			this.setState({
				userName: login_data.name
			})
		}
		Tools.imgLoadError();
	},

	render:function () {
		var style65 = {width: "65%"};
		var style35 = {width: "35%"};
		var style75 = {width: "75%"};
		var style100 = {width: "100%"};
		var style_bg_black = {backgroundColor: "#000"};
		var style_bg1 = {backgroundColor: "#5DB2FF"};
		var style_bg2 = {backgroundColor: "#2dc3e8"};
		var style_bg3 = {backgroundColor: "#03B3B2"};
		var style_bg4 = {backgroundColor: "#53a93f"};
		var style_bg5 = {backgroundColor: "#FF8F32"};
		var style_bg6 = {backgroundColor: "#cc324b"};
		var style_bg7 = {backgroundColor: "#AC193D"};
		var style_bg8 = {backgroundColor: "#8C0095"};
		var style_bg9 = {backgroundColor: "#0072C6"};
		var style_bg10 = {backgroundColor: "#585858"};
		var style_bg11 = {backgroundColor: "#474544"};
		var style_bg12 = {backgroundColor: "#001940"};

		return (
			<div className="navbar">
				<div className="navbar-inner" style={style_bg_black}>
					<div className="navbar-container">

						<div className="navbar-header pull-left">
							<a href="#" className="navbar-brand">
								<small>
									<img src={`${APIS.img_path}/assets/crm/images/logoCRM.png`} name="defaultPic" alt=""/>
								</small>
							</a>
						</div>

						<div className="sidebar-collapse" id="sidebar-collapse">
							<i className="collapse-icon fa fa-bars"></i>
						</div>

						<div className="navbar-header pull-right">
							<div className="navbar-account">
								<ul className="account-area">
									<li>
										<a className=" dropdown-toggle" data-toggle="dropdown" title="Help"
										   href="#">
											<i className="icon fa fa-warning"></i>
										</a>

										<ul className="pull-right dropdown-menu dropdown-arrow dropdown-notifications">
											<li>
												<a href="#">
													<div className="clearfix">
														<div className="notification-icon">
															<i className="fa fa-phone bg-themeprimary white"></i>
														</div>
														<div className="notification-body">
															<span className="title">Skype meeting with Patty</span>
															<span className="description">01:00 pm</span>
														</div>
														<div className="notification-extra">
															<i className="fa fa-clock-o themeprimary"></i>
															<span className="description">office</span>
														</div>
													</div>
												</a>
											</li>
											<li>
												<a href="#">
													<div className="clearfix">
														<div className="notification-icon">
															<i className="fa fa-check bg-darkorange white"></i>
														</div>
														<div className="notification-body">
															<span className="title">Uncharted break</span>
															<span className="description">03:30 pm - 05:15 pm</span>
														</div>
														<div className="notification-extra">
															<i className="fa fa-clock-o darkorange"></i>
														</div>
													</div>
												</a>
											</li>
											<li>
												<a href="#">
													<div className="clearfix">
														<div className="notification-icon">
															<i className="fa fa-gift bg-warning white"></i>
														</div>
														<div className="notification-body">
															<span className="title">Kate birthday party</span>
															<span className="description">08:30 pm</span>
														</div>
														<div className="notification-extra">
															<i className="fa fa-calendar warning"></i>
															<i className="fa fa-clock-o warning"></i>
															<span className="description">at home</span>
														</div>
													</div>
												</a>
											</li>
											<li>
												<a href="#">
													<div className="clearfix">
														<div className="notification-icon">
															<i className="fa fa-glass bg-success white"></i>
														</div>
														<div className="notification-body">
															<span className="title">Dinner with friends</span>
															<span className="description">10:30 pm</span>
														</div>
													</div>
												</a>
											</li>
											<li className="dropdown-footer ">
													<span>
														Today, March 28
													</span>
													<span className="pull-right">
														10°c
														<i className="wi wi-cloudy"></i>
													</span>
											</li>
										</ul>

									</li>
									<li>
										<a className="wave in dropdown-toggle" data-toggle="dropdown" title="Help"
										   href="#">
											<i className="icon fa fa-envelope"></i>
											<span className="badge">3</span>
										</a>

										<ul className="pull-right dropdown-menu dropdown-arrow dropdown-messages">
											<li>
												<a href="#">
													<img name="defaultPic" src={`${APIS.img_path}/assets/img/avatars/divyia.jpg`}
														 className="message-avatar" alt="Divyia Austin"/>
													<div className="message">
															<span className="message-sender">
																Divyia Austin
															</span>
															<span className="message-time">
																2 minutes ago
															</span>
															<span className="message-subject">
																Here's the recipe for apple pie
															</span>
															<span className="message-body">
																to identify the sending application when the senders image is shown for the main icon
															</span>
													</div>
												</a>
											</li>
											<li>
												<a href="#">
													<img name="defaultPic" src={`${APIS.img_path}/assets/img/avatars/bing.png`}
														 className="message-avatar" alt="Microsoft Bing"/>
													<div className="message">
															<span className="message-sender">
																Bing.com
															</span>
															<span className="message-time">
																Yesterday
															</span>
															<span className="message-subject">
																Bing Newsletter: The January Issue‏
															</span>
															<span className="message-body">
																Discover new music just in time for the Grammy® Awards.
															</span>
													</div>
												</a>
											</li>
											<li>
												<a href="#">
													<img name="defaultPic" src={`${APIS.img_path}/assets/img/avatars/adam-jansen.jpg`}
														 className="message-avatar" alt="Divyia Austin"/>
													<div className="message">
															<span className="message-sender">
																Nicolas
															</span>
															<span className="message-time">
																Friday, September 22
															</span>
															<span className="message-subject">
																New 4K Cameras
															</span>
															<span className="message-body">
																The 4K revolution has come over the horizon and is reaching the general populous
															</span>
													</div>
												</a>
											</li>
										</ul>

									</li>

									<li>
										<a className="dropdown-toggle" data-toggle="dropdown" title="Tasks"
										   href="#">
											<i className="icon fa fa-tasks"></i>
											<span className="badge">4</span>
										</a>

										<ul className="pull-right dropdown-menu dropdown-tasks dropdown-arrow ">
											<li className="dropdown-header bordered-darkorange">
												<i className="fa fa-tasks"></i>
												4 Tasks In Progress
											</li>

											<li>
												<a href="#">
													<div className="clearfix">
														<span className="pull-left">Account Creation</span>
														<span className="pull-right">65%</span>
													</div>

													<div className="progress progress-xs">
														<div style={style65} className="progress-bar"></div>
													</div>
												</a>
											</li>

											<li>
												<a href="#">
													<div className="clearfix">
														<span className="pull-left">Profile Data</span>
														<span className="pull-right">35%</span>
													</div>

													<div className="progress progress-xs">
														<div style={style35}
															 className="progress-bar progress-bar-success"></div>
													</div>
												</a>
											</li>

											<li>
												<a href="#">
													<div className="clearfix">
														<span className="pull-left">Updating Resume</span>
														<span className="pull-right">75%</span>
													</div>

													<div className="progress progress-xs">
														<div style={style75}
															 className="progress-bar progress-bar-darkorange"></div>
													</div>
												</a>
											</li>

											<li>
												<a href="#">
													<div className="clearfix">
														<span className="pull-left">Adding Contacts</span>
														<span className="pull-right">10%</span>
													</div>

													<div className="progress progress-xs">
														<div style={style100}
															 className="progress-bar progress-bar-warning"></div>
													</div>
												</a>
											</li>

											<li className="dropdown-footer">
												<a href="#">
													See All Tasks
												</a>
												<button
													className="btn btn-xs btn-default shiny darkorange icon-only pull-right">
													<i className="fa fa-check"></i></button>
											</li>
										</ul>

									</li>
									<li>
										<a className="login-area dropdown-toggle" data-toggle="dropdown">
											<div style={{height:45+'px'}} className="avatar" title="View your public profile">
												<img name="defaultPic" style={{width:47+'px',height:45+'px'}} src={`${APIS.img_path}/assets/img/avatars/adam-jansen.jpg`}/>
											</div>
										</a>
										<ul className="pull-right dropdown-menu dropdown-arrow dropdown-login-area">
											<li className="username"><a>David Stevenson</a></li>
											<li className="email"><a>David.Stevenson@live.com</a></li>

											<li>
												<div className="avatar-area">
													<img name="defaultPic" src={`${APIS.img_path}/assets/img/avatars/adam-jansen.jpg`}
														 className="avatar"/>
													<span className="caption">Change Photo</span>
												</div>
											</li>

											<li className="edit">
												<a href="profile.html" className="pull-left">Profile</a>
												<a href="#" className="pull-right">Setting</a>
											</li>

											<li className="theme-area">
												<ul className="colorpicker" id="skin-changer">
													<li><a className="colorpick-btn" href="#" style={style_bg1}
														   rel="assets/css/skins/blue.min.css"></a></li>
													<li><a className="colorpick-btn" href="#" style={style_bg2}
														   rel="assets/css/skins/azure.min.css"></a></li>
													<li><a className="colorpick-btn" href="#" style={style_bg3}
														   rel="assets/css/skins/teal.min.css"></a></li>
													<li><a className="colorpick-btn" href="#" style={style_bg4}
														   rel="assets/css/skins/green.min.css"></a></li>
													<li><a className="colorpick-btn" href="#" style={style_bg5}
														   rel="assets/css/skins/orange.min.css"></a></li>
													<li><a className="colorpick-btn" href="#" style={style_bg6}
														   rel="assets/css/skins/pink.min.css"></a></li>
													<li><a className="colorpick-btn" href="#" style={style_bg7}
														   rel="assets/css/skins/darkred.min.css"></a></li>
													<li><a className="colorpick-btn" href="#" style={style_bg8}
														   rel="assets/css/skins/purple.min.css"></a></li>
													<li><a className="colorpick-btn" href="#" style={style_bg9}
														   rel="assets/css/skins/darkblue.min.css"></a></li>
													<li><a className="colorpick-btn" href="#" style={style_bg10}
														   rel="assets/css/skins/gray.min.css"></a></li>
													<li><a className="colorpick-btn" href="#" style={style_bg11}
														   rel="assets/css/skins/black.min.css"></a></li>
													<li><a className="colorpick-btn" href="#" style={style_bg12}
														   rel="assets/css/skins/deepblue.min.css"></a></li>
												</ul>
											</li>

											<li className="dropdown-footer">
												<a href="login.html">
													Sign out
												</a>
											</li>
										</ul>

									</li>
									<li style={{width:80+'px',paddingLeft:10+'px', paddingTop:5+'px'}}>
										<span style={{display:this.state.userName?'block':'none', color:'#fff'}}
											  className="profile"><span>{this.state.userName}</span></span>
										<span style={{color:'#fff'}} onClick={this.loginOut}>退出</span>
									</li>


								</ul>
								<div className="setting">
									<a id="btn-setting" title="Setting" href="#">
										<i className="icon glyphicon glyphicon-cog"></i>
									</a>
								</div>
								<div className="setting-container">
									<label>
										<input type="checkbox" id="checkbox_fixednavbar"/>
										<span className="text">Fixed Navbar</span>
									</label>
									<label>
										<input type="checkbox" id="checkbox_fixedsidebar"/>
										<span className="text">Fixed SideBar</span>
									</label>
									<label>
										<input type="checkbox" id="checkbox_fixedbreadcrumbs"/>
										<span className="text">Fixed BreadCrumbs</span>
									</label>
									<label>
										<input type="checkbox" id="checkbox_fixedheader"/>
										<span className="text">Fixed Header</span>
									</label>
								</div>

							</div>
						</div>

					</div>
				</div>
			</div>
		)
	}

})

