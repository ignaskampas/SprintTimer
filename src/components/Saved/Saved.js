import React,  {useState, useEffect} from 'react';
import styles from './saved.module.scss'
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { useHistory } from "react-router-dom";
import ReactPaginate from 'react-paginate';
import {ImBin} from 'react-icons/im'
import Dropdown from '../Dropdown/Dropdown'
import {firebaseDb, storageRef, firebaseAuth} from '../../firebase/index.js';
import heapSort from '../../utils/heapSort'

function Saved(props) {
    var userId = firebaseAuth.currentUser !== null ? firebaseAuth.currentUser.uid : null;
    var userRef = firebaseDb.ref('users/' + (firebaseAuth.currentUser !== null ? firebaseAuth.currentUser.uid : ""));
    const [categories, setCategories] = useState(props.categories);
    const [filterCategory, setFilterCategory] = useState(categories[0]);
    const [filteredVideoRecordIds, setfilteredVideoRecordIds] = useState([]);
    const filterOptions = ["Newest", "Oldest", "Smallest Sprint Time", "Largest Sprint Time"];
    const [filterOption, setFilterOption] = useState(filterOptions[0]);
    let history = useHistory();
    const [pageCount, setPageCount] = useState(1);
    // Temp value is 10. But later increase this.
    var itemsPerPage = 10;
    const [firstVidRecordInPageIdx, setFirstVidRecordInPageIdx] = useState(0);

    useEffect(() => {
        var newCategories = ["All"].concat(props.categories);
        setFilterCategory(newCategories[0]);
        setCategories(newCategories);
    }, [props.categories]);

    useEffect(() => {
        onFilterChange();
    }, [props.videoRecords, filterCategory, filterOption])

    var dateFromEpochTime = function(time){
        return (new Date(time)).toLocaleDateString();
    }

    var deleteVideoRecord = function(event, uid, videoSaved){
        event.preventDefault();
        event.stopPropagation();
        userRef.child('videoRecords/' + uid).remove()

        if(videoSaved){
            storageRef.child('videos/' + userId + '/' + uid).delete().then(function() {
                // file deleted successfully
            }).catch(function(error) {
                console.log(error)
            })
        }
        setfilteredVideoRecordIds([]);
    }
    
    function onFilterChange(){
        var newFilteredUnorderedIds = [];
        var attributeToOrderBy = filterOption === filterOptions[0] || filterOption === filterOptions[1] ? "date" : "sprintTime";
        if(filterCategory === categories[0]){
            // Category is set to "All". Apply no filtering.
            for (const videoRecordKey in props.videoRecords){
                newFilteredUnorderedIds.push({uid: videoRecordKey, [attributeToOrderBy]: props.videoRecords[videoRecordKey][attributeToOrderBy]});
            }
        } else {
            // Filter by category
            for (const videoRecordKey in props.videoRecords){
                if(props.videoRecords[videoRecordKey].category === filterCategory){
                    newFilteredUnorderedIds.push({uid: videoRecordKey, [attributeToOrderBy]: props.videoRecords[videoRecordKey][attributeToOrderBy]});
                }
            }
        }

        // Filter by attribute
        heapSort(newFilteredUnorderedIds, attributeToOrderBy);
        if(filterOption === filterOptions[0] || filterOption === filterOptions[3]){
            // largest values first - need to reverse the list
            newFilteredUnorderedIds.reverse();
        }
        setfilteredVideoRecordIds(newFilteredUnorderedIds);
        var nrVidRecords = newFilteredUnorderedIds.length;
        var nrPages = Math.ceil(nrVidRecords / itemsPerPage) === 0 ? 1 : Math.ceil(nrVidRecords / itemsPerPage);
        setPageCount(nrPages);
    }

    function onListItemClicked(event, uid){
        event.preventDefault();
        event.stopPropagation();
        history.push(`/video_record_details/${uid}`);
    }

    function handlePageClick(data){
        var pageIdx = data.selected
        setFirstVidRecordInPageIdx(pageIdx * itemsPerPage);
    }

    const getJSXList = (firstIdx, allIndices) => {
        let content = [];
        for (let i = firstIdx; (i < allIndices.length) && (i < (firstIdx + itemsPerPage)); i++){
            content.push(
                <li className={styles.videoRecordRowLi} key={i} onClick={function(event){
                    onListItemClicked(event, allIndices[i].uid)
                } }>
                    {
                    <div className={styles.videoRecordRow}>
                        <div className={styles.videoRecordData}>
                            <div className={[styles.videoRecordDataPiece, styles.videoRecordCategory].join(" ")}>{props.videoRecords[allIndices[i].uid].category}</div>
                            <div className={styles.videoRecordTimeAndDate}>
                                <div className={[styles.videoRecordDataPiece,styles.videoRecordTime].join(" ")}>{props.videoRecords[allIndices[i].uid].sprintTime}s</div>
                                <div className={[styles.videoRecordDataPiece, styles.videoRecordDate].join(" ")}>{dateFromEpochTime(props.videoRecords[allIndices[i].uid].date)}</div>
                            </div>
                            
                        </div> 
                        <button className={styles.binBtn} onClick={function(event){deleteVideoRecord(event, allIndices[i].uid, props.videoRecords[allIndices[i].uid].videoSaved)}}>
                                <ImBin className={styles.binIcon}/>
                        </button> 
                    </div>
                    }
                </li>
            )
        }
        return content;
    }

    return (
        <div>
            <div className={styles.savedCenter}>

                <div className={styles.filterOptions}>
                    <div className={styles.filterOptionsItem}>
                        <label className={styles.filterOptionLabel} htmlFor="Filter Option">Category:</label>
                        <div className={styles.filterDropdown}>
                            <Dropdown updateParentSelected={setFilterCategory} options={categories}  />
                        </div>
                    </div>
                    <div className={styles.filterOptionsItem}>
                        <label className={styles.filterOptionLabel} htmlFor="Filter Option">Filter:</label>
                        <div className={styles.filterDropdown}>
                            <Dropdown updateParentSelected={setFilterOption} options={filterOptions}  />
                        </div>
                    </div>
                </div>

                <div className={styles.line}></div>
                
                <ol className={styles.videoRecordList}>
                    {getJSXList(firstVidRecordInPageIdx, filteredVideoRecordIds)}
                </ol>

                <div className={styles.line}></div>

                <div className={styles.paginationContainer}>
                    <ReactPaginate
                        previousLabel={'<'}
                        nextLabel={'>'}
                        breakLabel={'...'}
                        breakClassName={styles.breakMe}
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={2}
                        onPageChange={handlePageClick}
                        containerClassName={styles.pagination}
                        subContainerClassName={styles.pagesPagination}
                        activeClassName={styles.active}
                    />
                </div>
            </div>
        </div>
    )
}

Saved.propTypes = {
    videoRecords: PropTypes.object.isRequired,
    categories: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
    videoRecords: state.videoRecordsState.videoRecords,
    categories: state.videoRecordsState.categories
});

export default connect(mapStateToProps, {})(Saved)