import React from 'react'
import style from './importVideo.module';
import { useHistory } from "react-router-dom";
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {updateVideoSrc} from '../../redux/actions/videoActions';
import styles from './importVideo.module.scss'

function ImportVideo(props) {

    let history = useHistory();

    const handleDrop = function(ev){
      let dt = ev.dataTransfer
      let files = dt.files

      handleFiles(files)
    }

    function handleFiles(files) {
      files = [...files]
      saveVidInStore(files[0]);
    }

    function saveVidInStore(file){
      const URL = window.URL || window.webkitURL;
      props.updateVideoSrc(URL.createObjectURL(file));
      history.push('/new_video_record')
    }

    const onDrop = (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      handleDrop(ev);
    }
    
    const onDragOver = (ev) => {
      ev.preventDefault();
      ev.stopPropagation()
    }
    
    const onDragEnter = (ev) => {
      ev.preventDefault();
      ev.stopPropagation()
    }
    
    const onDragLeave = (ev) => {
      ev.preventDefault();
      ev.stopPropagation()
    }

    const onChange = (ev) => {
      console.log("hello")
      const fileList = event.target.files;
      handleFiles(fileList);
    }

    return (
        <div>
          <div className={styles.importVideoCenter}> 
            {/* For debug:  */}
            {/* <Link to='/new_video_record'>Item Details</Link> */}
            {/* <br /> */}
            <form>
              <div 
                className={style.dropZone} 
                onDrop={event => onDrop(event)}
                onDragOver={(event => onDragOver(event))}
                onDragEnter={(event => onDragEnter(event))}
                onDragLeave={(event => onDragLeave(event))}
              >
                <p>Drop video here</p>
              </div>
              <br />
              <label className={styles.btn}>
                <input className={styles.input} type="file" onChange={(event => onChange(event))} />
                Choose Video
              </label>
            </form>
          </div>
        </div>
    )
}

ImportVideo.propTypes = {
  updateVideoSrc: PropTypes.func.isRequired
};

export default connect(null, {updateVideoSrc})(ImportVideo);