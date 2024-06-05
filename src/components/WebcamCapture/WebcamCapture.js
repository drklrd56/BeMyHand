import React from "react";
import Webcam from "react-webcam";
import './WebcamCapture.css';
import {useSpeechRecognition} from "react-speech-recognition";

const WebcamCapture = (props) => {

    const commands = [
        {
          command: 'capture photo.',
          callback: () => { props.addFacialAuth || props.verifyFacialAuth ? captureForFacialAuth() : capture()},
          description: 'Captures Profile Photo'
        }
      ];
    
    
      const {Transcript} = useSpeechRecognition({commands});
    


    const webcamRef = React.useRef(null);
    const [imgSrc, setImgSrc] = React.useState(null);

    function dataURLtoFile(dataurl, filename) {
 
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), 
            n = bstr.length, 
            u8arr = new Uint8Array(n);
            
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        
        return new File([u8arr], filename, {type:mime});
    }

    const capture = async () => {
        console.log("Profile Pic");
        const imageSrc = webcamRef.current.getScreenshot();
        // console.log(imageSrc);
        // const blob = await fetch(imageSrc).then((res) => res.blob());
        // setImgSrc(imageSrc);

        // console.log(blob);

        // blob.lastModifiedDate = new Date();
        // blob.name = "profilePicture";

        var file = await dataURLtoFile(imageSrc,`profile${JSON.parse(localStorage.getItem("user")).userId}.jpg`);
        // console.log(file);
        props.fileSelectedHandler(null,file);
        props.ProfileModalClosedHandler();

    }

    const captureForFacialAuth = async () => {
        console.log("Facial Auth");
        const imageSrc = webcamRef.current.getScreenshot();
        // console.log(imageSrc);
        // const blob = await fetch(imageSrc).then((res) => res.blob());
        // setImgSrc(imageSrc);

        // console.log(blob);

        // blob.lastModifiedDate = new Date();
        // blob.name = "profilePicture";

        var file = await dataURLtoFile(imageSrc,`profile${JSON.parse(localStorage.getItem("user")).userId}.jpg`);
        // console.log(file);

        if (props.verifyFacialAuth) {
            props.verifyFacialAuthHandler(file);
            props.FaceAuthModalClosedHandler();
        }
        else {
            props.addFacialAuthHandler(file);
            props.ProfileModalClosedHandler();
        }

    }

    return (
        <>
        {console.log(props.addFacialAuth)}
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
            />
            <button style={{textAlign:"center"}} onClick={props.addFacialAuth ||  props.verifyFacialAuth ? captureForFacialAuth : capture}>Capture photo</button>
            {imgSrc && (
                <img
                    src={imgSrc}
                />
            )}
        </>
    );
};

export default WebcamCapture;
