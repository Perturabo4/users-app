import axios from 'axios'
import { fromJS } from 'immutable'
import { call, put, takeEvery } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { baseUrlPath, ducksPath } from '../../config'
import { setSnackBar } from './snackBar'

// CREATE USER TYPES
const duckName = 'createUser'

const CREATE_USER_REQUEST = `${ducksPath}/${duckName}/CREATE_USER_REQUEST`
const CREATE_USER_SUCCESS = `${ducksPath}/${duckName}/CREATE_USER_SUCCESS`
const CREATE_USER_ERROR = `${ducksPath}/${duckName}/CREATE_USER_ERROR`

// Reducer

const initialState = fromJS({
  load: false,
  user: {},
  error: null
})

export default function createUserReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_USER_REQUEST:
      return state.set('load', false)
    case CREATE_USER_SUCCESS:
      return state.set('load', false).set('user', fromJS(action.payload))
    case CREATE_USER_ERROR:
      return state.set('load', false).set('error', action.payload)
    default:
      return state
  }
}

// Actions

export const userCreateRequest = (user) => ({
  type: CREATE_USER_REQUEST,
  payload: user
})
export const userCreateSuccess = (user) => ({
  type: CREATE_USER_SUCCESS,
  payload: user
})
export const userCreateError = (error) => ({
  type: CREATE_USER_ERROR,
  payload: error
})

// Selectors

const selectUser = (state) => state.get('newUser')

export const selectNewUser = createSelector(selectUser, (newUser) =>
  newUser.get('user').toJS()
)
export const selectNewUserLoad = createSelector(selectUser, (newUser) =>
  newUser.get('load')
)
export const selectNewUserError = createSelector(selectUser, (newUser) =>
  newUser.get('error')
)

// Requests

const createNewUserRequest = async (obj) => {
  const response = await axios.post(`${baseUrlPath}/users`, obj)

  return response.data
}

// Sagas
let idle = false
export const handleCreateNewUserSaga = function* ({ payload }) {
  if (idle) return
  idle = true
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
  } finally {
    idle = false
  }
}

export const watchCreateUserSaga = function* () {
  yield takeEvery(CREATE_USER_REQUEST, handleCreateNewUserSaga)
}
