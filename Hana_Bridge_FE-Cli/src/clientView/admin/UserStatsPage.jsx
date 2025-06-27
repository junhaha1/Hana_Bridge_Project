import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaComments, FaQuestionCircle, FaCalendarAlt, FaCalendar, FaRobot, FaCode, FaChartBar, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { AdminService } from '../../service/AdminService';

const UserStatsPage = () => {
  const navigate = useNavigate();
  const userRole = useSelector((state) => state.user.role);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('all');
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [viewType, setViewType] = useState('monthly'); // monthly, weekly, daily
  const [barSort, setBarSort] = useState('recent'); // 'recent' | 'users'
  
  // API에서 받아온 실제 데이터
  const [apiStats, setApiStats] = useState({
    totalUsers: 0,
    newUsersThisMonth: 0,
    totalQuestions: 0,
    totalSummaries: 0,
    totalAssembleArticles: 0,
    totalCodeArticles: 0,
    totalComments: 0,
  });

  // 기간별 사용자 데이터
  const [periodUsers, setPeriodUsers] = useState([]);

  // 관리자가 아닌 경우 접근 차단
  useEffect(() => {
    if (userRole !== 'ROLE_ADMIN') {
      navigate('/');
      return;
    }
    fetchUserStats(true); // 초기 로딩
    
    // 초기 로딩 시 전체 기간(2024-06-26부터 현재까지) 데이터 가져오기
    const today = new Date();
    const startDate = '2024-06-26'; // 전체 기간 시작일
    const endDate = today.toISOString().split('T')[0];
    setStartDate(startDate);
    setEndDate(endDate);
    setTimeRange('all');
    fetchPeriodUsers(startDate, endDate);
  }, [userRole, navigate]);

  const fetchUserStats = async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setStatsLoading(true);
      }
      setError(null);
      
      // 실제 API 호출이 구현되면 여기서 데이터를 가져옴
      const userStatsData = await AdminService.getUserStats();
      setApiStats({
        totalUsers: userStatsData.totalUsers || 0,
        newUsersThisMonth: userStatsData.monthUsers || 0,
        totalQuestions: userStatsData.questionCount || 0,
        totalSummaries: userStatsData.summaryCount || 0,
        totalAssembleArticles: userStatsData.assembleArticle || 0,
        totalCodeArticles: userStatsData.codeArticle || 0,
        totalComments: userStatsData.commentCount || 0,
      });
      
      // 임시로 로딩 시뮬레이션 (초기 로딩은 더 길게, 부분 업데이트는 짧게)
      await new Promise(resolve => setTimeout(resolve, isInitialLoad ? 1000 : 300));
      
    } catch {
      setError('사용자 통계 데이터를 불러오는데 실패했습니다.');
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      } else {
        setStatsLoading(false);
      }
    }
  };

  // 기간별 사용자 데이터 가져오기
  const fetchPeriodUsers = async (start, end) => {
    try {
      setStatsLoading(true);
      const userData = await AdminService.getUserPeriod(start, end);
      setPeriodUsers(userData);
    } catch {
      setError('기간별 사용자 데이터를 불러오는데 실패했습니다.');
    } finally {
      setStatsLoading(false);
    }
  };

  // 사용자 데이터를 월별로 그룹화하는 함수
  const groupUsersByMonth = (users) => {
    if (!Array.isArray(users) || users.length === 0) {
      return [];
    }
    
    const monthlyData = {};
    
    users.forEach((user) => {
      // createdAt이 문자열인 경우 Date 객체로 변환
      let date;
      if (typeof user.createdAt === 'string') {
        date = new Date(user.createdAt);
      } else if (user.createdAt) {
        date = new Date(user.createdAt);
      } else {
        return; // createdAt이 없으면 건너뛰기
      }
      
      if (isNaN(date.getTime())) {
        return; // 유효하지 않은 날짜는 건너뛰기
      }
      
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: `${date.getFullYear()}년 ${date.getMonth() + 1}월`,
          users: 0,
          totalQuestions: 0,
          totalSummaries: 0
        };
      }
      
      monthlyData[monthKey].users += 1;
      monthlyData[monthKey].totalQuestions += user.totalQuestion || 0;
      monthlyData[monthKey].totalSummaries += user.totalSummary || 0;
    });
    
    return Object.values(monthlyData).sort((a, b) => {
      const [yearA, monthA] = [a.month.split('년 ')[0], a.month.split('년 ')[1].replace('월', '')];
      const [yearB, monthB] = [b.month.split('년 ')[0], b.month.split('년 ')[1].replace('월', '')];
      return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
    });
  };

  // 사용자 데이터를 주별로 그룹화하는 함수
  const groupUsersByWeek = (users) => {
    if (!Array.isArray(users) || users.length === 0) {
      return [];
    }
    
    const weeklyData = {};
    
    users.forEach((user) => {
      let date;
      if (typeof user.createdAt === 'string') {
        date = new Date(user.createdAt);
      } else if (user.createdAt) {
        date = new Date(user.createdAt);
      } else {
        return;
      }
      
      if (isNaN(date.getTime())) {
        return;
      }
      
      // 주의 시작일 (일요일)을 기준으로 주 키 생성
      const dayOfWeek = date.getDay();
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - dayOfWeek);
      
      const weekKey = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, '0')}-${String(weekStart.getDate()).padStart(2, '0')}`;
      
      if (!weeklyData[weekKey]) {
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        weeklyData[weekKey] = {
          week: `${weekStart.getMonth() + 1}월 ${weekStart.getDate()}일 ~ ${weekEnd.getMonth() + 1}월 ${weekEnd.getDate()}일`,
          users: 0,
          totalQuestions: 0,
          totalSummaries: 0
        };
      }
      
      weeklyData[weekKey].users += 1;
      weeklyData[weekKey].totalQuestions += user.totalQuestion || 0;
      weeklyData[weekKey].totalSummaries += user.totalSummary || 0;
    });
    
    return Object.values(weeklyData).sort((a, b) => {
      const [monthA, dayA] = [a.week.split('월 ')[0], a.week.split('월 ')[1].split('일')[0]];
      const [monthB, dayB] = [b.week.split('월 ')[0], b.week.split('월 ')[1].split('일')[0]];
      return new Date(2024, monthA - 1, dayA) - new Date(2024, monthB - 1, dayB);
    });
  };

  // 사용자 데이터를 일별로 그룹화하는 함수
  const groupUsersByDay = (users) => {
    if (!Array.isArray(users) || users.length === 0) {
      return [];
    }
    
    const dailyData = {};
    
    users.forEach((user) => {
      let date;
      if (typeof user.createdAt === 'string') {
        date = new Date(user.createdAt);
      } else if (user.createdAt) {
        date = new Date(user.createdAt);
      } else {
        return;
      }
      
      if (isNaN(date.getTime())) {
        return;
      }
      
      const dayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      
      if (!dailyData[dayKey]) {
        dailyData[dayKey] = {
          day: `${date.getMonth() + 1}월 ${date.getDate()}일`,
          users: 0,
          totalQuestions: 0,
          totalSummaries: 0
        };
      }
      
      dailyData[dayKey].users += 1;
      dailyData[dayKey].totalQuestions += user.totalQuestion || 0;
      dailyData[dayKey].totalSummaries += user.totalSummary || 0;
    });
    
    return Object.values(dailyData).sort((a, b) => {
      const [monthA, dayA] = [a.day.split('월 ')[0], a.day.split('월 ')[1].split('일')[0]];
      const [monthB, dayB] = [b.day.split('월 ')[0], b.day.split('월 ')[1].split('일')[0]];
      return new Date(2024, monthA - 1, dayA) - new Date(2024, monthB - 1, dayB);
    });
  };

  // 현재 보기 타입에 따른 데이터 그룹화 함수
  const getGroupedData = () => {
    switch (viewType) {
      case 'weekly':
        return groupUsersByWeek(periodUsers);
      case 'daily':
        return groupUsersByDay(periodUsers);
      default:
        return groupUsersByMonth(periodUsers);
    }
  };

  const handleDateRangeChange = (range) => {
    setTimeRange(range);
    setShowDatePicker(false);
    
    // 미리 정의된 기간 설정
    const today = new Date();
    let start, end;
    
    switch (range) {
      case 'daily':
        start = new Date(today);
        end = new Date(today);
        break;
      case 'weekly':
        start = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        end = new Date(today);
        break;
      case 'monthly':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today);
        break;
      case 'custom':
        setShowDatePicker(true);
        return;
      default: // 'all'
        start = new Date('2024-06-26'); // 전체 기간 시작일
        end = new Date(today);
        break;
    }
    
    if (start && end) {
      setStartDate(start.toISOString().split('T')[0]);
      setEndDate(end.toISOString().split('T')[0]);
    } else {
      setStartDate('');
      setEndDate('');
    }
    
    // 날짜가 변경되면 기간별 사용자 데이터와 통계 데이터를 다시 로드
    if (range !== 'custom') {
      if (start && end) {
        fetchPeriodUsers(start.toISOString().split('T')[0], end.toISOString().split('T')[0]);
      }
      fetchUserStats(false);
    }
  };

  const handleCustomDateSubmit = () => {
    if (startDate && endDate) {
      setShowDatePicker(false);
      fetchPeriodUsers(startDate, endDate);
      fetchUserStats(false); // 부분 업데이트
    }
  };

  const tabs = [
    { id: 'overview', label: '신규 사용자 가입 추이', icon: FaUsers }
  ];

  const timeRanges = [
    { value: 'all', label: '전체 기간' },
    { value: 'monthly', label: '이번 달' },
    { value: 'weekly', label: '최근 7일' },
    { value: 'daily', label: '오늘' },
    { value: 'custom', label: '사용자 지정' }
  ];

  // 현재 월 텍스트
  const now = new Date();
  const currentMonthLabel = `${now.getMonth() + 1}월 신규 가입`;

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
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 whitespace-nowrap min-w-0 max-w-[120px] text-sm"
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
        <div className="space-y-6 mb-8">
          {/* 첫 번째 줄: 기본 통계 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-md p-6 relative"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100">
                  <FaUsers className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">총 사용자 수</p>
                  <p className="text-2xl font-bold text-gray-900">{apiStats.totalUsers.toLocaleString()}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-md p-6 relative"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <FaCalendarAlt className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{currentMonthLabel}</p>
                  <p className="text-2xl font-bold text-gray-900">{apiStats.newUsersThisMonth}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-md p-6 relative"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-orange-100">
                  <FaQuestionCircle className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">총 질문 수</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {apiStats.totalQuestions.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    (1인당 평균 {apiStats.totalUsers > 0 ? (apiStats.totalQuestions / apiStats.totalUsers).toFixed(1) : 0}개)
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white rounded-lg shadow-md p-6 relative"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100">
                  <FaComments className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">총 요약 수</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {apiStats.totalSummaries.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    (1인당 평균 {apiStats.totalUsers > 0 ? (apiStats.totalSummaries / apiStats.totalUsers).toFixed(1) : 0}개)
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 두 번째 줄: 사용자 비율 통계 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-md p-6 relative"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <FaRobot className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">AI 답변 포스팅</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {apiStats.totalAssembleArticles.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    (1인당 평균 {apiStats.totalUsers > 0 ? (apiStats.totalAssembleArticles / apiStats.totalUsers).toFixed(1) : 0}개)
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg shadow-md p-6 relative"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-indigo-100">
                  <FaCode className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">코드/질문 작성</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {apiStats.totalCodeArticles.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    (1인당 평균 {apiStats.totalUsers > 0 ? (apiStats.totalCodeArticles / apiStats.totalUsers).toFixed(1) : 0}개)
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-lg shadow-md p-6 relative"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-teal-100">
                  <FaComments className="h-6 w-6 text-teal-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">댓글 작성</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {apiStats.totalComments.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    (1인당 평균 {apiStats.totalUsers > 0 ? (apiStats.totalComments / apiStats.totalUsers).toFixed(1) : 0}개)
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
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
            {/* 탭별 콘텐츠 */}
            <div className="relative">
              {statsLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg z-10">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600">데이터 업데이트 중...</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {/* 시간 범위 선택 */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-6 space-y-2 sm:space-y-0">
                    <span className="text-sm font-medium text-gray-700">조회 기간:</span>
                    {/* 첫 번째 그룹: 사용자 지정 제외 */}
                    <div className="flex space-x-2 overflow-x-auto no-scrollbar">
                      {timeRanges.filter(r => r.value !== 'custom').map((range) => (
                        <button
                          key={range.value}
                          onClick={() => handleDateRangeChange(range.value)}
                          disabled={statsLoading}
                          className={`px-3 py-1 text-sm rounded-md transition-colors whitespace-nowrap flex-shrink-0 max-w-[120px] ${
                            timeRange === range.value
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          } ${statsLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                    {/* 두 번째 그룹: 사용자 지정만 모바일에서 아래로 */}
                    <div className="flex space-x-2 mt-2 sm:mt-0 sm:ml-2">
                      {timeRanges.filter(r => r.value === 'custom').map((range) => (
                        <button
                          key={range.value}
                          onClick={() => handleDateRangeChange(range.value)}
                          disabled={statsLoading}
                          className={`px-3 py-1 text-sm rounded-md transition-colors whitespace-nowrap flex-shrink-0 max-w-[120px] ${
                            timeRange === range.value
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          } ${statsLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                    {(startDate || endDate) && (
                      <div className="flex items-center space-x-2 sm:ml-4 mt-2 sm:mt-0">
                        <FaCalendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {startDate && endDate ? `${startDate} ~ ${endDate}` : '날짜 선택 중...'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 보기 타입 선택 */}
                  <div className="flex items-center space-x-4 mb-6">
                    <span className="text-sm font-medium text-gray-700">보기 타입:</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setViewType('monthly')}
                        disabled={statsLoading}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                          viewType === 'monthly'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        } ${statsLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        월별
                      </button>
                      <button
                        onClick={() => setViewType('weekly')}
                        disabled={statsLoading}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                          viewType === 'weekly'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        } ${statsLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        주별
                      </button>
                      <button
                        onClick={() => setViewType('daily')}
                        disabled={statsLoading}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                          viewType === 'daily'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        } ${statsLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        일별
                      </button>
                    </div>
                  </div>

                  {/* 사용자 지정 날짜 선택기 */}
                  {showDatePicker && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 rounded-lg p-4 mb-6"
                    >
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full">
                        <div className="flex items-center space-x-2 w-full">
                          <label className="text-sm font-medium text-gray-700">시작일:</label>
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-0 w-full"
                          />
                        </div>
                        <div className="flex items-center space-x-2 w-full">
                          <label className="text-sm font-medium text-gray-700">종료일:</label>
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min={startDate}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-0 w-full"
                          />
                        </div>
                        <button
                          onClick={handleCustomDateSubmit}
                          disabled={!startDate || !endDate || statsLoading}
                          className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
                        >
                          {statsLoading ? '업데이트 중...' : '적용'}
                        </button>
                        <button
                          onClick={() => setShowDatePicker(false)}
                          disabled={statsLoading}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
                        >
                          취소
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* 사용자 성장 차트 */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        신규 사용자 가입 추이 ({viewType === 'monthly' ? '월별' : viewType === 'weekly' ? '주별' : '일별'})
                      </h3>
                      <div className="flex flex-row items-center">
                        <div className="flex bg-gray-100 rounded-full shadow-inner p-1 gap-1">
                          <button
                            className={`flex items-center gap-1 px-2 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 border-none outline-none focus:ring-2 focus:ring-purple-300 whitespace-nowrap min-w-0 max-w-[90px] flex-shrink-0
                              ${barSort === 'recent' ? 'bg-gradient-to-r from-purple-500 to-purple-400 text-white shadow-md scale-105' : 'bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-700'}`}
                            onClick={() => setBarSort('recent')}
                            style={{ boxShadow: barSort === 'recent' ? '0 2px 8px 0 rgba(139,92,246,0.15)' : undefined }}
                          >
                            <FaClock className="w-4 h-4" />
                            최근순
                          </button>
                          <button
                            className={`flex items-center gap-1 px-2 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 border-none outline-none focus:ring-2 focus:ring-purple-300 whitespace-nowrap min-w-0 max-w-[90px] flex-shrink-0
                              ${barSort === 'users' ? 'bg-gradient-to-r from-purple-500 to-purple-400 text-white shadow-md scale-105' : 'bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-700'}`}
                            onClick={() => setBarSort('users')}
                            style={{ boxShadow: barSort === 'users' ? '0 2px 8px 0 rgba(139,92,246,0.15)' : undefined }}
                          >
                            <FaUsers className="w-4 h-4" />
                            사용자순
                          </button>
                        </div>
                      </div>
                    </div>
                    {periodUsers && periodUsers.length > 0 ? (
                      <div className="max-h-72 overflow-y-auto customScroll">
                        <div className="grid grid-cols-6 gap-4 items-end">
                          {(() => {
                            let grouped = getGroupedData();
                            const maxCount = Math.max(...grouped.map(g => g.users));
                            // 정렬 적용
                            if (barSort === 'users') {
                              grouped = [...grouped].sort((a, b) => b.users - a.users);
                            } else {
                              grouped = [...grouped].reverse(); // 최근순(기본은 오래된순)
                            }
                            return grouped.map((item, index) => (
                              <motion.div 
                                key={index} 
                                className="text-center flex flex-col items-center justify-end h-full"
                                initial={{ opacity: 0, scaleY: 0 }}
                                animate={{ opacity: 1, scaleY: 1 }}
                                transition={{ 
                                  duration: 0.6, 
                                  delay: index * 0.1,
                                  ease: "easeOut"
                                }}
                              >
                                <motion.div 
                                  className="bg-purple-500 rounded-t-lg w-6 origin-bottom" 
                                  style={{ 
                                    height: `${Math.max(20, (item.users / (maxCount || 1)) * 100)}px` 
                                  }}
                                  initial={{ scaleY: 0 }}
                                  animate={{ scaleY: 1 }}
                                  transition={{ 
                                    duration: 0.8, 
                                    delay: index * 0.1 + 0.2,
                                    ease: "easeOut"
                                  }}
                                />
                                <motion.p 
                                  className="text-sm font-medium mt-2"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ 
                                    duration: 0.4, 
                                    delay: index * 0.1 + 0.8
                                  }}
                                >
                                  {item.users}명
                                </motion.p>
                                <motion.p 
                                  className="text-xs text-gray-600 mt-1"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ 
                                    duration: 0.4, 
                                    delay: index * 0.1 + 0.6
                                  }}
                                >
                                  {item.month || item.week || item.day}
                                </motion.p>
                              </motion.div>
                            ));
                          })()}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FaChartBar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>선택된 기간의 데이터가 없습니다.</p>
                        <p className="text-sm text-gray-400 mt-2">다른 기간을 선택해보세요.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStatsPage; 