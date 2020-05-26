import React from 'react';

import { useIntl } from 'react-intl';
import { Alert } from 'tabler-react';

function InvalidPage() {
  const intl = useIntl();

  return (
    <Alert type="warning" icon="alert-triangle">
      {intl.formatMessage({ id: 'page.invalid.message' })}
      {' '}
      <a target="_blank" rel="noopener noreferrer" href={intl.formatMessage({ id: 'page.invalid.link.value' })}>{intl.formatMessage({ id: 'page.invalid.link.name' })}</a>
    </Alert>
  );
}

export default InvalidPage;
