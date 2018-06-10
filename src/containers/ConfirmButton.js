import React from 'react';
import styled from 'styled-components';
import Colors from '../constants/Colors';
import SubmitButton from '../components/SubmitButton';

const Button = styled.button`
  display: inline;
  border: 1px solid #ced7da;
  border-radius: 3px;
  width: 100%;
  background: #fff;
  text-decoration: none;
  padding: 5px 10px 5px;
  position: relative;
  color: ${Colors.blue};
  font-size: 13px;
  cursor: pointer;
  transition: 0.5s all;
  font-weight: 600;
  box-shadow: 1px 1px 1px rgba(206, 215, 218, 0.55);
  &:hover {
    background: ${Colors.whiteBlue};
  }
`;

class ConfirmButton extends React.Component {
  static defaultProps = {
    readyMsg: 'Confirm',
    confirmMsg: 'Click Again to Confirm',
    action: () => {},
    timeout: 750,
  };
  state = {
    step: 0,
  };
  click = e => {
    e.stopPropagation();
    e.preventDefault();
    const { step } = this.state;
    if (step) {
      this.props.action();
    } else {
      this.setState({ step: 1 });
      setTimeout(() => {
        this.setState({ step: 0 });
      }, this.props.timeout);
    }
  };
  render() {
    const {
      readyMsg,
      confirmMsg,
      mainButton,
      saving,
      success,
      status,
    } = this.props;
    const { step } = this.state;
    const msg = step ? confirmMsg : readyMsg;
    if (mainButton) {
      return (
        <SubmitButton
          msgs={{ ready: msg, saving, success }}
          onClick={this.click}
          style={this.props.style}
          status={status}
        />
      );
    } else {
      return (
        <Button onClick={this.click} style={this.props.style}>
          {msg}
        </Button>
      );
    }
  }
}

export default ConfirmButton;
