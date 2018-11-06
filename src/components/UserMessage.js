import React from 'react'
import PropTypes from 'prop-types'
import { Alert } from '@cwds/components'

const UserMessage = ({errorMessage, successMessage}) => {
  return (
    <React.Fragment>
      {errorMessage && <Alert className='errorMessage-customizable' color='danger'>{errorMessage}</Alert>}
      {successMessage && <Alert className='successMessage-customizable' color='success'>{successMessage}</Alert>}
      <br />
    </React.Fragment>
  )
}

UserMessage.propTypes = {
  errorMessage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  successMessage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ])
}

export default UserMessage
