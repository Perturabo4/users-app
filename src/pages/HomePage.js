import * as React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import CssBaseline from '@mui/material/CssBaseline'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { Outlet } from 'react-router-dom'
import NavLinkStyled from '../components/NavLinkStyled'

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
        <Box>
          <NavLinkStyled to={'/'}>Home</NavLinkStyled>
          <Divider />
          <NavLinkStyled to={'/create-user'}>Create user</NavLinkStyled>
          <Divider />
          <NavLinkStyled to={'/all-users'}>Users</NavLinkStyled>
          <Divider />
        </Box>
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
