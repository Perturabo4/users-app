import { Autocomplete, TextField } from '@mui/material'
import React from 'react'
import { Controller } from 'react-hook-form'

const AutocompleteField = ({ control, name, options }) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Autocomplete
          {...field}
          options={options}
          getOptionLabel={(option) => option.label}
          sx={{ marginBottom: '20px' }}
          //   renderOption={(option) => option.label}
          renderInput={(params) => (
            <TextField
              {...params}
              size='small'
              label='Choose your country'
              variant='outlined'
            />
          )}
          onChange={(_, data) => {
            console.log(data)
            return field.onChange(data.label)
          }}
          onInputChange={(event, newInputValue) => {
            console.log(newInputValue)
          }}
        />
      )}
    />
  )
}

export default AutocompleteField
