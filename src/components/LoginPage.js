import React, { Component } from 'react'

import qs from 'query-string'
import LoginForm from './LoginForm'
import MfaForm from './MfaForm'
import * as Auth from '../utils/Auth'

const perryLoginUrl = 'https://web.cogsandbox.cwds.io/perry/login'

// TODO - redirect_uri on the url?  save it to state
class LoginPage extends Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      validating: false,
      errorMsg: undefined,
      email: '',
      password: '',
      code: '',
      cognitoJson: '{}'
    }
    this.login = this.login.bind(this)
    this.validate = this.validate.bind(this)
    this.showValidationArea = this.showValidationArea.bind(this)
    this.showError = this.showError.bind(this)
    this.updateEmailState = this.updateEmailState.bind(this)
    this.updatePasswordState = this.updatePasswordState.bind(this)
    this.updateCodeState = this.updateCodeState.bind(this)
    this.sendToRedirectUri = this.sendToRedirectUri.bind(this)
    this.setCognitoToken = this.setCognitoToken.bind(this)
    this.submitFormToPerry = this.submitFormToPerry.bind(this)
  }

  updateCodeState (event) {
    this.setState({
      code: event.target.value
    })
  }

  updateEmailState (event) {
    this.setState({
      email: event.target.value
    })
  }

  updatePasswordState (event) {
    this.setState({
      password: event.target.value
    })
  }

  showValidationArea (maskedEmail) {
    this.setState({
      validating: true,
      maskedEmail: maskedEmail
    })
  }

  setCognitoToken (token) {
    this.setState({cognitoJson: token})
    this.submitFormToPerry()
  }

  submitFormToPerry () {
    document.getElementById('login-form').submit()
  }

  showError (msg) {
    this.setState({
      validating: false,
      maskedEmail: undefined,
      errorMsg: msg,
      email: '',
      password: ''
    })
  }

  sendToRedirectUri (result) {
    // TODO - this is where the integration with Perry is.
    const parsed = qs.parse(window.location.search)
    // FOR NOW JUST SEND TO PAGE
    // INTEGRATION WITH PERRY WILL BE A REST CALL WITH RESULT
    window.location.href = parsed.redirect_uri
  }

  validate () {
    let cognitoUser = this.state.cognitoUser
    let sendToRedirectUri = this.sendToRedirectUri
    let challengeResponses = this.state.code + ' ' + cognitoUser.deviceKey
    let showError = this.showError

    let setCognitoToken = this.setCognitoToken
    cognitoUser.sendCustomChallengeAnswer(challengeResponses, {
      onSuccess: function (result) {
        // sendToRedirectUri(result)
        setCognitoToken(JSON.stringify(result))
      },
      onFailure: function () {
        showError('Unable to verify account')
      }
    })
  }

  login () {
    let showValidationArea = this.showValidationArea
    let showError = this.showError
    let sendToRedirectUri = this.sendToRedirectUri

    let cognitoUser = Auth.createUser(this.state)
    this.setState({
      cognitoUser: cognitoUser
    })
    cognitoUser.setAuthenticationFlowType('CUSTOM_AUTH')
    let authenticationDetails = Auth.authenticationDetails(this.state)
    cognitoUser.authenticateUserDefaultAuth(authenticationDetails, {
      onFailure: function (err) {
        if (err.code === 'InvalidParameterException') {
          showError('Email is required')
        } else {
          showError(err.message)
        }
      },
      customChallenge: function () {
        // device challenge
        let challengeResponses
        challengeResponses = cognitoUser.deviceKey ? cognitoUser.deviceKey : 'null'
        cognitoUser.sendCustomChallengeAnswer(challengeResponses, {
          onSuccess: function (result) {
            sendToRedirectUri(result)
          },
          onFailure: function (err) {
            showError(err.message)
          },
          customChallenge: function (challengeParameters) {
            showValidationArea(challengeParameters.maskedEmail)
          }
        })
      }
    })
  }

  render () {
    const comp = this.state.validating
      ? <MfaForm
        maskedEmail={this.state.maskedEmail}
        code={this.state.code}
        onCodeChange={this.updateCodeState}
        onValidate={this.validate} />
      : <LoginForm
        onSubmit={this.login}
        errorMsg={this.state.errorMsg}
        email={this.state.email}
        password={this.state.password}
        onEmailChange={this.updateEmailState}
        onPasswordChange={this.updatePasswordState} />

    return (
      <React.Fragment>
        {comp}
        <form id='login-form' action={perryLoginUrl} method='post'>
          <input
            type='hidden'
            name="CognitoResponse"
            value={this.state.cognitoJson} />
        </form>
      </React.Fragment>
    )
  }
}

export default LoginPage
