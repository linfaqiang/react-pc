import React, {
	Component
} from 'react'
import ReactMixin from 'react-mixin'
import {
	Router,
	Route,
	Link,
	hashHistory
} from 'react-router'
//import Navbar from './core/components/layout/navbar'
import Header from './core/components/layout/header'
import Loading from './core/components/layout/loading'
import SidebarMenu from './core/components/layout/sidebarMenu'
import AddBirthday from './home/AddBirthday'
import AddSchedule from './home/AddSchedule'
import Alert from './core/components/alert.js'

module.exports = React.createClass({

	render: function() {

		return (
			<div>
				{/*<Loading></Loading>*/}
			    <Header></Header>

				<div className="main-container container-fluid">
				  <div className="page-container">
				      <SidebarMenu pathname={this.props.location.pathname}></SidebarMenu>

			          <div className="page-content">
			          	{this.props.children}
			          </div>
					  <AddBirthday></AddBirthday>
					  <AddSchedule></AddSchedule>
				  </div>
				</div>
 			</div>
		)
	}
});