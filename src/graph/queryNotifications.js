import { gql } from 'react-apollo';

export default gql`
  query notifications {
    notifications {
      admin_notification_id
      msg
      title
      content
      channel_type
      channel_id
      type
      link
      send_on
      sent_on
      sent_devices
      sent_users
      created_at
      updated_at
    }
  }
`;
