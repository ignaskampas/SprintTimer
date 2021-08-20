import {FETCH_VIDEO_RECORDS} from './types';
import * as firebase from "firebase/app";

export const fetchVideoRecords = () => dispatch => {
    var database = firebase.database();
    var userId = firebase.auth().currentUser.uid;
    var videoRecordsRef = database.ref('users/' + userId + '/videoRecords/');
    videoRecordsRef.on("value", function(snap){
        var newVideoRecords = {}
        var categories = [];
        var payload = {};
        snap.forEach((videoRecord) => {
            newVideoRecords[videoRecord.key] = videoRecord.val()

            if(!categories.find(element => element === videoRecord.val().category)){
                categories.push(videoRecord.val().category);
            }
        })
        payload.newVideoRecords = newVideoRecords;
        payload.categories = categories.sort();
        dispatch({
            type: FETCH_VIDEO_RECORDS,
            payload: payload
        })
    })
}