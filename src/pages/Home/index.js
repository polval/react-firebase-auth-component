import React, { useContext, useEffect } from 'react';
import PandaBridge from 'pandasuite-bridge';

import FirebaseBridgeContext from '../../FirebaseBridgeContext';

const Home = () => {
  const firebaseWithBridge = useContext(FirebaseBridgeContext);
  const { firestore, auth } = firebaseWithBridge || {};

  const currentUser = auth && auth.currentUser;

  useEffect(() => {
    let signedInTrigger = false;

    const unsubscribe = currentUser && firestore
      .collection('users')
      .doc(currentUser.uid)
      .onSnapshot((snapshot) => {
        const data = snapshot.data();

        PandaBridge.send(PandaBridge.UPDATED, {
          queryable: { ...data, id: currentUser.uid },
        });

        if (signedInTrigger === false) {
          PandaBridge.send('onSignedIn');
          signedInTrigger = true;
        }
      });

    return function cleanup() {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUser, firestore]);
  return (<></>);
};

export default Home;
