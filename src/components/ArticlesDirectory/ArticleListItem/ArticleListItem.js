import React from 'react';
import './ArticleListItem.scss';
import { Editor } from 'draft-js';

import Button from '../UIElements/Button/Button';
import AuthService from '../../../services/auth-service';

const ArticleListItem = (props) => (
  <div className="ArticleListItem">
    <div
      className="ArticleListItem__Img"
      style={{ backgroundImage: `url(${props.cover})` }}
    ></div>
    <div className="ArticleListItem__Content">
      <h1 className="ArticleListItem__Content--Heading">{props.title}</h1>
      <p className="ArticleListItem__Content--Paragraph">
        <Editor editorState={props.body} readOnly={true} />
        {/*{props.body.substr(0,180) + "..."}*/}
      </p>

      <div className="ArticleListItem__Content--DateAndButtonDiv">
        <p className="ArticleListItem__Content--DateAndButtonDiv-PublishedDate">
          {/*Oct 18 - 3:24 PM*/}
          {new Date(props.date).toDateString()}
        </p>
        <div className="ArticleListItem__Content--DateAndButtonDiv">
          {AuthService.getCurrentUser().isAdmin && (
            <div
              style={{
                paddingRight: '24px'
              }}
            >
              <Button
                buttonText="Delete"
                width="114px"
                height="31px"
                padding="6px 24px 6px 24px"
                fontSize="13px"
                borderRadius="5px"
                onClick={props.deleteArticleHandler}
              />
            </div>
          )}
          <Button
            buttonText="Open"
            width="114px"
            height="31px"
            padding="6px 24px 6px 24px"
            fontSize="13px"
            borderRadius="5px"
            onClick={props.showBlogHandler}
          />
        </div>
      </div>
    </div>
  </div>
);

export default ArticleListItem;
