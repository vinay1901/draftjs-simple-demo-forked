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
    this.container.style.left = `${
      left + this.container.offsetWidth > bodyPosition.width
        ? bodyPosition.width - this.container.offsetWidth - 16
        : left
    }px`;

    setTimeout(() => this.input.focus(), 0);
  }
  render() {
    const {
      position: { top, height },
      value,
      placeholder,
      onKeyDown,
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
        <Input
          innerRef={input => (this.input = input)}
          type="input"
          value={value}
          placeholder={placeholder}
          onKeyDown={onKeyDown}
          onChange={onChange}
          spellCheck={false}
        />
        {enableRemove && (
          <ToolbarButton onClick={onClickRemove}>Remove</ToolbarButton>
        )}
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
  };
  static defaultProps = {
    position: {
      top: 0,
      left: 0,
      height: 0,
    },
    value: '',
    placeholder: '',
    onKeyDown: () => {},
    onChange: () => {},
    onClickRemove: () => {},
    enabledRemove: false,
  };
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #333;
  border: 1px solid #eee;
  border-radius: 5px;
  padding: 0.5rem;
  position: absolute;
`;

const Input = styled.input`
  width: 250px;
  background: transparent;
  font-family: system-ui;
  font-size: 0.8rem;
  font-weight: 100;
  color: white;
  border: 0;
  outline: none;
`;
