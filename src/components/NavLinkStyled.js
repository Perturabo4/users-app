import React from 'react'
import { NavLink } from 'react-router-dom'
import { styled } from '@mui/system'

const NavLinkStyled = styled(NavLink)({
  display: 'flex',
  alignItems: 'center',
  paddingLeft: '10px',
  textDecoration: 'none',
  textTransform: 'uppercase',
  width: '100%',
  height: '100%',
  '&:hover, &.active': {
    color: 'white',
    backgroundColor: '#1976d2'
  }
})

export default NavLinkStyled
