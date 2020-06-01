import { gql } from 'react-apollo';

export default gql`
  mutation racetaskUpdate(
    $racetask_id: String!
    $section: String!
    $type: String!
    $task: String!
    $points: String!
    $note: String
  ) {
    racetaskUpdate(
      racetask_id: $racetask_id
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
