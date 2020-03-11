import React, { useContext } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import {
  Form, Card, Button, Alert,
} from 'tabler-react';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import _ from 'lodash';
import PandaBridge from 'pandasuite-bridge';

import * as ROUTES from '../../constants/routes';
import StandaloneFormPage from '../StandaloneFormPage';
import FirebaseBridgeContext from '../../FirebaseBridgeContext';

const SignUp = () => {
  const firebaseWithBridge = useContext(FirebaseBridgeContext);
  const intl = useIntl();
  const history = useHistory();

  const { auth, firestore, bridge } = firebaseWithBridge || {};
  const { properties } = bridge || {};

  const formik = useFormik({
    initialValues: {},
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      const {
        name, email, password, position, company,
      } = values;

      auth.createUserWithEmailAndPassword(email, password).then(() => {
        const { currentUser } = auth;

        if (properties.verifyEmail && !currentUser.emailVerified) {
          currentUser.sendEmailVerification();
        }

        if (firestore) {
          firestore.collection('users').doc(currentUser.uid).set({
            name,
            email,
            position,
            company,
          }).then(() => {
            formik.setSubmitting(false);
          })
            .catch(() => {
              formik.setSubmitting(false);
            });
        } else {
          currentUser.updateProfile({
            displayName: name,
          }).then(() => {
            formik.setSubmitting(false);
          }, () => {
            formik.setSubmitting(false);
          });
        }
      }).catch((error) => {
        formik.setErrors({ global: error });
        formik.setSubmitting(false);
      });
    },
  });

  return (
    <StandaloneFormPage>
      <Form className="card" onSubmit={formik.handleSubmit}>
        <Card.Body className="p-6">
          <Card.Title RootComponent="div">{intl.formatMessage({ id: 'page.signup.form.title' })}</Card.Title>
          <Form.Group
            label={intl.formatMessage({ id: 'page.signup.form.input.name.label' })}
            isRequired
          >
            <Form.Input
              name="name"
              placeholder={intl.formatMessage({ id: 'page.signup.form.input.name.placeholder' })}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values && formik.values.name}
              error={formik.errors && formik.errors.name}
              disabled={formik.isSubmitting}
              isRequired
            />
          </Form.Group>
          <Form.Group
            label={intl.formatMessage({ id: 'page.signup.form.input.email.label' })}
            isRequired
          >
            <Form.Input
              name="email"
              placeholder={intl.formatMessage({ id: 'page.signup.form.input.email.placeholder' })}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values && formik.values.email}
              error={formik.errors && formik.errors.email}
              disabled={formik.isSubmitting}
            />
          </Form.Group>
          <Form.Group
            label={intl.formatMessage({ id: 'page.signup.form.input.password.label' })}
            isRequired
          >
            <Form.Input
              name="password"
              type="password"
              placeholder={intl.formatMessage({ id: 'page.signup.form.input.password.placeholder' })}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values && formik.values.password}
              error={formik.errors && formik.errors.password}
              disabled={formik.isSubmitting}
            />
          </Form.Group>
          {(properties && properties.advancedFields) && (
            <>
              <Form.Group
                label={intl.formatMessage({ id: 'page.signup.form.input.position.label' })}
              >
                <Form.Input
                  name="position"
                  placeholder={intl.formatMessage({ id: 'page.signup.form.input.position.placeholder' })}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values && formik.values.position}
                  error={formik.errors && formik.errors.position}
                  disabled={formik.isSubmitting}
                  isRequired
                />
              </Form.Group>
              <Form.Group
                label={intl.formatMessage({ id: 'page.signup.form.input.company.label' })}
              >
                <Form.Input
                  name="company"
                  placeholder={intl.formatMessage({ id: 'page.signup.form.input.company.placeholder' })}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values && formik.values.company}
                  error={formik.errors && formik.errors.company}
                  disabled={formik.isSubmitting}
                  isRequired
                />
              </Form.Group>
            </>
          )}
          {(formik.errors && formik.errors.global) && (
          <Alert type="danger" className="mt-6" isDismissible>
            {formik.errors.global.message}
            {formik.errors.global.code === 'auth/wrong-password' && (
              <>
                <br />
                <Button link className="p-0" href="#" onClick={() => { history.push(`${ROUTES.PASSWORD_FORGET}/${formik.values && formik.values.email}`); }}>
                  {intl.formatMessage({ id: 'page.signup.form.forgot.label' })}
                </Button>
              </>
            )}
          </Alert>
          )}
          <Form.Footer>
            {(properties && properties.terms) && (
              <Button link className="pl-0 pb-2" href="#" onClick={() => { PandaBridge.send('onTermsClicked'); }}>
                {intl.formatMessage({ id: 'page.signup.form.terms' })}
              </Button>
            )}
            <Button
              type="submit"
              color="primary"
              loading={formik.isSubmitting}
              disabled={
                formik.isSubmitting
                || _.isEmpty(formik.values)
                || !_.isEmpty(formik.errors)
              }
              block
            >
              {intl.formatMessage({ id: 'page.signup.form.button' })}
            </Button>
          </Form.Footer>
          <div className="row row gutters-xs align-items-center mt-5">
            <div className="col col-auto">
              {intl.formatMessage({ id: 'page.signup.form.signin.label' })}
            </div>
            <Button link className="p-0" href="#" onClick={() => { history.push(ROUTES.SIGN_UP); }}>
              {intl.formatMessage({ id: 'page.signup.form.signin.action' })}
            </Button>
          </div>
        </Card.Body>
      </Form>
    </StandaloneFormPage>
  );
};

export default SignUp;
