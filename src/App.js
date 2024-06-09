import React, { useEffect, useState, lazy, Suspense } from 'react';
import SpeechRecognition from 'react-speech-recognition';
import { Route } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';

import TextEditor from './containers/TextEditor';
import VCS from './containers/Blog/VCS/VCS';

import SignupPage from './components/Pages/User/SingupPage/SignupPage';
import LoginPage from './components/Pages/User/LoginPage/LoginPage';
import SearchInDirectory from './containers/ArticlesDirectory/SearchInDirectory';

import BlogManager from './containers/Blog/BlogManager';
import ArticlesPage from './containers/Pages/ArticlesPage/ArticlesPage';

import './App.css';
import Sidebar from './containers/Sidebar';

function App(props) {
  useEffect(() => {
    SpeechRecognition.startListening({ continuous: true });
  }, []);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    alert('can not use speech recognition...');
  }

  const [sidebar, setSidebar] = useState('');

  const [setSidebarState, setsetSidebarState] = useState(null);

  const setSidebarStateFunc = (setSidebarStateFunc) => {
    setsetSidebarState((prevState) => {
      return setSidebarStateFunc;
    });
  };

  return (
    <>
      <div className="App">
        <div
          style={{ width: '15%', maxHeight: '100vh', height: '100vh' }}
        ></div>
        <div
          style={{
            width: '15%',
            height: '100vh',
            maxHeight: '100vh',
            overflow: 'auto',
            borderRight: '1.5px solid #d3d3d3',
            position: 'fixed',
            top: '0',
            left: '0',
            zIndex: '900',
            backgroundColor: '#fff'
          }}
        >
          <Sidebar setsetStateFunc={setSidebarStateFunc} />
        </div>
        <div style={{ width: '85%' }}>
          {setSidebarState ? (
            <React.Fragment>
              <Route
                path="/new-article"
                render={(props) => (
                  <Suspense fallback={<LinearProgress />}>
                    <TextEditor
                      setCommands={(newState) => setSidebarState(newState)}
                      {...props}
                    />
                  </Suspense>
                )}
              />
              <Route
                path="/edit-article/:id"
                exact
                render={(props) => (
                  <Suspense fallback={<LinearProgress />}>
                    <TextEditor
                      editor={true}
                      setCommands={(newState) => setSidebarState(newState)}
                      {...props}
                    />
                  </Suspense>
                )}
              />
              <Route
                path="/edit-article/:id/:vid"
                render={(props) => (
                  <Suspense fallback={<LinearProgress />}>
                    <TextEditor
                      editor={true}
                      setCommands={(newState) => setSidebarState(newState)}
                      {...props}
                    />
                  </Suspense>
                )}
              />
              <Route
                path="/blog"
                exact
                render={(props) => (
                  <BlogManager
                    setCommands={(newState) => setSidebarState(newState)}
                    {...props}
                  />
                )}
              />

              <Route
                path="/articles-directory/:directoryName/search"
                render={(props) => (
                  <SearchInDirectory
                    setCommands={(newState) => setSidebarState(newState)}
                    {...props}
                  />
                )}
              />
              <Route
                path="/articles-directory/user-articles/:userId"
                exact
                render={(props) => (
                  <ArticlesPage
                    setCommands={(newState) => setSidebarState(newState)}
                    {...props}
                  />
                )}
              />
              <Route
                path="/vcs/:id"
                exact
                render={(props) => (
                  <VCS
                    setCommands={(newState) => setSidebarState(newState)}
                    {...props}
                  />
                )}
              />
              <Route
                path="/signup"
                exact
                render={(props) => <SignupPage {...props} />}
              />
              <Route
                path="/"
                exact
                render={(props) => <LoginPage {...props} />}
              />

              <Route
                path="/article/:id"
                exact
                render={(props) => (
                  <BlogManager
                    json={true}
                    setCommands={(newState) => setSidebarState(newState)}
                    {...props}
                  />
                )}
              />
              <Route
                path="/article-new/:id"
                exact
                render={(props) => (
                  <BlogManager
                    json={true}
                    setCommands={(newState) => setSidebarState(newState)}
                    {...props}
                  />
                )}
              />
            </React.Fragment>
          ) : (
            ''
          )}
        </div>
      </div>
    </>
  );
}

export default App;
