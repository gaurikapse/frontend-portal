import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import NavBarBurger from './Components/Menu/NavBarBurger'
import NavBarOffset from './Components/Menu/NavBarOffset'
import Footer from './Components/Menu/Footer'
import LoadingCircle from './Components/Shared/LoadingCircle'
import './assets/css/style.css';

import HomePage from './Components/Pages/HomePage/HomePage'
import ActionsPage from './Components/Pages/ActionsPage/ActionsPage'
import OneActionPage from './Components/Pages/ActionsPage/OneActionPage'
import AboutUsPage from './Components/Pages/AboutUsPage/AboutUsPage'
import ServicesPage from './Components/Pages/ServicesPage/ServicesPage'
import StoriesPage from './Components/Pages/StoriesPage/StoriesPage'
import LoginPage from './Components/Pages/LoginPage/LoginPage'
import EventsPage from './Components/Pages/EventsPage/EventsPage'
import OneEventPage from './Components/Pages/EventsPage/OneEventPage'
import ProfilePage from './Components/Pages/ProfilePage/ProfilePage'
import ImpactPage from './Components/Pages/ImpactPage/ImpactPage'
import TeamsPage from './Components/Pages/TeamsPage/TeamsPage'
import RegisterPage from './Components/Pages/RegisterPage/RegisterPage'
import PoliciesPage from './Components/Pages/PoliciesPage/PoliciesPage'

import URLS, { getJson } from './Components/api_v2'

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loaded: false
		}
	}
	componentDidMount() {
		Promise.all([
			getJson(URLS.MENU + "?name=Portal-FooterQuickLinks"),
			getJson(URLS.MENU + "?name=Portal-MainNavBar"),
			getJson(URLS.MENU + "?name=Portal-FooterInfo")
		]).then(myJsons => {
			this.setState({
				footerLinks: myJsons[0].data[0].content,
				navLinks: myJsons[1].data[0].content,
				footerInfo: myJsons[2].data[0].content,
				loaded: true
			})
		}).catch(err => {
			console.log(err)
		});
	}
	render() {
		if (!this.state.loaded) return <LoadingCircle />;
		return (
			<div className="boxed-wrapper">
				<Helmet>
					<meta charset="UTF-8" />
					<title>Mass Energize</title>
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
				</Helmet>
				{this.state.navLinks ?
					<div>
						<NavBarBurger
							navLinks={this.state.navLinks}
						/>
						<NavBarOffset />
					</div> : <LoadingCircle />
				}
				<Switch>
					<Route exact path="/" component={HomePage} />
					<Route path="/home" component={HomePage} />
					<Route exact path="/actions" component={ActionsPage} />
					<Route path="/aboutus" component={AboutUsPage} />
					<Route path="/services" component={ServicesPage} />
					<Route path="/actions/:id" component={OneActionPage} />
					<Route path="/testimonials" component={StoriesPage} />
					<Route path="/teams" component={TeamsPage} />
					<Route path="/impact" component={ImpactPage} />
					<Route exact path="/events" component={EventsPage} />
					<Route path="/events/:id" component={OneEventPage} />
					<Route path="/login" component={LoginPage} />
					<Route path="/register" component={RegisterPage} />
					<Route path="/profile" component={ProfilePage} />
					<Route path="/policies" component={PoliciesPage} />
					{/*<Route path="/contact" component={Contact} /> */}

					<Route component={() =>
						<div>
							FOUR OR FOR: PAGE NOT FOUND
						</div>
					} />
				</Switch>
				{this.state.footerLinks ?
					<Footer
						footerLinks={this.state.footerLinks}
						footerInfo={this.state.footerInfo}
					/> : <LoadingCircle />
				}
			</div>
		);
	}
}
export default App;
