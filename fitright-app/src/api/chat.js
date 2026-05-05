import request from './request'

export const getChatSessions = () => request({ url: '/chat/sessions' })

export const getChatDetail = (id) => request({ url: `/chat/sessions/${id}` })

// SSE 流式对话（不走uni.request，直接用 EventSource 或手动解析）
// #ifdef H5
export const CHAT_SEND_URL = '/api/v1/chat/send'
// #endif
// #ifndef H5
export const CHAT_SEND_URL = 'http://localhost:8000/api/v1/chat/send'
// #endif
