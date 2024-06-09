/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';

import BlogHeader from './BlogHeader';
import BlogBody from './BlogBody';
import { useSpeechRecognition } from 'react-speech-recognition';
import AddComment from '../../../containers/Blog/AddComment';

import Speech from 'speak-tts';
import CommentsViewer from '../../../containers/Blog/CommentsViewer';
function BlogUI(props) {
  const [numOfComments, setNumOfComments] = useState(props.numOfComments);
  useEffect(() => {
    setNumOfComments(props.numOfComments);
  }, [props.numOfComments]);
  return (
    <React.Fragment>
      <BlogHeader config={{ ...props.config.header }} />
      <BlogBody
        numOfLikes={props.numOfLikes}
        numComments={numOfComments}
        isLiked={props.isLiked}
        {...props.config.blogStats}
        viewBlog={props.viewBlog}
        config={{ ...props.config.body }}
      />
      {props.showAddComment ? (
        <AddComment setCommands={props.setCommands} {...props.commentsConfig} />
      ) : (
        ''
      )}
      {props.showComments ? (
        <CommentsViewer
          hideShowComment={props.hideShowComment}
          setCommands={props.setCommands}
          {...props.commentsConfig}
          comments={props.comments}
        />
      ) : (
        ''
      )}
    </React.Fragment>
  );
}

export default BlogUI;
