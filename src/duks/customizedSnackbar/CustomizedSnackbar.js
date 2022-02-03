import * as React from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import { selectMessage, selectOpen, selectType, setSnackBar } from './snackBar'
import { useDispatch, useSelector } from 'react-redux'

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

export default function CustomizedSnackbar() {
  const dispatch = useDispatch()

  const open = useSelector(selectOpen)
  const type = useSelector(selectType)
  const message = useSelector(selectMessage)

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    dispatch(setSnackBar({ open: false }))
  }
  console.log('SnackBar RENDER')

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      aria-describedby='client-snackbar'
    >
      <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}
