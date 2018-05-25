import styled from 'styled-components';
import { lighten } from 'polished';
import Colors from '../constants/Colors';

export default styled.div`
  background: ${lighten(0.03, Colors.whiteBlue)};
  border: 1px solid #ddd;
  margin-bottom: 12px;
  border-radius: 3px;
  text-align: center;
  background: #f3f3f3;
  padding: 24px;
`;
