/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import './style.scss';

function Sidebar(props) {
  const [commands, setCommands] = useState([]);

  const setCommandsState = (cmds) => {
    let filteredCmds = [];
    if (cmds !== null) {
      try {
        filteredCmds = cmds.filter(
          (cmd) => cmd.isHidden === undefined || cmd.isHidden === false
        );
      } catch (e) {
        console.log(e);
        filteredCmds = cmds;
      }
      setCommands(filteredCmds);
    }
  };

  useEffect(() => {
    props.setsetStateFunc(setCommandsState);

    // Function to handle voice message
    // const speakWelcomeMessage = () => {
    //     const message = new SpeechSynthesisUtterance();
    //     message.text = "Welcome to the homepage. These are the available commands 'Create New Article', 'Open', 'Search', 'Go Back', 'Scroll Down' and 'Scroll Up'"
    //     window.speechSynthesis.speak(message);
    // };

    // // Speak welcome message on component mount
    // speakWelcomeMessage();
  }, []);

  return (
    <React.Fragment>
      <div className="sidebar">
        <h6 className="h6">Commands and Descriptions</h6>
        <div className="commands">
          {commands.length > 0
            ? commands.map((cmd) => (
                <div className="command" key={cmd.command}>
                  <div className="button">{cmd.command}</div>
                  <div className="caption">{cmd.description}</div>
                </div>
              ))
            : 'loading commands...'}
        </div>
      </div>
    </React.Fragment>
  );
}

export default Sidebar;
