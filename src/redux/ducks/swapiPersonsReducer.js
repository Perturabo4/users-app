import { List, Record } from 'immutable'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { baseSwapiUrlPath, ducksPath } from '../../config'
import { getRequest } from '../../utils/requests'

// Reducer statuses
export const IDLE_STATUS = 'idle'
export const LOADING_STATUS = 'loading'
export const SUCCESS_STATUS = 'success'
export const FAILURE_STATUS = 'failure'

// action types

const duckName = 'swapiPersons'
const FETCH_PERSON_REQUEST = `${ducksPath}/${duckName}/FETCH_PERSON_REQUEST`
const FETCH_PERSON_SUCCESS = `${ducksPath}/${duckName}/FETCH_PERSON_SUCCESS`
const FETCH_PERSON_ERROR = `${ducksPath}/${duckName}/FETCH_PERSON_ERROR`

// reducer

const record = Record({
  status: IDLE_STATUS,
  persons: List(),
  error: null,
  name: ''
})

const initialState = record()

const swapiIdlePersonsReducer = (state, action) => {
  switch (action.type) {
    case FETCH_PERSON_REQUEST:
      return state
        .set('status', LOADING_STATUS)
        .set('persons', List())
        .set('error', null)
        .set('name', action.payload)
    default:
      return state
  }
}
const swapiLoadingPersonsReducer = (state, action) => {
  switch (action.type) {
    case FETCH_PERSON_SUCCESS:
      return state
        .set('status', SUCCESS_STATUS)
        .set('persons', List(action.payload))
        .set('error', null)
        .set('name', '')
    case FETCH_PERSON_ERROR:
      return state
        .set('status', FAILURE_STATUS)
        .set('persons', List())
        .set('error', action.payload)
        .set('name', '')
    default:
      return state
  }
}

export default function swapiPersonsReducer(state = initialState, action) {
  switch (state['status']) {
    case IDLE_STATUS:
      return swapiIdlePersonsReducer(state, action)
    case LOADING_STATUS:
      return swapiLoadingPersonsReducer(state, action)
    case SUCCESS_STATUS:
    case FAILURE_STATUS:
      return swapiIdlePersonsReducer(state, action)
    default:
      return state
  }
}

// action creators

export const swapiFetchRequest = (name) => ({
  type: FETCH_PERSON_REQUEST,
  payload: name
})
export const swapiFetchSuccess = (users) => ({
  type: FETCH_PERSON_SUCCESS,
  payload: users
})
export const swapiFetchError = (error) => ({
  type: FETCH_PERSON_ERROR,
  payload: error
})

// selectors
export const selectPersons = (state) => state.get('swapiPersons')
export const selectPersonsMemo = createSelector(selectPersons, (swapiPersons) =>
  swapiPersons['persons'].toArray()
)

export const selectPersonsStatus = createSelector(
  selectPersons,
  (swapiPersons) => swapiPersons['status']
)

export const selectPersonsError = createSelector(
  selectPersons,
  (swapiPersons) => swapiPersons['error']
)

// sagas

export function* fetchPersonsSaga({ payload }) {
  try {
    const { results } = yield call(
      getRequest,
      `${baseSwapiUrlPath}/people/?search=${payload}`
    )
    yield put(swapiFetchSuccess(results))
  } catch (error) {
    yield put(swapiFetchError(error.message))
  }
}

export function* watchPersonsSaga() {
  const status = select(selectPersonsStatus)

  if (status === LOADING_STATUS) return

  yield takeEvery(FETCH_PERSON_REQUEST, fetchPersonsSaga)
}
