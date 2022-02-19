import { List, Record } from 'immutable'
import { call, put, takeEvery } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { baseSwapiUrlPath, ducksPath } from '../../config'
import { getRequest } from '../../utils/requests'

// action types
const duckName = 'swapiPersons'
const FETCH_PERSON_REQUEST = `${ducksPath}/${duckName}/FETCH_PERSON_REQUEST`
const FETCH_PERSON_SUCCESS = `${ducksPath}/${duckName}/FETCH_PERSON_SUCCESS`
const FETCH_PERSON_ERROR = `${ducksPath}/${duckName}/FETCH_PERSON_ERROR`

// reducers
const record = Record({
  load: false,
  persons: List([]),
  error: null,
  name: ''
})

const initialState = record()

export default function swapiPersonsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PERSON_REQUEST:
      return state.set('load', true).set('name', action.payload)
    case FETCH_PERSON_SUCCESS:
      return state.set('load', false).set('persons', List(action.payload))
    case FETCH_PERSON_ERROR:
      return state.set('load', false).set('error', action.payload)
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
export const selectPersonsLoad = createSelector(
  selectPersons,
  (swapiPersons) => swapiPersons['load']
)

// sagas
let idle
export function* fetchPersonsSaga({ payload }) {
  if (idle) return
  idle = true
  try {
    const { results } = yield call(
      getRequest,
      `${baseSwapiUrlPath}/people/?search=${payload}`
    )
    yield put(swapiFetchSuccess(results))
  } catch (error) {
    yield put(swapiFetchError(error))
  } finally {
    idle = false
  }
}

export function* watchPersonsSaga() {
  yield takeEvery(FETCH_PERSON_REQUEST, fetchPersonsSaga)
}
