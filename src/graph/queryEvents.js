import { gql } from 'react-apollo';

export default gql`
  query events($year: Int, $showInactive: Boolean, $type: String) {
    events(year: $year, type: $type, showInactive: $showInactive) {
      event_id
      year
      active
      ignored
      type
      for_type
      format
      outline
      slug
      descr
      what
      who
      bios
      start
      end
      place
      address
      venue_note
      lat
      lon
      note
      price
      pay_link
      max
      num_rsvps
      free_max
      num_free
      created_at
      updated_at
      hosts {
        user_id
        first_name
        last_name
        email
      }
    }
  }
`;
