import React, {useState} from 'react';
import Selector from "../../Selector";
import LinearProgress from "@material-ui/core/LinearProgress";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import MicIcon from "@material-ui/icons/Mic";
import {makeStyles} from "@material-ui/core/styles";
import {useSpeechRecognition} from "react-speech-recognition";


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


export default function CommentsViewer(props) {
    const classes = useStyles();
    const [offsetTop, setOffsetTop] = useState(0);
    const commands = [
        {
            command: 'close',
            callback: () => props.hideShowComment(),
            description: 'Closes this modal.'
        },
        {
            command: 'scroll comments down',
            callback: () => {
                setOffsetTop(prevOffsetTop => {
                    document.querySelector("#selector-element").scrollTo({top: prevOffsetTop + 320, behavior: "smooth"})
                    return prevOffsetTop + 320;
                })
            }
        },
        {
            command: 'scroll comments up',
            callback: () => {
                setOffsetTop(prevOffsetTop => {
                    document.querySelector("#selector-element").scrollTo({top: prevOffsetTop - 320, behavior: "smooth"})
                    return prevOffsetTop - 320;
                })
            }
        },
    ];

  const { Transcript } = useSpeechRecognition({ commands });

  return (
    <React.Fragment>
      <Selector commands={[...commands]} {...props}>
        <div
          style={{
            position: 'relative',
            padding: '20px 4.5%',
            background: '#fafafa',
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
              zIndex: 1
            }}
          ></div>

          {props.comments.map((comment) => {
            return (
              <div
                key={comment._id}
                style={{
                  position: 'relative',
                  zIndex: 2,
                  marginBottom: '12.5px'
                }}
              >
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
                        Posted on {new Date(comment.PostedOn).toDateString()}
                      </Typography>
                    </CardContent>
                    <div className={classes.controls}>
                      <TextField
                        id="standard-multiline-flexible"
                        label="Comment"
                        multiline
                        fullWidth
                        rowsMax={20}
                        value={comment.Text}
                      />
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </Selector>
    </React.Fragment>
  );
}
