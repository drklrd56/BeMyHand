/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-dupe-keys */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { convertFromRaw, EditorState, Modifier, RichUtils } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import createStyles from 'draft-js-custom-styles';
import { useSpeechRecognition } from 'react-speech-recognition';
import { stateToHTML } from 'draft-js-export-html';
import LinearProgress from '@material-ui/core/LinearProgress';
import axios from 'axios';
import DraftEditor from './DraftEditor';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import BlogHeader from '../../components/Blog/BlogUI/BlogHeader';
import { convertToRaw } from 'draft-js';
import { useSnackbar } from 'notistack';
import Speech from 'speak-tts';
import authHeader from '../../services/auth-header';
const TitleField = withStyles({
  root: {
    '& label': {
      color: '#4285f4',
      fontWeight: 'bold'
    },
    '& label.Mui-focused': {
      color: '#4285f4'
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#4285f4',
        borderWidth: '2px'
      },
      '&:hover fieldset': {
        borderColor: '#4285f4'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#4285f4'
      }
    }
  }
})(TextField);

const speech = new SpeechSynthesisUtterance();

function TextEditor(props) {
  //State Initialization for this component
  const [editorState, setEditorState] = useState(EditorState.createEmpty()); //state for setting the content of Draft Editor
  const [loading, setLoading] = useState(true); //Loading state to show loader while an http request is progressing
  const [title, setTitle] = useState('');
  const customStylesToManage = ['font-size', 'color', 'font-family'];
  const { styles, customStyleFn, exporter } = createStyles(
    customStylesToManage,
    'CUSTOM_'
  );

  const { enqueueSnackbar } = useSnackbar();

  const [blogHeaderConfig, setBlogHeaderConfig] = useState({
    imageURL: '',
    author: '...',
    createdOn: `${new Date().toDateString()}`
  });

  useEffect(() => {
    if (props.match.params.id) {
      axios
        .get(
          'https://bemyhandbackend.onrender.com/get-article/' +
            props.match.params.id
        )
        .then((res) => {
          const article = res.data.article;
          setTitle(article.Title);
          setEditorState(
            EditorState.createWithContent(
              convertFromRaw(JSON.parse(res.data.article.Body))
            )
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // ttsSpeak(
    //   'Welcome to the text editor. You can start writing your article now. If you need any help, just say "help" and I will guide you through the available commands. Say the word clean to clear the text editor.'
    // );
  }, []);

  const publishArticle = () => {
    let url = 'https://bemyhandbackend.onrender.com/add-article';
    if (props.editor) {
      url = 'https://bemyhandbackend.onrender.com/edit-article';
    }
    // let _state = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
    // console.log(_state);
    // let _updated_state = EditorState.createWithContent(convertFromRaw(JSON.parse(_state)));
    // setEditorState(_updated_state);
    if (title !== '' && editorState.getCurrentContent().hasText()) {
      setLoading(true);
      let data = new FormData();

      // if (props.editor) {
      //   data.append('articleId', blogId);
      // }

      data.append('title', title);
      data.append(
        'body',
        JSON.stringify(convertToRaw(editorState.getCurrentContent()))
      );
      console.log(data.title, 'reqData', authHeader());

      axios
        .post(url, data, {
          headers: authHeader()
        })
        .then((res) => {
          console.log(res);
          setLoading(false);
          console.log(res.data.article._id);
          const _id = res.data.article._id;

          props.history.push('/article/' + _id);
          // alert("Blog published successfully!");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      let variant = 'error';
      let missingFields = [];
      if (title === '') missingFields.push('Title');
      if (!editorState.getCurrentContent().hasText())
        missingFields.push('Article Body');
      let PluralConfirmedString = missingFields.length > 1 ? 's: ' : ': ';
      enqueueSnackbar(
        `Please fill in the following missing field${PluralConfirmedString}` +
          missingFields.join(', '), // Voice feedback for the error
        ttsSpeak(
          'There was an error publishing the article please fill in the title in order to publish the article.'
        ),
        { variant }
      );
    }
  };

  function ttsSpeak(message) {
    const voices = window.speechSynthesis.getVoices();
    speech.voice = voices[1];
    speech.text = message;
    window.speechSynthesis.speak(speech);
  }
  //Registered Voice Commands for this component
  const commands = [
    {
      command: 'go to home page.',
      callback: async () => {
        ttsSpeak('Going to Home Page Now.');
      },
      callback: () => props.history.goBack(),
      description: 'Goes back to the previous page'
    },
    {
      command: 'set title *.',
      callback: async (title) => {
        ttsSpeak(
          'Set the title of the article. Please say "set title" followed by the title of the article.'
        );
        title = title.replace('.', '');
        setTitle(title);
        setBlogHeaderConfig((prevConfig) => {
          return { ...prevConfig, title: title };
        });
      },
      description: 'Set title *'
    },
    {
      command: 'help.',
      callback: async () => {
        ttsSpeak(
          'The available commands are:Go to homw page, set title,help, speak, stop speaking, bold, italics, underline, strikethrough, normal text, code, heading level 1, heading level 2, heading level 3, heading level 4, heading level 5,    heading level 6, code block, block quote, ordered list, unordered list, new line, set font, set font family, publish Article and clean . You can also use the toolbar to format your text. If you need any help, just say "help" and I will guide you through the available commands. Say the word clear to clear the text editor.'
        );
      },
      description: 'Help command'
    },
    {
      command: 'stop speaking.',
      callback: () => {
        window.speechSynthesis.cancel();
      },
      description: 'Stop speaking'
    },
    {
      command: 'Speak.',
      callback: async () => {
        let contentState = editorState.getCurrentContent();
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
      command: 'clean.',

      callback: () => {
        // Clearing the editor content
        const newEditorState = EditorState.createEmpty(); // Assuming you're using Draft.js
        setEditorState(newEditorState);
        ttsSpeak('Editor has been cleaned successfully');
      },
      description: 'Sets Font-Size to 24px'
    },
    {
      command: 'bold.',
      callback: () =>
        setEditorState((editorState) =>
          RichUtils.toggleInlineStyle(editorState, 'BOLD')
        ),
      description: 'Toggles Bold style to the text'
    },
    {
      command: 'italics.',
      callback: () =>
        setEditorState((editorState) =>
          RichUtils.toggleInlineStyle(editorState, 'ITALIC')
        ),
      description: 'Toggles Italics style to the text'
    },
    {
      command: 'underline.',
      callback: () =>
        setEditorState((editorState) =>
          RichUtils.toggleInlineStyle(editorState, 'UNDERLINE')
        ),
      description: 'Toggles Underline style to the text'
    },
    {
      command: 'strike through.',
      callback: () =>
        setEditorState((editorState) =>
          RichUtils.toggleInlineStyle(editorState, 'STRIKETHROUGH')
        ),
      description: 'Toggles Strikethrough style to the text'
    },
    {
      command: 'normal text.',
      callback: () =>
        setEditorState((editorState) =>
          RichUtils.toggleBlockType(editorState, 'normal')
        ),
      description: 'Toggles heading 6 block style'
    },
    {
      command: 'heading.',
      callback: () =>
        setEditorState((editorState) =>
          RichUtils.toggleBlockType(editorState, 'header-two')
        ),
      description: 'Toggles heading 2 block style'
    },
    {
      command: 'heading level 2.',
      callback: () =>
        setEditorState((editorState) =>
          RichUtils.toggleBlockType(editorState, 'header-two')
        ),
      description: 'Toggles heading 2 block style'
    },
    {
      command: 'heading level 3.',
      callback: () =>
        setEditorState((editorState) =>
          RichUtils.toggleBlockType(editorState, 'header-three')
        ),
      description: 'Toggles heading 3 block style'
    },
    {
      command: 'heading level 4.',
      callback: () =>
        setEditorState((editorState) =>
          RichUtils.toggleBlockType(editorState, 'header-four')
        ),
      description: 'Toggles heading 4 block style'
    },
    {
      command: 'heading level 5.',
      callback: () =>
        setEditorState((editorState) =>
          RichUtils.toggleBlockType(editorState, 'header-five')
        ),
      description: 'Toggles heading 5 block style'
    },
    {
      command: 'heading level 6.',
      callback: () =>
        setEditorState((editorState) =>
          RichUtils.toggleBlockType(editorState, 'header-six')
        ),
      description: 'Toggles heading 6 block style'
    },
    {
      command: 'code block.',
      callback: () =>
        setEditorState((editorState) =>
          RichUtils.toggleBlockType(editorState, 'code-block')
        ),
      description: 'Toggles code block style'
    },
    {
      command: 'block quote.',
      callback: () =>
        setEditorState((editorState) =>
          RichUtils.toggleBlockType(editorState, 'blockquote')
        ),
      description: 'Toggles blockquote block style'
    },
    {
      command: 'ordered list.',
      callback: () => {
        setEditorState((editorState) =>
          RichUtils.toggleBlockType(editorState, 'ordered-list-item')
        );

        ttsSpeak(
          'Please press enter from your keyboard to add next number of the current ordered list.'
        );

        // Additional async operations can be added here if needed
      },
      description: 'inserts an Ordered-List-Item'
    },
    {
      command: 'unordered list.',
      callback: () => {
        setEditorState((editorState) =>
          RichUtils.toggleBlockType(editorState, 'unordered-list-item')
        );
        ttsSpeak(
          'Please press enter from your keyboard to add next bullet of the current unordered list.'
        );

        // Additional async operations can be added here if needed
      },
      description: 'inserts an Unordered-List-Item'
    },
    {
      command: 'new line.',
      callback: () =>
        setEditorState((editorState) =>
          RichUtils.insertSoftNewline(editorState)
        ),
      description: 'Inserts a New Line'
      //# callback: () => setEditorContentProgramatically('\u000A'),
    },
    {
      command: 'set font.',
      callback: () =>
        setEditorState((editorState) =>
          styles.fontSize.toggle(editorState, '24px')
        ),
      description: 'Sets Font-Size to 24px'
    },
    {
      command: 'set font family.',
      callback: () =>
        setEditorState((editorState) =>
          styles.fontFamily.toggle(editorState, 'Times New Roman')
        ),
      description: 'Sets Font-Family to Times New Roman'
    },
    {
      command: 'post article.',
      callback: () => {
        publishArticle();
      }
    }
  ];

  const updateSidebar = () => {
    if (props.editor) {
      commands.push();
    }
    props.setCommands(commands);
  };

  const commandsAndDesc = [];

  commands.forEach((cmd) => {
    commandsAndDesc.push({
      command: cmd.command,
      description: cmd.description
    });
  });

  useEffect(() => {
    updateSidebar();
  }, []);

  const { resetTranscript, interimTranscript, finalTranscript } =
    useSpeechRecognition({ commands });
  const [editorJSON, setEditorJSON] = useState('');

  const onEditorStateChange = (editorState) => {
    setEditorState((prevEditorState) => {
      return editorState;
    });
  };

  //Insert the transcribed text into the text editor
  const insertText = (text, editorState) => {
    const currContent = editorState.getCurrentContent();
    const currSelection = editorState.getSelection();

    const newContent = Modifier.replaceText(
      currContent,
      currSelection,
      text,
      editorState.getCurrentInlineStyle()
    );

    const newEditorState = EditorState.push(
      editorState,
      newContent,
      'insert-characters'
    );
    return EditorState.forceSelection(
      newEditorState,
      newContent.getSelectionAfter()
    );
  };

  //Sets the text editor state programatically
  const setEditorContentProgramatically = (text) => {
    let shouldProvoke = true;
    //Do not insert commands into the text editor as plain text
    if (speechSynthesis.speaking) shouldProvoke = false;
    commands.forEach((cmd) => {
      if (text === cmd.command) {
        shouldProvoke = false;
      }
    });
    if (text.includes('speak')) shouldProvoke = false;
    if (text.includes('stop speaking')) shouldProvoke = false;
    if (shouldProvoke) {
      setEditorState((currEditorState) => {
        return insertText(text.length > 0 ? text + ' ' : text, currEditorState);
      });
    }
  };

  return (
    <React.Fragment>
      <div id={'download-area'}></div>
      {loading ? <LinearProgress /> : ''}
      <BlogHeader
        config={{
          ...blogHeaderConfig,
          title:
            title.length > 0
              ? title
              : 'Untitled - Say "set title <titlename>" to set a title',
          setCommands: props.setCommands,
          showCoverImageSelectorButton: true
          // setShowCoverImageSelector: () => setShowImageSelector(true)
        }}
      />
      <DraftEditor
        interimTranscript={interimTranscript}
        transcript={finalTranscript}
        resetTranscript={resetTranscript}
        onEditorStateChange={onEditorStateChange}
        setEditorContentProgramatically={setEditorContentProgramatically}
        editorState={editorState}
        customStyleFn={customStyleFn}
      />
      {interimTranscript}
    </React.Fragment>
  );
}

export default TextEditor;
