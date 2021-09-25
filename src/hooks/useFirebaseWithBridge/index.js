import _ from 'lodash';

import PandaBridge from 'pandasuite-bridge';
import { usePandaBridge } from 'pandasuite-bridge-react';

import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { useMemo } from 'react';

let firestore = null;
let auth = null;

const changeData = ({
  user, data, func, value,
}) => {
  const userDocRef = firestore.collection('users').doc(user.uid);

  firestore.runTransaction((transaction) => transaction.get(userDocRef).then((userDoc) => {
    if (userDoc.exists) {
      const update = {};
      const key = _.compact(data.split('/')).join('.');
      let fieldValue = value;

      if (func === 'inc') {
        fieldValue = app.firestore.FieldValue.increment(parseInt(value));
      } else if (func === 'dec') {
        fieldValue = app.firestore.FieldValue.increment(-parseInt(value));
      } else if (func === 'del') {
        fieldValue = app.firestore.FieldValue.delete();
      } else if (func === 'add') {
        fieldValue = app.firestore.FieldValue.arrayUnion(value);
      } else if (func === 'delbyid') {
        const doc = _.find(_.get(userDoc.data(), key), (row) => row.id === value);
        if (!doc) {
          return;
        }
        fieldValue = app.firestore.FieldValue.arrayRemove(doc);
      } else if (func === 'delbyvalue') {
        fieldValue = app.firestore.FieldValue.arrayRemove(value);
      }
      update[key] = fieldValue;
      transaction.update(userDocRef, update);
    }
  })).catch((error) => {
    console.log(error);
  });
};

function useFirebaseWithBridge() {
  const { properties } = usePandaBridge({
    actions: {
      signOut: () => {
        if (auth) {
          auth.signOut();
        }
      },
      change: ({ data, function: func, value }) => {
        const { currentUser } = auth;

        if (currentUser) {
          changeData({
            user: currentUser, data, func, value,
          });
        } else {
          const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
              unsubscribe();
              changeData({
                user, data, func, value,
              });
            }
          });
        }
      },
    },
  });

  [auth, firestore] = useMemo(() => {
    if (properties === undefined) {
      return [null];
    }

    if (PandaBridge.isStudio && _.isEmpty(properties)) {
      return [false];
    }

    try {
      const newApp = app.initializeApp({
        apiKey: properties.apiKey,
        authDomain: properties.authDomain,
        databaseURL: properties.databaseURL,
        projectId: properties.projectId,
        storageBucket: properties.storageBucket,
        messagingSenderId: properties.messagingSenderId,
        appId: properties.appId,
      }, _.uniqueId());

      newApp.firestore().enablePersistence();

      return [newApp.auth(), newApp.firestore()];
    } catch (error) {
      console.log(error);
    }
    return [false];
  }, [properties]);

  if (auth === null) {
    return null; /* Loading */
  }

  if (auth === false) {
    return false;
  }

  return { auth, firestore, bridge: { properties } };
}

export default useFirebaseWithBridge;
