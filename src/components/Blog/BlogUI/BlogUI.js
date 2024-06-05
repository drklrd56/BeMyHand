/* eslint-disable no-unused-vars */
import React, {useEffect, useState} from "react";

import BlogHeader from "./BlogHeader";
import BlogBody from "./BlogBody";
import {useSpeechRecognition} from "react-speech-recognition";
import AddComment from "../../../containers/Blog/AddComment";

import Speech from 'speak-tts';
import CommentsViewer from "../../../containers/Blog/CommentsViewer";
function BlogUI(props) {
    // const commands = [
    //     {
    //         command: 'go back',
    //         callback: () => props.history.goBack(),
    //         description: 'Goes back to the previous page',
    //     },
    //     {
    //         command: 'scroll down',
    //         callback: () => window.scrollTo({top: window.pageYOffset + 500, behavior: "smooth"})
    //     },
    //     {
    //         command: 'scroll up',
    //         callback: () => window.scrollTo({top: window.pageYOffset - 500, behavior: "smooth"})
    //     },
    //     {
    //         command: 'add comment',
    //         callback: () => setShowAddComment(true),
    //         description: 'Opens up an input field for adding a comment.'
    //     },
    // ];
    // useEffect(() => {
    //     props.setCommands(commands);
    // }, [])
    //
    // const [showAddComment, setShowAddComment] = useState(false);
    // const hideAddComment = () => {
    //     setShowAddComment(false);
    // }
    //
    //
    // useEffect(() => {
    //     let userId = null;
    //     let header = authHeader();
    //     if (header.Authorization) {
    //         let uer = axios
    //             .get("http://localhost:8080/get-profile", { headers: header })
    //             .then((res) => {
    //                 userId = res.data.userId;
    //                 setUserId(userId);
    //                 console.log(res.data, "profile");
    //                 setUserPic(res.data.userProfile.ProfilePhotoSecureId);
    //                 updateBlogConfig(userId);
    //             })
    //             .catch((err) => {
    //                 updateBlogConfig(null);
    //                 console.log(err);
    //             });
    //     } else {
    //         updateBlogConfig(null);
    //     }
    //     console.log(header);
    // }, []);
    //
    //
    // const {Transcript} = useSpeechRecognition({commands});
    const [numOfComments, setNumOfComments] = useState(props.numOfComments);
    useEffect(() => {
        setNumOfComments(props.numOfComments);
    }, [props.numOfComments]);
    return (
        <React.Fragment>
            <BlogHeader config={{...props.config.header}}/>
            <BlogBody numOfLikes={props.numOfLikes} numComments={numOfComments} isLiked={props.isLiked} {...props.config.blogStats} viewBlog={props.viewBlog} config={{...props.config.body}}/>
            {props.showAddComment ?
                <AddComment setCommands={props.setCommands} {...props.commentsConfig}/>
                : ''}
            {props.showComments ? <CommentsViewer hideShowComment={props.hideShowComment} setCommands={props.setCommands} {...props.commentsConfig} comments={props.comments} /> : ''}
        </React.Fragment>
    );
}

export default BlogUI;
