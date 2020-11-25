import {UPDATE_VIDEO_SRC} from '../actions/types';

const initialState = {
    src: null
}

export default function(state = initialState, action){
    switch(action.type){
        case UPDATE_VIDEO_SRC:
            return {
                ...state,
                src: action.payload
            }
        default:
            return state;
    }
}