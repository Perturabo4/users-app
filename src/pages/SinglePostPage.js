import { Button, Container, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Loader from '../components/Loader'
import {
  selectSinglePost,
  selectSinglePostError,
  selectSinglePostStatus,
  postFetchRequest,
  LOADING_STATUS,
  FAILURE_STATUS
} from '../redux/ducks/singlePostReducer'
import ErrorMessage from '../components/ErrorMessage'

const SinglePostPage = () => {
  const { postId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const post = useSelector(selectSinglePost)
  const status = useSelector(selectSinglePostStatus)
  const error = useSelector(selectSinglePostError)

  useEffect(() => {
    dispatch(postFetchRequest(postId))
  }, [])

  if (status === FAILURE_STATUS) {
    return <ErrorMessage error={error} />
  }

  if (status === LOADING_STATUS) {
    return <Loader />
  }

  return (
    <Container>
      <Box>
        <Typography
          component='h1'
          variant='h2'
          sx={{ textAlign: 'center', mb: '20px' }}
        >
          {post.get('title')}
        </Typography>
        <Button onClick={() => navigate(-1)} variant='contained' size='small'>
          <ArrowBackIcon /> Go back
        </Button>
        <Typography component='div' variant='body1' sx={{ mt: '20px' }}>
          {post.get('body')}
        </Typography>
      </Box>
    </Container>
  )
}

export default SinglePostPage
