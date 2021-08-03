import { configureStore } from '@reduxjs/toolkit'
import playerReducer from './playerState';

const checkLocalhost = window.location.hostname === 'localhost'

export const store = configureStore({
  reducer: {
    player: playerReducer,
  },
  devTools: checkLocalhost
})