import React, { useState } from 'react';
import './ArticlesPage.scss';

import ArticleMainHeader from '../../../components/ArticlesDirectory/ArticleMainHeader/ArticleMainHeader';
import SearchBar from '../../../components/ArticlesDirectory/UIElements/SearchBar/SearchBar';
import Articles from '../../ArticlesDirectory/Articles/Articles';
import Button from '../../../components/ArticlesDirectory/UIElements/Button/Button';
import { Route } from 'react-router-dom';
import Fab from '@material-ui/core/Fab';
import MicIcon from '@material-ui/icons/Mic';

import LinearProgress from '@material-ui/core/LinearProgress';

const ArticlesPage = (props) => {
  //States Initialization for this component
  const [buttonClickedName, setButtonClickedName] = useState('all-articles');
  const [loading, setLoading] = useState(true);

  /**
   * Handling loading state
   * Turn Loading ON
   * Turn Loading OFF
   * */
  const showLoading = () => setLoading(true);
  const hideLoading = () => setLoading(false);

  const toolBarButtonClickedHandler = (buttonName) => {
    setButtonClickedName(buttonName);
  };
  console.log(props.match.params.userId);
  return (
    <React.Fragment style={{ position: 'relative' }}>
      {loading ? <LinearProgress /> : ''}
      <ArticleMainHeader
        buttonName={buttonClickedName}
        Button1="All Articles"
        Button2="My Articles"
        Button3="Saved"
        page={
          JSON.parse(localStorage.getItem('user')).username ? 'user' : 'no_user'
        }
        toolBarButtonClickedHandler={toolBarButtonClickedHandler}
      />
      {/* <SearchBar placeHolder="Ex. 10 business that grow exponentially" /> */}
      <Articles
        showLoading={showLoading}
        hideLoading={hideLoading}
        setCommands={props.setCommands}
        {...props}
        buttonName={buttonClickedName}
        toolBarButtonClickedHandler={toolBarButtonClickedHandler}
      />

      <Fab
        color="secondary"
        aria-label="add"
        style={{ position: 'fixed', bottom: '5%', right: '5%' }}
        variant="extended"
        onClick={() => props.history.push('/create-article')}
      >
        <MicIcon style={{ marginRight: '0.7rem' }} />
        Create New Article
      </Fab>
      {/*}*/}
    </React.Fragment>
  );
};

export default ArticlesPage;
