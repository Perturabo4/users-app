import React from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Grid, List, ListItem, ListItemText, Avatar } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Link } from 'react-router-dom'
import { LightTooltip } from './LightTooltip'

const useStyle = makeStyles({
  root: {
    height: '100%',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
  },
})

export default function UserCard({ user }) {
  const { name, phone, email, id } = user
  const classes = useStyle()
  return (
    <Grid item xs={3}>
      <Card sx={{ maxWidth: 345 }} className={classes.root}>
        <CardContent>
          <LightTooltip title={name} placement='top'>
            <Typography
              gutterBottom
              variant='h5'
              component='div'
              textAlign={'center'}
              noWrap
            >
              {name}
            </Typography>
          </LightTooltip>
          <List>
            <ListItem>
              <Avatar>
                <PhoneIcon />
              </Avatar>
              <ListItemText secondary={phone} sx={{ pl: '10px' }} />
            </ListItem>
            <ListItem>
              <Avatar>
                <EmailIcon />
              </Avatar>
              <ListItemText secondary={email} sx={{ pl: '10px' }} />
            </ListItem>
          </List>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center' }}>
          <Link to={`/posts/${id}/${name}`} className={classes.link}>
            View posts <ArrowForwardIcon fontSize='small' />
          </Link>
        </CardActions>
      </Card>
    </Grid>
  )
}
