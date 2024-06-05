import React, { useContext } from 'react';
import MicIcon from '@material-ui/icons/Mic';
import Typography from '@material-ui/core/Typography';

import BlogSignatureHeading from '../../../../components/UIWidgets/Typography/BlogSignatureHeading';
import DotList from '../../../../components/UIWidgets/DotList';

import ThemeContext from '../../../../contexts/ThemeContext';

import './style.scss';
import { withStyles } from '@material-ui/core/styles';

const WhiteTextTypography = withStyles({
  root: {
    color: '#fff'
  }
})(Typography);

function BlogHeader(props) {
  const theme = useContext(ThemeContext);
  const currTheme = 'blue';

  return (
    <React.Fragment>
      <div
        style={{ backgroundImage: `url(${props.config.imageURL})` }}
        className="blog-header blog-header--pixel"
      >
        {props.config.owner ? (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <button
              style={{
                background: '#4285f4',
                border: 0,
                borderRadius: '4px',
                padding: '7px 18px',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                marginRight: '12.5px'
              }}
              onClick={props.config.handleEditArticleClicked}
            >
              <MicIcon style={{ fill: '#fff' }} />
              <WhiteTextTypography variant={'button'}>
                Edit Article
              </WhiteTextTypography>
            </button>
            <button
              style={{
                background: '#ED4739',
                border: 0,
                borderRadius: '4px',
                padding: '7px 18px',
                color: '#fff',
                display: 'flex',
                alignItems: 'center'
              }}
              onClick={props.config.handleDeleteArticleClicked}
            >
              <MicIcon style={{ fill: '#fff' }} />
              <WhiteTextTypography variant={'button'}>
                Delete Article
              </WhiteTextTypography>
            </button>
          </div>
        ) : (
          ''
        )}

        <div style={{ color: theme[currTheme].color }} className="blog-title">
          <div className="blog-title--heading">
            <BlogSignatureHeading theme={currTheme}>
              {props.config.title}
            </BlogSignatureHeading>
          </div>
          <div className="blog-authored">
            <DotList items={[props.config.author, props.config.createdOn]} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default BlogHeader;
