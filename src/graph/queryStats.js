import { gql } from 'react-apollo';

export default gql`
  query stats {
    stats {
      single_buys
      payment_plans
      current_wave_tickets
      current_wave_plan
      current_wave_total
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
