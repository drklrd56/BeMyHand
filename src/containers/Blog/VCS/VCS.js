import React, { useEffect, useState } from 'react';
import axios from 'axios';
import authHeader from '../../../services/auth-header';
import { useSpeechRecognition } from 'react-speech-recognition';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import MicIcon from '@material-ui/icons/Mic';
import LinearProgress from '@material-ui/core/LinearProgress';

import DotList from '../../../components/UIWidgets/DotList';

const BlueTextTypography = withStyles({
  root: {
    color: '#4285f4',
    fontSize: '24px'
  }
})(Typography);
const BlueRegularTypography = withStyles({
  root: {
    color: '#4285f4'
  }
})(Typography);

export default function VCS(props) {
  const [loading, setLoading] = useState(true);

  const commands = [
    {
      command: 'go back.',
      callback: () => props.history.goBack(),
      description: 'Go back to the previous page'
    },
    {
      command: 'go to homepage.',
      callback: () => props.history.push('/'),
      description: 'Goes to the home page'
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
      command: 'open version level *.',
      callback: (id) => {
        if (id - 1 < versions.length && id - 1 >= 0)
          props.history.push(
            '/edit-article/' + props.match.params.id + '/' + (id - 1)
          );
      },
      description: 'Opens the respective version in the text editor'
    }
  ];

  const commandsAndDesc = [];

  commands.forEach((cmd) => {
    commandsAndDesc.push({
      command: cmd.command,
      description: cmd.description
    });
  });

  const updateSidebar = () => {
    props.setCommands(commandsAndDesc);
  };

  const { Transcript } = useSpeechRecognition({ commands });

  const [versions, setVersions] = useState([]);

  useEffect(() => {
    axios
      .get(
        'https://bemyhandbackend.onrender.com/get-articles-version-history/' +
          props.match.params.id,
        {
          headers: authHeader()
        }
      )
      .then((res) => {
        console.log(res);
        setLoading(false);
        const versionHistory = res.data['version_history']['Version_History'];
        setVersions([...versionHistory]);
        updateSidebar();
      })
      .catch((err) => {
        props.history.push('/');
      });
  }, []);

  return (
    <React.Fragment>
      {loading ? <LinearProgress /> : ''}
      <div
        style={{ textAlign: 'center', padding: '10px', marginBottom: '25px' }}
      >
        <BlueTextTypography variant={'button'}>
          Version Control System
        </BlueTextTypography>
      </div>
      <div>
        {!loading ? (
          versions.length > 0 ? (
            versions.map((version, index) => {
              return (
                <div style={{ marginBottom: '12.5px', padding: '5px 7.5%' }}>
                  <Paper variant={'outlined'}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '12.5px',
                        color: '#4285f4'
                      }}
                    >
                      {/*<BlueRegularTypography variant={"subtitle1"}>*/}
                      {/*    Version {index}*/}
                      {/*</BlueRegularTypography>*/}
                      <DotList
                        items={[
                          `Version${index + 1}`,
                          new Date(version.timeChanged).toDateString()
                        ]}
                      />
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <MicIcon style={{ fill: '#4285f4' }} />
                        <BlueRegularTypography variant={'button'}>
                          Open Version Level {index + 1}
                        </BlueRegularTypography>
                      </div>
                    </div>
                  </Paper>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '12.5px 7.5%' }}>
              <Paper variant={'outlined'}>
                <div style={{ textAlign: 'center', padding: '12.5px' }}>
                  <BlueRegularTypography variant={'button'}>
                    No edit history found
                  </BlueRegularTypography>
                </div>
              </Paper>
            </div>
          )
        ) : (
          <div style={{ textAlign: 'center', padding: '12.5px 7.5%' }}>
            <Paper variant={'outlined'}>
              <div style={{ textAlign: 'center', padding: '12.5px' }}>
                <BlueRegularTypography variant={'button'}>
                  Loading edit history
                </BlueRegularTypography>
              </div>
            </Paper>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}
