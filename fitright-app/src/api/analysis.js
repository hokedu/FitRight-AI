import request, { uploadFile } from './request'

export const uploadVideo = (filePath, exerciseType, onProgress) => {
  return uploadFile({
    url: '/analysis/upload',
    filePath,
    name: 'video',
    formData: exerciseType ? { exercise_type: exerciseType } : {},
    onProgress
  })
}

export const getAnalysisResult = (id) => request({ url: `/analysis/${id}` })

export const getAnalysisHistory = () => request({ url: '/analysis/history' })
