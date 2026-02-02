export const storageUser = (token: string, username: string) => {
  localStorage.setItem('username', username);
  localStorage.setItem("userinfo", JSON.stringify({
    'username': username,
    'token': token
  }));
}
//
export const getUserInfo = () => {
  return JSON.parse(localStorage.getItem('userinfo'));
}

//
export const getUserName = () => {
  return JSON.parse(localStorage.getItem('username'));
}

//
export const storageAccount = (username: string, password: string) => {
  localStorage.setItem('userAccount', JSON.stringify({
    'username': username,
    'password': password
  }));
}

//
export const getUserAccount = () => {
  return JSON.parse(localStorage.getItem('userAccount'));
}

//
export const cleanUser = () => {
  localStorage.removeItem('username');
  localStorage.removeItem('userinfo');
}

// 存储项目
export const setItem = (key: string, value: any) => {
  const type = typeof value ;
  switch (type) {
    case 'string':
      localStorage.setItem(key, value);
      break;
    case 'object':
      localStorage.setItem(key, JSON.stringify(value));
      break;
    default:
      localStorage.setItem(key,value);
      break;
  }
}

// 获取项目
export const getJsonItem = (key: string) => {
  return JSON.parse(localStorage.getItem(key));
}

export const getStringItem = (key: string) => {
  return localStorage.getItem(key);
}
