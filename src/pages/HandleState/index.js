import React, { useContext, useMemo } from 'react';
import { useHistory, Redirect, useLocation } from 'react-router-dom';
import PandaBridge from 'pandasuite-bridge';

import * as ROUTES from '../../constants/routes';

import FirebaseBridgeContext from '../../FirebaseBridgeContext';

function HandleStatePage() {
  const history = useHistory();
  const location = useLocation();
  const firebaseWithBridge = useContext(FirebaseBridgeContext);

  return useMemo(() => {
    if (firebaseWithBridge === null) {
      return null;
    }

    if (firebaseWithBridge === false) {
      return (<Redirect to={ROUTES.INVALID_CONFIGURATION} />);
    }

    const { auth, bridge } = firebaseWithBridge;

    const safePush = (path) => {
      if (history.location.pathname !== path) {
        history.push(path);
      }
    };

    auth.onAuthStateChanged((user) => {
      if (user) {
        const { properties } = bridge || {};

        if (properties.verifyEmail && !user.emailVerified) {
          safePush(ROUTES.VERIFY_EMAIL);
          return null;
        }
        if (properties.forceAuthenticationAfter > 0) {
          const { metadata } = user;
          const hoursSinceTheLastSignIn = (
            Date.now() - Date.parse(metadata.lastSignInTime)
          ) / 1000 / 60 / 60;

          if (hoursSinceTheLastSignIn > properties.forceAuthenticationAfter) {
            user.reload().then(() => {
              safePush(ROUTES.HOME);
            }).catch(() => {
              auth.signOut();
            });
            return null;
          }
        }
        safePush(ROUTES.HOME);
      } else {
        PandaBridge.send(PandaBridge.UPDATED, {
          queryable: {},
        });
        PandaBridge.send('onSignedOut');
        if (location.pathname !== ROUTES.SIGN_IN && location.pathname !== ROUTES.SIGN_UP) {
          safePush(ROUTES.SIGN_IN);
        }
      }
      return null;
    });

    return null;
  }, [firebaseWithBridge, history, location]);
}

export default HandleStatePage;
