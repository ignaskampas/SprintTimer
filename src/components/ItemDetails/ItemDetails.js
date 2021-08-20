import React,  {useState, useEffect, useLayoutEffect} from 'react';
import styles from './itemDetails.module.scss'
import VideoWithSliders from '../VideoWithSliders/VideoWithSliders';
import {firebaseDb, storageRef, firebaseAuth} from '../../firebase/index.js';
import {connect} from 'react-redux';
import { useHistory } from "react-router-dom";
import Button from '../Button/Button';
import DayPicker from '../DayPicker/DayPicker';
import Checkbox from '../Checkbox/Checkbox';
import DropdownWithInput from '../DropdownWithInput/DropdownWithInput';

function ItemDetails(props) {
    const [vidStartTime, setVidStartTime] = useState(0);
    const [vidEndTime, setVidEndTime] = useState(0);
    const [sprintTime, setSprintTime] = useState(0);
    const [selectedDay, setSelectedDay] = useState(new Date());
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    var userId = firebaseAuth.currentUser !== null ? firebaseAuth.currentUser.uid : null;
    const [showNoCategoryError, setShowNoCategoryError] = useState(false);
    const [saveVideo, setSaveVideo] = useState(false);
    var userRef = firebaseDb.ref('users/' + userId);
    const [isNewVideoRecord, setIsNewVideoRecord] = useState();
    const [isPending, setIsPending] = useState(true);
    const [videoSource, setVideoSource] = useState();
    const [videoRecordUid, setVideoRecordUid] = useState();
    let history = useHistory();
    const [isSavingVid, setIsSavingVid] = useState(false);

    useEffect(() => {
        if(props.vrsAreRetrievedFromFb){
            if(props.match.path === "/video_record_details/:id"){
                // THIS IS AN EXISTING VIDEO RECORD
                var vrId = props.match.params.id;
                // old video record
                var oldVR = props.videoRecords[vrId];
                setSelectedDay(new Date(oldVR.date));
                setSelectedCategory(oldVR.category);
                setVideoRecordUid(vrId);
                setVidStartTime(parseFloat(props.videoRecords[vrId].vidStartTime, 10).toFixed(2)); 
                setVidEndTime(parseFloat(props.videoRecords[vrId].vidEndTime, 10).toFixed(2));
                setIsNewVideoRecord(false);
                if(props.videoRecords[vrId].videoSaved){
                    // video was saved
                    setSaveVideo(oldVR.videoSaved);
                    var videoRef = storageRef.child('videos/' + userId + '/' + vrId);
                    videoRef.getDownloadURL().then(function(url) {
                        setVideoSource(url)
                    })
                } else {
                    // video was not saved
                }
            } 
            else {
                // THIS IS A NEW VIDEO RECORD
                setIsNewVideoRecord(true);
                setVideoSource(props.videoSrc);
            }
            setIsPending(false);
            setCategories(props.categories);
        }
    }, [props.vrsAreRetrievedFromFb]);

    useLayoutEffect(() => {
        var newSprintTime = (parseFloat(vidEndTime, 10) - parseFloat(vidStartTime, 10)).toFixed(2);
        if (newSprintTime < 0){
            newSprintTime = (0).toFixed(2);
        }
        setSprintTime(parseFloat(newSprintTime));
    }, [vidStartTime, vidEndTime])

    function newVideoRecordObj(sprintTime, date, category, videoSaved, vidStartTime, vidEndTime){
        return {
            sprintTime: sprintTime,
            date: date,
            category: category,
            videoSaved: videoSaved,
            vidStartTime: vidStartTime,
            vidEndTime: vidEndTime
        }
    }

    function saveVideoRecord(){
        if(selectedCategory === ""){
            setShowNoCategoryError(true);
        } else {
            setShowNoCategoryError(false);
            setIsSavingVid(true);
            if(isNewVideoRecord){
                userRef.child('videoRecords/').push(
                    newVideoRecordObj(sprintTime, selectedDay.getTime(), selectedCategory, saveVideo, vidStartTime, vidEndTime)
                ).then((snapshot) => {
                    // need to make sure that the user didnt make up a category called "All".
                    if(saveVideo){

                        // set "Saving..." here.
                        // store the video in firebase storage
                        var blob = null
                        var xhr = new XMLHttpRequest()
                        xhr.open("GET", videoSource)
                        xhr.responseType = "blob"
                        
                        xhr.onload = function() 
                        {
                            // TO DO: make a progress bar
                            blob = xhr.response
                            var videoRef = storageRef.child('videos/' + userId + '/' + snapshot.key);
                            videoRef.put(blob).then(function(snapshot) {
                                console.log("hello")
                                history.push('/saved');
                            });
                        }
                        xhr.send()
                    } else {
                        history.push('/saved');
                    }
                });
            } else {
                // updating current video record
                var videoRecordRef = userRef.child('videoRecords/' + videoRecordUid);
                // console.log("saving video")
                var videoWasSaved = props.videoRecords[videoRecordUid].videoSaved;
                videoRecordRef.set(
                    newVideoRecordObj(sprintTime, selectedDay.getTime(), selectedCategory, saveVideo, vidStartTime, vidEndTime)
                ).then((snapshot) => {
                    // need to make sure that the user didnt make up a category called "All".
                    if(saveVideo){
                        history.push('/saved');
                    } else {
                        // don't save video - need to check if the video was saved before. If so, delete it
                        if(videoWasSaved){
                            storageRef.child('videos/' + userId + '/' + videoRecordUid).delete().then(function() {
                                // file deleted successfully
                                setVideoSource(undefined);
                                history.push('/saved');
                            }).catch(function(error) {
                                console.log(error)
                            })
                        } else {
                            history.push('/saved');
                        }
                    }
                });
            }
        }
    }

    var deleteVideoRecord = function(event, uid, videoSaved){
        event.preventDefault();
        event.stopPropagation();
        userRef.child('videoRecords/' + uid).remove();

        if(videoSaved){
            storageRef.child('videos/' + userId + '/' + uid).delete().then(function() {
                // file deleted successfully
                history.push('/saved');
            }).catch(function(error) {
                console.log(error)
            })
        } else{
            history.push('/saved');
        }
    }

    return (
        <div className={styles.itemDetails}>
            <div className={styles.itemDetailsCenter}>
                {isPending ? 
                    <>Loading...</>
                :
                    <div>

                        {isSavingVid ?
                            <>Saving...</>
                            :
                            <div>
                    
                                <div>   
                                    {videoSource !== undefined ? 
                                        <div>
                                            <div className={styles.videoWithSliders}>
                                                <VideoWithSliders initialVidTime={vidStartTime} updateTime={setVidStartTime} videoSrc={videoSource}/>
                                                <br />
                                            </div>
                                            <div className={styles.videoWithSliders}>
                                                <VideoWithSliders initialVidTime={vidEndTime} updateTime={setVidEndTime} videoSrc={videoSource}/>
                                                <br />
                                            </div>
                                        </div>
                                        : 
                                        <div></div>
                                    }
                                    
                                    <form>
                                        <div className={styles.textRow}>Time: {sprintTime}s</div>
                                        <div className={styles.textRow}>
                                            <label htmlFor="date">Date:</label>
                                            &nbsp;
                                            <DayPicker selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
                                            <br />
                                        </div>
                                        <div className={styles.textRow}>
                                            <div className={showNoCategoryError ? styles.showNoCategoryError : styles.hideNoCategoryError}>You must choose a category</div>
                                            <div className={styles.categoryLWithDropdown}>
                                                <label htmlFor="category">Category:</label>
                                                &nbsp;
                                                <div className={styles.categoryDropdown}>
                                                    <DropdownWithInput 
                                                        id="category"
                                                        value={selectedCategory} 
                                                        setSelectedCategory={setSelectedCategory} 
                                                        options={categories} />
                                                </div>
                                            </div>
                                        </div>   
                                        {videoSource !== undefined ? 
                                            <div className={styles.checkbox}>
                                                <Checkbox isChecked={saveVideo} setIsChecked={setSaveVideo} text="Save Video:" />
                                            </div>
                                            :
                                            <div></div>
                                        }
                                        <div className={styles.saveAndDeleteBtns}>
                                            {!isNewVideoRecord ? 
                                                <div className={styles.deleteBtn}>
                                                    <Button text="Delete" onClick={function(event){deleteVideoRecord(event, videoRecordUid, props.videoRecords[videoRecordUid].videoSaved)}}></Button> 
                                                </div> 
                                                : 
                                                <div></div>}
                                            <Button onClick={saveVideoRecord} text="Save"></Button>
                                        </div>
                                    </form>
                                </div>
                                <br/>
                                <br/>  
                            </div>
                        }

                    </div>
                    
                
                }  
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    videoSrc: state.videoState.src,
    videoRecords: state.videoRecordsState.videoRecords,
    // vrsAreRetrievedFromFb stands for: video records are retrieved from firebase
    vrsAreRetrievedFromFb: !(state.videoRecordsState.isPending),
    categories: state.videoRecordsState.categories
});

export default connect(mapStateToProps)(ItemDetails);