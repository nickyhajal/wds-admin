import React from 'react';
import styled from 'styled-components';
import { lighten } from 'polished';
import query from '../util/query';
import Colors from '../constants/Colors';
import TextArea from 'react-textarea-autosize';
import apollo from '../util/apollo';
import mutateUserNoteAdd from '../graph/mutateUserNoteAdd';
import NullMsg from '../components/NullMsg';

const TextInput = styled(TextArea)`
  padding: 10px;
  border: 1px solid #d3d3d3;
  border-radius: 3px 0 0 3px;
  margin-top: 12px;
  width: 75%;
  font-size: 15px;
  font-family: 'Source Sans Pro';
  color: ${Colors.blueDarker};
`;
const PostShell = styled.div`
  display: flex;
  align-items: center;
`;
const Button = styled.button`
  background: ${Colors.blue};
  color: #fff;
  padding: 3px 12px;
  height: 41px;
  font-size: 14px;
  width: 140px;
  margin-left: 0;
  border: 0;
  margin-top: 11px;
  border-radius: 0 3px 3px 0;
  opacity: 0;
  transition: 0.2s all;
  cursor: pointer;
`;
const NoteShell = styled.div`
  margin-top: 24px;
  border-top: 1px solid ${lighten(0.3, Colors.grayDark)};
  padding-top: 24px;
  width: 75%;
  margin-bottom: -4px;
`;
const Note = styled.div`
  padding: 12px 20px;
  background: ${lighten(0.03, Colors.whiteBlue)};
  border: 1px solid #ddd;
  margin-bottom: 12px;
  border-radius: 3px;
  &.nullMsg {
    text-align: center;
    background: #f3f3f3;
    padding: 24px;
  }
`;

class UserAdminNoteContainer extends React.Component {
  state = {
    note: '',
    postBtn: 'Post Note',
  };
  post = async () => {
    this.setState({ postBtn: 'Posting...' });
    const result = await apollo.mutate({
      mutation: mutateUserNoteAdd,
      variables: {
        admin: '1',
        user_id: '0',
        about_id: this.props.user.user_id,
        note: this.state.note,
      },
    });
    this.setState({ note: '', postBtn: 'Posted!' });
    setTimeout(() => {
      this.setState({ postBtn: 'Post Note' });
    });
    this.props.data.refetch();
  };
  render() {
    const admin_notes = this.props.data.loading
      ? []
      : this.props.data.user
        ? this.props.data.user.admin_notes
        : [];
    return (
      <div>
        <PostShell onMouseOver={this.postAreaOver}>
          <TextInput
            onChange={e => this.setState({ note: e.currentTarget.value })}
            value={this.state.note}
            style={{
              borderRadius: this.state.note.length ? '3px 0 0 3px' : '3px',
            }}
            placeholder={`Add a note about ${this.props.user.first_name}`}
          />
          <Button
            onClick={this.post}
            style={{ opacity: this.state.note.length ? '1' : '0' }}
          >
            {this.state.postBtn}
          </Button>
        </PostShell>
        <NoteShell>
          {admin_notes.length ? (
            admin_notes.map(v => <Note>{v.note}</Note>)
          ) : (
            <NullMsg className="nullMsg">No notes yet!</NullMsg>
          )}
        </NoteShell>
      </div>
    );
  }
}

export default query('userAdminNotes', UserAdminNoteContainer, ({ user }) => ({
  variables: { id: user.user_id },
}));
