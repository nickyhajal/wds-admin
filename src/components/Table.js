import ReactTable from 'react-table';
import styled from 'styled-components';
import Colors from '../constants/Colors';
import { lighten } from 'polished';

export default styled(ReactTable)`
  margin-top: 22px;
  &.ReactTable {
    .rt-resizable-header-content {
      padding: 10px;
    }
    .rt-thead.-header {
      box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.04);
      border-bottom: 1px solid #eee;
    }
    .rt-td {
      padding: 12px;

      a {
        color: ${Colors.blueDarker};
        text-decoration: underline;
        &:hover {
          text-decoration: none;
        }
      }
    }
    .rt-tr {
      cursor: pointer;
      transition: 0.2s all;
    }
    &.-highlight {
      .rt-tbody .rt-tr:not(.-padRow):hover {
        background: ${lighten(0.03, Colors.blueBright)};
      }
    }
  }
`;
