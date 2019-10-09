import React from 'react'
import { connect } from 'react-redux';
import PageTitle from '../../Shared/PageTitle';
import Tooltip from '../../Shared/Tooltip';
import Table from 'react-bootstrap/Table';
import LoadingCircle from '../../Shared/LoadingCircle';
import { postJson } from '../../../api/functions'
import URLS from '../../../api/urls'
import { reduxJoinTeam } from '../../../redux/actions/userActions'
import { reduxAddTeamMember } from '../../../redux/actions/pageActions'
import { Link } from 'react-router-dom'
import BreadCrumbBar from '../../Shared/BreadCrumbBar'
import Modal from '../../Shared/DescModal';



class TeamsPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			modal_toggled: false,
			modal_content: { title: "...", desc: "..." }
		}
		this.toggleModal = this.toggleModal.bind(this);
	}
	renderModal = () => {
		if (this.state.modal_toggled) return <Modal content={this.state.modal_content} toggler={this.toggleModal} />
	}

	toggleModal = () => {
		var val = this.state.modal_toggled;
		this.setState({ modal_toggled: !val });
	}
	render() {
		const teams = this.props.teamsPage;
		if (teams == null) return <p className='text-center'> Sorry, looks like this community's Teams Page is under maintenance. Try again later </p>

		return (
			<>
				{this.renderModal()}

				<div className="boxed_wrapper" >
					<BreadCrumbBar links={[{ name: 'Teams' }]} />
					<div className="p-5">
						<PageTitle>Team Leaderboard</PageTitle>
						<Table bordered hover responsive className="teams-table">
							<thead>
								<tr>
									<th>Team Name</th>
									<th>Households</th>
									<th>Actions Completed</th>
									<th>Average Actions/Household</th>
									<th>
										<Tooltip text="Brad's paragraph here" dir="left">
											<span className="has-tooltip">Carbon Impact</span>
										</Tooltip>
									</th>
									<th>Key Contact</th>
									<th>Join Team</th>
								</tr>
							</thead>
							<tbody>
								{this.renderTeamsData(teams)}
							</tbody>
						</Table>
					</div>
				</div>
			</>
		);
	}

	renderTeamsData(teamsData) {
		var teamsSorted = teamsData.slice(0);
		for (let i = 0; i < teamsSorted.length; i++) {
			let households = teamsSorted[i].households;
			let actions_completed = teamsSorted[i].actions_completed;
			var avrg = Number(actions_completed) / Number(households);
			avrg = (!isNaN(avrg)) ? avrg.toFixed(1) : 0;
			teamsSorted[i]["avrgActionsPerHousehold"] = avrg;
		}

		teamsSorted = teamsSorted.sort((a, b) => {
			return b.avrgActionsPerHousehold - a.avrgActionsPerHousehold;
		});
		console.log("I am the team sorted", teamsSorted);
		return teamsSorted.map((obj) => {
			const desc = obj.team.description.length > 70 ? obj.team.description.substr(0, 70) + "..." : obj.team.description;
			return (
				<tr>
					<td>{obj.team.name} &nbsp;
            <Tooltip title={obj.team.name} text={desc} dir="right">
							<div>
								<small className="more-hyperlink" onClick={() => { this.setState({ modal_content: { title: obj.team.name, desc: obj.team.description } }); this.toggleModal() }}>More...</small>
								<span className="fa fa-info-circle" style={{ color: "#428a36" }}></span>
							</div>
						</Tooltip>
					</td>
					<td>{obj.households}</td>
					<td>{obj.actions_completed}</td>
					<td>{obj.avrgActionsPerHousehold}</td>
					<td>...</td>
					<td>...</td>
					{this.props.user ?
						<td>
							{this.inTeam(obj.team.id) ?
								<button className='thm-btn red'><i className='fa fa-hand-peace-o'> </i> Leave</button>
								:
								<button className='thm-btn' onClick={() => {
									console.log('clicked')
									this.joinTeam(obj.team)
								}}><i className='fa fa-user-plus' > </i> Join </button>
							}
						</td>
						:
						<td>
							<Link to={this.props.links.signin}>Sign In</Link> to join a team
						</td>
					}
					{/* <td>{obj.ghgSaved}</td> */}
				</tr>
			)
		});
	}
	inTeam = (team_id) => {
		if (!this.props.user) {
			return false;
		}
		return this.props.user.teams.filter(team => { return team.id === team_id }).length > 0;
	}

	joinTeam = (team) => {
		const body = {
			members: this.props.user.id,
		}
		postJson(`${URLS.TEAM}/${team.id}`, body).then(json => {
			console.log(json)
			if (json.success) {
				this.props.reduxJoinTeam(team);

				this.props.reduxAddTeamMember({
					team: team,
					member: {
						households: this.props.user.households.length,
						actions: this.props.todo.length + this.props.done.length,
						actions_completed: this.props.done.length,
						actions_todo: this.props.todo.length
					}
				});
			}
		})
	}
}
const mapStoreToProps = (store) => {
	return {
		user: store.user.info,
		todo: store.user.todo,
		done: store.user.done,
		teamsPage: store.page.teamsPage,
		links: store.links
	}
}
const mapDispatchToProps = {
	reduxJoinTeam,
	reduxAddTeamMember
}
export default connect(mapStoreToProps, mapDispatchToProps)(TeamsPage);