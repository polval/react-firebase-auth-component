import React, { useContext, useEffect } from 'react';
import PandaBridge from 'pandasuite-bridge';
import _ from 'lodash';

import FirebaseBridgeContext from '../../FirebaseBridgeContext';

const Home = () => {
  const firebaseWithBridge = useContext(FirebaseBridgeContext);
  const { firestore, auth, bridge } = firebaseWithBridge || {};
  const { markers } = bridge || {};

  useEffect(() => {
    let traits = {};
    let unsubscribe = null;

    if (!_.isEmpty(markers)) {
      unsubscribe = firestore
        .collection('users')
        .doc(auth.currentUser.uid)
        .onSnapshot((snapshot) => {
          const data = snapshot.data();
          const currentTraits = data.traits || {};

          _.each(markers, (marker) => {
            if (marker.create !== false
              && !traits[marker.trait]
              && currentTraits[marker.trait]) {
              PandaBridge.send('triggerMarker', marker.id);
            }
            if (marker.update
              && traits[marker.trait]
              && currentTraits[marker.trait]
              && traits[marker.trait].count !== currentTraits[marker.trait].count) {
              PandaBridge.send('triggerMarker', marker.id);
            }
            if (marker.delete
              && traits[marker.trait]
              && !currentTraits[marker.trait]) {
              PandaBridge.send('triggerMarker', marker.id);
            }
          });

          traits = currentTraits;
        });
    }
    return function cleanup() {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  // eslint-disable-next-line
  }, []);

  PandaBridge.send('onSignedIn');
  return (
    <>
    </>
  );
};

export default Home;
