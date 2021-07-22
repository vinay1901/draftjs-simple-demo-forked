import React, { Component } from "react";
import PropTypes from "prop-types";
import onClickOutside from "react-onclickoutside";
import { EditorState, RichUtils } from "draft-js";

import { getEditorData, extendSelectionByData } from "../helpers/editor";
import {
  createEntity,
  removeEntity,
  findEntityInSelection,
  getEntities
} from "../helpers/entity";
import Input from "../components/Input";

export default onClickOutside(
  class extends Component {
    static propTypes = {
      entityType: PropTypes.string,
      editorState: PropTypes.object,
      position: PropTypes.object,
      placeholder: PropTypes.string,
      onChange: PropTypes.func,
      onClose: PropTypes.func,
      commentsList: PropTypes.array
    };
    constructor(props) {
      super();
      const { entityType, editorState } = props;
      console.log('entityType', entityType, editorState)
      this.entity = findEntityInSelection(editorState, entityType);
      this.state = {
        commentsList: [],
        value: this.entity !== null ? this.entity.entity.data.value : ""
      };
    }
    componentWillMount() {
      this.handleAdd();
      const { entityType, editorState, onChange } = this.props;

      if (this.entity !== null) {
        this.editorStateBackup = extendSelectionByData(
          editorState,
          getEntities(editorState, entityType, this.entity.entityKey)
        );
        console.log('this.editorStateBackup ', this.editorStateBackup, this.entity.entity.data)
        this.setState({ commentsList: this.entity.entity.data })
      } else {
        this.editorStateBackup = editorState;
      }
      onChange(RichUtils.toggleInlineStyle(this.editorStateBackup, "SELECTED"));
    }

    componentWillUnmount() {
      this.props.onChange(this.editorStateBackup);
    }

    handleAdd() {
      let array = this.state.commentsList;
      array.push({ value: '' })
      this.setState({ commentsList: array })
      console.log('commentsList', this.state.commentsList)
      // commentsType.comments = this.state.commentsList;
    }

    // handleInputVlaueChange (e ) {
    //   console.log(e.target.value)
    // }

    handleRemove(e) {
      let tempArray = this.state.commentsList;
      tempArray.splice(tempArray.indexOf(e), 1);
      this.setState({ commentsList: tempArray })

    }

    handleClickOutside = () => {
      this.props.onClose();
    };
    applyValue = e => {
      // if (e.keyCode === 13) {
      e.preventDefault();
      const { value } = this.state;
      const { entityType, onClose } = this.props;
      const { contentState } = getEditorData(this.editorStateBackup);
      if (this.entity === null) {
        console.log('aaaa', value)
        this.editorStateBackup = createEntity(
          this.editorStateBackup,
          entityType,
          [{ value }]
        );
      } else {
        console.log('value', this.state.commentsList)

        contentState.replaceEntityData(this.entity.entityKey, this.state.commentsList);
      }
      console.log('this.props.commentsList', this.state.commentsList)
      onClose();
      // }
    };
    handleAddComment = () => {
      this.handleAdd();
    }
    _onRemoveClick = () => {
      const { entityType, onClose } = this.props;
      this.editorStateBackup = removeEntity(this.editorStateBackup, entityType);
      onClose();
    };
    _onInputChange = (e, i) => {
      console.log(e.target, i)

      this.setState({ value: e.target.value });
      this.state.commentsList[i].value = e.target.value;

    };
    render() {
      const { value, commentsList } = this.state;
      const { position, placeholder } = this.props;
      return (
        <Input
          position={position}
          value={value}
          commentsList={commentsList}
          handleAddComment={this.handleAddComment}
          placeholder={placeholder}
          onKeyDown={this.applyValue}
          onChange={this._onInputChange}
          onClickRemove={this._onRemoveClick}
          enableRemove={this.entity !== null}
        />
      );
    }
  }
);
