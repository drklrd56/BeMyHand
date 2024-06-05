/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Selector from "../../Selector";
import TextField from '@material-ui/core/TextField';
import axios from "axios";
import {useSpeechRecognition} from "react-speech-recognition";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(1),
            width: theme.spacing(16),
            height: theme.spacing(16),
        },
    },
}));
;


function ArticleCoverImageSelector(props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [offsetTop, setOffsetTop] = useState(0);

    const classes = useStyles();

    const commands = [
        {
            command: 'search *.',
            callback: query => {
                setSearchQuery(query);
                const url = "https://www.googleapis.com/customsearch/v1?key=AIzaSyAmFfu2RsIuY7DoarLaK-GNoMQAkXoq4sQ&cx=b99ad2dddfcac4813&searchType=image&q="
                    + query.replace(" ", "%20");
                axios.get(url)
                    .then(res => {
                        console.log(res);
                        setSearchResults([...res.data.items]);
                    }).catch(err => {
                    console.log(err);
                });
            },
            description: 'Searches images from the web.',
        },
        {
            command: 'set image level *.',
            callback: index => {
                console.log(index);
                index = parseInt(index);
                index -= 1
                props.setCoverImage(searchResults[index].link);
                props.hide();
            },
            description: 'Sets cover image equal to the image at the level specified'
        },
        {
            command: 'scroll down.',
            callback: () => {
                setOffsetTop(prevOffsetTop => {
                    document.querySelector("#selector-element").scrollTo({top: prevOffsetTop + 320, behavior: "smooth"})
                    return prevOffsetTop + 320;
                })
            }
        },
        {
            command: 'scroll up.',
            callback: () => {
                setOffsetTop(prevOffsetTop => {
                    document.querySelector("#selector-element").scrollTo({top: prevOffsetTop - 320, behavior: "smooth"})
                    return prevOffsetTop - 320;
                })
            }
        },
        {
            command: 'close.',
            callback: () => props.hide(),
            description: 'It will close this modal',
        }

]
    const {transcript} = useSpeechRecognition({commands});
    const commandsAndDesc = [];

    commands.forEach(cmd => {
        commandsAndDesc.push({command: cmd.command, description: cmd.description})
    })

    const updateSidebar = () => {
        props.setCommands(commandsAndDesc);
    }

    useEffect(() => {
        updateSidebar();
    }, [])


    return (

        <Selector {...props} commands={commands}>
            <div style={{padding: '20px 10px',}}>
                <h6 className="h6-local">Select a method for uploading cover image</h6>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-around'
                }}>
                    <div style={{
                        width: '100%'
                    }}>
                        <TextField id="cover-image-search-bar" value={searchQuery}
                                   onChange={(e) => setSearchQuery(e.target.value)}
                                   label="Say 'Search <your-query>'" variant="outlined" fullWidth/>
                    </div>
                </div>
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                flexWrap: 'wrap',
            }}>
                {searchResults.map(sr => {
                    return (
                        <div style={{
                            width: "48%",
                            minHeight: '300px',
                            height: '300px',
                            maxHeight: '300px',
                            display: 'inline-block',
                            marginBottom: '10px',
                            borderRadius: '4px',
                            overflow: 'hidden',
                        }}>
                            <Paper>
                                <img src={sr.link} width={"100%"} height={"auto"}/>
                            </Paper>
                        </div>
                    )
                })}
            </div>
            <label style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: '#4285f4',
                border: 0,
                borderRadius: '4px',
                padding: '7px 18px',
                color: '#fff',
            }}
            htmlFor={"coverImage"}>Upload Locally
            </label>

        </Selector>

    );
}

export default ArticleCoverImageSelector;