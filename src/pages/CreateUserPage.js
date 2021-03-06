import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Box, Container, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { add, format, isWithinInterval } from 'date-fns'

import Input from '../components/Input'
import PrimaryButton from '../components/PrimaryButton'
import {
  selectNewUserStatus,
  userCreateRequest
} from '../redux/ducks/createUserReducer'
import {
  LOADING_STATUS,
  selectPersonsMemo,
  swapiFetchRequest
} from '../redux/ducks/swapiPersonsReducer'
import Loader from '../components/Loader'
import DatePickerField from '../components/DatePickerField'
import SelectList from '../components/SelectList'
import AutocompleteField from '../components/AutocompleteField'

const useStyle = makeStyles({
  container: {
    display: 'flex',
    marginTop: '20px',
    paddingBottom: '20px',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '4px 4px 8px 0px rgba(34, 60, 80, 0.2)',
    backgroundColor: '#fff'
  },
  button: {
    marginRight: '10px'
  }
})

const CreateUserPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const classes = useStyle()

  // Custom yup validation methods

  yup.addMethod(yup.string, 'checkPhoneFormat', function (msg) {
    const regExpPhoneNumber =
      /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/
    return this.test({
      name: 'checkPhoneFormat',
      message: msg,
      test: (value) => regExpPhoneNumber.test(value)
    })
  })

  yup.addMethod(yup.string, 'checkEmptyField', function (msg) {
    return this.test({
      name: 'checkEmptyField',
      message: msg || 'Field is required!',
      test: (value) => value.trim() !== ''
    })
  })

  yup.addMethod(yup.date, 'checkIsBetween', function (msg) {
    // check date shoud be between today and 7 days from today
    const currentDate = new Date()
    const endDate = add(currentDate, { days: 7 })
    const errorTxt = `Date should be between ${format(
      currentDate,
      'dd.MM.yyyy'
    )} and ${format(endDate, 'dd.MM.yyyy')}`

    return this.test({
      name: 'checkIsBetween',
      message: msg || errorTxt,
      test: (value) => {
        return isWithinInterval(value, {
          start: currentDate,
          end: endDate
        })
      }
    })
  })

  // Yup schema

  const schema = yup.object().shape({
    datePicker: yup.date().checkIsBetween(),
    username: yup
      .string()
      .max(14, 'Field must be no longer than 14 chars')
      .min(3, 'Field must contains at least 3 chars')
      .required('Field is required!')
      .checkEmptyField(),
    name: yup
      .string()
      .min(5, 'Field must contains at least 5 chars')
      .required('Field is required!')
      .checkEmptyField(),
    email: yup
      .string()
      .email('Email has incorrect format!')
      .required('Field is required!'),
    age: yup.string().required('Field is required!'),
    phone: yup.string().checkPhoneFormat('Incorrect data passed!')
  })

  const {
    register,
    handleSubmit,
    formState,
    formState: { errors },
    reset,
    control
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: { age: '', autocomplete: null }
  })

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      // Reset fields data after submit success
      reset()
    }
  }, [formState, reset])

  const status = useSelector(selectNewUserStatus)

  const load = status === LOADING_STATUS

  const onSubmit = (data) => {
    Object.keys(data).forEach((key) => {
      if (typeof data[key] === 'string') {
        data[key] = data[key].trim()
      }
    })
    data.datePicker = format(data.datePicker, 'dd.MM.yyyy')
    console.log(data)
    dispatch(userCreateRequest(data))
  }

  return (
    <Container className={classes.container} maxWidth='xs'>
      <Typography
        variant='h4'
        component='h1'
        sx={{ textAlign: 'center', margin: '20px 0' }}
      >
        Create new user
      </Typography>
      <form sx={{ width: '100%' }} noValidate onSubmit={handleSubmit(onSubmit)}>
        <DatePickerField
          sx={{ marginBottom: '20px' }}
          control={control}
          name='datePicker'
          label='Select date'
          error={!!errors.datePicker}
          helperText={errors.datePicker?.message}
          size='small'
          fullWidth
        />
        <Input
          sx={{ marginBottom: '20px' }}
          fullWidth
          size='small'
          label='User name'
          {...register('username')}
          error={!!errors.username}
          helperText={errors.username?.message}
        />
        <Input
          sx={{ marginBottom: '20px' }}
          fullWidth
          size='small'
          label='Full name'
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <Input
          sx={{ marginBottom: '20px' }}
          fullWidth
          size='small'
          label='Email'
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <Input
          sx={{ marginBottom: '20px' }}
          fullWidth
          size='small'
          label='Phone number'
          {...register('phone')}
          error={!!errors.phone}
          helperText={errors.phone?.message}
        />
        <SelectList
          control={control}
          name='age'
          label='Age'
          fullWidth={true}
          sx={{ marginBottom: '20px' }}
          size='small'
          options={[
            { value: '20-25' },
            { value: '25-30' },
            { value: '30-40' },
            { value: '40+' }
          ]}
          error={!!errors.age}
          helperText={errors.age?.message}
        />
        <AutocompleteField
          control={control}
          name={'autocomplete'}
          selector={selectPersonsMemo}
          actionToGetOptions={swapiFetchRequest}
          labelKey={'name'}
          label={'Chose youre favorite STAR WARS person'}
        />
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box mr={2}>
            <PrimaryButton
              type='submit'
              className={classes.button}
              disabled={load}
            >
              Submit
              {load && <Loader sx={{ position: 'relative' }} size={14} />}
            </PrimaryButton>
          </Box>
          <Box>
            <PrimaryButton onClick={() => navigate('/all-users')}>
              Cancel
            </PrimaryButton>
          </Box>
        </Box>
      </form>
    </Container>
  )
}

export default CreateUserPage
