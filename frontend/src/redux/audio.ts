import { createSlice } from '@reduxjs/toolkit';

interface CounterState {
    duration: { sec: number, min: number };
    src: string,
    vocalAudioSrc:string,
    durationInSec:number,
    currentPosition:number,
}

const initialState: CounterState = {
    duration: { sec: 0, min: 0 },
    src: "",
    vocalAudioSrc:"",
    durationInSec:0,
    currentPosition:0
};

const audioPlay = createSlice({
    name: 'audioPlay',
    initialState,
    reducers: {

        durationUpdate: (state, action) => {
            state.duration = { ...action.payload };
        },
        srcUpdate: (state, action) => {
            state.src = action.payload;
        },
        vocalsrcUpdate: (state, action) => {
            state.vocalAudioSrc = action.payload;
        },
        durationInSecUpdate: (state, action) => {
            state.durationInSec =  action.payload ;
        },
        currentPositionUpdate: (state, action) => {
            state.currentPosition =  action.payload ;
        },
    },
});

export const { srcUpdate,durationUpdate,vocalsrcUpdate,durationInSecUpdate ,currentPositionUpdate} = audioPlay.actions;
export default audioPlay.reducer;
