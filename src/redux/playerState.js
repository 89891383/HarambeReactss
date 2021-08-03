import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    firstInteraction: false,
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
    currentVideoID: null,
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
    isAddVideo: false,
    isHistoryOpen: false,
    hiddenChat: false,
    liveDuration: null,
    currentChat: 'victorowsky_',
    isTwitchCam: false,
    nickname: null,
    videoTitle: null,
    currentAvailableFormats: [],
    twitchCam: false,

}

export const counterSlice = createSlice({
  name: 'playerState',
  initialState,
  reducers: {

    loadPlayer: (state)=>{
        state.firstInteraction = true
    },

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
        const {iFrame, currentVideo, title, queue, isAdmin, isServerTime, isPlaylistOpen, isPlaying, playbackRate, isLive,currentAvailableFormats, isTwitchCam } = action.payload
        state.iFrame = iFrame
        state.currentVideoLink = currentVideo
        state.admin = isAdmin
        state.playbackRate = playbackRate
        state.videoTitle = title
        state.videoQueue = queue
        state.isPlaying = isPlaying
        state.isPlaylistOpen = isPlaylistOpen
        state.isServerTime = isServerTime
        state.isLive = isLive
        state.currentAvailableFormats = currentAvailableFormats
        state.isTwitchCam = isTwitchCam
    },

    changeOnlineUsers: (state,action) =>{
        state.onlineUsers = action.payload
    },

    setTwitchUserData: (state, action)=>{
        state.twitchUserData = action.payload
    },

    changeTwitchCam: (state,action)=>{
        state.isTwitchCam = action.payload
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
        const { currentVideoLink, queue, title, formats,id,iFrame } = action.payload

        state.duration = 0
        state.progress = 0
        state.isLoading = true
        state.isLive = false
        state.currentVideoLink = currentVideoLink
        state.videoQueue = queue
        state.currentAvailableFormats = formats
        state.currentVideoID = id
        state.iFrame = iFrame
        if(title){
            state.videoTitle = title
        }else{
            state.videoTitle = null
        }
    },

    queueUpdate: (state,action)=>{
        state.videoQueue = [...state.videoQueue, action.payload]
    },

    updateQueueYoutubeDL: (state,action)=>{

        const {link, duration,thumbnail, title,formats,id,noData} = action.payload


        state.videoQueue.forEach(video=>{
            if(video.id === id){

                if(link){
                    video.URL = link
                }
                if(duration){
                    video.duration = duration
                }
                if(thumbnail){
                   video.thumbnail = video.thumbnail || thumbnail  
                }
                if(formats){
                    video.availableFormats = formats
                }
                if(noData){
                    video.noData = noData
                }
				if(!video.title){
					video.title = title
				}
            }
        })

        
    },

    updateCurrentVideo: (state,action)=>{
        const {id, formats,duration} = action.payload
        if(state.currentVideoID === id ){
            state.currentAvailableFormats = formats
            if(duration === 'LIVE'){
                state.isLive = true
            }
        }
    },

    queueMoveUpAnswer: (state,action)=>{
        state.videoQueue = action.payload
    },


    queueDelete: (state,action)=>{
        const {payload} = action

        const newQueue = state.videoQueue.filter((video) => video.id !== payload);

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
    dialogOpenToggle: (state,action) => {

        state.isDialogOpen = action.payload
    }, 
    historyOpenToggle: (state,action)=>{
        state.isHistoryOpen = action.payload
        // state.isHistoryOpen = !state.isHistoryOpen
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
    },

    changeQuality: (state,action)=>{
        state.currentVideoLink = action.payload
    },

    iFrameVideoToggle: (state,action)=>{
        const {id, iFrame} = action.payload
        state.videoQueue.forEach(video=>{
            if(video.id === id){
                video.iFrame = iFrame
            }
        })
    },

    changeIsAddVideo: (state, action) =>{
        const {payload} = action

        state.isAddVideo = payload
    },



  },
})

// Action creators are generated for each case reducer function
export const {  
    changePlaying,changeiFrame,changePlaybackRate,changeCurrentVideoLink,changeVideoQueue,changeServerTime,changePlaylistOpen,joinRoomAnswer,changeOnlineUsers,setTwitchUserData,successMessage,errorMessage,warningMessage,videoChangeAnswer,queueUpdate,queueMoveUpAnswer,queueDelete,playlistToggle,isLiveToggle,setDuration,setAreControls,setVideoProgress,changeLiveDuration,changeProgress,changeIsLoading,changeVolume,changeCurrentChat,togglePlaying,changeVideoTitle,hiddenChatToggle,changeNickname,dialogOpenToggle,historyOpenToggle,changeIsError,changeIsSuccess,changeIsWarning,onProgress,changeMaxDelay,updateQueueYoutubeDL,changeQuality,updateCurrentVideo,loadPlayer,iFrameVideoToggle,changeIsAddVideo,changeTwitchCam } = counterSlice.actions

export default counterSlice.reducer