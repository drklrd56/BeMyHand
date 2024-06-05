/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { convertFromRaw, EditorState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import BlogUI from '../../../components/Blog/BlogUI';
import axios from 'axios';
import AddComment from '../AddComment';
import { useSpeechRecognition } from 'react-speech-recognition';
import authHeader from '../../../services/auth-header';
import authService from '../../../services/auth-service';
import LinearProgress from '@material-ui/core/LinearProgress';

import { useSnackbar } from 'notistack';

const speech = new SpeechSynthesisUtterance();

function BlogManager(props) {
  // BlogManager States Initialization
  const [blogId, setBlogId] = useState(props.match.params.id); //Extracted from the URL
  const [blogLiked, setBlogLiked] = useState(false); //Used for setting the blog liked status for current user
  const [loading, setLoading] = useState(true); //Shows loader while an http request is under progress
  const [userPic, setUserPic] = useState(''); //Needed to be shown while the user adds a comment
  const [userId, setUserId] = useState(''); //Needed for user authorization
  const [username, setUsername] = useState(''); //Needed to be shown while the user adds a comment
  const [owner, setOwner] = useState(false); //Checks whether the current user is also the author of the current blog
  const [isLiked, setIsLiked] = useState(false); //Used for checking if the blog is already liked by the current user
  const [numOfLikes, setNumOfLikes] = useState(0); //Used to show the number of likes on this blog
  const [numOfComments, setNumOfComments] = useState(0); //Used to show the number of comments on this blog
  const [comments, setComments] = useState([]); //Used to store the comments on this blog
  const [showComments, setShowComments] = useState(false); //To check whether to show the comments
  const [blogConfig, setBlogConfig] = useState({}); //Holds the entire blog config
  const [viewBlog, setViewBlog] = useState(false); //Becomes true when the blog has been fetched
  const [showAddComment, setShowAddComment] = useState(false); //If true then show the comment input for new comment
  const [counter, setCounter] = useState(0);
  const { enqueueSnackbar } = useSnackbar(); //Shows alert messages at the bottom left of the screen
  const [article, setArticle] = useState(EditorState.createEmpty()); //Holds the article content
  const handleCommentBoxOpened = () => {
    setCounter((prevState) => prevState + 1);
  };

  const handleCommentBoxOpenedStatusChange = (status) => {
    alert('comment manager responded with status: ' + status);
  };

  useEffect(() => {
    ttsSpeak(
      'You have now directed to the published articles If you want any help just say Help. Speak now'
    );
  }, []);

  // Handler Function for liking this blog
  const handleLikeArticle = () => {
    setLoading(true);
    //Fetch authHeaders from local storage of the browser to authorize the current user
    let auth = authHeader();
    //If there is a user stored in the local storage
    if (auth) {
      //If the auth object includes the Authorization headers i.e. it has not been corrupted manually
      if (auth.Authorization) {
        //Post a like request
        axios
          .post(
            'http://localhost:8000/like-article',
            {
              articleId: blogId
            },
            {
              headers: auth
            }
          )
          .then((res) => {
            //On successful request
            //Another axios request to check for the updated number of likes to show with this blog
            axios
              .get('http://localhost:8000/get-article/' + blogId)
              .then((res) => {
                //On Successful request
                //Set new data received in the response
                let likes = res.data.article.Likes;

                //Check whether the current user has liked this article or not
                let isLiked;
                likes.forEach((likerId) => {
                  if (likerId == userId) {
                    setIsLiked(true);
                    isLiked = true;
                  }
                });

                setNumOfLikes(likes.length);
                if (!isLiked) {
                  setIsLiked(false);
                  enqueueSnackbar('You unliked this article');
                } else {
                  let variant = 'success';
                  enqueueSnackbar('You liked this article', { variant });
                }
                setLoading(false);
              })
              .catch((err) => {
                //On unsuccessful request
                console.log(err);
                let variant = 'error';
                //Show error message in the snackbar
                enqueueSnackbar(
                  'Something went wrong. Make sure you are connected to the internet',
                  { variant }
                );
              });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        props.history.push('/login');
      }
    } else {
      props.history.push('/login');
    }
  };

  const handleBlogLikeToggled = () => {
    handleLikeArticle();
  };

  //Routes to the edit article page
  const handleEditArticleClicked = () => {
    props.history.push('/edit-article/' + blogId);
  };

  //Handler Function for deleting the article
  const handleDeleteArticleClicked = () => {
    setLoading(true);
    axios
      .post(
        'http://localhost:8000/delete-article',
        {
          articleId: blogId
        },
        {
          headers: authHeader() //Auth headers for authorizing the user whether he is authorized to delete this blog or not
        }
      )
      .then((res) => {
        //On successful request
        setLoading(false);
        //Show success message in the snackbar
        enqueueSnackbar(
          `The article, ${blogConfig.header.title}, deleted successfully`
        );
        //Route to the articles directory as the currently loaded blog does not exist any more
        const userId = authService.getCurrentUser().userId;
        props.history.push(`/articles-directory/user-articles/${userId}`);
      })
      .catch((err) => {
        //On unsuccessful request
        console.log(err);
        let variant = 'error';
        //Show error message in the snackbar
        enqueueSnackbar('Article could not be deleted.', { variant });
      });
  };

  //Handler Function for displaying the comments
  const handleViewComments = () => {
    setLoading(true);
    //GET request to fetch all the comments on the current blog
    axios
      .get('http://localhost:8000/get-blog-comments/' + blogId)
      .then((res) => {
        //On successful request
        setLoading(false);
        setComments([...res.data.comments]); //Set the commands state to the loaded comments
        setShowComments(true); //Also set the showComments true so that the comments are displayed
      })
      .catch((err) => {
        console.log(err);
        let variant = 'error';
        //Show error message in the snackbar
        enqueueSnackbar('Comments could not be loaded.', { variant });
      });
  };

  function ttsSpeak(message) {
    const voices = window.speechSynthesis.getVoices();
    console.log(voices);
    speech.voice = voices[1];
    speech.text = message;
    console.log(speech);
    window.speechSynthesis.speak(speech);
  }

  //Registered Voice Commands for this Component
  const commands = [
    {
      command: 'go back.',
      callback: () => props.history.goBack(),
      description: 'Goes back to the previous page'
    },
    {
      command: 'help.',
      callback: async () => {
        ttsSpeak(
          'The available commands are:Go back, help, speak, stop speaking, scroll up, scroll down, like article, add comment, view comments and delete article. Say help and i will guide yout through the available commands'
        );
      },
      description: 'Help command'
    },
    {
      command: 'Speak.',
      callback: async () => {
        let contentState = article.getCurrentContent();
        let htmlString = stateToHTML(contentState);
        htmlString = htmlString.replace('&nbsp;', '');
        htmlString =
          new DOMParser().parseFromString(htmlString, 'text/html').body
            .textContent || '';

        try {
          ttsSpeak(htmlString);
        } catch (e) {
          console.log(e);
        }
      },
      description: 'Speaks the article'
    },
    {
      command: 'stop speaking.',
      callback: () => {
        window.speechSynthesis.cancel();
      },
      description: 'Stop speaking'
    },
    {
      command: 'scroll down.',
      callback: () =>
        window.scrollTo({ top: window.pageYOffset + 500, behavior: 'smooth' })
    },
    {
      command: 'scroll up.',
      callback: () =>
        window.scrollTo({ top: window.pageYOffset - 500, behavior: 'smooth' })
    },
    {
      command: 'like article.',
      callback: handleLikeArticle,
      description: 'Likes the article'
    },
    {
      command: 'add comment.',
      callback: () => setShowAddComment(true),
      description: 'Opens up an input field for adding a comment.'
    },
    {
      command: 'view comments.',
      callback: handleViewComments,
      description: 'Opens all the comments for this article'
    },
    {
      command: 'delete article',
      callback: handleDeleteArticleClicked,
      description: 'Deletes the article'
    }
  ];
  //Updates the sidebar to show the registered commands for this component
  const updateSidebar = () => {
    props.setCommands(commands);
  };
  //If the current user is also the author of this article then add another comment for editing the article
  if (owner) {
    commands.push({
      command: 'edit article',
      callback: handleEditArticleClicked,
      description: 'Opens the article in editor mode'
    });
    updateSidebar();
  }

  useEffect(() => {
    updateSidebar();
  }, []);

  const hideAddComment = () => {
    setShowAddComment(false);
    updateSidebar();
  };

  //Updates the blog config with the fetched blog data
  const updateBlogConfig = (userId) => {
    axios
      .get('http://localhost:8000/get-article/' + blogId)
      .then((res) => {
        let owner = false;
        if (userId) {
          if (userId === res.data.article.Author.id) {
            owner = true;
            setOwner(true);
          }
        }
        let d = new Date(res.data.article.PostedOn);
        const date = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;

        const numOfComments = res.data.article.Comments.length;
        const numOfLikes = res.data.article.Likes.length;
        console.log(res.data.article);
        let isLiked;
        res.data.article.Likes.forEach((likerId) => {
          if (likerId == userId) {
            setIsLiked(true);
            isLiked = true;
          }
        });
        setNumOfLikes(res.data.article.Likes.length);
        setComments([...res.data.article.Comments]);
        setNumOfComments(res.data.article.Comments.length);
        setArticle(
          EditorState.createWithContent(
            convertFromRaw(JSON.parse(res.data.article.Body))
          )
        );
        if (!isLiked) setIsLiked(false);
        setBlogConfig({
          blogStats: {
            numOfComments: numOfComments
          },
          comments: [res.data.article.comments],
          // let data = {
          header: {
            //owner: owner,
            //imageURL: res.data.article.PictureSecureId,
            title: res.data.article.Title,
            //author: res.data.article.Author.authorName,
            createdOn: date,
            handleEditArticleClicked: handleEditArticleClicked
            // editArticle: () => editArticle(res.data.article._id),
            // deleteArticle: () => deleteArticle(res.data.article._id),
          },
          body: {
            content: EditorState.createWithContent(
              convertFromRaw(JSON.parse(res.data.article.Body))
            ),
            likeToggled: handleBlogLikeToggled,
            commentBoxOpened: handleCommentBoxOpened
          }
          // };
        });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //On componentDidMount, check for the current user and also fetch the user's profile picture
  useEffect(() => {
    let _user = authService.getCurrentUser();
    if (_user && _user.userId) {
      setUsername(_user.username);
      setUserId(_user.userId);
      axios
        .get('http://localhost:8000/get-profile', { headers: authHeader() })
        .then((res) => {
          console.log(res);
          setUserPic(res.data.userProfile.ProfilePhotoSecureId);
          updateBlogConfig(_user.userId);
        })
        .catch((err) => {
          console.log(err);
          updateBlogConfig(null);
        });
    } else {
      updateBlogConfig(null);
    }
  }, []);

  //The transcribed text from voice is stored in this variable - Transcript
  const { Transcript } = useSpeechRecognition({ commands });

  const updateCommentsStats = () => {
    axios
      .get('http://localhost:8000/get-blog-comments/' + blogId)
      .then((res) => {
        setNumOfComments(res.data.comments.length);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Handler function for adding a comment
  const handleAddComment = (text) => {
    setLoading(true);
    axios
      .post(
        'http://localhost:8000/comment/add-new',
        {
          text: text,
          articleId: blogId
        },
        { headers: authHeader() }
      )
      .then((res) => {
        console.log(res, 'comment');
        setLoading(false);
        setShowAddComment(false);

        axios
          .get('http://localhost:8000/get-blog-comments/' + blogId)
          .then((res) => {
            console.log(res);
            setNumOfComments(res.data.comments.length);
          })
          .catch((err) => {
            console.log(err);
          });

        updateSidebar();
        let variant = 'success';
        enqueueSnackbar('Your comment has been added successfully', {
          variant
        });
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        let variant = 'error';
        enqueueSnackbar('Your comment could not be added', { variant });
      });
  };

  return (
    <React.Fragment>
      {loading ? (
        <LinearProgress
          style={{
            // backgroundColor: '#4285f4'
            color: '#4285f4'
          }}
        />
      ) : (
        ''
      )}
      {blogConfig ? (
        <BlogUI
          numOfComments={numOfComments}
          showAddComment={showAddComment}
          viewBlog={viewBlog}
          showComments={showComments}
          config={{ ...blogConfig }}
          {...props}
          setCommands={props.setCommands}
          isLiked={isLiked}
          numOfLikes={numOfLikes}
          hideShowComment={() => {
            setShowComments(false);
            updateSidebar();
          }}
          comments={comments}
          commentsConfig={{
            addComment: handleAddComment,
            imageURL: userPic,
            username: username,
            userId: userId,
            articleTitle: blogConfig.header
              ? blogConfig.header.title
              : 'Loading article name...',
            coverImageURL: blogConfig.header ? blogConfig.header.imageURL : '',
            hide: hideAddComment
          }}
        />
      ) : (
        'Loading...'
      )}
    </React.Fragment>
  );
}

export default BlogManager;
