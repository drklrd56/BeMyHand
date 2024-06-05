/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';

import './style.scss';

import Selector from '../../Selector';
import { useSpeechRecognition } from 'react-speech-recognition';

function ArticleTopicSelector(props) {
  const [articleTopics, setArticleTopics] = useState([]);
  const [topicNames, setTopicNames] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    axios
      .get('http://localhost:8000/get-topics')
      .then((res) => {
        setArticleTopics([...res.data.articleTopics]);
        let topicNames = [];
        res.data.articleTopics.forEach((topic) => {
          topicNames.push(`${topic.TopicName.toLowerCase()}`);
        });
        setTopicNames([...topicNames]);
        console.log(res.data.articleTopics);
      })
      .catch((err) => {
        let variant = 'error';
        enqueueSnackbar(
          'Something went wrong. Please make sure you are connected to the internet'
        );
        console.log(err);
      });
  }, []);

  const commands = [
    {
      command: 'set topic of *.',
      callback: (topic) => {
        if (topicNames.includes(topic.toLowerCase())) {
          articleTopics.forEach((tp) => {
            if (topic.toLowerCase() === tp.TopicName.toLowerCase())
              props.setTopic(tp.TopicName);
          });
          props.hide();
        } else {
          if (topic !== 'topic') {
            let variant = 'error';
            enqueueSnackbar(
              'Please select a topic from the given list of topics',
              { variant }
            );
          }
        }
        // props.setTopic(topic);
      },
      description: 'Set <topicname> will set a topic for this article'
    },
    {
      command: 'close.',
      callback: () => props.hide(),
      description: 'It will close this modal'
    }
  ];

  const { transcript } = useSpeechRecognition({ commands });

  return (
    <div style={{ margin: '10px 0', marginTop: '-20px' }}>
      <div
        style={{
          padding: '7px 18px',
          border: '1px solid #d3d3d3',
          display: 'inline-block',
          borderColor: props.topic.length > 0 ? '#19c270' : '#458bff',
          backgroundColor: props.topic.length > 0 ? '#e1fff0' : '#458bff',
          borderRadius: '4px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          color: props.topic.length > 0 ? '#1a1616' : '#fff'
        }}
      >
        {props.topic.length > 0
          ? 'Topic > ' +
            props.topic +
            ' - Say "set topic" to open the list of topics'
          : 'Select a topic for your article - Say "set topic" to open the list of topics'}
      </div>

      {props.show ? (
        <Selector {...props} commands={[...commands]}>
          <div style={{ padding: '20px 0' }}>
            <h6 className="h6-local">Select a topic for your article</h6>
            <p className="caption">
              Say 'Set {'<topicname>'}' to set a topic. You can only select a
              topic from the given list.
            </p>
            <ul style={{ listStyleType: 'none' }}>
              {articleTopics.map((opt, index) => (
                <li
                  className="button"
                  style={{
                    backgroundColor: index % 2 == 0 ? '#fafafa' : '#fff',
                    padding: '7px 18px'
                  }}
                  key={opt._id}
                >
                  {opt.TopicName}
                </li>
              ))}
            </ul>
          </div>
        </Selector>
      ) : (
        ''
      )}

      {/*    provide options to select from */}
    </div>
  );
}

export default ArticleTopicSelector;
