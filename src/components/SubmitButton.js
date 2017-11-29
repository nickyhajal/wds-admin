import styled from 'styled-components';
import React from 'react';

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
  font-family: Lato;
  cursor: pointer;
`;

const SubmitButton = props => {
  const msgs = Object.assign({}, SubmitButton.defaultProps, props.msgs);
  let msg = 'Continue';
  return <Button {...props}>{msgs[props.status]}</Button>;
};
SubmitButton.defaultProps = {
  status: 'ready',
  msgs: {
    ready: 'Continue',
    saving: 'Saving...',
    success: 'Success!',
  },
};
export default SubmitButton;
