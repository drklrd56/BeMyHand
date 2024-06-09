/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import './Articles.scss';
import axios from 'axios';
import { useSpeechRecognition } from 'react-speech-recognition';
import AuthService from '../../../services/auth-service';
import { EditorState, convertFromRaw } from 'draft-js';
import authHeader from '../../../services/auth-header';
import ArticleListItem from '../../../components/ArticlesDirectory/ArticleListItem/ArticleListItem';

const speech = new SpeechSynthesisUtterance();

function ttsSpeak(message) {
  const voices = window.speechSynthesis.getVoices();
  speech.voice = voices[1];
  speech.text = message;
  window.speechSynthesis.speak(speech);
}

const Articles = (props) => {
  const [allArticles, setAllArticles] = useState([]);

  // Registered Voice Commands for this component
  const commands = [
    {
      command: 'create new article.',
      callback: () => props.history.push('/new-article'),
      description: 'Opens the text editor to create a new article'
    },
    {
      command: 'open *.',
      callback: (articleTitle) => showBlogByVoiceHandler(articleTitle),
      description: 'Opens an article'
    },
    {
      command: 'open all articles.',
      callback: () => {},
      description: 'Opens all articles'
    },
    {
      command: 'open my articles.',
      callback: () => {},
      description: 'Opens user articles.'
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
      command: 'help.',
      callback: async () => {
        ttsSpeak(
          'The available commands are: CREATE NEW ARTICLE, OPEN, delete, opn all articles, open my articles, Scroll up, scroll down, speak articles, help and logout. Speak now'
        );
      },
      description: 'Help command'
    },
    {
      command: 'speak articles.',
      callback: () => {
        const speakAllArticles = async () => {
          for (const article of allArticles) {
            await new Promise((resolve) => {
              ttsSpeak(`Article title: ${article.Title}`);
              speech.onend = resolve;
            });
          }
        };
        speakAllArticles();
      },
      description: 'Speaks the names of all articles'
    },
    {
      command: 'logout.',
      callback: async () => {
        console.log('Logging out');
        AuthService.logout();
        props.history.push('/login');
      },
      description: 'Logs out the user'
    }
  ];

  if (AuthService.getCurrentUser().isAdmin) {
    commands.push({
      command: 'delete *.',
      callback: (articleTitle) => deleteBlogForAdmin(articleTitle),
      description: 'Deletes an article'
    });
  }
  useEffect(() => {
    ttsSpeak(
      'Welcome to the Article Directory. What would you like to do? Say help and I will guide you through the commands.'
    );
  }, []);

  const { Transcript } = useSpeechRecognition({ commands });

  useEffect(() => {
    if (props.showLoading) props.showLoading();
    props.setCommands(commands);
    const topic = props.match.params.topicName;
    let url = '';
    console.log('Button Name:', props.buttonName);
    if (props.buttonName === 'all-articles') {
      url = 'https://bemyhandbackend.onrender.com/get-all-articles/';
    } else if (props.buttonName === 'my-articles') {
      url = `https://bemyhandbackend.onrender.com/get-all-user-articles/${AuthService.getCurrentUser().userId}`;
    }

    axios
      .get(url)
      .then((result) => {
        const articles = result.data.articles;
        setAllArticles(Object.values(articles)); // Assuming articles is an object
        if (props.hideLoading) props.hideLoading();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.buttonName]);

  const showBlogByVoiceHandler = (articleTitle) => {
    const matchedArticle = allArticles.find(
      (article) => article.Title.toLowerCase() === articleTitle.toLowerCase()
    );

    if (matchedArticle) {
      ttsSpeak(`Opening article: ${matchedArticle.Title}`);
      const url = `/article/${matchedArticle._id}`;
      props.history.push(url);
    }
  };

  const deleteBlogForAdmin = (articleTitle) => {
    const matchedArticle = allArticles.find(
      (article) => article.Title.toLowerCase() === articleTitle.toLowerCase()
    );

    if (matchedArticle) {
      const articleId = matchedArticle._id;
      axios
        .post(
          `https://bemyhandbackend.onrender.com/delete-article`,
          {
            articleId: articleId
          },
          {
            headers: authHeader()
          }
        )
        .then((result) => {
          console.log(result);
          const newArticles = allArticles.filter(
            (article) => article._id !== articleId
          );
          setAllArticles(newArticles);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const showBlogHandler = (id) => {
    const url = `/article/${id}`;
    props.history.push(url);
  };

  const deleteArticleHandler = (id) => {
    axios
      .post(
        `https://bemyhandbackend.onrender.com/delete-article`,
        {
          articleId: id
        },
        {
          headers: authHeader()
        }
      )
      .then((result) => {
        console.log(result);
        const newArticles = allArticles.filter((article) => article._id !== id);
        setAllArticles(newArticles);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="AllArticles">
      {allArticles.map((article) => (
        <ArticleListItem
          key={article._id}
          title={article.Title}
          body={EditorState.createWithContent(
            convertFromRaw(JSON.parse(article.Body))
          )}
          cover={article.PictureSecureId}
          date={article.PostedOn}
          showBlogHandler={() => showBlogHandler(article._id)}
          deleteArticleHandler={() => deleteArticleHandler(article._id)}
        />
      ))}
    </div>
  );
};

export default Articles;
