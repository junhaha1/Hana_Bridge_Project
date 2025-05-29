import store from "../store/store";
import { updateAccessToken } from "../store/authSlice";
import { clearUser, clearAiChat } from "../store/userSlice";

//OpenAI 스트림 요청용 Fetch
const StreamFetch = async (url, options = {}) => {
  const SERVER_URL = import.meta.env.VITE_API_URL;

  // 🔁 1. AccessToken 새로 발급 시도
  const refreshResponse = await fetch(SERVER_URL + "/auth/refresh", {
    method: "POST",
    credentials: "include",
  });

  let tokenData = null;
  try {
    tokenData = await refreshResponse.json();
  } catch (e) {
    // JSON이 아닐 수도 있으므로 무시
  }

  // ❌ 실패 처리
  if (!refreshResponse.ok || tokenData?.code === "UNAUTHORIZED") {
    store.dispatch(clearUser());
    store.dispatch(clearAiChat());
    store.dispatch(updateAccessToken({ accessToken: "" }));
    alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
    window.location.href = "/";
    return;
  }

  // ✅ 2. accessToken 갱신 및 fetch 재시도
  const accessToken = tokenData.accessToken;
  store.dispatch(updateAccessToken({ accessToken }));

  const fetchOptions = {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${accessToken}`,
    },
  };

  return await fetch(url, fetchOptions);
};

export default StreamFetch;
