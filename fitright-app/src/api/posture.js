import request, { uploadFile } from './request'

const uploadImage = (filePath) => {
  return uploadFile({
    url: '/posture/upload-image',
    filePath,
    name: 'file'
  })
}

export const uploadPostureImages = async (frontPath, sidePath, backPath) => {
  const [frontResult, sideResult, backResult] = await Promise.all([
    uploadImage(frontPath),
    uploadImage(sidePath),
    uploadImage(backPath)
  ])

  return request({
    url: '/posture/assess',
    method: 'POST',
    data: {
      front_image_url: frontResult.url,
      side_image_url: sideResult.url,
      back_image_url: backResult.url
    }
  })
}

export const getPostureResult = (id) => request({ url: `/posture/${id}` })

export const getPostureHistory = () => request({ url: '/posture/history' })
