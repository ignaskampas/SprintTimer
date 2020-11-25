import {UPDATE_AUTH_STATE, UPDATE_PENDING, CHECK_IF_USER_IS_LOGGED_IN} from '../actions/types';

const initialState = {
    isLoggedIn: false,
    isPending: true
}

export default function(state = initialState, action){
    switch (action.type){
        case UPDATE_AUTH_STATE:
            return {
                ...state,
                isLoggedIn: action.payload
            }
        case UPDATE_PENDING:
            return {
                ...state,
                isPending: action.payload
            }
        case CHECK_IF_USER_IS_LOGGED_IN:
            return {
                ...state,
                isLoggedIn: action.payload.isLoggedIn,
                isPending: action.payload.isPending
            }
        default:
            return state;
    }
}