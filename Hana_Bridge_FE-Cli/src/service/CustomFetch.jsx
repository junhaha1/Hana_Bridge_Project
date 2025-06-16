import store from "../store/store"
import { clearAccessToken, updateAccessToken } from "../store/authSlice";
import {clearUser, clearAiChat} from "../store/userSlice";

//일반적인 Json기반 API 요청
const CustomFetch = async (url, options = {}) => {
  const SERVER_URL = import.meta.env.VITE_API_URL;
  let accessToken = store.getState().auth.accessToken;

  const fetchOptions = ({
    ...options,
    headers: {
      ...(options.headers || {}),
      "Authorization": `Bearer ${accessToken}`,
    },
  });

  let response = await fetch(url, fetchOptions);

  const cloned = response.clone(); // json()은 1회용이라 clone 필요
  let isUnauthorized = false;

  try {
    const result = await cloned.json();
    if (result?.code === 'UNAUTHORIZED') {
      isUnauthorized = true;
    }
  } catch (e) {
    // 응답이 JSON이 아닐 수도 있음 → 무시
  }
  
  if (response.status === 401 || isUnauthorized) {
    console.warn(`[CustomFetch] 401 발생 → 리프레시 시도`);
    const refreshResponse = await fetch(SERVER_URL + '/auth/refresh', {
      method: 'POST', 
      credentials: 'include',
    });

    console.log(refreshResponse);

    const refreshCheck = refreshResponse.clone();
    let isUnRefresh = false;
    let TokenData = null;

    try {
      TokenData = await refreshCheck.json();
      if (TokenData?.code === 'UNAUTHORIZED') {
        isUnRefresh = true;
      }
    } catch (e) {
      // 응답이 JSON이 아닐 수도 있음 → 무시
    }

    if (refreshResponse.ok && !isUnRefresh){
      const newAccessToken = TokenData.accessToken;
      store.dispatch(updateAccessToken({ accessToken: newAccessToken }));

      const retryOptions = {
        ...options,
        headers: {
          ...(options.headers || {}),
          'Authorization': `Bearer ${newAccessToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      };
      response = await fetch(url, retryOptions);
    }
    else {
      // 리프레시 실패 시 로그아웃 처리
      store.dispatch(clearUser());
      store.dispatch(clearAiChat());
      store.dispatch(clearAccessToken());
      alert('세션이 만료되었습니다. 다시 로그인 해주세요.');
      window.location.href = '/';
    }
  } 
  return response;
}

export default CustomFetch;