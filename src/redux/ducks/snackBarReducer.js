// TYPES

import { Record } from 'immutable'
import { createSelector } from 'reselect'
import { ducksPath } from '../../config'

const duckName = 'snackBar'
const SET_SNACKBAR = `${ducksPath}/${duckName}/SET_SNACKBAR`

// Reducer

const record = Record({
  open: false,
  type: 'success',
  message: ''
})

const initialState = record()

export default function snackBarReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SNACKBAR:
      const { open, type, message } = action.payload
      return state.set('open', open).set('type', type).set('message', message)
    default:
      return state
  }
}

// Actions

export const setSnackBar = (options) => ({
  type: SET_SNACKBAR,
  payload: options
})

// Selectors
const selectSnackBar = (state) => state.get('snackBar')

export const selectOpen = createSelector(
  selectSnackBar,
  (snackBar) => snackBar['open']
)
export const selectType = createSelector(
  selectSnackBar,
  (snackBar) => snackBar['type']
)
export const selectMessage = createSelector(
  selectSnackBar,
  (snackBar) => snackBar['message']
)
