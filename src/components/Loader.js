import React from 'react'
import { CircularProgress } from '@mui/material'

export default function Loader({ children, ...props }) {
  return (
    <CircularProgress
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}
      {...props}
    />
  )
}
