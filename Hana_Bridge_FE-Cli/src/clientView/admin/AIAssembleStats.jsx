import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaChartBar, FaRobot, FaThumbsUp, FaComment, FaCalendarAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminService } from '../../service/AdminService';

const AIAssembleStats = () => {
  const navigate = useNavigate();
  const userRole = useSelector((state) => state.user.role);
  const [totalAssemblePosts, setTotalAssemblePosts] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [stats, setStats] = useState({
    monthlyTrend: [],
    weeklyTrend: [],
    dailyTrend: [],
    topPosts: [],
    categoryDistribution: {
      parentCategories: [],
      childCategories: {}
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assemblePosts, setAssemblePosts] = useState([]);
  
  // 기간 필터링 상태
  const [periodType, setPeriodType] = useState('monthly'); // 'monthly', 'weekly', 'daily'
  const [selectedPeriod, setSelectedPeriod] = useState({
    startDate: '',
    endDate: ''
  });

  // 카테고리 토글 상태
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  // 트렌드 정렬 상태
  const [trendSort, setTrendSort] = useState('date'); // 'date' | 'ratio'

  // 카테고리 분포 정렬 상태
  const [categorySort, setCategorySort] = useState('desc'); // 'desc' | 'asc'

  // 상위 카테고리 9개 고정 배열
  const FIXED_PARENT_CATEGORIES = [
    { id: 1, name: '프로그래밍 언어' },
    { id: 2, name: '운영체제' },
    { id: 3, name: '데이터베이스' },
    { id: 4, name: '프레임워크' },
    { id: 5, name: '클라우드' },
    { id: 6, name: '인프라' },
    { id: 7, name: '알고리즘 & 자료구조' },
    { id: 8, name: '협업 & 도구' },
    { id: 9, name: '기타' },
  ];

  // 하위 카테고리 고정 배열
  const FIXED_CHILD_CATEGORIES = [
    { id: 10, name: 'Python', parentId: 1 },
    { id: 11, name: 'Java', parentId: 1 },
    { id: 12, name: 'JavaScript', parentId: 1 },
    { id: 13, name: 'TypeScript', parentId: 1 },
    { id: 14, name: 'C / C++', parentId: 1 },
    { id: 15, name: '기타 언어', parentId: 1 },
    { id: 16, name: 'Linux', parentId: 2 },
    { id: 17, name: 'Ubuntu', parentId: 2 },
    { id: 18, name: 'CentOS', parentId: 2 },
    { id: 19, name: '기타 Linux 배포판', parentId: 2 },
    { id: 20, name: 'Windows', parentId: 2 },
    { id: 21, name: 'macOS', parentId: 2 },
    { id: 22, name: 'WSL (Windows Subsystem for Linux)', parentId: 2 },
    { id: 23, name: 'SQL 쿼리', parentId: 3 },
    { id: 24, name: 'MySQL', parentId: 3 },
    { id: 25, name: 'Oracle', parentId: 3 },
    { id: 26, name: 'PostgreSQL', parentId: 3 },
    { id: 27, name: 'NoSQL', parentId: 3 },
    { id: 28, name: 'React', parentId: 4 },
    { id: 29, name: 'Spring Boot', parentId: 4 },
    { id: 30, name: 'Django', parentId: 4 },
    { id: 31, name: 'Vue.js', parentId: 4 },
    { id: 32, name: 'Next.js', parentId: 4 },
    { id: 33, name: 'Flask', parentId: 4 },
    { id: 34, name: 'AWS', parentId: 5 },
    { id: 35, name: 'KT Cloud', parentId: 5 },
    { id: 36, name: 'Azure', parentId: 5 },
    { id: 37, name: 'Docker / 컨테이너', parentId: 6 },
    { id: 38, name: 'Kubernetes', parentId: 6 },
    { id: 39, name: 'Nginx / Apache', parentId: 6 },
    { id: 40, name: 'CI/CD', parentId: 6 },
    { id: 41, name: 'DevOps', parentId: 6 },
    { id: 42, name: '코딩 테스트', parentId: 7 },
    { id: 43, name: '알고리즘 이론', parentId: 7 },
    { id: 44, name: 'Git / GitHub', parentId: 8 },
    { id: 45, name: '기타 문서', parentId: 9 },
  ];

  // 관리자가 아닌 경우 접근 차단
  useEffect(() => {
    if (userRole !== 'ROLE_ADMIN') {
      navigate('/');
      return;
    }
    fetchAssembleStats();
  }, [userRole, navigate]);

  // 기간 변경 시 통계 다시 불러오기
  useEffect(() => {
    if (selectedPeriod.startDate && selectedPeriod.endDate) {
      fetchAssemblePosts();
    }
  }, [selectedPeriod]);

  const fetchAssemblePosts = async () => {
    try {
      const response = await AdminService.getTodayPosts("assemble", selectedPeriod.startDate, selectedPeriod.endDate);
      setAssemblePosts(Array.isArray(response) ? response : []);
    } catch {
      setAssemblePosts([]);
      setError('게시글 데이터를 불러오는데 실패했습니다.');
    }
  }

  const fetchAssembleStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await AdminService.getAssembleStats();
      setTotalAssemblePosts(response.assembleCount || 0);
      setTotalLikes(response.likeCount || 0);
      setStats({
        monthlyTrend: response.monthlyTrend || [],
        weeklyTrend: response.weeklyTrend || [],
        dailyTrend: response.dailyTrend || [],
        topPosts: response.topPosts || [],
        categoryDistribution: response.categoryDistribution || { parentCategories: [], childCategories: {} }
      });
    } catch {
      setError('통계 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 트렌드 차트용 그룹핑 함수
  const getTrendGroups = () => {
    if (!assemblePosts.length) return [];
    const groups = {};
    if (periodType === 'monthly') {
      assemblePosts.forEach(post => {
        const date = new Date(post.createAt || post.date);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(post);
      });
    } else if (periodType === 'weekly') {
      assemblePosts.forEach(post => {
        const date = new Date(post.createAt || post.date);
        const tempDate = new Date(date.getTime());
        tempDate.setHours(0,0,0,0);
        tempDate.setDate(tempDate.getDate() - (tempDate.getDay() === 0 ? 6 : tempDate.getDay() - 1));
        const year = tempDate.getFullYear();
        const week = Math.ceil((((date - new Date(year,0,1)) / 86400000) + new Date(year,0,1).getDay()+1)/7);
        const key = `${year}-W${String(week).padStart(2, '0')}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(post);
      });
    } else {
      assemblePosts.forEach(post => {
        const date = new Date(post.createAt || post.date);
        const key = date.toISOString().slice(0, 10);
        if (!groups[key]) groups[key] = [];
        groups[key].push(post);
      });
    }
    // 결과를 정렬
    let sorted = Object.entries(groups).map(([key, posts]) => ({ key, count: posts.length }));
    if (trendSort === 'date') {
      sorted = sorted.sort((a, b) => b.key.localeCompare(a.key)); // 최신순
    } else if (trendSort === 'ratio') {
      const total = assemblePosts.length;
      sorted = sorted.sort((a, b) => (b.count / total) - (a.count / total)); // 비율순
    }
    return sorted;
  };

  // 인기 게시글(좋아요순) - assemblePosts 기준
  const getSortedAssemblePostsByLikes = () => {
    return [...assemblePosts].sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
  };

  // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오기
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 한 달 전 날짜를 YYYY-MM-DD 형식으로 가져오기
  const getOneMonthAgoDate = () => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const year = oneMonthAgo.getFullYear();
    const month = String(oneMonthAgo.getMonth() + 1).padStart(2, '0');
    const day = String(oneMonthAgo.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 1년 전 날짜를 YYYY-MM-DD 형식으로 가져오기
  const getOneYearAgoDate = () => {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const year = oneYearAgo.getFullYear();
    const month = String(oneYearAgo.getMonth() + 1).padStart(2, '0');
    const day = String(oneYearAgo.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 현재 assemblePosts에서 카테고리별 통계 계산
  const getCategoryStats = () => {
    // 상위 카테고리별 카운트 (하위 카테고리 합산)
    const parentCounts = {};
    // 하위 카테고리별 카운트
    const childCounts = {};
    let total = 0;
    assemblePosts.forEach(post => {
      const parent = post.parentName;
      const child = post.categoryName;
      if (child) {
        childCounts[child] = (childCounts[child] || 0) + 1;
        total++;
      }
    });
    // 상위 카테고리별 합산
    FIXED_PARENT_CATEGORIES.forEach(parentCat => {
      const childList = FIXED_CHILD_CATEGORIES.filter(child => child.parentId === parentCat.id);
      parentCounts[parentCat.name] = childList.reduce((sum, child) => sum + (childCounts[child.name] || 0), 0);
    });
    return { parentCounts, childCounts, total };
  };
  const { parentCounts, childCounts, total: categoryTotal } = getCategoryStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">AI답변 통계 데이터를 불러오는 중...</p>
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/admin')}
                className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors duration-200"
              >
                <FaArrowLeft className="w-4 h-4" />
              </motion.button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">AI답변 상세 통계</h1>
                <p className="text-gray-600">AI답변 게시글의 상세한 통계 정보를 확인할 수 있습니다.</p>
              </div>
            </div>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </motion.div>

        {/* 주요 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[
            {
              title: '총 AI답변 게시글',
              value: totalAssemblePosts,
              icon: FaRobot,
              color: 'bg-purple-500',
              bgColor: 'bg-purple-100'
            },
            {
              title: '총 좋아요',
              value: totalLikes,
              icon: FaThumbsUp,
              color: 'bg-green-500',
              bgColor: 'bg-green-100'
            }
          ].map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
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
            </motion.div>
          ))}
        </div>

        {/* 기간 필터링 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <div className="flex items-center mb-6">
            <FaCalendarAlt className="h-6 w-6 text-purple-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">기간 설정</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 기간 타입 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">기간 타입</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="monthly"
                    checked={periodType === 'monthly'}
                    onChange={(e) => setPeriodType(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">월별</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="weekly"
                    checked={periodType === 'weekly'}
                    onChange={(e) => setPeriodType(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">주별</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="daily"
                    checked={periodType === 'daily'}
                    onChange={(e) => setPeriodType(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">일자별</span>
                </label>
              </div>
            </div>

            {/* 날짜 범위 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">날짜 범위</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={selectedPeriod.startDate}
                  onChange={(e) => setSelectedPeriod(prev => ({ ...prev, startDate: e.target.value }))}
                  max={selectedPeriod.endDate || getTodayDate()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="시작일"
                />
                <span className="flex items-center text-gray-500">~</span>
                <input
                  type="date"
                  value={selectedPeriod.endDate}
                  onChange={(e) => setSelectedPeriod(prev => ({ ...prev, endDate: e.target.value }))}
                  min={selectedPeriod.startDate}
                  max={getTodayDate()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="종료일"
                />
              </div>
            </div>
          </div>

          {/* 빠른 선택 버튼 */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedPeriod({ startDate: getOneMonthAgoDate(), endDate: getTodayDate() })}
              className="px-4 py-2 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
            >
              최근 1개월
            </button>
            <button
              onClick={() => {
                const today = new Date();
                const weekAgo = new Date();
                weekAgo.setDate(today.getDate() - 7);
                setSelectedPeriod({
                  startDate: weekAgo.toISOString().split('T')[0],
                  endDate: today.toISOString().split('T')[0]
                });
              }}
              className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              최근 1주일
            </button>
            <button
              onClick={() => setSelectedPeriod({ startDate: getOneYearAgoDate(), endDate: getTodayDate() })}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              전체 기간
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 트렌드 차트 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center mb-6">
              <FaChartBar className="h-6 w-6 text-purple-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">
                {periodType === 'monthly' ? '월별' : periodType === 'weekly' ? '주별' : '일자별'} 트렌드
              </h2>
              <span className="ml-4 text-sm text-gray-500">해당 기간 게시글 수: {assemblePosts.length}개</span>
              <div className="ml-4 flex flex-row gap-1">
                <button
                  className={`px-2 py-0.5 rounded text-xs border ${trendSort === 'date' ? 'bg-purple-500 text-white border-purple-500' : 'bg-white text-gray-700 border-gray-300'}`}
                  onClick={() => setTrendSort('date')}
                >최신순</button>
                <button
                  className={`px-2 py-0.5 rounded text-xs border ${trendSort === 'ratio' ? 'bg-purple-500 text-white border-purple-500' : 'bg-white text-gray-700 border-gray-300'}`}
                  onClick={() => setTrendSort('ratio')}
                >비율순</button>
              </div>
            </div>
            
            <div className="space-y-4 max-h-[26rem] overflow-y-auto pr-2">
              {getTrendGroups().length > 0 ? (
                getTrendGroups().map((item, index) => {
                  const maxCount = Math.max(...getTrendGroups().map(g => g.count));
                  return (
                    <div key={item.key} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 w-40">
                        {periodType === 'monthly' ? `${item.key.split('-')[0]}년 ${item.key.split('-')[1]}월` :
                         periodType === 'weekly' ? (() => {
                           const [year, weekStr] = item.key.split('-W');
                           const week = parseInt(weekStr, 10);
                           // 주의 시작일 계산 (월요일 기준)
                           const firstDayOfYear = new Date(Number(year), 0, 1);
                           const dayOfWeek = firstDayOfYear.getDay() === 0 ? 7 : firstDayOfYear.getDay();
                           const mondayOfFirstWeek = new Date(firstDayOfYear);
                           mondayOfFirstWeek.setDate(firstDayOfYear.getDate() + (dayOfWeek <= 4 ? 1 - dayOfWeek : 8 - dayOfWeek));
                           const startDate = new Date(mondayOfFirstWeek);
                           startDate.setDate(mondayOfFirstWeek.getDate() + (week - 1) * 7);
                           const endDate = new Date(startDate);
                           endDate.setDate(startDate.getDate() + 6);
                           const startStr = `${startDate.getMonth() + 1}.${startDate.getDate()}`;
                           const endStr = `${endDate.getMonth() + 1}.${endDate.getDate()}`;
                           return `${year}년 ${week}주 (${startStr}~${endStr})`;
                         })() :
                         item.key}
                      </span>
                      <div className="flex-1 mx-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>게시글: {item.count}</span>
                          <span>{assemblePosts.length > 0 ? `비율: ${(item.count / assemblePosts.length * 100).toFixed(1)}%` : ''}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${maxCount > 0 ? (item.count / maxCount) * 100 : 0}%` }}
                            transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                            className="h-2 rounded-full bg-purple-500"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaChartBar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>선택한 기간에 해당하는 데이터가 없습니다.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* 카테고리 분포 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center mb-6">
              <FaChartBar className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">카테고리 분포</h2>
              <div className="ml-4 flex flex-row gap-1">
                <button
                  className={`px-2 py-0.5 rounded text-xs border ${categorySort === 'desc' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300'}`}
                  onClick={() => setCategorySort('desc')}
                >비율순(내림차순)</button>
                <button
                  className={`px-2 py-0.5 rounded text-xs border ${categorySort === 'asc' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300'}`}
                  onClick={() => setCategorySort('asc')}
                >비율순(오름차순)</button>
              </div>
            </div>
            
            <div className="space-y-2 pr-2 h-[26rem] overflow-y-auto">
              {[...FIXED_PARENT_CATEGORIES]
                .map((cat, i) => {
                  // 비율 계산 동일하게 적용
                  const percentage = categoryTotal > 0 ? Math.round((parentCounts[cat.name] || 0) / categoryTotal * 100) : 0;
                  return { ...cat, _percentage: percentage, _origIndex: i };
                })
                .sort((a, b) => categorySort === 'desc' ? b._percentage - a._percentage : a._percentage - b._percentage)
                .map((category, index) => {
                  const percentage = category._percentage;
                  const isExpanded = expandedCategories.has(category.id);
                  const handleClick = () => {
                    const newSet = new Set(expandedCategories);
                    if (isExpanded) newSet.delete(category.id);
                    else newSet.add(category.id);
                    setExpandedCategories(newSet);
                  };
                  const childList = FIXED_CHILD_CATEGORIES.filter(child => child.parentId === category.id);
                  // 하위 카테고리 퍼센트 정보 (assemblePosts 기준)
                  const childPercentMap = {};
                  childList.forEach(child => {
                    childPercentMap[child.id] = categoryTotal > 0 ? Math.round((childCounts[child.name] || 0) / categoryTotal * 100) : 0;
                  });
                  return (
                    <motion.div key={category.id} className="mb-2" layout>
                      <motion.div
                        className={`bg-white rounded-lg shadow-md transition-shadow border-2 ${isExpanded ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:shadow-lg'}`}
                        layout
                      >
                        <div className="flex items-center p-4 cursor-pointer" onClick={handleClick}>
                          <span className="w-40 text-sm font-medium text-gray-700">{category.name}</span>
                          <span className="w-12 text-right text-sm text-gray-500">{percentage}%</span>
                          <div className="flex-1 ml-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                                className="h-2 rounded-full bg-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              key="child-list"
                              initial={{ opacity: 0, scaleY: 0 }}
                              animate={{ opacity: 1, scaleY: 1 }}
                              exit={{ opacity: 0, scaleY: 0 }}
                              transition={{ duration: 0.32, ease: 'easeInOut' }}
                              className="px-8 pb-4 origin-top overflow-hidden"
                            >
                              {childList.map((child, childIndex) => {
                                const childPercent = childPercentMap[child.id] || 0;
                                return (
                                  <div key={child.id} className="flex items-center py-1">
                                    <span className="w-40 text-sm text-gray-600">{child.name}</span>
                                    <span className="w-12 text-right text-sm text-gray-400">{childPercent}%</span>
                                    <div className="flex-1 ml-4">
                                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                                        <motion.div
                                          initial={{ width: 0 }}
                                          animate={{ width: `${childPercent}%` }}
                                          transition={{ delay: 0.3 + childIndex * 0.05, duration: 0.6 }}
                                          className="h-1.5 rounded-full bg-blue-400"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </motion.div>
                  );
                })}
            </div>
          </motion.div>
        </div>

        {/* 인기 게시글 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FaComment className="h-6 w-6 text-green-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">인기 AI답변 게시글 (좋아요순)</h2>
            </div>
            {selectedPeriod.startDate && selectedPeriod.endDate && (
              <span className="text-sm text-gray-500">
                {selectedPeriod.startDate} ~ {selectedPeriod.endDate}
              </span>
            )}
          </div>
          
          <div className="space-y-4 max-h-[26rem] overflow-y-auto pr-2">
            {getSortedAssemblePostsByLikes().length > 0 ? (
              getSortedAssemblePostsByLikes().map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`border-l-4 border-gray-200 pl-4 py-3 hover:border-purple-400 transition-colors cursor-pointer border border-gray-200 rounded-lg shadow-md
                    ${index === 0 ? 'bg-yellow-200' : ''}
                    ${index === 1 ? 'bg-gray-200' : ''}
                    ${index === 2 ? 'bg-orange-100' : ''}
                  `}
                  onClick={() => navigate(`/detailAssemble/${post.id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{post.title}</h3>
                      <div className="text-xs text-gray-500 mt-1 w-full overflow-hidden whitespace-nowrap text-ellipsis">
                        {post.content && post.content.length > 50 ? post.content.substring(0, 50) + '...' : post.content}
                      </div>
                      <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <FaThumbsUp className="mr-1" />
                          좋아요: {post.likeCount}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{post.date}</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FaComment className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>선택한 기간에 해당하는 게시글이 없습니다.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AIAssembleStats; 