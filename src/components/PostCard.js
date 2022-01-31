import React from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { Grid } from '@mui/material'
import { Link } from 'react-router-dom'
import { LightTooltip } from './LightTooltip'

export default function PostCard({ id, title, body }) {
  return (
    <Grid item xs={3}>
      <Card sx={{ maxWidth: 345, height: '100%' }}>
        <CardContent>
          <LightTooltip title={title} placement='top'>
            <Typography
              noWrap
              gutterBottom
              variant='h6'
              component='div'
              textAlign={'center'}
            >
              {title}
            </Typography>
          </LightTooltip>
          <Typography variant='body1' component='div'>
            {body}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center' }}>
          <Link to={`/single-post/${id}`}>Read full post</Link>
        </CardActions>
      </Card>
    </Grid>
  )
}
