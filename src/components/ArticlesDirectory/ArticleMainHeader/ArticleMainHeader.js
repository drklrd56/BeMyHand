/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import './ArticleMainHeader.scss';
import { useSpeechRecognition } from 'react-speech-recognition';

const ArticleMainHeader = (props) => {
  const [buttonClickedName, setButtonClickedName] = useState(props.buttonName);

  const commands = [
    {
      command: 'open all articles.',
      callback: () => {
        toolbarButtonClicked('all-articles');
        props.toolBarButtonClickedHandler('all-articles');
      },
      description: 'Opens all articles'
    },
    {
      command: 'open my articles.',
      callback: () => {
        toolbarButtonClicked('my-articles');
        props.toolBarButtonClickedHandler('my-articles');
      },
      description: 'Opens user articles.'
    },
    {
      command: 'open saved articles.',
      callback: () => {
        toolbarButtonClicked('saved');
        props.toolBarButtonClickedHandler('saved');
      },
      description: 'Opens saved articles'
    }
  ];

  const { Transcript } = useSpeechRecognition({ commands });

  const toolbarButtonClicked = (buttonName) => {
    setButtonClickedName(buttonName);
  };

  return (
    <div className="ArticleMainHeader">
      <div className="ArticleMainHeader__Img">
        <h1 className="ArticleMainHeader__Img--AboveText">Articles</h1>
      </div>
      <div className="ArticleMainHeader__Toolbar">
        <div className="ArticleMainHeader__Toolbar--ButtonsPalette">
          <div
            className="ArticleMainHeader__Toolbar--ButtonsPalette-Button"
            onClick={() => {
              toolbarButtonClicked('all-articles');
              props.toolBarButtonClickedHandler('all-articles');
            }}
          >
            <div className="ArticleMainHeader__Toolbar--ButtonsPalette-Button-Text">
              <p>{props.Button1}</p>
            </div>
            {buttonClickedName === 'all-articles' ? (
              <div className="ArticleMainHeader__Toolbar--ButtonsPalette-Button-Bar" />
            ) : (
              <div />
            )}
          </div>
          <React.Fragment>
            <div
              className="ArticleMainHeader__Toolbar--ButtonsPalette-Button"
              onClick={() => {
                toolbarButtonClicked('my-articles');
                props.toolBarButtonClickedHandler('my-articles');
              }}
            >
              <div className="ArticleMainHeader__Toolbar--ButtonsPalette-Button-Text">
                <p>{props.Button2}</p>
              </div>
              {buttonClickedName === 'my-articles' ? (
                <div className="ArticleMainHeader__Toolbar--ButtonsPalette-Button-Bar" />
              ) : (
                <div />
              )}
            </div>
          </React.Fragment>
        </div>
      </div>
    </div>
  );
};
export default ArticleMainHeader;
