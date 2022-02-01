// TYPES

import { fromJS } from 'immutable'

export const SET_SNACKBAR = 'SET_SNACKBAR'

// Reducer

const initialState = fromJS({
  open: false,
  type: 'success',
  message: ''
})

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

export const selectOpen = (state) => state.getIn(['snackBar', 'open'])
export const selectType = (state) => state.getIn(['snackBar', 'type'])
export const selectMessage = (state) => state.getIn(['snackBar', 'message'])
