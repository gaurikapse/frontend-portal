import React from 'react'
import URLS, {getJson, section} from '../../api_v2';
import LoadingPage from '../../Shared/LoadingCircle';
import PageTitle from '../../Shared/PageTitle';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

class TeamsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageData: null,
        }
    }
    componentDidMount() {
        Promise.all([
            getJson(URLS.TEAMS),
        ]).then(myJsons => {
            this.setState({
                teams: myJsons[0].data,
                loaded: true
            })
        }).catch(err => {
            console.log(err)
        });
    }

    render() {
        if(!this.state.loaded) return <LoadingPage/>;
        
        const {
            teams
        } = this.state;

        return (
            <div className="boxed_wrapper p-5">
                <PageTitle>Teams Leaderboard</PageTitle>
                <Table bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Team Name</th>
                            <th># Households</th>
                            <th># Actions Completed</th>
                            <th>Average # Actions/Household</th>
                            <th>GHG Saved</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderTeamsData(teams)}
                    </tbody>
                </Table>     
            </div>
        );
    }

    renderTeamsData(teamsData) {        
        return teamsData.map((obj) => {
            const popover = (
                <Popover title={obj.name}>
                    {obj.description}
                </Popover>
            );
            return (
                <tr>
                    <td>{obj.teamName} &nbsp;
                        <OverlayTrigger trigger="hover" placement="right" overlay={popover}><span className="fa fa-info-circle" style={{color: "#428a36"}}></span></OverlayTrigger>
                    </td>
                    <td>{obj.numHouseholds}</td>
                    <td>{obj.numActionsCompleted}</td>
                    <td>{obj.avrgNumActions}</td>
                    <td>{obj.ghgSaved}</td>
                </tr>
            )
        });
    }
}
export default TeamsPage;