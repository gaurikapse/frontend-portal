import React from 'react'
import { connect } from 'react-redux'
import { Redirect, Link } from 'react-router-dom'

import SignOutButton from './SignOutButton'
import Cart from '../../Shared/Cart'
import LoadingCircle from '../../Shared/LoadingCircle'
import Counter from './Counter'
// import { threadId } from 'worker_threads'
import URLS, { getJson } from '../../api_v2'
import { isLoaded } from 'react-redux-firebase';
import AddingHouseholdForm from './AddingHouseholdForm';
// import { watchFile } from 'fs';



class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            user: null,
            todo: [],
            done: [],
            households: [],
            selectedHousehold: null,
            addingHH: false,
            addingCom: false,
        }
    }
    componentDidMount() {
        Promise.all([
            getJson(URLS.USER + "/e/" + this.props.auth.email),
            getJson(URLS.USER + "/e/" + this.props.auth.email + "/actions" + "?status=TODO"),
            getJson(URLS.USER + "/e/" + this.props.auth.email + "/actions" + "?status=DONE"),
        ]).then(myJsons => {
            this.setState({
                user: myJsons[0].data,
                todo: myJsons[1].data,
                done: myJsons[2].data,
                loaded: true
            })
        }).catch(err => {
            console.log(err)
        });
    }
    render() {
        //avoids trying to render before the promise from the server is fulfilled
        if (!isLoaded(this.props.auth)) { //if the auth isn't loaded wait for a bit
            return <LoadingCircle />;
        }
        //if the auth is loaded and there is a user logged in but the user has not been fetched from the server remount
        if (isLoaded(this.props.auth) && this.props.auth.uid && !this.state.user) {
            this.componentDidMount();
            return <LoadingCircle />;
        }
        if (!this.state.loaded) return <LoadingCircle />;
        const { auth } = this.props;
        const { user } = this.state;
        if (!auth.uid) return <Redirect to='/login' />
        //if the user hasnt registered to our back end yet, but still has a firebase login, send them to register
        if (!user) return <Redirect to='/register?form=2' />
        return (
            <div className='boxed_wrapper'>
                <div className="container">
                    <div className="row" style={{ paddingRight: "0px", marginRight: "0px" }}>
                        <div className="col-lg-8 col-md-7  col-12">
                            <h3>{user ?
                                <div>
                                    <span style={{ color: "#8dc63f" }}>Welcome</span> {user.preferred_name}
                                </div>
                                :
                                "Your Profile"
                            } <SignOutButton className="float_right" /> </h3> 
                            <section className="fact-counter style-2 sec-padd" >
                                <div className="container">
                                    <div className="counter-outer" style={{ background: "#333", width: "100%" }}>
                                        <div className="row no-gutter">
                                            <div className="column counter-column col-lg-4 col-6 ">
                                                <Counter end={this.state.done.length} icon={"icon-money"} title={"Actions Completed"} />
                                            </div>
                                            <div className="column counter-column  d-lg-block d-none col-4 ">
                                                <Counter end={this.state.todo.length} icon={"icon-money"} title={"Actions To Do"} />
                                            </div>
                                            <div className="column counter-column col-lg-4 col-6"  >
                                                <Counter end={this.state.done.length * 10} unit={"tons"} icon={"icon-money"} title={"Tons of Carbon Saved"} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-6 col-12">
                                        <table className="profile-table" style = {{width: '100%'}}>
                                            <tbody>
                                                <tr>
                                                    <th> Your Communities </th>
                                                    <th></th>
                                                </tr>
                                                {this.renderCommunities(user.communities)}
                                                <tr>
                                                    <td colSpan={2}><button className="thm-btn" disabled>Join another Community</button></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="col-lg-6 col-12">
                                        <table className="profile-table" style = {{width: '100%'}}>
                                            <tbody>
                                                <tr>
                                                    <th />
                                                    <th> Your Households </th>
                                                    <th />
                                                    <th />
                                                </tr>
                                                {this.renderHouseholds(user.households)}
                                                <tr>
                                                    <td colSpan={4}>
                                                        {this.state.addingHH ?
                                                            <>
                                                                <AddingHouseholdForm user={this.state.user} addHousehold={this.addHousehold} />
                                                                <button
                                                                    className="thm-btn"
                                                                    onClick={() => this.setState({ addingHH: !this.state.addingHH })}
                                                                    style={{ width: '99%' }}>Cancel
                                                                    </button>
                                                            </>
                                                            :
                                                            <button className="thm-btn" onClick={() => this.setState({ addingHH: !this.state.addingHH })}>Add Another Household</button>
                                                        }
                                                    </td>
                                                </tr>

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <br />
                            <br />
                        </div>
                        {/* makes the todo and completed actions carts */}
                        <div className="col-lg-4 col-md-5 col-12" style={{ paddingRight: "0px", marginRight: "0px" }}>
                            <Cart title="To Do List" actionRels={this.state.todo} status="TODO" moveToDone={this.moveToDone} />
                            <Cart title="Completed Actions" actionRels={this.state.done} status="DONE" moveToDone={this.moveToDone} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    renderCommunities(communities) {
        return Object.keys(communities).map(key => {
            const community = communities[key]
            return (<tr key={key}>
                <td> <a href={'//' + community.subdomain + '.massenergize.org'}> {community.name} </a></td>
                <td> <button className="remove-btn"> <i className="fa fa-trash"></i></button> </td>
            </tr>
            );
        })
    }

    renderHouseholds(households) {
        return Object.keys(households).map(key => {
            const house = households[key]
            return (
                <tr key={key}>
                    <td><input type='radio' /></td>
                    <td>{house.name}</td>
                    <td><button className="edit-btn"> <i className="fa fa-edit"></i> </button></td>
                    <td><button className="remove-btn"> <i className="fa fa-trash"></i> </button></td>
                </tr>
            );
        })
    }


    addHousehold = (household) => {
        this.setState({
            user: {
                ...this.state.user,
                households: [
                    ...this.state.user.households,
                    household
                ]

            }
        });
    }
    /**
     * Cart Functions
     */
    moveToDone = (actionRel) => {
        fetch(URLS.USER + "/" + this.state.user.id + "/action/" + actionRel.id, {
            method: 'post',
            body: JSON.stringify({
                status: "DONE",
                action: actionRel.action.id,
                real_estate_unit: actionRel.real_estate_unit.id,
            })
        }).then(response => {
            return response.json()
        }).then(json => {
            console.log(json);
            if (json.success) {
                this.setState({
                    //delete from todo by filtering for not matching ids
                    todo: this.state.todo.filter(actionRel => { return actionRel.id !== json.data[0].id }),
                    //add to done by assigning done to a spread of what it already has and the one from data
                    done: [
                        ...this.state.done,
                        json.data[0]
                    ]
                })
            }
            //just update the state here
        }).catch(err => {
            console.log(err)
        })
    }
}
const mapStoreToProps = (store) => {
    return {
        auth: store.firebase.auth
    }
}
export default connect(mapStoreToProps, null)(ProfilePage);