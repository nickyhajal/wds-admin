import React from 'react';
import styled from 'styled-components';

const Avatar = styled.div`
  background-size: cover;
  position: relative;
  display: inline-block;
  box-shadow: 5px 5px 12px rgba(0, 0, 0, 0.12);
`;

export default ({ user_id, user, width, style, suffix }) => {
  if (user) {
    user_id = user.user_id;
  }
  const url = `url(https://avatar.wds.fm/${user_id}?width=${width *
    2}&${suffix})`;
  const dim = `${width}px`;
  return (
    <Avatar
      style={Object.assign(
        { backgroundImage: url, width: dim, height: dim },
        style,
      )}
    />
  );
};
