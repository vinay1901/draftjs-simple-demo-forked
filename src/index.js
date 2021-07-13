import React, { Component } from 'react';
import { render } from 'react-dom';
import {
  Editor,
  EditorState,
  ContentState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';
import styled from 'styled-components';
import { stateToHTML } from 'draft-js-export-html';

import './style';
import decorator from './decorators';
import Input from './containers/Input';
import CommentButton from './components/CommentButton';
import ToolbarButton from './components/ToolbarButton';
import Image from './components/Image';
import { insertImage, getEditorData } from './helpers/editor';
import { getSelected, getPosition } from './helpers/selection';

const Toolbar = styled.div`
  div {
    &:first-child {
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
    }
    &:last-child {
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
    }
  }
`;

class App extends Component {
  constructor() {
    super();
    this.state = {
      showLinkInput: false,
      showCommentInput: false,
      showExportedHTML: false,
      exportedOptions: {},
      position: {},
      ContentData: '',
      editorState: EditorState.createEmpty()
      // editorState: EditorState.createWithContent(
      //   ContentState.createFromText(
      //     `Advith ITeC Pvt. Ltd. (“Advith ITeC”) is engaged in the business of providing tech enabled business support service relating to financial service requirements of its customers (“Services”) through the software, developed and owned by Advith ITeC under the name and style - “Advith ITeC Platform ”. The Services are provided through the online Website of Advith ITeC – www.advithitec.in (“Website”). The clients of the Customers (“Clients”) and their staff/consultant/employees and the staff/consultant/employees of the Customer including the representative of the Customer accessing the Website are referred to as the “Users” of the Website. The term “Customer” here refers to the customer of Advith ITeC who has entered into a software license cum service agreement with Advith ITeC.
      //     `,
      //   ),
      // ),
    };

  }


  _onChange = editorState => {
    console.log('BBBBB', editorState)
    this.setState({ editorState });
  };
  _onBoldClick = e => {
    e.preventDefault();
    this._onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  };
  _onLinkClick = e => {
    e.preventDefault();
    this.setState({
      showLinkInput: true,
    });
  };
  _onLinkInputClose = () => {
    this.setState({
      showLinkInput: false,
    });
  };
  _onImageClick = e => {
    e.preventDefault();
    this.imgUpload.click();
  };
  _onCommentClick = e => {
    console.log('aaaa')
    e.preventDefault();
    this.setState({
      showCommentInput: true,
    });
  };
  _onCommentInputClose = () => {
    this.setState({
      showCommentInput: false,
    });
  };
  handleSubmit = (value) => {
    if (this.state.editorState) {
      var contentRaw = convertToRaw(this.state.editorState.getCurrentContent());
      console.log('contentState', contentRaw)
      sessionStorage.setItem('user', JSON.stringify(contentRaw));
    }
  }
  _onExportClick = e => {
    e.preventDefault();
    this.setState(({ showExportedHTML }) => ({
      showExportedHTML: !showExportedHTML,
      exportedOptions: {
        entityStyleFn: entity => {
          const entityType = entity.get('type');
          if (entityType === 'COMMENT') {
            const data = entity.getData();
            return {
              element: 'span',
              attributes: {
                'data-value': data.value,
              },
              style: {
                backgroundColor: '#ffedf2',
              },
            };
          }
        },
      },
    }));
  };
  startUploadFile = () => {
    if (this.imgUpload.files && this.imgUpload.files[0]) {
      this.handleUploadImage(this.imgUpload.files[0]);
    }
  };
  handleUploadImage = file => {
    var fr = new FileReader();
    fr.addEventListener('load', e => {
      this._onChange(
        insertImage(this.state.editorState, { src: e.target.result }),
      );
    });
    fr.readAsDataURL(file);
  };
  _onMouseOrKeyUp = () => {
    var selected = getSelected();
    if (selected.rangeCount > 0) {
      setTimeout(() => {
        this.setState({
          position: getPosition(selected),
        });
      }, 1);
    }
  };
  componentDidMount() {
    this.imgUpload = document.getElementById('imgUpload');
    this.imgUpload.addEventListener('change', this.startUploadFile, false);
    console.log('this.state.editorState', this.state.editorState)
    let decoratorObj = decorator({
      clickComment: this._onCommentClick,
      clickLink: this._onLinkClick,
    })

    this._onChange(
      EditorState.set(this.state.editorState, {
        decorator: decorator({
          clickComment: this._onCommentClick,
          clickLink: this._onLinkClick,
        }),
      }),
    );

    this.setState({
      ContentData: JSON.parse(sessionStorage.getItem('user')),
    });

    let data = JSON.parse(sessionStorage.getItem('user'));
    console.log('data', data)
    console.log('this.state.editorState', this.state.editorState)
    if (data) {
      this.setState({
        editorState: EditorState.createWithContent(convertFromRaw(data), decoratorObj)
      });
      console.log('if', this.state.editorState)
    }
    else {

      this.setState({
        editorState: EditorState.createWithContent(
          ContentState.createFromText(
            `There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc
            `,
          ),decoratorObj
        )
      })
      console.log('else', this.state.editorState)
    }

    // const rawContentFromStore = convertFromRaw(this.state.ContentData);
    // const initialEditorState = EditorState.createWithContent(rawContentFromStore);

    // this._onChange(
    //   EditorState.set(this.state.editorState, {
    //     decorator: decorator({
    //       clickComment: this._onCommentClick,
    //       clickLink: this._onLinkClick,
    //     }),
    //   }),
    // );

    // console.log('datadata')



    console.log('sessionstorage', this.state.ContentData)
  }
  componentWillUnmount() {
    this.imgUpload.removeEventListener('change', this.startUploadFile);
  }
  render() {
    const {
      showCommentInput,
      showLinkInput,
      showExportedHTML,
      exportedOptions,
      position,
      editorState,
    } = this.state;
    const { contentState } = getEditorData(editorState);
    return (
      <div style={containerStyle}>
        <Toolbar>
          <ToolbarButton icon="bold" onClick={this._onBoldClick}>
            Bold
          </ToolbarButton>
          <ToolbarButton icon="link" onClick={this._onLinkClick}>
            Link
          </ToolbarButton>
          <ToolbarButton icon="file-image-o" onClick={this._onImageClick}>
            Image
          </ToolbarButton>
          <ToolbarButton icon="commenting-o" onClick={this._onCommentClick}>
            Comment
          </ToolbarButton>
          <ToolbarButton icon="code" onClick={this._onExportClick}>
            Code
          </ToolbarButton>
        </Toolbar>
        <div
          style={{
            margin: '1rem 0',
          }}
          onKeyUp={this._onMouseOrKeyUp}
          onMouseUp={this._onMouseOrKeyUp}
        >
          {!showExportedHTML && (
            <Editor
              ref={element => (this.editor = element)}
              editorState={editorState}
              onChange={this._onChange}
              blockRendererFn={block => {
                if (block.getType() === 'atomic') {
                  return {
                    component: Image,
                    editable: false,
                    props: {
                      onClick: e => { },
                    },
                  };
                }
              }}
              blockStyleFn={block => {
                if (block.getType() === 'atomic') {
                  return 'atomic-block';
                }
              }}
              customStyleMap={{
                SELECTED: {
                  background: '#e2f2ff',
                },
              }}
            />
          )}
          {showExportedHTML && stateToHTML(contentState, exportedOptions)}
        </div>
        {showLinkInput && (
          <Input
            entityType="LINK"
            placeholder="Paste link address"
            editorState={editorState}
            onChange={this._onChange}
            position={position}
            onClose={this._onLinkInputClose}
          />
        )}
        {showCommentInput && (
          <Input
            entityType="COMMENT"
            placeholder="Write down some comment..."
            editorState={editorState}
            onChange={this._onChange}
            position={position}
            onClose={this._onCommentInputClose}
          />
        )}
        <button onClick={() => { this.handleSubmit(contentState) }}>Save</button>
        <pre>{JSON.stringify(convertToRaw(contentState), null, 2)}</pre>
        <pre>{JSON.stringify(contentState)}</pre>
        <CommentButton
          disabled={getSelected().isCollapsed || showCommentInput}
          position={position}
          onClick={this._onCommentClick}
        />
        <input type="file" id="imgUpload" style={{ display: 'none' }} />
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));

const containerStyle = {
  position: 'relative',
};
