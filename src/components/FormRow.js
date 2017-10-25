//@flow
import styled from 'styled-components';

type Props = {
  cols?: number,
  children?: any,
};
const FormRow = styled.div`
  display: flex;
  width: 100%;
  > div {
    margin-right: 20px;
    flex: ${(props: Props) => (props.cols === 1 ? '0.5' : '1')};
    &:last-of-type {
      margin-right: ${(props: Props) =>
        props.cols === 1 ? '20px !important' : '0'};
    }
  }
  margin-bottom: 20px;
  .Select,
  .Select-placeholder {
    cursor: pointer;
  }
  .rdr-DateRange {
    display: flex !important;
    justify-content: center !important;
  }
`;
FormRow.defaultProps = {
  cols: 1,
};

export default FormRow;
