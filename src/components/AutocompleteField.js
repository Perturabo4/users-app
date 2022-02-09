import { Autocomplete, TextField } from '@mui/material'
import React from 'react'
import { Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'

const AutocompleteField = ({
  control,
  name,
  selector,
  actionToGetOptions,
  labelKey,
  label
}) => {
  const options = useSelector(selector)
  const dispatch = useDispatch()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value, ref } }) => (
        <Autocomplete
          value={value}
          ref={ref}
          sx={{ marginBottom: '20px' }}
          options={options}
          getOptionLabel={(option) => option[labelKey]}
          isOptionEqualToValue={(value, option) =>
            option[labelKey] === value[labelKey]
          }
          renderInput={(params) => (
            <TextField
              {...params}
              size='small'
              label={label}
              variant='outlined'
            />
          )}
          onInputChange={(event, newInputValue) =>
            dispatch(actionToGetOptions(newInputValue))
          }
          onChange={(_, data) => {
            onChange(data)
          }}
        />
      )}
    />
  )
}

export default AutocompleteField
