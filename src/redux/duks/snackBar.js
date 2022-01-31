// TYPES

export const SET_SNACKBAR = 'SET_SNACKBAR'

// Reducer

const initialState = {
  open: false,
  type: 'success',
  message: ''
}

export default function snackBarReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SNACKBAR:
      const { open, type, message } = action.payload
      return {
        ...state,
        open,
        type,
        message
      }
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

export const selectOpen = (state) => state.snackBar.open
export const selectType = (state) => state.snackBar.type
export const selectMessage = (state) => state.snackBar.message
