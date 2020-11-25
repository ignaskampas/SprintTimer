import React, {useEffect, useState} from "react";
import styles from './app.module';
import {Switch} from 'react-router-dom';
require("regenerator-runtime/runtime");
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {checkIfUserIsLoggedIn} from '../../redux/actions/authStateActions';
import { fetchVideoRecords } from '../../redux/actions/videoRecordsActions'

import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';
import ImportVideo from '../ImportVideo/ImportVideo';
import Saved from '../Saved/Saved';
import ItemDetails from '../ItemDetails/ItemDetails';
import Login from '../Auth/Login/Login';
import { withRouter } from 'react-router-dom';
import RestrictedRoute from "../routeTypes/RestrictedRoute";
import PrivateRoute from "../routeTypes/PrivateRoute";
import { useHistory } from "react-router-dom";

function App(props) {

    let history = useHistory();
    const [isPending, setIsPending] = useState(true);

    useEffect(() => {
        props.checkIfUserIsLoggedIn(setIsPending);
    }, []);

    useEffect(() => {
        if(props.isLoggedIn){
            props.fetchVideoRecords();
            history.push('/');
        } else {
            history.push(`/login`);
        }
    }, [props.isLoggedIn])

    return (
        <div className={styles.app} >
            {isPending ?
                <div className={styles.routerResult}>
                    <>Loading...</>
                </div>
                :
                <div className={styles.content}>
                    <Nav />
                    <div className={styles.routerResult}>
                        <Switch>
                            <PrivateRoute path="/" exact component={ImportVideo} />
                            <RestrictedRoute path="/login" exact component={Login} />
                            <PrivateRoute path="/saved" exact component={Saved} />
                            <PrivateRoute path="/video_record_details/:id" component={ItemDetails} />
                            <PrivateRoute path="/new_video_record" exact component={ItemDetails} />
                        </Switch>
                    </div>
                    <Footer />
                </div>
            }
        </div>
    );
}

App.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    fetchVideoRecords: PropTypes.func.isRequired,
    checkIfUserIsLoggedIn: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    isLoggedIn: state.authState.isLoggedIn,
});

export default connect(mapStateToProps, {fetchVideoRecords, checkIfUserIsLoggedIn})(withRouter(App));