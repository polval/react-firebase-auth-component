import React, { useContext, useEffect } from 'react';
import PandaBridge from 'pandasuite-bridge';

import FirebaseBridgeContext from '../../FirebaseBridgeContext';

const Home = () => {
  const firebaseWithBridge = useContext(FirebaseBridgeContext);
  const { firestore, auth } = firebaseWithBridge || {};

  useEffect(() => {
    const unsubscribe = auth && auth.currentUser && firestore
      .collection('users')
      .doc(auth.currentUser.uid)
      .onSnapshot((snapshot) => {
        const data = snapshot.data();

        PandaBridge.send(PandaBridge.UPDATED, {
          queryable: { ...data, id: auth.currentUser.uid },
        });
      });

    return function cleanup() {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  // eslint-disable-next-line
  }, []);

  if (auth && auth.currentUser) {
    PandaBridge.send('onSignedIn');
  }
  return (<></>);
};

export default Home;
