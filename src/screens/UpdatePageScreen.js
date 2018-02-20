import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { pick, kebabCase } from 'lodash';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Select from 'react-select';
import moment from 'moment';
import AceEditor from 'react-ace';
import query from '../util/query';
import Container from '../components/Container';
import Form from '../components/Form';
import FormRow from '../components/FormRow';
import Input from '../components/Input';
import Colors from '../constants/Colors';
import Label from '../components/Label';
import apollo from '../util/apollo';
import mutateAddTicket from '../graph/mutateAddTicket';
import SubmitButton from '../components/SubmitButton';
import queryUser from '../graph/queryUser';
import mutateAddUser from '../graph/mutateAddUser';
import UserAdminNoteContainer from '../containers/UserAdminNoteContainer';
import 'brace/mode/jsx';
import 'brace/mode/markdown';
import 'brace/snippets/markdown';
import 'brace/theme/tomorrow';
import mutateAddPage from '../graph/mutateAddPage';
import mutateUpdatePage from '../graph/mutateUpdatePage';

const Page = styled.div``;

const ColContent = styled.div`
  display: flex;
  align-items: flex-start;
`;
const ContentSide = styled.div`
  background: ${Colors.white};
  padding: 32px;
  margin-left: 24px;
  border-radius: 4px;
  box-shadow: 3px 3px 20px rgba(0, 0, 0, 0.08);
  flex: 1;
  margin-top: 110px;
`;

class UpdatePageScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      submitStatus: 'ready',
      status: 'draft',
      title: '',
      content: '',
    };
  }
  componentWillReceiveProps(props) {
    this.setState(Object.assign({}, this.state, props.data.page));
  }
  changeStatus = e => {
    this.setState({
      status: e.value,
    });
  };
  change = e => {
    if (e.currentTarget.name !== undefined) {
      const { name, value } = e.currentTarget;
      this.setState({
        [name]: value,
      });
    }
  };
  changeContent = content => {
    this.setState({ content });
  };
  startAdd = async e => {
    e.preventDefault();
    this.setState({ submitStatus: 'saving' });
    const variables = pick(this.state, [
      'page_id',
      'status',
      'content',
      'title',
    ]);
    const res = await apollo.mutate({
      mutation: mutateUpdatePage,
      variables,
    });
    this.setState({ submitStatus: 'success' });
    setTimeout(() => {
      this.setState({ submitStatus: 'ready' });
    }, 1000);
  };
  render() {
    const types = [
      { label: 'Draft', value: 'draft' },
      { label: 'Published', value: 'published' },
    ];
    const h = window.innerHeight;
    const link = `https://worlddominationsummit.com/${
      this.state.status === 'draft' ? 'draft/' : ''
    }${this.state.slug}`;
    return (
      <ColContent>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', width: '100%', marginTop: '-18px' }}>
            <div
              className="react-tabs__tab-panel react-tabs__tab-panel--selected"
              style={{
                flex: '1',
                marginRight: '20px',
                padding: '3px',
              }}
            >
              <Form onSubmit={this.startAdd}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex' }}>
                    <Input
                      type="text"
                      value={this.state.title}
                      placeholder="Add a Title for Your Page"
                      name="title"
                      onChange={this.change}
                      style={{
                        width: '100%',
                        fontSize: '20px',
                        padding: '15px',
                        margin: '20px 15px 0 15px',
                        borderRadius: '4px 4px 0 0',
                      }}
                    />
                  </div>
                  <a
                    href={link}
                    target="_blank"
                    style={{
                      background: '#eee',
                      color: '#a4bfc1',
                      borderRadius: '0 0 4px 4px',
                      margin: '0px 15px 20px 15px',
                      padding: '6px 10px',
                      fontSize: '14px',
                    }}
                  >
                    {link}
                  </a>
                </div>
                <AceEditor
                  mode="markdown"
                  theme="tomorrow"
                  name="blah2"
                  onLoad={this.onLoad}
                  onChange={this.changeContent}
                  fontSize={14}
                  style={{
                    width: '100%',
                    borderTop: '1px solid #ddd',
                    marginBottom: '10px',
                    height: `${h - 250}px`,
                  }}
                  showPrintMargin={true}
                  showGutter={true}
                  highlightActiveLine={true}
                  value={this.state.content}
                  setOptions={{
                    enableBasicAutocompletion: false,
                    enableLiveAutocompletion: false,
                    enableSnippets: false,
                    showLineNumbers: false,
                    indentedSoftWrap: true,
                    wrap: true,
                    tabSize: 2,
                  }}
                />
              </Form>
            </div>
            <div style={{ width: '340px' }}>
              <SubmitButton
                status={this.state.submitStatus}
                onClick={this.startAdd}
                msgs={{
                  ready: 'Save Page',
                  saving: 'Saving...',
                  success: 'Saved!',
                }}
                style={{
                  width: '100%',
                  padding: '14px 0',
                  marginBottom: '0px',
                }}
              />
              <div
                className="react-tabs__tab-panel react-tabs__tab-panel--selected"
                style={{ width: '340px' }}
              >
                <div>
                  <label>Status</label>
                  <Select
                    value={this.state.status}
                    name="type"
                    options={types}
                    clearable={false}
                    onChange={this.changeStatus}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ColContent>
    );
  }
}
export default withRouter(
  query('page', UpdatePageScreen, ({ match }) => ({
    variables: { page_id: match.params.id },
  })),
);
