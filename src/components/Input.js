import styled from 'styled-components';
import Colors from '../constants/Colors';

export default styled.input`
  padding: 9px;
  border: 1px solid #ccc;
  font-size: 15px;
  border-radius: 4px;
  width: 100%;
  color: ${Colors.inputText};

  &:disabled {
    background: #efefef;
    border-color: #dedede;
    color: #888;

    &.alert {
      background: #efd9d9;
      border-color: #eacbcb;
      color: #af8e8e;
    }
    &.success {
      background: #e1f3db;
      border-color: #c1e4b5;
      color: #8aad7e;
    }
  }
`;
