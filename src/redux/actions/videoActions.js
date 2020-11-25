import {UPDATE_VIDEO_SRC} from './types';

export const updateVideoSrc = (src) => dispatch => {
    dispatch({
        type: UPDATE_VIDEO_SRC,
        payload: src
    })
}