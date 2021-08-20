import {UPDATE_AUTH_STATE} from './types';
import {UPDATE_PENDING} from './types';
import {CHECK_IF_USER_IS_LOGGED_IN} from './types';
import {firebase} from '../../firebase/index.js';

export const updateAuthState = (auth) => dispatch => {
    dispatch({
        type: UPDATE_AUTH_STATE,
        payload: auth
    })
}

export const updatePending = (isPending) => dispatch => {
    dispatch({
        type: UPDATE_PENDING,
        payload: isPending
    })
}

export const checkIfUserIsLoggedIn = (setIsPending) => dispatch => {
    firebase.auth().onAuthStateChanged((newAuthUser) => {
        setIsPending(false);
        dispatch({
            type: CHECK_IF_USER_IS_LOGGED_IN,
            payload: {isLoggedIn: newAuthUser ? true : false , isPending: false}
        })
    });
}