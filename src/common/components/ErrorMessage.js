import { Alert, Container } from '@mui/material'
import React from 'react'

const ErrorMessage = ({ error }) => {
  return (
    <Container>
      <Alert severity='error'>{error}</Alert>
    </Container>
  )
}

export default ErrorMessage
