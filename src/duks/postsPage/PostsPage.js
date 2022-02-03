import { Container, Grid, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PostCard from '../../common/components/PostCard'
import {
  postsFetch,
  selectPostsMemo,
  selectPostsError,
  selectPostsLoad
} from './posts'
import { Box } from '@mui/system'
import { makeStyles } from '@mui/styles'
import Loader from '../../common/components/Loader'
import ErrorMessage from '../../common/components/ErrorMessage'

const useStyle = makeStyles({
  link: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'blue',
    fontFamily: '"Roboto","Helvetica","Arial",sans-serif'
  }
})

const PostsPage = () => {
  const { userId, userName } = useParams()
  const dispatch = useDispatch()
  const posts = useSelector(selectPostsMemo)
  const load = useSelector(selectPostsLoad)
  const error = useSelector(selectPostsError)
  const backLinkStyle = useStyle()

  useEffect(() => {
    dispatch(postsFetch(userId))
  }, [])

  if (error) {
    return <ErrorMessage error={error} />
  }

  console.log('Posts Page RENDER')

  return load ? (
    <Loader />
  ) : (
    <Container>
      <Typography
        variant='h2'
        component='h1'
        sx={{ textAlign: 'center', marginBottom: '40px' }}
      >
        {`Posts of ${userName}`}
      </Typography>
      <Box mb={'10px'}>
        <Link to='/' className={backLinkStyle.link}>
          <ArrowBackIcon />
          Back to users page
        </Link>
      </Box>
      <Grid container spacing={2} alignItems='stretch'>
        {posts.map((post) => {
          return (
            <PostCard
              key={post.id}
              id={post.id}
              body={post.body}
              title={post.title}
            />
          )
        })}
      </Grid>
    </Container>
  )
}

export default PostsPage