import axios from 'axios'
import { call, put, takeEvery } from 'redux-saga/effects'
import { baseUrlPath } from '../../api'
import { setSnackBar } from './snackBar'

// CREATE USER TYPES

export const USER_CREATE_REQUEST = 'USER_CREATE_REQUEST'
export const USER_CREATE_SUCCESS = 'USER_CREATE_SUCCESS'
export const USER_CREATE_ERROR = 'USER_CREATE_ERROR'

// Reducer

const initialState = {
  load: false,
  user: {},
  error: null
}

export default function createUserReducer(state = initialState, action) {
  switch (action.type) {
    case USER_CREATE_REQUEST:
      return { ...state, load: true }
    case USER_CREATE_SUCCESS:
      return { ...state, load: false, user: { ...action.payload } }
    case USER_CREATE_ERROR:
      return { ...state, load: false, error: action.payload }
    default:
      return state
  }
}

// Actions

export const userCreateRequest = (user) => ({
  type: USER_CREATE_REQUEST,
  payload: user
})
export const userCreateSuccess = (user) => ({
  type: USER_CREATE_SUCCESS,
  payload: user
})
export const userCreateError = (error) => ({
  type: USER_CREATE_ERROR,
  payload: error
})

// Selectors

export const selectNewUser = (state) => state.newUser.user
export const selectNewUserLoad = (state) => state.newUser.load
export const selectNewUserError = (state) => state.newUser.error

// Requests

const createNewUserRequest = async (obj) => {
  const response = await axios.post(`${baseUrlPath}/users`, obj)
  return response.data
}

// Sagas

export const handleCreateNewUser = function* ({ payload }) {
  try {
    const user = yield call(createNewUserRequest, payload)
    yield put(userCreateSuccess(user))
    yield put(
      setSnackBar({
        open: true,
        message: 'User successfully created!',
        type: 'success'
      })
    )
  } catch (error) {
    yield put(userCreateError(error.message))
    yield put(
      setSnackBar({
        open: true,
        message: 'User did not create',
        type: 'error'
      })
    )
  }
}

export const watchCreateUserRequest = function* () {
  yield takeEvery(USER_CREATE_REQUEST, handleCreateNewUser)
}
