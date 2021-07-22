import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ToolbarButton from '../components/ToolbarButton';

export default class extends Component {

  componentDidMount() {
    const {
      position: { left },
    } = this.props;
    const bodyPosition = document.body.getBoundingClientRect();
    this.container.style.left = `${left + this.container.offsetWidth > bodyPosition.width
      ? bodyPosition.width - this.container.offsetWidth - 16
      : left
      }px`;
    if (this.input) {
      setTimeout(() => this.input.focus(), 100);
    }
    console.log('commentsListcommentsList', this.props.commentsList)
  }

  // handleAddComment(val) {
  //   console.log('aaaa')
  //   this.props.commentsList.push({ value: '' })
  // }



  render() {
    const {
      position: { top, height },
      value,
      placeholder,
      handleAddComment,
      onKeyDown,
      commentsList,
      onChange,
      onClickRemove,
      enableRemove,
    } = this.props;
    return (
      <Container
        innerRef={container => (this.container = container)}
        style={{
          top: top + height + window.scrollY,
        }}
      >
        {commentsList && commentsList.map((ele, i) => {
          return (
            <div style={{ marginTop: '10px' }}>
              <Input
                innerRef={input => (this.input = input)}
                type="input"
                value={ele.value}
                placeholder={placeholder}
                // onKeyDown={onKeyDown}
                onChange={(e) => onChange(e, i)}
                spellCheck={false}
              />
            </div>
          )
        })}
        {enableRemove && (
          <div style={{ marginTop: '15px' }}>
            <ToolbarButton onClick={handleAddComment}>reply</ToolbarButton>
          </div>
        )}
        <div style={{ display: 'flex', paddingTop: '15px' }}>
          {enableRemove && (
            <div>
              <ToolbarButton onClick={onClickRemove}>Remove</ToolbarButton>
            </div>
          )}
          <div style={{ paddingLeft: '5px' }}><ToolbarButton onClick={onKeyDown}>Submit</ToolbarButton></div></div>
      </Container>
    );
  }
  static propTypes = {
    position: PropTypes.shape({
      top: PropTypes.number,
      left: PropTypes.number,
      height: PropTypes.number,
    }),
    value: PropTypes.string,
    placeholder: PropTypes.string,
    onKeyDown: PropTypes.func,
    onChange: PropTypes.func,
    onClickRemove: PropTypes.func,
    enabledRemove: PropTypes.bool,
    handleAddComment: PropTypes.func,
  };
  static defaultProps = {
    position: {
      top: 0,
      left: 0,
      height: 0,
    },
    value: '',
    placeholder: '',
    handleAddComment: () => { },
    onKeyDown: () => { },
    onChange: () => { },
    onClickRemove: () => { },
    enabledRemove: false,
  };
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 5px;
  padding: 0.5rem;
  position: absolute;
  box-shadow: 0 0 0 1px #dadce0;
  display: block;
`;

const Input = styled.input`
  width: 250px;
  background: transparent;
  font-family: system-ui;
  font-size: 0.8rem;
  font-weight: 100;
  color: black;
  padding: 6px;
  border-radius: 5px;
  border: 1px solid grey;
  outline: none;
`;
