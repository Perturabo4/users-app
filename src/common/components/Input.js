import { TextField } from '@mui/material'
import { forwardRef } from 'react'

const Input = forwardRef((props, ref) => {
  return (
    <TextField
      margin='normal'
      fullWidth
      inputRef={ref}
      size='small'
      {...props}
    />
  )
})

export default Input
