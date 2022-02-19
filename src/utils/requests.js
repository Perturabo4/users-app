export const postRequest = async (urlPath = '', obj = {}) => {
  const response = await fetch(urlPath, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  })
  const result = await response.json()
  return result
}

export const getRequest = async (urlPath = '') => {
  const response = await fetch(urlPath)
  const result = await response.json()
  return result
}
