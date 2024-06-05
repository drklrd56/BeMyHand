import React, { useState, useEffect } from 'react';
import './ProfileUI.css';
import axios from 'axios';
import authHeader from '../../../../services/auth-header';
import ArticleCard from '../../../../components/ArticlesDirectory/ArticleCardUI/ArticleCardUI';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Skeleton } from '@material-ui/lab';
import { useSpeechRecognition } from 'react-speech-recognition';
import Button from '@material-ui/core/Button';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import DescriptionIcon from '@material-ui/icons/Description';
import ViewDayIcon from '@material-ui/icons/ViewDay';
import PictureInPictureIcon from '@material-ui/icons/PictureInPicture';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import Modal from '@material-ui/core/Modal';
import CameraFrontIcon from '@material-ui/icons/CameraFront';
import WebcamCapture from '../../../../components/WebcamCapture/WebcamCapture';
// import {EditorState, convertFromRaw} from 'draft-js';

const ProfileUI = (props) => {
  let textInput = React.createRef();

  let modalStyle = {
    position: 'relative'
  };

  let modalBodyStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    backgroundColor: '#FFFFFF',
    padding: '1rem 5rem 3rem 5rem'
  };

  const [myLatestFavArticles, setMyLatestFavArticles] = useState(null);
  const [myLatestArticles, setMyLatestArticles] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [username, setUsername] = useState('Loading...');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  // const [uploadPictureDialogState, setUploadPictureDialogState] = useState(false);
  const [view, setView] = useState('Private View');
  const [modelOpen, setModelOpen] = useState(false);
  const [webcamModalOpen, setWebcamModalOpen] = useState(false);
  const [addFacialAuth, setAddFacialAuth] = useState(false);

  const commands = [
    {
      command: 'upload profile picture.',
      callback: () => {
        uploadProfilePicture();
      },
      description: 'Uploads new profile picture'
    },
    {
      command: 'close modal.',
      callback: () => {
        ModalClosedHandler();
      },
      description: 'Closed Profile Picture Selection Modal'
    },
    {
      command: 'upload from computer.',
      callback: () => {
        UploadFromComputer();
      },
      description: 'Uploads profile picture from file system'
    },
    {
      command: 'take picture from webcam.',
      callback: () => {
        uploadPictureFromWebcamHandler();
      },
      description: 'Uploads profile picture from Webcam'
    },
    {
      command: 'add facial authentication.',
      callback: () => {
        trigerFacialAuth();
      },
      description: 'Opens webcam to add facial authentication'
    },
    {
      command: 'close webcam.',
      callback: () => {
        ProfileModalClosedHandler();
      },
      description: 'Closes Webcam modal'
    },
    {
      command: 'public view.',
      callback: () => {
        profileViewHandler();
      },
      description: 'Changes profile view to public'
    },
    {
      command: 'private view.',
      callback: () => {
        profileViewHandler();
      },
      description: 'Changes profile view to private'
    },
    {
      command: 'view all articles.',
      callback: () => {
        viewMyAllBlogs();
      },
      description: 'Views user all articles'
    },
    {
      command: 'show user articles.',
      callback: () => {
        navigationHandler(null, 0);
      },
      description: 'Shows all user articles from navigation menu'
    },
    {
      command: 'go back.',
      callback: () => props.history.goBack(),
      description: 'Goes back to the previous page'
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
    }
    // {
    //   command: 'view portfolio',
    //   callback: () => {
    //     props.history.push(`portfolio/60829525d05bf230282aa436`);
    //   }
    // }
  ];

  let commandsAndDesc = [];

  commands.forEach((cmd) => {
    commandsAndDesc.push({
      command: cmd.command,
      description: cmd.description
    });
  });

  useEffect(() => {
    if (props.setCommands) props.setCommands(commandsAndDesc);
  }, []);

  const { Transcript } = useSpeechRecognition({ commands });

  useEffect(() => {
    axios
      .get(
        'https://bemyhandbackend.onrender.com/get-user-latest-articles/' +
          props.match.params.userId,
        {
          headers: authHeader()
        }
      )
      .then((response) => {
        console.log(response.data.articles);
        setMyLatestArticles(response.data.articles);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.match.params.userId]);

  useEffect(() => {
    if (
      props.match.params.userId ===
        JSON.parse(localStorage.getItem('user')).userId &&
      view === 'Private View'
    ) {
      axios
        .get(
          'https://bemyhandbackend.onrender.com/get-latest-fav-articles/' +
            props.match.params.userId,
          {
            headers: authHeader()
          }
        )
        .then((response) => {
          setMyLatestFavArticles(response.data.favArticles);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setMyLatestFavArticles([]);
    }
  }, [props.match.params.userId, view]);

  useEffect(() => {
    axios
      .get(
        'https://bemyhandbackend.onrender.com/get-profile/' +
          props.match.params.userId,
        {
          headers: authHeader()
        }
      )
      .then((response) => {
        console.log(response.data.userProfile);

        setUsername(response.data.username);
        setUserId(response.data.userId);
        setProfilePicture(response.data.userProfile.ProfilePhotoSecureId);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.match.params.userId]);

  const profileViewHandler = () => {
    if (view === 'Public View') {
      setView('Private View');
    } else {
      setView('Public View');
    }
  };

  const navigationHandler = (event, newValue) => {
    // console.log(newValue);

    if (newValue === 1) {
      alert('Resume');
    } else if (newValue === 2) {
      alert('Portfolio');
    } else {
      const url =
        '/articles-directory/user-articles/' + props.match.params.userId;
      props.history.push(url);
    }
  };

  const viewMyAllBlogs = () => {
    const url =
      '/articles-directory/user-articles/' + props.match.params.userId;
    props.history.push(url);
  };

  const viewAllFavBlogs = () => {
    const url = 'blogs/my-fav-blogs';
    this.props.history.push(url);
  };

  const uploadProfilePicture = () => {
    setModelOpen(true);
  };

  const ModalClosedHandler = () => {
    setModelOpen(false);
  };
  const UploadFromComputer = () => {
    textInput.current.click();
  };
  const uploadPictureFromWebcamHandler = () => {
    setModelOpen(false);
    setWebcamModalOpen(true);
  };

  const trigerFacialAuth = () => {
    setModelOpen(false);
    setWebcamModalOpen(true);
    setAddFacialAuth(true);
  };

  const ProfileModalClosedHandler = () => {
    setWebcamModalOpen(false);
    setAddFacialAuth(false);
  };

  const fileSelectedHandler = (event, blob) => {
    const fd = new FormData();
    if (event) {
      setProfilePicture(event.target.files[0]);

      fd.append('picture', event.target.files[0]);
    } else {
      console.log(blob);
      setProfilePicture(blob);

      fd.append('picture', blob);
    }
    setModelOpen(false);
    setLoading(true);
    axios
      .post('https://bemyhandbackend.onrender.com/upload-profile-picture', fd, {
        headers: authHeader(),
        'content-type': 'multipart/form-data'
      })
      .then((response) => {
        setLoading(false);
        setProfilePicture(response.data.picture);
      });

    // axios
    // .post("https://bemyhandbackend.onrender.com/add-facial-auth", fd, {
    //   headers: authHeader(),
    //   'content-type': 'multipart/form-data'
    // })
    // .then((response) => {
    //   setLoading(false);
    //   setProfilePicture(response.data.picture);
    // });
  };

  const addFacialAuthHandler = (blob) => {
    console.log('Entered addFacialAuthHandler');
    const fd = new FormData();

    fd.append('picture', blob);

    setModelOpen(false);
    setLoading(true);

    axios
      .post('https://bemyhandbackend.onrender.com/add-facial-auth', fd, {
        headers: authHeader(),
        'content-type': 'multipart/form-data'
      })
      .then((response) => {
        setLoading(false);
        console.log(response);
      });
  };

  return (
    <React.Fragment>
      {loading ? <LinearProgress /> : ''}
      <div className="profile">
        <div className="profile__details">
          <div className="profile__details--content">
            <div
              className="profile__details--content-profile-pic"
              style={{ backgroundImage: `url(${profilePicture})` }}
            >
              {userId === JSON.parse(localStorage.getItem('user')).userId &&
              view === 'Private View' ? (
                <React.Fragment>
                  {/*<label*/}
                  {/*  htmlFor="upload-image"*/}
                  {/*  className="profile__details--content-profile-pic-change"*/}
                  {/*>*/}
                  <div className="profile__details--content-profile-pic-change">
                    <h3 onClick={uploadProfilePicture}>Upload New</h3>
                  </div>
                  {/*</label>*/}
                </React.Fragment>
              ) : (
                <></>
              )}
            </div>
            <h2 className="profile__details--content-username">{username}</h2>

            {userId === JSON.parse(localStorage.getItem('user')).userId ? (
              <div style={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={profileViewHandler}
                >
                  {view === 'Public View' ? 'Private View' : 'Public View'}
                </Button>
              </div>
            ) : (
              <div style={{ marginBottom: '-3rem' }} />
            )}
            <BottomNavigation
              // value={value}
              // onChange={(event, newValue) => {
              //   setValue(newValue);
              // }}
              onChange={(event, newValue) => navigationHandler(event, newValue)}
              showLabels
              className="profile__details--content-menu"
            >
              <BottomNavigationAction
                label="Articles"
                icon={<DescriptionIcon />}
              />
              <BottomNavigationAction label="Resume" icon={<ViewDayIcon />} />
              <BottomNavigationAction
                label="Portfolio"
                icon={<PictureInPictureIcon />}
              />
            </BottomNavigation>
          </div>
          <div className="profile__details--boundary" />
        </div>
        <div className="profile__activity">
          <div className="profile__activity--blogs">
            {userId === JSON.parse(localStorage.getItem('user')).userId &&
            view === 'Private View' ? (
              <h2 className="profile__activity--blogs-heading">
                My Published Articles
              </h2>
            ) : (
              <h2 className="profile__activity--blogs-heading">
                Published Articles
              </h2>
            )}
            <div className="profile__activity--blogs-my-blogs">
              {myLatestArticles ? (
                myLatestArticles.map((article) => (
                  <ArticleCard
                    key={article._id}
                    id={article._id}
                    title={article.Title}
                    picture={article.PictureSecureId}
                    // body={EditorState.createWithContent(convertFromRaw(JSON.parse(article.Body)))}
                    body={article.Body}
                    postedOn={article.PostedOn}
                    author={article.Author.authorName}
                  />
                ))
              ) : (
                <React.Fragment>
                  {[...Array(4)].map((element, index) => (
                    <Skeleton
                      variant="rect"
                      height={280}
                      width={210}
                      key={index}
                    />
                  ))}
                </React.Fragment>
              )}
            </div>
            <a
              className="profile__activity--blogs-view"
              onClick={viewMyAllBlogs}
            >
              View All
            </a>
          </div>
          {userId === JSON.parse(localStorage.getItem('user')).userId &&
          view === 'Private View' ? (
            <div className="profile__activity--my-favorites">
              <h2 className="profile__activity--blogs-heading">My Favorites</h2>
              <div className="profile__activity--blogs-my-blogs">
                {myLatestFavArticles ? (
                  myLatestFavArticles.map((article) => (
                    <ArticleCard
                      key={article._id}
                      id={article._id}
                      title={article.Title}
                      picture={article.PictureSecureId}
                      body={article.Body}
                      postedOn={article.PostedOn}
                      author={article.Author.authorName}
                    />
                  ))
                ) : (
                  <React.Fragment>
                    {[...Array(4)].map((element, index) => (
                      <Skeleton
                        variant="rect"
                        height={280}
                        width={210}
                        key={index}
                      />
                    ))}
                  </React.Fragment>
                )}
              </div>
              <a
                className="profile__activity--blogs-view"
                onClick={viewAllFavBlogs}
              >
                View All
              </a>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      <Modal
        style={modalStyle}
        open={modelOpen}
        onClose={ModalClosedHandler}
        // aria-labelledby="simple-modal-title"
        // aria-describedby="simple-modal-description"
      >
        <div style={modalBodyStyle}>
          <h4 style={{ marginBottom: '2rem', textAlign: 'center' }}>
            Please Select Upload method
          </h4>
          <input
            id="upload-image"
            class="upload-image"
            type="file"
            onChange={fileSelectedHandler}
          />
          <div>
            <Button
              style={{ margin: '1rem' }}
              variant="contained"
              color="default"
              startIcon={<CloudUploadIcon />}
              ref={textInput}
              onClick={() => {
                document.getElementById('upload-image').click();
              }}
            >
              Upload from computer
            </Button>
            <Button
              style={{ margin: '1rem' }}
              variant="contained"
              color="default"
              startIcon={<CameraFrontIcon />}
              onClick={uploadPictureFromWebcamHandler}
            >
              Take Picture From Webcam
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        style={modalStyle}
        open={webcamModalOpen}
        onClose={ProfileModalClosedHandler}
        // aria-labelledby="simple-modal-title"
        // aria-describedby="simple-modal-description"
      >
        <div style={modalBodyStyle}>
          <h4 style={{ marginBottom: '2rem', textAlign: 'center' }}>
            {addFacialAuth
              ? 'Please Capture a Straight and Clear Photo for Facial Authentication'
              : 'Please Capture Profile Image'}
          </h4>
          <input
            id="upload-image"
            class="upload-image"
            type="file"
            onChange={fileSelectedHandler}
          />
          <div>
            <WebcamCapture
              fileSelectedHandler={fileSelectedHandler}
              ProfileModalClosedHandler={ProfileModalClosedHandler}
              addFacialAuth={addFacialAuth}
              addFacialAuthHandler={addFacialAuthHandler}
            />
          </div>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default ProfileUI;
