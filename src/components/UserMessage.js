import React from 'react'
import PropTypes from 'prop-types'

const UserMessage = ({errorMessage, successMessage}) => {
  return (
    <React.Fragment>
      {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
      {successMessage && <SuccessMessage successMessage={successMessage} />}
      <br />
    </React.Fragment>

  )
}

const ErrorMessage = ({errorMessage}) => {
  return (
    <div id='errorMessage' className='errorMessage-customizable'>
      {errorMessage}
    </div>
  )
}

const SuccessMessage = ({successMessage}) => {
  return (
    <div id='successMessage' className='successMessage-customizable'>
      {successMessage}
    </div>
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
