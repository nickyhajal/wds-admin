import {gql} from 'react-apollo'

export default gql`
  query users($search: String!, $years: String, $types: String) {
    users(search: $search, years: $years, types: $types) {
      user_id
      attending18
      attending19
      attending20
      pre18
      pre19
      pre20
      type
      ticket_type
      first_name
      last_name
      user_name
      location
      twitter
      stripe
      email
      merged
    }
  }
`
