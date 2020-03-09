import _ from 'lodash';

import PandaBridge from 'pandasuite-bridge';
import { usePandaBridge } from 'pandasuite-bridge-react';

// import app from 'firebase';
import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

function useFirebaseWithBridge() {
  let auth = null;

  const { properties } = usePandaBridge({}, {
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

  let firestore = null;

  try {
    app.initializeApp({
      apiKey: properties.apiKey,
      authDomain: properties.authDomain,
      databaseURL: properties.databaseURL,
      projectId: properties.projectId,
      storageBucket: properties.storageBucket,
      messagingSenderId: properties.messagingSenderId,
      appId: properties.appId,
    });
    auth = app.auth();
    if (properties && properties.advancedFields) {
      firestore = app.firestore();
    }
  } catch (error) {
    console.log(error);
    return false;
  }

  return { auth, firestore, bridge: { properties } };
}

export default useFirebaseWithBridge;
