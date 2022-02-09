import { fromJS } from 'immutable'
import { call, put, takeEvery } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { baseSwapiUrlPath, ducksPath } from '../../config'

// action types
const duckName = 'swapiPersons'
const FETCH_PERSON_REQUEST = `${ducksPath}/${duckName}/FETCH_PERSON_REQUEST`
const FETCH_PERSON_SUCCESS = `${ducksPath}/${duckName}/FETCH_PERSON_SUCCESS`
const FETCH_PERSON_ERROR = `${ducksPath}/${duckName}/FETCH_PERSON_ERROR`

// reducers
const initialState = fromJS({
  persons: [],
  error: null,
  name: ''
})

export default function swapiReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PERSON_REQUEST:
      //   return { ...state, load: true, name: action.payload };
      return state.set('name', action.payload)
    case FETCH_PERSON_SUCCESS:
      //   return { ...state, load: false, persons: action.payload };
      return state.set('persons', fromJS(action.payload))
    case FETCH_PERSON_ERROR:
      //   return { ...state, load: false, error: action.payload };
      return state.set('error', action.payload)
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

// Actions

const fetchPersons = async (name) => {
  console.log(name)
  const res = await fetch(`${baseSwapiUrlPath}/?search=${name}`)
  const persons = await res.json()
  console.log(persons)
  return persons.results
}

// selectors
export const selectPersons = (state) => state.get('swapiPersons')
export const selectPersonsMemo = createSelector(selectPersons, (swapi) =>
  swapi.get('persons').toJS()
)

// export const selectLoadPersons = (state) => state.swapi.load;

// sagas
let idle
export function* fetchPersonsSaga({ payload }) {
  if (idle) return
  idle = true
  try {
    const users = yield call(fetchPersons, payload)
    yield put(swapiFetchSuccess(users))
  } catch (error) {
    yield put(swapiFetchError(error))
  } finally {
    idle = false
  }
}

export function* watchPersonsSaga() {
  yield takeEvery(FETCH_PERSON_REQUEST, fetchPersonsSaga)
}
