import styled from 'styled-components';
import React from 'react';
import { transparentize } from 'polished';

import Colors from '../constants/Colors';

const Button = styled.button`
  border: 0;
  padding: 12px 44px;
  margin-top: 20px;
  margin-bottom: -16px;
  font-size: 17px;
  background: ${Colors.blue};
  border-radius: 4px;
  color: #fff;
  margin-right: 10px;
  cursor: pointer;

  &.tier2 {
    background: #ebf4f5;
    color: ${Colors.blueDarker};
    border: 1px solid rgba(183, 222, 227, 0.5);
  }
  &.tier3 {
    background: #fff;
    color: ${Colors.blueDarker};
    text-decoration: underline;
  }
`;

const SubmitButton = props => {
  const msgs = Object.assign({}, SubmitButton.defaultProps, props.msgs);
  let msg = 'Continue';
  return (
    <Button {...props} className={`tier${props.tier}`}>
      {msgs[props.status]}
    </Button>
  );
};
SubmitButton.defaultProps = {
  status: 'ready',
  msgs: {
    tier: '1',
    ready: 'Continue',
    saving: 'Saving...',
    success: 'Success!',
  },
};
export default SubmitButton;
