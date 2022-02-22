import { Map, Record } from 'immutable'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { baseUrlPath, ducksPath } from '../../config'
import { postRequest } from '../../utils/requests'
import { setSnackBar } from './snackBarReducer'

// USER Reducer statuses
export const IDLE_STATUS = 'idle'
export const LOADING_STATUS = 'loading'
export const SUCCESS_STATUS = 'success'
export const FAILURE_STATUS = 'failure'

// CREATE USER TYPES
const duckName = 'createUserReducer'
const CREATE_USER_REQUEST = `${ducksPath}/${duckName}/CREATE_USER_REQUEST`
const USER_SET_PROGRESS = `${ducksPath}/${duckName}/USER_SET_PROGRESS`
const CREATE_USER_SUCCESS = `${ducksPath}/${duckName}/CREATE_USER_SUCCESS`
const CREATE_USER_ERROR = `${ducksPath}/${duckName}/CREATE_USER_ERROR`

// Reducers

const record = Record({
  status: IDLE_STATUS,
  inProgress: false,
  user: Map(),
  error: null
})

const initialState = record()

const createIdleUserReducer = (state, action) => {
  switch (action.type) {
    case CREATE_USER_REQUEST:
      return state
        .set('status', LOADING_STATUS)
        .set('inProgress', false)
        .set('user', Map())
        .set('error', null)
    default:
      return state
  }
}

const createLoadingUserReducer = (state, action) => {
  switch (action.type) {
    case USER_SET_PROGRESS:
      return state.set('inProgress', true)
    case CREATE_USER_SUCCESS:
      return state
        .set('status', SUCCESS_STATUS)
        .set('inProgress', false)
        .set('user', Map(action.payload))
        .set('error', null)
    case CREATE_USER_ERROR:
      return state
        .set('status', FAILURE_STATUS)
        .set('inProgress', false)
        .set('user', Map())
        .set('error', action.payload)
    default:
      return state
  }
}

export default function createUserReducer(state = initialState, action) {
  switch (state['status']) {
    case IDLE_STATUS:
      return createIdleUserReducer(state, action)
    case LOADING_STATUS:
      return createLoadingUserReducer(state, action)
    case SUCCESS_STATUS:
    case FAILURE_STATUS:
      return createIdleUserReducer(state, action)
    default:
      return state
  }
}

// Actions

export const setProgress = () => ({
  type: USER_SET_PROGRESS
})
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
const selectProgress = (state) => state.getIn(['newUser', 'inProgress'])

export const selectNewUser = createSelector(selectUser, (newUser) =>
  newUser['user'].toJS()
)
export const selectNewUserStatus = createSelector(
  selectUser,
  (newUser) => newUser['status']
)
export const selectNewUserError = createSelector(
  selectUser,
  (newUser) => newUser['error']
)

// Sagas

export const handleCreateNewUserSaga = function* ({ payload }) {
  const progress = yield select(selectProgress)

  if (progress) return

  yield put(setProgress())

  try {
    const user = yield call(postRequest, `${baseUrlPath}/users`, payload)
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

export const watchCreateUserSaga = function* () {
  yield takeEvery(CREATE_USER_REQUEST, handleCreateNewUserSaga)
}
