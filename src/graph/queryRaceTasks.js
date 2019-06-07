import { gql } from 'react-apollo';

export default gql`
  query racetasks {
    racetasks {
      racetask_id
      section
      type
      task
      slug
      descr
      points
      note
      active
      address
      geopoint
      attendee_max
      global_max
      submissions
      year
    }
  }
`;
