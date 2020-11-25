import {combineReducers} from 'redux';
import authStateReducer from './authStateReducer.js'
import videoReducer from './videoReducer.js'
import videoRecordsReducer from './videoRecordsReducer.js'

export default combineReducers({
    authState: authStateReducer,
    videoState: videoReducer,
    videoRecordsState: videoRecordsReducer
})