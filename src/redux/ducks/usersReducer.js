import { List, Record } from 'immutable'
import { call, put, takeEvery, select } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { baseUrlPath, ducksPath } from '../../config'
import { getRequest } from '../../utils/requests'

// USERS Reducer statuses
export const IDLE_STATUS = 'idle'
export const LOADING_STATUS = 'loading'
export const SUCCESS_STATUS = 'success'
export const FAILURE_STATUS = 'failure'

// ALL USERS ACTION TYPES
const duckName = 'users'
const USERS_FETCH_REQUEST = `${ducksPath}/${duckName}/USERS_FETCH_REQUEST`
const USERS_SET_PROGRESS = `${ducksPath}/${duckName}/USERS_SET_PROGRESS`
const USERS_FETCH_SUCCES = `${ducksPath}/${duckName}/USERS_FETCH_SUCCES`
const USERS_FETCH_ERROR = `${ducksPath}/${duckName}/USERS_FETCH_ERROR`

// Reducer

const record = Record({
  status: IDLE_STATUS,
  inProgress: false,
  users: List(),
  error: null
})

const initialState = record()

const usersIdleReducer = (state, action) => {
  switch (action.type) {
    case USERS_FETCH_REQUEST:
      return state
        .set('status', LOADING_STATUS)
        .set('inProgress', false)
        .set('users', List())
        .set('error', null)
    default:
      return state
  }
}
const usersLoadingReducer = (state, action) => {
  switch (action.type) {
    case USERS_SET_PROGRESS:
      return state
        .set('status', LOADING_STATUS)
        .set('inProgress', true)
        .set('users', List(action.payload))
        .set('error', null)
    case USERS_FETCH_SUCCES:
      return state
        .set('status', SUCCESS_STATUS)
        .set('inProgress', false)
        .set('users', List(action.payload))
        .set('error', null)
    case USERS_FETCH_ERROR:
      return state
        .set('status', FAILURE_STATUS)
        .set('inProgress', false)
        .set('users', List())
        .set('error', action.payload)
    default:
      return state
  }
}

export default function usersReducer(state = initialState, action) {
  switch (state['status']) {
    case IDLE_STATUS:
      return usersIdleReducer(state, action)
    case LOADING_STATUS:
      return usersLoadingReducer(state, action)
    case SUCCESS_STATUS:
    case FAILURE_STATUS:
      return usersIdleReducer(state, action)
    default:
      return state
  }
}

// Actions

export const usersFetchRequest = () => ({ type: USERS_FETCH_REQUEST })

export const usersSetProgress = () => ({ type: USERS_SET_PROGRESS })

export const usersFetchSuccess = (users) => ({
  type: USERS_FETCH_SUCCES,
  payload: users
})

export const usersFetchError = (error) => ({
  type: USERS_FETCH_ERROR,
  payload: error
})

// Selectors
export const selectUsers = (state) => state.get('allUsers')

const selectProgress = (state) => state.getIn(['allUsers', 'inProgress'])

export const selectUsersMemo = createSelector(
  selectUsers,
  (allUsers) => allUsers['users']
)
export const selectUsersStatus = createSelector(
  selectUsers,
  (allUsers) => allUsers['status']
)
export const selectUsersError = createSelector(
  selectUsers,
  (allUsers) => allUsers['error']
)

// Sagas

export const handleUsersSaga = function* () {
  const progress = yield select(selectProgress)

  if (progress) return

  yield put(usersSetProgress())

  try {
    const users = yield call(getRequest, `${baseUrlPath}/users`)
    yield put(usersFetchSuccess(users))
  } catch (error) {
    yield put(usersFetchError(error.message))
  }
}

export const watchUsersFetchSaga = function* () {
  yield takeEvery(USERS_FETCH_REQUEST, handleUsersSaga)
}
