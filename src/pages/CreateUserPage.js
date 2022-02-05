import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Box, Container, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { TextField } from '@mui/material'
import Input from '../components/Input'
import PrimaryButton from '../components/PrimaryButton'
import { selectNewUserLoad, userCreateRequest } from '../redux/ducks/createUser'
import Loader from '../components/Loader'
import DatePickerField from '../components/DatePicker'
import moment from 'moment'

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

  // Custom yup validation

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
    return this.test({
      name: 'checkIsBetween',
      message: msg || 'Date should be between "01-02-2022" and "10-02-2022"',
      test: (value) => {
        let newVal = moment(value).format('YYYY-MM-DD')
        return moment(newVal).isBetween('2022-02-01', '2022-02-10')
      }
    })
  })

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
    resolver: yupResolver(schema)
  })

  // Reset fields data after submit success

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset()
    }
  }, [formState, reset])

  const load = useSelector(selectNewUserLoad)

  const onSubmit = (data) => {
    console.log('submit')
    Object.keys(data).forEach((key) => (data[key] = data[key].trim()))
    // dispatch(userCreateRequest(data))
    data.datePicker = moment(data.datePicker).format('DD.MM.YYYY')
    console.log(data)
  }

  return (
    <Container className={classes.container} maxWidth='xs'>
      <Typography variant='h4' component='h1' sx={{ textAlign: 'center' }}>
        Create new user
      </Typography>
      <form sx={{ width: '100%' }} noValidate onSubmit={handleSubmit(onSubmit)}>
        <DatePickerField
          control={control}
          name='datePicker'
          label='Select date'
          error={!!errors.datePicker}
          helperText={errors.datePicker?.message}
        />
        <Input
          label='User name'
          {...register('username')}
          error={!!errors.username}
          helperText={errors.username?.message}
        />
        <Input
          label='Full name'
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <Input
          label='Email'
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <Input
          label='Phone number'
          {...register('phone')}
          error={!!errors.phone}
          helperText={errors.phone?.message}
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
            <PrimaryButton onClick={() => navigate('/')}>Cancel</PrimaryButton>
          </Box>
        </Box>
      </form>
    </Container>
  )
}

export default CreateUserPage
