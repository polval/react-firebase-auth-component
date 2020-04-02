import _ from 'lodash';

import PandaBridge from 'pandasuite-bridge';
import { usePandaBridge } from 'pandasuite-bridge-react';

// import app from 'firebase';
import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

function useFirebaseWithBridge() {
  let firestore = null;
  let auth = null;

  const { properties, markers } = usePandaBridge({}, {
    markers: {
      getSnapshotDataHook: () => ({
        trait: _.uniqueId('trait_'),
      }),
      setSnapshotDataHook: (snapshot) => {
        const { currentUser } = auth;

        if (currentUser) {
          const userDocRef = firestore.collection('users').doc(currentUser.uid);

          firestore.runTransaction((transaction) => transaction.get(userDocRef).then((userDoc) => {
            if (userDoc.exists) {
              const update = {};

              if (snapshot.params.delete) {
                update[`traits.${snapshot.data.trait}`] = app.firestore.FieldValue.delete();
              } else {
                const traits = userDoc.data().traits || {};
                const newTraitCount = ((traits[snapshot.data.trait] || {}).count || 0) + 1;

                update[`traits.${snapshot.data.trait}`] = {
                  count: newTraitCount,
                  timestamp: app.firestore.FieldValue.serverTimestamp(),
                };
              }
              transaction.update(userDocRef, update);
            }
          }));
        }
      },
    },
    actions: {
      signOut: () => {
        if (auth) {
          auth.signOut();
        }
      },
    },
  });

  if (properties === undefined) {
    return null; /* Loading */
  }

  if (PandaBridge.isStudio && _.isEmpty(properties)) {
    return false;
  }

  try {
    if (!app.apps.length) {
      app.initializeApp({
        apiKey: properties.apiKey,
        authDomain: properties.authDomain,
        databaseURL: properties.databaseURL,
        projectId: properties.projectId,
        storageBucket: properties.storageBucket,
        messagingSenderId: properties.messagingSenderId,
        appId: properties.appId,
      });
    }
    auth = app.auth();
    firestore = app.firestore();
  } catch (error) {
    console.log(error);
    return false;
  }

  return { auth, firestore, bridge: { properties, markers } };
}

export default useFirebaseWithBridge;
