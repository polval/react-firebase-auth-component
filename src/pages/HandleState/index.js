import React, { useContext } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import PandaBridge from 'pandasuite-bridge';

import * as ROUTES from '../../constants/routes';

import FirebaseBridgeContext from '../../FirebaseBridgeContext';

function HandleStatePage() {
  const history = useHistory();
  const firebaseWithBridge = useContext(FirebaseBridgeContext);

  if (firebaseWithBridge === null) {
    return null;
  }

  if (firebaseWithBridge === false) {
    return (<Redirect to={ROUTES.INVALID_CONFIGURATION} />);
  }

  const { auth, bridge } = firebaseWithBridge;

  auth.onAuthStateChanged((user) => {
    if (user) {
      const { properties } = bridge || {};

      if (properties.verifyEmail && !user.emailVerified) {
        history.push(ROUTES.VERIFY_EMAIL);
        return null;
      }
      if (properties.forceAuthenticationAfter > 0) {
        const { metadata } = user;
        const hoursSinceTheLastSignIn = (
          Date.now() - Date.parse(metadata.lastSignInTime)
        ) / 1000 / 60 / 60;

        if (hoursSinceTheLastSignIn > properties.forceAuthenticationAfter) {
          user.reload().then(() => {
            history.push(ROUTES.HOME);
          }).catch(() => {
            auth.signOut();
          });
          return null;
        }
      }
      history.push(ROUTES.HOME);
    } else {
      PandaBridge.send('onSignedOut');
      history.push(ROUTES.SIGN_IN);
    }
    return null;
  });

  return null;
}

export default HandleStatePage;
