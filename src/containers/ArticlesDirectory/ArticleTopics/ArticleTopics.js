/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import './ArticleTopics.scss';
import axios from 'axios';
import { useSpeechRecognition } from 'react-speech-recognition';
import Speech from 'speak-tts';
import ArticleTopicCard from '../../../components/ArticlesDirectory/ArticleTopicCard/ArticleTopicCard';

const speech = new SpeechSynthesisUtterance();
function ttsSpeak(message) {
  const voices = window.speechSynthesis.getVoices();
  console.log('voice is availavle');
  speech.voice = voices[1];
  speech.text = message;
  window.speechSynthesis.speak(speech);
}

const ArticleTopics = (props) => {
  //States Initialization for this component
  const [articleTopics, manipulateArticleTopics] = useState([]);

  //Registered voice commads for this article
  const commands = [
    {
      command: 'create new article.',
      callback: () => props.history.push('/new-article'),
      description: 'Opens the text editor to create a new article'
    },
    {
      command: 'open user profile.',
      callback: () =>
        props.history.push(
          `/profile/${JSON.parse(localStorage.getItem('user')).userId}`
        ),
      description: 'Opens user profile'
    },
    {
      command: 'go back.',
      callback: () => props.history.goBack(),
      description: 'Goes back to the previous page'
    },
    {
      command: 'open *.',
      callback: (articleTopic) => showArticlesByTopicHandler(articleTopic),
      description: 'Opens an article topic'
    },
    {
      command: 'search.',
      callback: () => {
        props.history.push(`${props.match.url}/All%20Articles/search`);
      },
      description: 'Search in the entire directory'
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
  ];

  useEffect(() => {
      ttsSpeak('Welcome to the Article Directory. What would you like to do?');
  }, []);

  //On componentDidMount, set the new commands in the sidebar
  useEffect(() => {
    props.setCommands(commands);
  }, []);

  const { Transcript } = useSpeechRecognition({ commands });

  //On componentDidMount, get all the topics in the articles directory
  useEffect(() => {
    axios
      .get('https://bemyhandbackend.onrender.com/get-topics')
      .then((result) => {
        const articleTopics = result.data.articleTopics;
        const tempArticleTopics = [];

        for (const topic in articleTopics) {
          tempArticleTopics.push(articleTopics[topic]);
        }
        manipulateArticleTopics(tempArticleTopics);
      });
  }, []);

  //Open articles of the selected topic
  const showArticlesByTopicHandler = (topicName) => {
    let isAvailable;
    articleTopics.forEach((articleTopic) => {
      if (articleTopic.TopicName.toLowerCase() == topicName.toLowerCase()) {
        topicName = articleTopic.TopicName;
        isAvailable = true;
      }
    });
    if (isAvailable) {
      const url = props.match.url + '/' + topicName;
      props.history.push(url);
    }
  };

  return (
    <div className="ArticleTopicsGrid">
      {articleTopics.map((articleTopic) => {
        return (
          <div className="ArticleTopicsGrid__Card">
            <ArticleTopicCard
              key={articleTopic._id}
              topicName={articleTopic.TopicName}
              description={articleTopic.Description}
              picture={articleTopic.PictureSecureId}
              showArticlesByTopicsHandler={() =>
                showArticlesByTopicHandler(articleTopic.TopicName)
              }
            />
          </div>
        );
      })}
    </div>
  );
};

export default ArticleTopics;
