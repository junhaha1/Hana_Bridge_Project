import ApiClient from "../../service/ApiClient";

import { useEffect, useState, useRef} from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate} from "react-router-dom";
import { modifyUser, clearUser, clearAiChat } from '../../store/userSlice';

const UserInfoModal = ({ onClose, onSwitch }) => {
   //이메일 관련
  const [email,setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  useEffect(() => {

    ApiClient.getUser()
    .then((res) => {
      console.log(res)
      if (!res.ok) {
        //error handler 받음 
        const errorData = res.json(); // JSON으로 파싱
        console.log("errorData: " + errorData.code + " : " + errorData.message); 
        // 👇 error 객체에 code를 추가해 던짐
        const error = new Error(errorData.message || `서버 오류: ${res.status}`);
        error.code = errorData.code;
        throw error;   
      }
      return res.json();
    })
    .then((data) => {
      console.log(data.email);
      setEmail(data.email);
      setName(data.name);
      setRole(data.role);
    })
    .catch((error) => {
      console.error("내정보 불러오기 에러", error);
    });
  }, []);
  
 

  //사용자 정보 관련
  const nickName = useSelector((state) => state.user.nickName);

  //사용자 정보 수정용 temp 변수
  const [tempEmail, setTempEmail] = useState(email);
  const [tempNickName, setTempNickName] = useState(nickName);

  //수정용 토글 변수
  const [isEdit, setIsEdit] = useState(false); 

  //비밀번호 변경
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState(""); 
  const [newCheckPassword, setNewCheckPassword] = useState("");

  //비밀번호 변경용 토글 변수
  const[isChangePassword, setIsChangePassword] = useState(false);

  //회원 탈퇴용 모달
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);

  //redux 변경 및 이동 관련
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //수정 취소할 시에 원래 값으로 복원
  const resetEdit = () => {
    setIsEdit(false);
    setIsChangePassword(false);

    setTempEmail(email);
    setTempNickName(nickName);
  };

  //비밀번호 취소
  const cancleChangePassword = () => {
    setIsChangePassword(false);
    setIsEdit(false);

    setOldPassword("");
    setNewPassword("");
    setNewCheckPassword("");
  }
  //비밀번호 확인 체크
  const checkNewPassword = () => {
    return newPassword && newCheckPassword && newPassword === newCheckPassword;
  };

  //비밀번호 변경
  const changePassword = () => {
    ApiClient.changePassword(oldPassword, newPassword)
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message); // 여기서 message 꺼내서 에러로 던짐
      }
      alert("비밀번호 변경 완료!");
      setIsChangePassword(false);
      setIsEdit(false)
    })
    .catch((error) => {
      console.log("에러 객체:", error);
      if (error.message === "Invalid Your Current Password!")
        alert(`입력하신 '변경할 비밀번호'가 틀렸습니다.\n다시 시도 해주십시오.`);
      else
        alert("비밀번호 변경 실패하였습니다.\n다시 시도해주십시오.");
    });
  }

  //정보 수정
  const updateUser = () => {
    ApiClient.updateUser(email, name, tempNickName)
    .then((res) => {
      if (!res.ok) throw new Error(`서버 오류 [${res.status}]`);
      return res.json();
    })
    .then((data)=>{
      alert("닉네임 수정 완료!");
      setIsEdit(false);
      dispatch(modifyUser({email: data.email, name: data.name, nickName: data.nickName}));
    })
    .catch((err) => {
      console.error("API 요청 실패:", err);
      alert("회원 정보 수정 중 문제가 발생했습니다. 다시 시도해주세요.");
    });
  };

  const confirmDeleteUser = () => {
    closeDeleteModal(); // 모달 닫고
    deleteUser();       // 탈퇴 진행
  };

  //회원 탈퇴
  const deleteUser = () => {
    ApiClient.deleteUser()
    .then((res) => {
      if (!res.ok) throw new Error(`서버 오류 [${res.status}]`);

      alert("회원 탈퇴되었습니다.");
      ApiClient.userLogout();
      dispatch(clearUser());
      dispatch(clearAiChat());
      localStorage.removeItem('userState');
      navigate('/');
    })
    .catch((err) => {
      console.error("API 요청 실패:", err);
      alert("회원 탈퇴 중 문제가 발생했습니다. 다시 시도해주세요.");
    });
  }

  //닉네임만 수정 시에 화면에 닉네임을 바꾸어줌
  useEffect(() => {
    setTempNickName(nickName);
  }, [nickName]);

  // Tailwind 적용된 JSX 코드
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-modal-fade max-md:mx-3">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl z-10"
        >
          ✕
        </button>
        <div className="bg-transparent flex justify-center">
          <div className="w-full max-w-[450px] bg-transparent rounded-2xl p-6">
            <h2 className="text-2xl text-black font-bold text-center mt-4 mb-6">사용자 정보</h2>
            <form className="space-y-4">
              {isChangePassword ? (
                <>
                  <div>
                    <label className="block text-black font-semibold mb-1">
                      변경할 비밀번호<span className="text-red-500">*</span>
                    </label>
                    <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}
                      className={`w-full px-3 py-2 rounded text-black bg-gray-100 cursor-text`} />
                  </div>

                  <div>
                    <label className="block text-black font-semibold mb-1">
                      새 비밀번호<span className="text-red-500">*</span>
                    </label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                      className={`w-full px-3 py-2 rounded text-black bg-gray-100`} />
                  </div>

                  <div>
                    <label className="block text-black  font-semibold mb-1">
                      새 비밀번호 확인<span className="text-red-500">*</span>
                    </label>
                    <input type="password" value={newCheckPassword} onChange={(e) => setNewCheckPassword(e.target.value)}
                      className={`w-full px-3 py-2 rounded text-black bg-gray-100`} />
                    {newCheckPassword && newPassword !== newCheckPassword && (
                      <p className="text-red-500 text-sm mt-1">새 비밀번호가 일치하지 않습니다.</p>
                    )}
                    {newCheckPassword && newPassword === newCheckPassword && (
                      <p className="text-green-500 text-sm mt-1">비밀번호가 일치합니다.</p>
                    )}
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <button type="button" disabled={!checkNewPassword()} onClick={() => changePassword()}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50 max-md:text-sm max-md:py-1 max-md:px-2">
                      비밀번호 변경
                    </button>
                    <button type="button" onClick={() => cancleChangePassword()}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded max-md:text-sm max-md:py-1 max-md:px-2">
                      비밀번호 변경 취소
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-black font-semibold mb-1">
                      이름<span className="text-red-500">*</span>
                    </label>
                    <input type="text" value={name} readOnly className="w-full px-3 py-2 rounded bg-gray-300 text-black" />
                  </div>

                  <div>
                    <label className="block text-black font-semibold mb-1">
                      이메일<span className="text-red-500">*</span>
                    </label>
                    <input type="email" value={email} readOnly
                      className={`w-full px-3 py-2 rounded text-black bg-gray-300`} />
                  </div>

                  <div>
                    <label className="block text-black font-semibold mb-1">
                      닉네임<span className="text-red-500">*</span>
                    </label>
                    <input type="text" value={tempNickName} readOnly={!isEdit} onChange={(e) => setTempNickName(e.target.value)}
                      className={`w-full px-3 py-2 rounded text-black ${isEdit ? 'bg-gray-100 cursor-text' : 'bg-gray-300'}`} />
                  </div>
                  <div>
                    <label className="block text-black font-semibold mb-1">
                      권한<span className="text-red-500">*</span>
                    </label>
                    <input type="text" value={role} readOnly className="w-full px-3 py-2 rounded bg-gray-300 text-black" />
                  </div>

                  <div className="mt-4 flex justify-end flex-wrap gap-2">
                    {isEdit ? (
                      <>
                        <button type="button" onClick={() => updateUser()} className="bg-green-600 hover:bg-green-700 text-white md:px-4 md:py-2 rounded max-md:text-sm max-md:py-1 max-md:px-2">
                          수정 완료
                        </button>
                        <button type="button" onClick={() => resetEdit()} className="bg-gray-500 hover:bg-gray-600 text-white md:px-4 md:py-2 rounded max-md:text-sm max-md:py-1 max-md:px-2">
                          정보 수정 취소
                        </button>
                      </>
                    ) : (
                      <>
                        <button type="button" onClick={() => setIsEdit(true)} className="bg-blue-600 hover:bg-blue-700 text-white md:px-4 md:py-2 rounded whitespace-nowrap max-md:text-sm max-md:py-1 max-md:px-2">
                          정보 수정
                        </button>
                        <button type="button" onClick={() => setIsChangePassword(true)} className="bg-red-600 hover:bg-red-700 text-white md:px-4 md:py-2 rounded whitespace-nowrap max-md:text-sm max-md:py-1 max-md:px-2">
                          비밀번호 변경
                        </button>
                        <button type="button" onClick={() => openDeleteModal()} className="bg-red-500 hover:bg-red-600 text-white md:px-4 md:py-2 rounded whitespace-nowrap max-md:text-sm max-md:py-1 max-md:px-2">
                          회원 탈퇴
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </form>
            {showDeleteModal && (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white text-black p-6 rounded-xl shadow-xl w-full max-w-sm max-md:mx-3">
                  <h3 className="text-lg font-semibold mb-4">회원 탈퇴 확인</h3>
                  <p className="mb-6">정말 회원 탈퇴하시겠습니까?<br />탈퇴하면 모든 정보가 삭제됩니다.</p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={closeDeleteModal}
                      className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded max-md:text-sm max-md:py-1 max-md:px-2"
                    >
                      취소
                    </button>
                    <button
                      onClick={confirmDeleteUser}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded max-md:text-sm max-md:py-1 max-md:px-2"
                    >
                      탈퇴하기
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoModal;