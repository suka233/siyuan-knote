// import process from 'process'
export async function request(url: string, body = {}, method = 'POST') {
  try {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token '
      },
      body: JSON.stringify(body)
    }
    const response = await fetch(url, options)
    if (!response.ok || response.status !== 200) {
      throw new Error(response.statusText)
    }
    const responseJson = await response.json()
    return responseJson.data
  } catch (error) {
    console.error(error)
  }
}

// 发送请求
export async function 向思源请求数据(
  url: string,
  data: any,
  { headers }: { headers?: any } = { headers: undefined }
): Promise<any> {
  let resData = null
  await fetch(url, {
    body: headers ? data : JSON.stringify(data),
    method: 'POST'
    // headers: Object.assign({}, headers),
    // {
    //     // Authorization: `Token ${config.token}`,
    // },
    // 多工作空间开发的时候，需要鉴权
    // headers:
    //   process.env.NODE_ENV === 'development'
    //     ? {
    //         Authorization: 'Token vynpj02enbofr6u1'
    //       }
    //     : undefined
  }).then(function (response) {
    if (response.ok) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      resData = response.json()
      // return resData = response.json()
      // return response.json()
      return resData
    }
    const error_msg = `API错误:(${url})${response.status} ${response.statusText}`
    console.error(error_msg)
  })
  return resData
}

export async function http(
  url: string,
  data: any,
  { headers }: { headers?: any } = { headers: undefined }
): Promise<any> {
  let resData = null
  await fetch(url, {
    body: headers ? data : JSON.stringify(data),
    method: 'POST'
    // headers: Object.assign({}, headers),
    // {
    //     // Authorization: `Token ${config.token}`,
    // },
    // 多工作空间开发的时候，需要鉴权
    // headers:
    //   process.env.NODE_ENV === 'development'
    //     ? {
    //         Authorization: 'Token vynpj02enbofr6u1'
    //       }
    //     : undefined
  }).then(function (response) {
    // console.log(response)
    if (response.ok) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      resData = response
      // return resData = response.json()
      // return response.json()
      return resData
    }
    const error_msg = `API错误:(${url})${response.status} ${response.statusText}`
    console.error(error_msg)
  })
  return resData
}
