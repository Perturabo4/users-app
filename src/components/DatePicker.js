import React from 'react'
import { Controller } from 'react-hook-form'
import DatePicker from '@mui/lab/DatePicker'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { TextField } from '@mui/material'

export default function DatePickerField({
  control,
  name,
  inputFormat,
  mask,
  ...rest
}) {
  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => {
          return (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                inputFormat='dd.MM.yyyy'
                mask='__.__.____'
                onChange={onChange}
                value={value}
                renderInput={(params) => <TextField {...params} {...rest} />}
              />
            </LocalizationProvider>
          )
        }}
      />
    </>
  )
}
