import video from './Video.mp4';
import React, { useRef, useState, useEffect } from 'react';
import { FaBackward, FaForward } from 'react-icons/fa';

export default function ReactVideoPlayer() {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [autoplayEnabled, setAutoplayEnabled] = useState(true); // State to track autoplay

    useEffect(() => {
        const video = videoRef.current;
        const onTimeUpdate = () => {
            setCurrentTime(video.currentTime);
        };
        const onLoadedMetadata = () => {
            setDuration(video.duration);
        };

        video.addEventListener('timeupdate', onTimeUpdate);
        video.addEventListener('loadedmetadata', onLoadedMetadata);
        video.addEventListener('ended', handleEnded);

        return () => {
            video.removeEventListener('timeupdate', onTimeUpdate);
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            video.removeEventListener('ended', handleEnded);
        };
    }, []);

    const handlePlayPause = () => {
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
        setAutoplayEnabled(false); // Disable autoplay when the user interacts with controls
    };

    const handleMouseEnter = () => {
        setShowControls(true);
    };

    const handleMouseLeave = () => {
        setShowControls(false);
    };

    const handleSeek = (e) => {
        const newTime = e.target.value;
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleClick = (e) => {
        const { clientX, target } = e;
        const { left, width } = target.getBoundingClientRect();
        const clickPosition = (clientX - left) / width;
        const newTime = clickPosition * duration;
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleEnded = () => {
        // Seek to the start of the video when it ends
        videoRef.current.currentTime = 0;
        videoRef.current.play(); // Ensure the video resumes playing after seeking to the start
    };

    const handlePause = () => {
        videoRef.current.pause(); // Pause the video
        setIsPlaying(false);
    };

    return (
        <div style={{ position: 'relative' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <video
                ref={videoRef}
                controls={false}
                width="30%"
                src={video}
                onClick={handleClick}
                autoPlay={autoplayEnabled} // Conditionally enable autoplay
                muted // Mute the video
            />

            <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                style={{ width: '30%', position: 'fixed', bottom: '0', left: '0', height: '100%', opacity: '-0.9', pointerEvents: 'auto' }}
            />

            <div style={{ position: 'absolute', top: '30%', left: '15%', transform: 'translate(-50%, -10%)' }}>
                <button
                    onClick={() => {
                        videoRef.current.currentTime -= 0.2;
                    }}
                    style={{
                        border: '0px',
                        borderRadius: '0%',
                        padding: '4px',
                        background: 'transparent',
                        color: 'black',
                        cursor: 'pointer',
                    }}
                >
                    <FaBackward />
                </button>
                <button
                    onClick={() => {
                        videoRef.current.currentTime += 0.2;
                    }}
                    style={{
                        marginLeft: '300px',
                        border: '0px',
                        borderRadius: '0%',
                        padding: '4px',
                        background: 'transparent',
                        color: 'black',
                        cursor: 'pointer',
                    }}
                >
                    <FaForward />
                </button>
               
            </div>
        </div>
    );
}
