import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaChartBar, FaRobot, FaThumbsUp, FaComment, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
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
    } catch (error) {
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
    } catch (error) {
      console.error('AI답변 통계 데이터 로딩 실패:', error);
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
    // 결과를 최신 날짜(내림차순)로 정렬
    const sorted = Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
    return sorted.map(([key, posts]) => ({ key, count: posts.length }));
  };

  // 기간 필터링된 인기 게시글
  const getFilteredTopPosts = () => {
    let filteredPosts = [...stats.topPosts];
    
    if (selectedPeriod.startDate && selectedPeriod.endDate) {
      filteredPosts = filteredPosts.filter(post => {
        const postDate = new Date(post.date);
        const startDate = new Date(selectedPeriod.startDate);
        const endDate = new Date(selectedPeriod.endDate);
        return postDate >= startDate && postDate <= endDate;
      });
    }
    
    // 좋아요 기준으로 내림차순 정렬
    return filteredPosts.sort((a, b) => b.likes - a.likes);
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
              <span className="ml-4 text-sm text-gray-500">해당 기간 게시글 수: {totalAssemblePosts}개</span>
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
                          <span>{totalAssemblePosts > 0 ? `비율: ${(item.count / totalAssemblePosts * 100).toFixed(1)}%` : ''}</span>
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
            </div>
            
            <div className="space-y-2 pr-2 h-[26rem] overflow-y-auto">
              {stats.categoryDistribution.parentCategories.map((category, index) => {
                const isExpanded = expandedCategories.has(category.id);
                const childCategories = stats.categoryDistribution.childCategories[category.id];
                
                return (
                  <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* 상위 카테고리 */}
                    <div 
                      className="flex items-center cursor-pointer hover:bg-gray-50 p-4 transition-colors"
                      onClick={() => {
                        const newExpanded = new Set(expandedCategories);
                        if (isExpanded) {
                          newExpanded.delete(category.id);
                        } else {
                          newExpanded.add(category.id);
                        }
                        setExpandedCategories(newExpanded);
                      }}
                    >
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{category.name}</span>
                          <span className="text-sm text-gray-500">{category.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${category.percentage}%` }}
                            transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                            className="h-2 rounded-full bg-blue-500"
                          />
                        </div>
                      </div>
                      <div className="ml-4 text-gray-400">
                        <motion.svg 
                          className="w-5 h-5" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          animate={{ rotate: isExpanded ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </motion.svg>
                      </div>
                    </div>
                    
                    {/* 하위 카테고리 */}
                    <motion.div
                      initial={false}
                      animate={{ 
                        height: isExpanded ? 'auto' : 0,
                        opacity: isExpanded ? 1 : 0
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-gray-50 p-4 space-y-3">
                        {childCategories.map((child, childIndex) => (
                          <motion.div
                            key={child.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: childIndex * 0.05 }}
                            className="flex items-center ml-4"
                          >
                            <div className="flex-1">
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-600">{child.name}</span>
                                <span className="text-sm text-gray-500">{child.percentage}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${child.percentage}%` }}
                                  transition={{ delay: 0.3 + childIndex * 0.05, duration: 0.6 }}
                                  className="h-1.5 rounded-full bg-blue-400"
                                />
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
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
            {getFilteredTopPosts().length > 0 ? (
              getFilteredTopPosts().map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="border-l-4 border-gray-200 pl-4 py-3 hover:border-purple-400 transition-colors cursor-pointer"
                  onClick={() => navigate(`/detailAssemble/${post.id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{post.title}</h3>
                      <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <FaThumbsUp className="mr-1" />
                          좋아요: {post.likes}
                        </span>
                        <span className="flex items-center">
                          <FaComment className="mr-1" />
                          댓글: {post.comments}
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