import React from 'react';
import PandaBridge from 'pandasuite-bridge';

const Home = () => {
  PandaBridge.send('onSignedIn');
  return (
    <>
    </>
  );
};

export default Home;
