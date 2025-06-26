import { FaFileAlt, FaCode, FaRobot, FaQuestionCircle, FaClipboardList, FaChartBar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import UserAIAssembleStats from './UserAIAssembleStats';
import CustomFetch from '../../service/CustomFetch';

const UserStats = () => {
  const [showAIAssembleStats, setShowAIAssembleStats] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // API에서 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const SERVER_URL = import.meta.env.VITE_API_URL;
        const response = await CustomFetch(`${SERVER_URL}/state/user/info`);
        
        if (!response.ok) {
          throw new Error('사용자 정보를 가져오는데 실패했습니다.');
        }
        
        const data = await response.json();
        setUserStats({
          totalPosts: data.totalCodeCount + data.totalAssembleCount + data.totalComment,
          codeQuestionPosts: data.totalCodeCount,
          aiAnswerPosts: data.totalAssembleCount,
          totalQuestions: data.totalQuestion,
          totalSummaries: data.totalSummary,
          totalComments: data.totalComment,
          receivedLikeCodeCount: data.receivedLikeCodeCount,
          receivedLikeAssembleCount: data.receivedLikeAssembleCount
        });
      } catch (err) {
        console.error('사용자 정보 조회 오류:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-800 flex items-center justify-center">
        <div className="text-white text-xl">사용자 정보를 불러오는 중...</div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen bg-zinc-800 flex items-center justify-center">
        <div className="text-red-400 text-xl">오류: {error}</div>
      </div>
    );
  }

  // 데이터가 없는 경우
  if (!userStats) {
    return (
      <div className="min-h-screen bg-zinc-800 flex items-center justify-center">
        <div className="text-white text-xl">사용자 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  const statCards = [
    {
      title: '총 게시물 수',
      value: userStats.totalPosts,
      icon: FaFileAlt,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30',
      linkable: false
    },
    {
      title: '코드/질문 게시글',
      value: userStats.codeQuestionPosts,
      icon: FaCode,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/20',
      borderColor: 'border-indigo-500/30',
      linkable: false
    },
    {
      title: 'AI답변 게시글',
      value: userStats.aiAnswerPosts,
      icon: FaRobot,
      color: 'text-violet-400',
      bgColor: 'bg-violet-500/20',
      borderColor: 'border-violet-500/30',
      linkable: true,
      action: () => setShowAIAssembleStats(true)
    },
    {
      title: '총 댓글 수',
      value: userStats.totalComments,
      icon: FaFileAlt,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20',
      borderColor: 'border-emerald-500/30',
      linkable: false
    },
    {
      title: '총 질문 횟수',
      value: userStats.totalQuestions,
      icon: FaQuestionCircle,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/20',
      borderColor: 'border-amber-500/30',
      linkable: false
    },
    {
      title: '총 요약 횟수',
      value: userStats.totalSummaries,
      icon: FaClipboardList,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/20',
      borderColor: 'border-rose-500/30',
      linkable: false
    },
    {
      title: '받은 총 좋아요',
      value: userStats.receivedLikeCodeCount + userStats.receivedLikeAssembleCount,
      icon: FaChartBar,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/30',
      linkable: false
    },
    {
      title: '받은 좋아요',
      subtitle: '(코드 게시글)',
      value: userStats.receivedLikeCodeCount,
      icon: FaCode,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/20',
      borderColor: 'border-pink-500/30',
      linkable: false
    },
    {
      title: '받은 좋아요',
      subtitle: '(AI답변 게시글)',
      value: userStats.receivedLikeAssembleCount,
      icon: FaRobot,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/20',
      borderColor: 'border-cyan-500/30',
      linkable: false
    }
  ];

  // AI답변 상세 통계가 표시되는 경우
  if (showAIAssembleStats) {
    return (
      <UserAIAssembleStats onBack={() => setShowAIAssembleStats(false)} />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">사용자 통계</h1>
              <p className="text-gray-300">내 활동 현황과 통계를 확인할 수 있습니다.</p>
            </div>
          </div>
        </motion.div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
          {statCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white/5 backdrop-blur-sm rounded-xl shadow-lg border ${card.borderColor} p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 ${
                card.linkable ? 'cursor-pointer' : ''
              }`}
              onClick={() => {
                if (card.linkable && card.action) {
                  card.action();
                }
              }}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`p-2 rounded-full ${card.bgColor} mb-2`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-1">{card.title}</p>
                  {card.subtitle && (
                    <p className="text-xs text-gray-400 mb-1">{card.subtitle}</p>
                  )}
                  <p className="text-xl font-bold text-white">{card.value}</p>
                </div>
                {card.linkable && (
                  <div className="mt-2 text-xs text-violet-400 font-medium text-center">
                    클릭하여 자세한 통계 보기 →
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* 추가 정보 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6"
        >
          <div className="flex items-center mb-6">
            <div className="p-2 rounded-full bg-purple-500/20 mr-3">
              <FaChartBar className="h-6 w-6 text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">게시물 분포</h2>
          </div>
          
          <div className="space-y-6">
            {/* 코드/질문 게시글 분포 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-300">코드/질문 게시글</span>
                <span className="text-sm text-blue-400 font-semibold">
                  {userStats.codeQuestionPosts}개 ({((userStats.codeQuestionPosts / userStats.totalPosts) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(userStats.codeQuestionPosts / userStats.totalPosts) * 100}%` }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="bg-blue-500 h-3 rounded-full shadow-lg"
                />
              </div>
            </div>

            {/* AI답변 게시글 분포 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-300">AI답변 게시글</span>
                <span className="text-sm text-violet-400 font-semibold">
                  {userStats.aiAnswerPosts}개 ({((userStats.aiAnswerPosts / userStats.totalPosts) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(userStats.aiAnswerPosts / userStats.totalPosts) * 100}%` }}
                  transition={{ delay: 0.9, duration: 1 }}
                  className="bg-violet-500 h-3 rounded-full shadow-lg"
                />
              </div>
            </div>

            {/* 범례 */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-xs text-gray-300">코드/질문</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-violet-500 rounded"></div>
                <span className="text-xs text-gray-300">AI답변</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserStats; 