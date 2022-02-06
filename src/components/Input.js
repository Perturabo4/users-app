import { TextField } from '@mui/material'
import { forwardRef } from 'react'

const Input = forwardRef((props, ref) => {
  return <TextField inputRef={ref} {...props} />
})

export default Input
