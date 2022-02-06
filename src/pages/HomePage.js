import * as React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import CssBaseline from '@mui/material/CssBaseline'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import { NavLink, Outlet } from 'react-router-dom'
import { ListItemText } from '@mui/material'

const drawerWidth = 240

export default function HomePage() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position='fixed'
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant='h6' noWrap component='div'>
            Pet App
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box'
          }
        }}
        variant='permanent'
        anchor='left'
      >
        <Toolbar />
        <Divider />
        <List>
          <ListItem button>
            <NavLink
              to={'/all-users'}
              style={{
                textDecoration: 'none',
                display: 'flex',
                width: '100%',
                height: '100%'
              }}
            >
              <ListItemText primary={'Users'} />
            </NavLink>
          </ListItem>
          <ListItem button>
            <NavLink
              to={'/create-user'}
              style={{
                textDecoration: 'none',
                display: 'flex',
                width: '100%',
                height: '100%'
              }}
            >
              <ListItemText primary={'Create user'} />
            </NavLink>
          </ListItem>
        </List>
      </Drawer>
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          p: 3
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}
