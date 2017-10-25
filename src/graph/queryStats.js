import { gql } from 'react-apollo';

export default gql`
  query stats {
    stats {
      current_wave_tickets
      total_tickets
      num_assigned
    }
  }
`;
