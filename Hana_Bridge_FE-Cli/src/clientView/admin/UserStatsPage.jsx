import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaChartLine, FaFileAlt, FaComments, FaHeart, FaQuestionCircle, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { AdminService } from '../../service/AdminService';

const UserStatsPage = () => {
  const navigate = useNavigate();
  const userRole = useSelector((state) => state.user.role);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 1234,
    newUsersThisMonth: 89,
    activeUsers: 567,
    userGrowth: [
      { month: '1월', users: 120 },
      { month: '2월', users: 145 },
      { month: '3월', users: 178 },
      { month: '4월', users: 203 },
      { month: '5월', users: 234 },
      { month: '6월', users: 267 }
    ],
    topPosters: [
      { name: '개발자1', posts: 45, comments: 123, likes: 234 },
      { name: '개발자2', posts: 38, comments: 98, likes: 187 },
      { name: '개발자3', posts: 32, comments: 76, likes: 156 },
      { name: '개발자4', posts: 28, comments: 65, likes: 134 },
      { name: '개발자5', posts: 25, comments: 54, likes: 112 }
    ],
    userActivity: {
      daily: 234,
      weekly: 567,
      monthly: 890
    },
    questionUsage: {
      totalQuestions: 1234,
      totalSummaries: 567,
      averagePerUser: 2.3
    }
  });

  // 관리자가 아닌 경우 접근 차단
  useEffect(() => {
    if (userRole !== 'ROLE_ADMIN') {
      navigate('/');
      return;
    }
    fetchUserStats();
  }, [userRole, navigate]);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 실제 API 호출이 구현되면 여기서 데이터를 가져옴
      // const userStatsData = await AdminService.getUserStats();
      // setStats(userStatsData);
      
      // 임시로 로딩 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error('사용자 통계 데이터 로딩 실패:', error);
      setError('사용자 통계 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: '개요', icon: FaUsers },
    { id: 'posts', label: '게시글 통계', icon: FaFileAlt },
    { id: 'comments', label: '댓글 통계', icon: FaComments },
    { id: 'likes', label: '좋아요 통계', icon: FaHeart },
    { id: 'usage', label: '질문/요약 통계', icon: FaQuestionCircle }
  ];

  const timeRanges = [
    { value: 'all', label: '전체 기간' },
    { value: 'monthly', label: '월별' },
    { value: 'weekly', label: '주별' },
    { value: 'daily', label: '일간' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">사용자 통계 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-screen bg-gray-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">사용자 통계</h1>
              <p className="text-gray-600">사용자 활동 및 참여도 통계를 확인할 수 있습니다.</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/admin')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <span>관리자 홈</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </motion.button>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </motion.div>

        {/* 주요 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <FaUsers className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 사용자 수</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <FaCalendarAlt className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">이번 달 신규 가입</p>
                <p className="text-2xl font-bold text-gray-900">{stats.newUsersThisMonth}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <FaChartLine className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">활성 사용자</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <FaQuestionCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">평균 질문/요약</p>
                <p className="text-2xl font-bold text-gray-900">{stats.questionUsage.averagePerUser}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* 시간 범위 선택 */}
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-sm font-medium text-gray-700">조회 기간:</span>
              <div className="flex space-x-2">
                {timeRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setTimeRange(range.value)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      timeRange === range.value
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 탭별 콘텐츠 */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* 사용자 성장 차트 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">사용자 성장 추이</h3>
                  <div className="grid grid-cols-6 gap-4">
                    {stats.userGrowth.map((item, index) => (
                      <div key={item.month} className="text-center">
                        <div className="bg-purple-500 rounded-t-lg" style={{ height: `${(item.users / 300) * 100}px` }}></div>
                        <p className="text-xs text-gray-600 mt-2">{item.month}</p>
                        <p className="text-sm font-medium">{item.users}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 상위 활동 사용자 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">상위 활동 사용자</h3>
                  <div className="space-y-3">
                    {stats.topPosters.map((user, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-purple-600">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600">게시글 {user.posts}개 • 댓글 {user.comments}개 • 좋아요 {user.likes}개</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'posts' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">일간 게시글</h4>
                    <p className="text-3xl font-bold text-blue-600">{stats.userActivity.daily}</p>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">주간 게시글</h4>
                    <p className="text-3xl font-bold text-green-600">{stats.userActivity.weekly}</p>
                  </div>
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">월간 게시글</h4>
                    <p className="text-3xl font-bold text-purple-600">{stats.userActivity.monthly}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'comments' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="text-center py-12">
                  <FaComments className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">댓글 통계</h3>
                  <p className="text-gray-600">댓글 작성 통계 데이터가 여기에 표시됩니다.</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'likes' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="text-center py-12">
                  <FaHeart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">좋아요 통계</h3>
                  <p className="text-gray-600">좋아요 통계 데이터가 여기에 표시됩니다.</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'usage' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-orange-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-orange-900 mb-2">총 질문 수</h4>
                    <p className="text-3xl font-bold text-orange-600">{stats.questionUsage.totalQuestions.toLocaleString()}</p>
                  </div>
                  <div className="bg-red-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-red-900 mb-2">총 요약 수</h4>
                    <p className="text-3xl font-bold text-red-600">{stats.questionUsage.totalSummaries.toLocaleString()}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">사용자별 질문/요약 사용량</h4>
                  <div className="space-y-3">
                    {stats.topPosters.slice(0, 5).map((user, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium">{user.name}</span>
                        <div className="flex space-x-4">
                          <span className="text-sm text-gray-600">질문: {Math.floor(Math.random() * 20) + 5}회</span>
                          <span className="text-sm text-gray-600">요약: {Math.floor(Math.random() * 15) + 3}회</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStatsPage; 