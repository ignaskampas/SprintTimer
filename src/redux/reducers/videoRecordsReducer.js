import {FETCH_VIDEO_RECORDS} from '../actions/types';

const initialState = {
    videoRecords: {},
    categories: [],
    isPending: true
}

export default function(state = initialState, action){
    switch(action.type){
        case FETCH_VIDEO_RECORDS:
            return {
                ...state,
                videoRecords: action.payload.newVideoRecords,
                categories: action.payload.categories,
                isPending: false
            }
        default:
            return state;
    }
}