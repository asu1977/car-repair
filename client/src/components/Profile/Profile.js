import React from 'react';

import UserInfo from './UserInfo';
import UserCars from './UserCars';
import withAuth from '../withAuth';

const Profile = ({ session }) => (
  <div className="App">
    <UserInfo session={session} />
    <UserCars username={session.getCurrentUser.username} />
  </div>
);

export default withAuth(session => session && session.getCurrentUser)(Profile);
