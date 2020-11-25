import React,  {useState, useEffect, useRef, useLayoutEffect} from 'react';
import styles from './videoWithSliders.module.scss'
import ResizeObserver from 'react-resize-observer';

export default function VideoWithSliders(props) {

    const videoRef1 = useRef();
    var videoNode1;
    const videoSrc = props.videoSrc;
    const [videoW, setVideoW] = useState(0);
    const [videoTime, setVideoTime] = useState(props.initialVidTime);
    const videoTimeRef = useRef(videoTime);
    const onMouseMove1Ref = useRef();
    const onMouseMove2Ref = useRef();
    const onMouseUpRef = useRef();
    const [videoDuration, setVideoDuration] = useState();
    const [lastMousePos, setLastMousePos] = useState();
    const lastMousePosRef = useRef(lastMousePos);
    const [lastVideoTime, setLastVideoTime] = useState();
    const lastVideoTimeRef = useRef(lastVideoTime);
    const sliderRef1 = useRef();
    const sliderRef2 = useRef();
    var sliderNode1;
    var sliderNode2;
    const sliderContRef1 = useRef();
    const sliderContRef2 = useRef();
    var sliderSens1 = 1;
    var sliderSens2 = 30;
    const [changedSize, setChangedSize] = useState(true);
    var touchDetectorNode1;
    var touchDetectorNode2;
    const touchDetector1Ref = useRef();
    const touchDetector2Ref = useRef();    

    useEffect(() => {
        lastMousePosRef.current = lastMousePos;
    }, [lastMousePos])

    useEffect(() => {
        videoTimeRef.current = videoTime;
    }, [videoTime])

    useEffect(() => {
        lastVideoTimeRef.current = lastVideoTime;
    }, [lastVideoTime])

    useLayoutEffect(() => {
        videoNode1 = videoRef1.current;
        touchDetectorNode1 = touchDetector1Ref.current;
        touchDetectorNode2 = touchDetector2Ref.current;
    })

    useEffect(() => {
        touchDetector1Ref.current.addEventListener("touchstart", (event) => {onTouchStart(event, 0)}, {passive: false})
        touchDetector2Ref.current.addEventListener("touchstart", (event) => {onTouchStart(event, 1)}, {passive: false})
        touchDetector1Ref.current.addEventListener("mousedown", (event) => {onMouseDown(event, 0)}, {passive: false})
        touchDetector2Ref.current.addEventListener("mousedown", (event) => {onMouseDown(event, 1)}, {passive: false})
        touchDetector1Ref.current.addEventListener("touchmove", (event) => {onTouchMove(event, 0)}, {passive: false})
        touchDetector2Ref.current.addEventListener("touchmove", (event) => {onTouchMove(event, 1)}, {passive: false})

        return () => {
            window.removeEventListener('mousemove', onMouseMove1Ref.current);
            window.removeEventListener('mousemove', onMouseMove2Ref.current);
            window.removeEventListener('mouseup', onMouseUpRef.current);
        }
    }, []);

    useLayoutEffect(() => {
        videoNode1 = videoRef1.current;
        // The loadedmetadata event is fired when the metadata has been loaded.
        videoNode1.onloadedmetadata = evt => {
            const maxSize = 600;
            var videoWidth = videoNode1.videoWidth;
            var videoHeight = videoNode1.videoHeight;
            var newW;
            if (videoWidth >= videoHeight){
                newW = maxSize;
            } else {
                newW = maxSize / videoHeight * videoWidth;
            }
            setVideoW(newW);
            setVideoDuration(videoNode1.duration);
        }
        videoNode1.src = videoSrc;
    }, [])

    useLayoutEffect(() => {
        sizeDraggableSlider(sliderNode1, sliderRef1, sliderSens1, touchDetectorNode1)
        sizeDraggableSlider(sliderNode2, sliderRef2, sliderSens2, touchDetectorNode2)
    }, [videoTime, videoW, videoDuration, changedSize]);

    const sizeDraggableSlider = function(sliderNode, sliderRef, sliderSens, touchDetectorNode){
        sliderNode = sliderRef.current;
        var left = -1 * videoTime * 100 * (1/sliderSens);
        var sliderContL = sliderContRef1.current.offsetWidth;
        if(sliderContL > 0){
            if(left*-1 > (sliderContL/2)){
                left = sliderContL/2 * -1;
            }
        }
        var maxSliderL = videoDuration * 100 * (1/sliderSens);
        var unusedSlidContL = sliderContL - (sliderContL / 2) + left;
        var spaceForSliderL = sliderContL - unusedSlidContL;
        var finalSliderL = maxSliderL;
        if (finalSliderL > spaceForSliderL){
            finalSliderL = spaceForSliderL;
            if ((videoDuration * 100) - (videoTime * 100) * (1/sliderSens) < sliderContL/2){
                finalSliderL = finalSliderL - ((sliderContL/2) - (((videoDuration * 100) - (videoTime * 100)) * (1/sliderSens)));
            }
        } else if (maxSliderL >= sliderContL/2 && maxSliderL < sliderContL){
            if(left == -1 * sliderContL/2){
                finalSliderL = sliderContL - ((sliderContL/2) - (((videoDuration * 100) - (videoTime * 100)) * (1/sliderSens)));
            }
        }
        sliderNode.style.cssText = `position: relative; height: 100%; width: ${finalSliderL}px; left: ${left}px; transform: translateX(${sliderContL/2}px);`
        while (sliderNode.firstChild) {
            sliderNode.removeChild(sliderNode.lastChild);
        }
        var sliderCurrentL = 0;
        var maxRectL = 39;
        var timeOnLeft = (parseFloat(videoTime, 10) + ((left/100) * sliderSens));
        var sliderLeftPxPos = maxSliderL * (timeOnLeft/videoDuration);
        var firstRectL = maxRectL - (sliderLeftPxPos % maxRectL);
        if (firstRectL == 0) {
            firstRectL = maxRectL;
        }
        if (firstRectL > maxSliderL){
            firstRectL = maxSliderL;
        }
        const firstRect = document.createElement('div');
        firstRect.classList.add(styles.rectangle);
        firstRect.style.cssText = `width: ${firstRectL}px;`;
        sliderNode.appendChild(firstRect);
        sliderCurrentL += firstRectL;
        while (sliderCurrentL < finalSliderL) {
            var nextRectL = maxRectL;
            var rectSpaceLeftL = finalSliderL - sliderCurrentL;
            if (nextRectL > rectSpaceLeftL){
                nextRectL = rectSpaceLeftL;
            }
            const nextRect = document.createElement('div');
            nextRect.classList.add(styles.rectangle);
            nextRect.style.cssText = `width: ${nextRectL}px;`;
            sliderNode.appendChild(nextRect);
            sliderCurrentL += nextRectL;
        }
        touchDetectorNode.style.cssText = `left: ${left}px; transform: translateX(${sliderContL/2}px); width: ${finalSliderL}px`;
    }

    function onTouchStart(ev, arg){
        ev.preventDefault();
        setLastMousePos(ev.touches[0].clientX);
        setLastVideoTime(parseFloat(videoNode1.currentTime, 10).toFixed(2));
    }

    function onTouchMove(ev, arg){
        ev.preventDefault();
        var mouseMoveAmount = lastMousePosRef.current - ev.touches[0].clientX;
        var timeDifference = (mouseMoveAmount/100*(-1)).toFixed(2);
        var newTime = (parseFloat(lastVideoTimeRef.current, 10) + parseFloat(timeDifference * (arg === 0 ? sliderSens1 : sliderSens2) * -1, 2)).toFixed(2);
        if (newTime < 0){
            newTime = (0).toFixed(2);
        }
        var vidDur = videoNode1.duration;
        if(newTime > vidDur){
            newTime = vidDur.toFixed(2);    
        }
        setLastVideoTime(newTime);
        setLastMousePos(ev.touches[0].clientX);
        setVideoTime(newTime);
        props.updateTime(newTime);
    }

    const onMouseMove = function(ev, mult) {
        ev.preventDefault();
        var mouseMoveAmount = lastMousePosRef.current - ev.screenX;
        var timeDifference = (mouseMoveAmount/100*(-1)).toFixed(2);
        var newTime = (parseFloat(parseFloat(videoRef1.current.currentTime, 10).toFixed(2), 10) + parseFloat(timeDifference * mult * -1, 2)).toFixed(2);
        if (newTime < 0){
            newTime = (0).toFixed(2);
        }
        var vidDur = videoRef1.current.duration;
        if(newTime > vidDur){
            newTime = vidDur.toFixed(2);    
        }
        setLastVideoTime(newTime);
        setLastMousePos(ev.screenX);
        setVideoTime(newTime);
        props.updateTime(newTime);
    }

    useEffect(() => {
        setVideoElTime();
    }, [videoTime])

    const setVideoElTime = function(){
        if (isNaN(videoTime)){
            videoNode1.currentTime = 0.00;    
        } else {
            videoNode1.currentTime = videoTime;
        }
    }

    const onMouseMove1 = function(ev) {
        onMouseMove(ev, sliderSens1);
    }

    const onMouseMove2 = function(ev) {
        onMouseMove(ev, sliderSens2);
    }

    function onMouseDown(ev, arg) {
        ev.preventDefault();
        ev.stopPropagation();
        setLastMousePos(ev.screenX);
        if (arg === 0){
            onMouseMove1Ref.current = onMouseMove1;
            window.addEventListener('mousemove', onMouseMove1Ref.current);
        } else {
            onMouseMove2Ref.current = onMouseMove2;
            window.addEventListener('mousemove', onMouseMove2Ref.current);
        }
        onMouseUpRef.current = onMouseUp;
        window.addEventListener('mouseup', onMouseUpRef.current);
        setLastVideoTime(parseFloat(videoRef1.current.currentTime, 10).toFixed(2));
    }

    function onMouseUp(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        window.removeEventListener('mousemove', onMouseMove1Ref.current);
        window.removeEventListener('mousemove', onMouseMove2Ref.current);
        window.removeEventListener('mouseup', onMouseUpRef.current);
    }

    return (
        <div className={styles.videoWithSlider}>
            <div className={styles.videoContainer}>
                <video className={styles.video} ref={videoRef1} id="video"></video>
                <div className={styles.timeDisplay}>
                    {parseFloat(videoTime, 10).toFixed(2)}
                </div>
            </div>
            <div className={styles.sliderContainer} ref={sliderContRef1} 
                >
                <ResizeObserver
                    onResize={(rect) => {
                        setChangedSize(!changedSize);
                    }}
                />
                <div className={styles.touchDetector} ref={touchDetector1Ref}></div>
                <div ref={sliderRef1} className={styles.slider}></div>
                <div className={styles.vidPosLineRef}></div>
            </div>
            <div className={styles.sliderContainer}  ref={sliderContRef2}
                >
                <div className={styles.touchDetector} ref={touchDetector2Ref}></div>
                <div ref={sliderRef2} className={styles.slider}></div>
                <div className={styles.vidPosLineRef}></div>
            </div>
        </div>
    )
}
