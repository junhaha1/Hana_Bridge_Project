import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaChartBar, FaFileAlt, FaComments, FaLightbulb, FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { AdminService } from '../../service/AdminService';

const AdminPage = () => {
  const navigate = useNavigate();
  const userRole = useSelector((state) => state.user.role);
  const [activeTab, setActiveTab] = useState('notice');
  const [stats, setStats] = useState({
    totalPosts: 0,
    codePosts: 0,
    assemblePosts: 0,
    noticePosts: 0,
    userCount: 0,
    commentCount: 0,
    likeCount: 0,
  });

  // 오늘 작성된 게시글을 탭별로 분리하여 저장
  const [todayNoticePosts, setTodayNoticePosts] = useState([]); // 공지
  const [todayCodePosts, setTodayCodePosts] = useState([]); // 코드/질문
  const [todayAssemblePosts, setTodayAssemblePosts] = useState([]); // AI답변

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오는 함수
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 관리자가 아닌 경우 접근 차단
  useEffect(() => {
    if (userRole !== 'ROLE_ADMIN') {
      navigate('/');
      return;
    }
    fetchStats();
  }, [userRole, navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // 실제 API 호출 - getStats()만 사용
      const statsData = await AdminService.getStats();
      console.log(statsData);
      
      const today = getTodayDate();
      
      const todayCodePostsData = await AdminService.getTodayPosts("code", today, today);
      const todayAssemblePostsData = await AdminService.getTodayPosts("assemble", today, today);
      const todayNoticePostsData = await AdminService.getTodayPosts("notice", today, today);
      
      console.log(todayCodePostsData);
      console.log(todayAssemblePostsData);
      console.log(todayNoticePostsData);

      // 각 탭별 게시글 데이터 설정
      setTodayNoticePosts(todayNoticePostsData);
      setTodayCodePosts(todayCodePostsData);
      setTodayAssemblePosts(todayAssemblePostsData);
      
      setStats({
        totalPosts: statsData.totalArticle || 0,
        codePosts: statsData.codeArticle || 0,
        assemblePosts: statsData.assembleArticle || 0,
        noticePosts: statsData.noticeArticle || 0,
        userCount: statsData.userCount || 0,
        commentCount: statsData.commentCount || 0,
        likeCount: statsData.likeCount || 0,
      });

    } catch (error) {
      console.error('통계 데이터 로딩 실패:', error);
      setError('통계 데이터를 불러오는데 실패했습니다.');
      
      // 에러 시 임시 데이터로 표시 (오늘 날짜만)
      const mockStats = {
        totalPosts: 156,
        codePosts: 89,
        assemblePosts: 45,
        noticePosts: 22,
        totalComments: 342,
      };
      
      setStats(mockStats);
    } finally {
      setLoading(false);
    }
  };

  // 현재 활성 탭에 따른 게시글 목록 반환
  const getCurrentTabPosts = () => {
    switch (activeTab) {
      case 'notice':
        return todayNoticePosts;
      case 'code':
        return todayCodePosts;
      case 'assemble':
        return todayAssemblePosts;
      default:
        return todayNoticePosts;
    }
  };

  // 탭별 게시글 수 계산
  const getTabCount = (tabType) => {
    switch (tabType) {
      case 'notice':
        return todayNoticePosts.length;
      case 'code':
        return todayCodePosts.length;
      case 'assemble':
        return todayAssemblePosts.length;
      default:
        return 0;
    }
  };

  const statCards = [
    {
      title: '전체 게시글',
      value: stats.totalPosts,
      icon: FaFileAlt,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-100'
    },
    {
      title: '코드/질문 게시글',
      value: stats.codePosts,
      icon: FaComments,
      color: 'bg-green-500',
      bgColor: 'bg-green-100'
    },
    {
      title: 'AI답변 게시글',
      value: stats.assemblePosts,
      icon: FaLightbulb,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-100'
    },
    {
      title: '공지 게시글',
      value: stats.noticePosts,
      icon: FaExclamationTriangle,
      color: 'bg-red-500',
      bgColor: 'bg-red-100'
    }
  ];

  const chartData = [
    { name: '코드/질문', value: stats.codePosts, percentage: ((stats.codePosts / stats.totalPosts) * 100).toFixed(1) },
    { name: 'AI답변', value: stats.assemblePosts, percentage: ((stats.assemblePosts / stats.totalPosts) * 100).toFixed(1) },
    { name: '공지', value: stats.noticePosts, percentage: ((stats.noticePosts / stats.totalPosts) * 100).toFixed(1) }
  ];

  const tabs = [
    { id: 'notice', label: '공지', count: getTabCount('notice') },
    { id: 'code', label: '코드/질문', count: getTabCount('code') },
    { id: 'assemble', label: 'AI답변', count: getTabCount('assemble') }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">통계 데이터를 불러오는 중...</p>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">관리자 대시보드</h1>
              <p className="text-gray-600">전체 게시글 통계 및 현황을 확인할 수 있습니다.</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard/home')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <span>대시보드 홈</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.button>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </motion.div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${
                card.title === 'AI답변 게시글' ? 'cursor-pointer' : ''
              }`}
              onClick={() => {
                if (card.title === 'AI답변 게시글') {
                  navigate('/admin/assemble-stats');
                }
              }}
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${card.bgColor}`}>
                  <card.icon className={`h-6 w-6 ${card.color.replace('bg-', 'text-')}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
              </div>
              {card.title === 'AI답변 게시글' && (
                <div className="mt-3 text-xs text-purple-600 font-medium">
                  클릭하여 상세 통계 보기 →
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 차트 섹션 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center mb-6">
              <FaChartBar className="h-6 w-6 text-purple-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">게시글 종류별 분포</h2>
            </div>
            
            <div className="space-y-4">
              {chartData.map((item, index) => (
                <div key={item.name} className="flex items-center">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{item.name}</span>
                      <span className="text-sm text-gray-500">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-green-500' : 
                          index === 1 ? 'bg-purple-500' : 'bg-red-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 최근 게시글 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center mb-6">
              <FaFileAlt className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">오늘 작성된 게시글</h2>
            </div>
            
            {/* 탭 네비게이션 */}
            <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                    activeTab === tab.id
                      ? 'bg-purple-100 text-purple-600'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
            
            {/* 게시글 목록에 스크롤 추가 (3개 초과일 때만) */}
            <div
              className={`space-y-4 ${getCurrentTabPosts().length > 3 ? 'max-h-56 overflow-y-auto' : ''}`}
            >
              {getCurrentTabPosts().map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="border-l-4 border-gray-200 pl-4 py-2 hover:border-purple-400 transition-colors cursor-pointer"
                  onClick={() => {
                    // TODO: API 연결 시 실제 게시글 타입에 따라 경로 설정
                    if (activeTab === 'assemble') {
                      navigate(`/detailAssemble/${post.id}`);
                    } else if (activeTab === 'code') {
                      navigate(`/detailBoard/${post.id}`);
                    } else {
                      navigate(`/detailBoard/${post.id}`);
                    }
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate w-full">{post.title}</h3>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          activeTab === 'code' ? 'bg-green-100 text-green-800' :
                          activeTab === 'assemble' ? 'bg-purple-100 text-purple-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {activeTab === 'code' ? '코드/질문' :
                           activeTab === 'assemble' ? 'AI답변' : '공지'}
                        </span>
                        <span className="text-xs text-gray-500">{post.nickName}</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{post.createAt?.slice(0, 10)}</span>
                  </div>
                </motion.div>
              ))}
              
              {/* 게시글이 없을 때 표시 */}
              {getCurrentTabPosts().length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-gray-500"
                >
                  <FaFileAlt className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>오늘 작성된 게시글이 없습니다.</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* 사용자 통계 정보 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/admin/user-stats')}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">사용자 통계</h2>
            <div className="text-sm text-purple-600 font-medium flex items-center">
              <span>상세 보기</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.userCount}</p>
              <p className="text-sm text-gray-600">총 사용자 수</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{(stats.userCount / stats.assemblePosts * 100).toFixed(1)}%</p>
              <p className="text-sm text-gray-600">AI 답변 포스팅 사용자 비율</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{(stats.userCount / stats.codePosts * 100).toFixed(1)}%</p>
              <p className="text-sm text-gray-600">코드/질문 작성 사용자 비율</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{(stats.userCount / stats.commentCount * 100).toFixed(1)}%</p>
              <p className="text-sm text-gray-600">댓글 작성 사용자 비율</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{(stats.userCount / stats.likeCount * 100).toFixed(1)}%</p>
              <p className="text-sm text-gray-600">좋아요 사용자 비율</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPage; 