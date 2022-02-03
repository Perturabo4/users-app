import { Tooltip, tooltipClasses } from '@mui/material'
import { styled } from '@mui/styles'
import React from 'react'

export const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 500,
    backgroundColor: '#fff',
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: '0 2px 2px 0',
    fontSize: 16,
  },
}))
