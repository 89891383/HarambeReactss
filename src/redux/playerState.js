import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    admin: false,
    isPlaying: false,
    maxDelay: 2,
    twitchUserData: null,
    progress: 0,
    duration : 0,
    volume: 0.1,
    areControls: false,
    playbackRate: 1,
    isLoading: false,
    videoProgress: null,
    isLive: false,
    iFrame: false,
    currentVideoLink: null,
    videoQueue: [],
    isServerTime:false,
    isPlaylistOpen: false,
    onlineUsers: null,
    isSuccess: false,
    successMessage: "",
    isError: false,
    errorMessage:"",
    isWarning: false,
    warningMessage: "",
    isDialogOpen: false,
    isHistoryOpen: false,
    hiddenChat: false,
    liveDuration: null,
    currentChat: 'victorowsky_',
    nickname: null,
    videoTitle: null,

}

export const counterSlice = createSlice({
  name: 'playerState',
  initialState,
  reducers: {

    changePlaying: (state, action) =>{
        state.isPlaying = action.payload
    },

    changeVideoTitle: (state,action)=>{
        state.videoTitle = action.payload
    },

    togglePlaying: (state)=>{
        state.isPlaying = !state.isPlaying
    },

    changeNickname: (state,action)=>{
        state.nickname = action.payload
    },

    changeiFrame: (state,action) =>{
        state.iFrame = action.payload
    },
    hiddenChatToggle: (state,action)=>{
        state.hiddenChat = !state.hiddenChat
    },

    changePlaybackRate: (state,action) =>{
        state.playbackRate = action.payload
    },

    changeCurrentVideoLink: (state,action)=>{
        state.currentVideoLink = action.payload
    },

    changeVideoQueue: (state,action)=>{
        state.videoQueue = action.payload
    },

    changeServerTime: (state,action)=>{
        state.isServerTime = action.payload
    },
    changePlaylistOpen: (state,action)=>{
        state.isPlaylistOpen = action.payload
    },

    joinRoomAnswer: (state, action)=>{
        const {iframe, currentVideo, title, queue, isAdmin, isServerTime, isPlaylistOpen, isPlaying, playbackRate, isLive } = action.payload
        state.iFrame = iframe
        state.currentVideoLink = currentVideo
        state.admin = isAdmin
        state.playbackRate = playbackRate
        state.videoTitle = title
        state.videoQueue = queue
        state.isPlaying = isPlaying
        state.isPlaylistOpen = isPlaylistOpen
        state.isServerTime = isServerTime
        state.isLive = isLive
    },

    changeOnlineUsers: (state,action) =>{
        state.onlineUsers = action.payload
    },

    setTwitchUserData: (state, action)=>{
        state.twitchUserData = action.payload
    },

    successMessage: (state,action)=>{
        state.isSuccess = true
        state.successMessage = action.payload
    },

    errorMessage: (state,action)=>{
        state.isError = true
        state.errorMessage = action.payload
    },

    warningMessage: (state,action)=>{
        state.isWarning = true
        state.warningMessage = action.payload
    },

    videoChangeAnswer: (state, action)=>{
        const { currentVideoLink, queue, title } = action.payload

        state.duration = 0
        state.progress = 0
        state.isLoading = true
        state.isLive = false
        state.currentVideoLink = currentVideoLink
        state.videoQueue = queue
        if(title){
            state.videoTitle = title
        }else{
            state.videoTitle = null
        }
    },

    queueUpdate: (state,action)=>{
        state.videoQueue = [...state.videoQueue, action.payload]
    },

    queueDurationUpdate: (state,action)=>{

        const {link, duration} = action.payload

        state.videoQueue.forEach(video=>{
            if(video.URL === link){
                video.duration = duration
            }
        })
        
    },

    queueMoveUpAnswer: (state,action)=>{
        state.videoQueue = action.payload
    },


    queueDelete: (state,action)=>{
        const {payload} = action

        const newQueue = state.videoQueue.filter((video) => video.URL !== payload);

        state.videoQueue = newQueue
    },

    playlistToggle: (state, action)=>{
        state.isPlaylistOpen = action.payload
        if(action.payload){
            state.isSuccess = true
            state.successMessage = 'PLAYLIST IS NOW OPEN'
        }else{
            state.isError = true
            state.errorMessage = "PLAYLIST IS NOW CLOSED"
        }
    },

    isLiveToggle: (state,action)=>{
        state.isLive = action.payload
    },

    setDuration: (state,action)=>{
        state.duration = action.payload
    },

    setAreControls: (state,action)=>{
        state.areControls = action.payload
    },

    setVideoProgress: (state, action)=>{
        state.videoProgress = action.payload
    },

    changeLiveDuration: (state,action)=>{
        state.liveDuration = action.payload
    },
    changeProgress: (state, action)=>{
        state.progress = action.payload
    },
    changeIsLoading: (state, action)=>{
        state.isLoading = action.payload
    },
    changeVolume: (state,action) =>{
        state.volume = action.payload
    }, 
    changeCurrentChat: (state,action)=>{
        state.currentChat = action.payload
    },
    dialogOpenToggle: (state) => {
        state.isDialogOpen = !state.isDialogOpen
    }, 
    historyOpenToggle: (state)=>{
        state.isHistoryOpen = !state.isHistoryOpen
    },
    changeIsError: (state,action)=>{
        state.isError = action.payload
    },
    changeIsSuccess: (state,action)=>{
        state.isSuccess = action.payload
    },
    changeIsWarning: (state,action)=>{
        state.isWarning = action.payload
    },

    onProgress: (state,action)=>{
        state.videoProgress = action.payload
        state.progress = action.payload.playedSeconds
    },

    changeMaxDelay: (state, action)=>{
        if(state.maxDelay > 1 || action.payload > 0){
            state.maxDelay += action.payload
            console.log(state.maxDelay);
        }
    }



  },
})

// Action creators are generated for each case reducer function
export const {  
    changePlaying,changeiFrame,changePlaybackRate,changeCurrentVideoLink,changeVideoQueue,changeServerTime,changePlaylistOpen,joinRoomAnswer,changeOnlineUsers,setTwitchUserData,successMessage,errorMessage,warningMessage,videoChangeAnswer,queueUpdate,queueMoveUpAnswer,queueDelete,playlistToggle,isLiveToggle,setDuration,setAreControls,setVideoProgress,changeLiveDuration,changeProgress,changeIsLoading,changeVolume,changeCurrentChat,togglePlaying,changeVideoTitle,hiddenChatToggle,changeNickname,dialogOpenToggle,historyOpenToggle,changeIsError,changeIsSuccess,changeIsWarning,onProgress,changeMaxDelay,queueDurationUpdate } = counterSlice.actions

export default counterSlice.reducer