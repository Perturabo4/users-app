import { Button, Container, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Loader from '../../common/components/Loader'
import {
  selectSinglePostMemo,
  selectSinglePostError,
  selectSinglePostLoad,
  postFetchRequest
} from './singlePost'
import ErrorMessage from '../../common/components/ErrorMessage'

const SinglePostPage = () => {
  const { postId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const post = useSelector(selectSinglePostMemo)
  const load = useSelector(selectSinglePostLoad)
  const error = useSelector(selectSinglePostError)

  useEffect(() => {
    dispatch(postFetchRequest(postId))
  }, [])

  if (error) {
    return <ErrorMessage error={error} />
  }

  return load ? (
    <Loader />
  ) : (
    <Container>
      <Box>
        <Typography
          component='h1'
          variant='h2'
          sx={{ textAlign: 'center', mb: '20px' }}
        >
          {post.title}
        </Typography>
        <Button onClick={() => navigate(-1)} variant='contained' size='small'>
          <ArrowBackIcon /> Go back
        </Button>
        <Typography component='div' variant='body1' sx={{ mt: '20px' }}>
          {post.body}
        </Typography>
      </Box>
    </Container>
  )
}

export default SinglePostPage
