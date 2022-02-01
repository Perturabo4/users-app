import { Container, Fab, Grid, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import AddIcon from '@mui/icons-material/Add'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import UserCard from '../components/UserCard'
import {
  selectUsers,
  selectUsersMemo,
  selectUsersError,
  selectUsersLoad,
  usersFetch
} from '../redux/duks/users'
import ErrorMessage from '../components/ErrorMessage'
import { LightTooltip } from '../components/LightTooltip'
import { useNavigate } from 'react-router-dom'

const UsersPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(usersFetch())
  }, [])

  const users = useSelector(selectUsersMemo)
  const load = useSelector(selectUsersLoad)
  const error = useSelector(selectUsersError)

  const useStyles = makeStyles({
    root: {
      display: 'flex',
      justifyContent: 'center'
    }
  })

  const styles = useStyles()

  if (error) {
    return <ErrorMessage error={error} />
  }

  console.log('Users Page RENDER')
  return load ? (
    <Loader />
  ) : (
    <Container>
      <Fab
        color='primary'
        aria-label='add'
        sx={{ position: 'absolute', top: '20px', right: '20px' }}
        onClick={() => navigate('/create-user')}
      >
        <LightTooltip title='Add new User'>
          <AddIcon />
        </LightTooltip>
      </Fab>
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
