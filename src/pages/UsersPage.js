import { Container, Grid, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import UserCard from '../components/UserCard'
import {
  selectUsersMemo,
  selectUsersError,
  usersFetchRequest,
  selectUsersStatus,
  LOADING_STATUS,
  FAILURE_STATUS
} from '../redux/ducks/usersReducer'
import ErrorMessage from '../components/ErrorMessage'

const UsersPage = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(usersFetchRequest())
  }, [])

  const users = useSelector(selectUsersMemo)
  const status = useSelector(selectUsersStatus)
  const error = useSelector(selectUsersError)

  const useStyles = makeStyles({
    root: {
      display: 'flex',
      justifyContent: 'center'
    }
  })

  const styles = useStyles()

  if (status === FAILURE_STATUS) {
    return <ErrorMessage error={error} />
  }

  if (status === LOADING_STATUS) {
    return <Loader />
  }

  return (
    <Container>
      <Typography variant='h2' component='h1' className={styles.root}>
        All users
      </Typography>
      <Grid container spacing={2} alignItems='stretch'>
        {users.map((user) => {
          return <UserCard user={user} key={user.id} />
        })}
      </Grid>
    </Container>
  )
}

export default UsersPage
