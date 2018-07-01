import { gql } from 'react-apollo';

export default gql`
  query stats {
    stats {
      single_buys
      double_buys
      current_wave_tickets
      total_tickets
      friends
      rsvps
      likes
      meetups
      posts
      pw
      num_assigned
    }
  }
`;
