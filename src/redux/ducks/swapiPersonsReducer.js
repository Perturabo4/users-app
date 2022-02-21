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

const duckName = 'swapiPersonsReducer'
const FETCH_PERSONS_REQUEST = `${ducksPath}/${duckName}/FETCH_PERSON_REQUEST`
const PERSONS_SET_PROGRESS = `${ducksPath}/${duckName}/PERSONS_SET_PROGRESS`
const FETCH_PERSONS_SUCCESS = `${ducksPath}/${duckName}/FETCH_PERSON_SUCCESS`
const FETCH_PERSONS_ERROR = `${ducksPath}/${duckName}/FETCH_PERSON_ERROR`

// reducer

const record = Record({
  status: IDLE_STATUS,
  inProgress: false,
  persons: List(),
  error: null,
  name: ''
})

const initialState = record()

const swapiIdlePersonsReducer = (state, action) => {
  switch (action.type) {
    case FETCH_PERSONS_REQUEST:
      return state
        .set('status', LOADING_STATUS)
        .set('inProgress', false)
        .set('persons', List())
        .set('error', null)
        .set('name', action.payload)
    default:
      return state
  }
}

const swapiLoadingPersonsReducer = (state, action) => {
  switch (action.type) {
    case PERSONS_SET_PROGRESS:
      return state
        .set('status', LOADING_STATUS)
        .set('inProgress', true)
        .set('persons', List(action.payload))
        .set('error', null)
        .set('name', '')
    case FETCH_PERSONS_SUCCESS:
      return state
        .set('status', SUCCESS_STATUS)
        .set('inProgress', false)
        .set('persons', List(action.payload))
        .set('error', null)
        .set('name', '')
    case FETCH_PERSONS_ERROR:
      return state
        .set('status', FAILURE_STATUS)
        .set('inProgress', false)
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

export const personsSetProgress = () => ({
  type: PERSONS_SET_PROGRESS
})

export const swapiFetchRequest = (name) => ({
  type: FETCH_PERSONS_REQUEST,
  payload: name
})

export const swapiFetchSuccess = (users) => ({
  type: FETCH_PERSONS_SUCCESS,
  payload: users
})

export const swapiFetchError = (error) => ({
  type: FETCH_PERSONS_ERROR,
  payload: error
})

// selectors
export const selectPersons = (state) => state.get('swapiPersons')
export const selectProgress = (state) =>
  state.getIn(['swapiPersons', 'inProgress'])
export const selectPersonsMemo = createSelector(selectPersons, (swapiPersons) =>
  swapiPersons['persons'].toArray()
)

export const selectPersonsStatus = createSelector(
  selectPersons,
  (swapiPersons) => {
    console.log(swapiPersons['status'])
    return swapiPersons['status']
  }
)

export const selectPersonsError = createSelector(
  selectPersons,
  (swapiPersons) => swapiPersons['error']
)

// sagas

export function* fetchPersonsSaga({ payload }) {
  const progress = yield select(selectProgress)

  console.log('Saga', progress)

  if (progress) return

  yield put(personsSetProgress())

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
  yield takeEvery(FETCH_PERSONS_REQUEST, fetchPersonsSaga)
}
