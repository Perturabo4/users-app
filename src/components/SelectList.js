import * as React from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { Controller } from 'react-hook-form'

export default function SelectList({
  control,
  name,
  label,
  options,
  fullWidth,
  size,
  ...restProps
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormControl fullWidth={fullWidth} size={size}>
          <InputLabel>{label}</InputLabel>
          <Select label={label} {...field} {...restProps}>
            {options.map((option) => (
              <MenuItem value={option.value} key={option.value}>
                {option.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    />
  )
}
