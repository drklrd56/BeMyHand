/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { withStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MicIcon from '@material-ui/icons/Mic';
import LinearProgress from '@material-ui/core/LinearProgress';

import Selector from '../../Selector';
import { useSpeechRecognition } from 'react-speech-recognition';

import Paper from '@material-ui/core/Paper';
const speech = new SpeechSynthesisUtterance();
function ttsSpeak(message) {
  const voices = window.speechSynthesis.getVoices();
  console.log('voice is availavle');
  speech.voice = voices[1];
  speech.text = message;
  window.speechSynthesis.speak(speech);
}
const BlueTextTypography = withStyles({
  root: {
    color: '#4285f4'
  }
})(Typography);

const GrayTextTypography = withStyles({
  root: {
    color: '#777'
  }
})(Typography);

const PrimaryButton = withStyles({
  root: {
    backgroundColor: '#4285f4',
    color: '#ffffff',
    marginBottom: '25px',
    width: '40%'
  }
})(Button);

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    width: '79%'
  },
  content: {
    flex: '1 0 auto'
  },
  cover: {
    // width: 151,
    width: '20%'
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  playIcon: {
    height: 38,
    width: 38
  }
}));

function AddComment(props) {
  const classes = useStyles();
  const theme = useTheme();

  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const commands = [
    {
      command: 'submit comment.',
      callback: () => {
        setLoading(true);
        props.addComment(text);
        // props.hide();
      },
      description: 'Submits the comment on this blog'
    },

    {
      command: 'help.',
      callback: async () => {
        ttsSpeak(
          'The available commands are: submit comment, help and close. Say help and i will guide yout through the available commands'
        );
      },
      description: 'Help command'
    },
    {
      command: 'close.',
      callback: () => props.hide(),
      description: 'Closes this modal.'
    }
  ];
  useEffect(() => {
    ttsSpeak(
      'this is Add comment page. What would you like to do? if you want any help just say help and i will guide you through the website.'
    );
  }, []);
  const { transcript } = useSpeechRecognition({ commands });

  useEffect(() => {
    if (!transcript.includes('close') && !transcript.includes('submit comment'))
      setText(transcript);
  }, [transcript]);

  const handleCommentChange = (e) => {
    setText(e.target.value);
  };

  return (
    <React.Fragment>
      <Selector commands={[...commands]} {...props}>
        <div
          style={{
            position: 'relative',
            padding: '20px 4.5%',
            background: '#fafafa',
            backgroundImage: `url(${props.coverImageURL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/*<Paper variant={"outlined"}>*/}
          {/*    {text}*/}
          {/*</Paper>*/}
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              zIndex: 1,
              backgroundColor: 'rgba(0,0,0,.36)'
            }}
          ></div>
          <div style={{ position: 'relative', zIndex: 2 }}>
            {loading ? <LinearProgress /> : ''}
            <Card className={classes.root}>
              <CardMedia
                className={classes.cover}
                image={props.imageURL}
                title={props.username}
              />
              <div className={classes.details}>
                <CardContent className={classes.content}>
                  <Typography component="h5" variant="h5">
                    {props.username}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    Commenting on {props.articleTitle}
                  </Typography>
                </CardContent>
                <div className={classes.controls}>
                  <TextField
                    id="standard-multiline-flexible"
                    label="Start speaking to write comment"
                    multiline
                    fullWidth
                    rowsMax={20}
                    value={text}
                    onChange={handleCommentChange}
                  />
                </div>
                {/*<PrimaryButton>*/}
                {/*    Submit comment*/}
                {/*</PrimaryButton>*/}
                <div
                  style={{
                    marginTop: '20px',
                    direction: 'rtl',
                    marginBottom: '5px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {text.length > 0 ? (
                      <BlueTextTypography variant="button">
                        Submit Comment
                      </BlueTextTypography>
                    ) : (
                      <GrayTextTypography variant={'button'}>
                        Say something in comment to submit
                      </GrayTextTypography>
                    )}
                    <MicIcon
                      style={{ fill: text.length > 0 ? '#4285f4' : '#777' }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Selector>
    </React.Fragment>
  );
}

export default AddComment;
