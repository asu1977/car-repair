import React from 'react';
import { withRouter } from 'react-router-dom';

import { ApolloConsumer } from 'react-apollo';

const handleSignout = (client, history) => {
  localStorage.setItem('token', '')
  client.resetStore();
  history.push('/');
}

const Signout = ({ history }) =>  (
  <ApolloConsumer>
    {client => {
      return (
        <button style={{ borderColor: "#514a9d" }} onClick={() => handleSignout(client, history)}>Signout</button>
      )
    }}
  </ApolloConsumer>
)

export default withRouter(Signout);