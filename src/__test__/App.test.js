import React from 'react'
import {screen, render, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import App from '../App';
import { Provider } from 'react-redux';
import { store } from '../redux/store';

test('firstIntegration toBeInTheDocument', ()=>{
    render(<Provider store={store} ><App/></Provider>)
    const clickToStart = screen.getByText(/click to start/i)
    expect(clickToStart).toBeInTheDocument()
})

test('firstIntegration click', async ()=>{
    render(<Provider store={store} ><App/></Provider>)
    const clickToStart = screen.getByText(/click to start/i)
    
    fireEvent.click(clickToStart)

    const currentQueueText = screen.getByText(/current queue/i)
    

    expect(currentQueueText).toBeInTheDocument()    
})
