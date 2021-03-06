import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withFirebase } from 'react-redux-firebase'
import Snackbar from '@material-ui/core/Snackbar'
import Paper from '@material-ui/core/Paper'
import RecoverForm from '../components/RecoverForm'
import EmailForm from '../components/EmailForm'

class RecoverContainer extends Component {
  /* eslint-disable no-undef */
  state = {
    message: null,
    open: false
  }

  sendRecoveryEmail = ({ email }) =>
    this.props.firebase
      .resetPassword(email)
      .then(() => {
        this.setState({
          message: 'Account Recovery Email Sent',
          open: true
        })
      })
      .catch(err => {
        console.error('Error updating account', err) // eslint-disable-line no-console
        this.setState({ message: err.message || 'Error' }) // show error snackbar
        return Promise.reject(err)
      })

  recoverAccount = ({ code, password }) => {
    /* eslint-enable no-undef */
    const {
      verifyPasswordResetCode,
      confirmPasswordReset
    } = this.props.firebase

    return verifyPasswordResetCode(code)
      .then(() => confirmPasswordReset(code, password))
      .then(res => {
        this.setState({ message: 'Password Changed Successfully' })
      })
      .catch(err => {
        console.error('Error updating account', err) // eslint-disable-line no-console
        this.setState({ message: err.message }) // show error snackbar
        return Promise.reject(err)
      })
  }

  render() {
    return (
      <div className="flex-column-center">
        <Paper style={{ marginTop: '3rem' }}>
          <EmailForm onSubmit={this.sendRecoveryEmail} />
        </Paper>
        <Paper style={{ marginTop: '3rem' }}>
          <RecoverForm onSubmit={this.recoverAccount} />
        </Paper>
        <Snackbar
          open={!!this.state.message}
          message={this.state.message || 'Error'}
          autoHideDuration={4000}
          onRequestClose={() => this.setState({ message: null })}
        />
      </div>
    )
  }
}

RecoverContainer.propTypes = {
  firebase: PropTypes.object.isRequired
}

export default withFirebase(RecoverContainer)
