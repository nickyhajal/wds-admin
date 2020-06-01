import { gql } from 'react-apollo';

export default gql`
  mutation racetaskAdd(
    $section: String!
    $type: String!
    $task: String!
    $points: String!
    $note: String
  ) {
    racetaskAdd(
      section: $section
      type: $type
      task: $task
      points: $points
      note: $note
    ) {
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
