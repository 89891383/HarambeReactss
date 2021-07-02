import { configureStore } from '@reduxjs/toolkit'
import playerReducer from './playerState';

export const store = configureStore({
  reducer: {
    player: playerReducer
  },
})