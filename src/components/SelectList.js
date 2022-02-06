import * as React from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { Controller } from 'react-hook-form'
import { FormHelperText } from '@mui/material'

export default function SelectList({
  control,
  name,
  label,
  options,
  fullWidth,
  helperText,
  error,
  size,
  sx,
  ...restProps
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormControl fullWidth={fullWidth} size={size} error={error} sx={sx}>
          <InputLabel>{label}</InputLabel>
          <Select label={label} {...field} {...restProps}>
            {options.map((option) => (
              <MenuItem value={option.value} key={option.value}>
                {option.value}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{helperText}</FormHelperText>
        </FormControl>
      )}
    />
  )
}
