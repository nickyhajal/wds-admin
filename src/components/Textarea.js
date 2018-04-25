import styled from 'styled-components';
import Colors from '../constants/Colors';

export default styled.textarea`
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
  }
`;
