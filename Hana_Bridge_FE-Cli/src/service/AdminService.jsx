import customFetch from './CustomFetch';
import ApiClient from './ApiClient';


export const AdminService = {
  
  // 전체 통계 데이터 가져오기
  getStats: async () => {
    const url = ApiClient.SERVER_URL + "/state/data/total";
    try {
      const response = await customFetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('통계 데이터를 가져오는데 실패했습니다.');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getUserStats: async () => {
    const url = ApiClient.SERVER_URL + "/state/user/total";
    try {
      const response = await customFetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('통계 데이터를 가져오는데 실패했습니다.');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // 기간별 사용자 데이터 가져오기
  getUserPeriod: async (start, end) => {
    const url = `${ApiClient.SERVER_URL}/state/user/period?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`;
    try {
      const response = await customFetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('기간별 사용자 데이터를 가져오는데 실패했습니다.');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // 사용자 정보 목록 가져오기 (페이지별)
  getUserInfo: async (page, sortType = 'totalPost', sortDirection = 'desc') => {
    const url = `${ApiClient.SERVER_URL}/state/user/info/${page}?sortType=${encodeURIComponent(sortType)}&sortDirection=${encodeURIComponent(sortDirection)}`;
    try {
      const response = await customFetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('사용자 정보를 가져오는데 실패했습니다.');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getAssembleStats: async () => {
    const url = `${ApiClient.SERVER_URL}/state/data/assemble`;
    try {
      const response = await customFetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // 게시글 종류별 통계
  getPostStatsByCategory: async (category) => {
    const url = `${ApiClient.SERVER_URL}/state/data?category=${encodeURIComponent(category)}`;
    try {
      const response = await customFetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('카테고리별 통계를 가져오는데 실패했습니다.');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // 최근 게시글 목록
  getTodayPosts: async (category, startDate, endDate) => {
    try {
      let url = "";
      if(category === "assemble"){
        url = `${ApiClient.SERVER_URL}/state/board/assemble?start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(endDate)}`;
      }else{
        url = `${ApiClient.SERVER_URL}/state/board?category=${encodeURIComponent(category)}&start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(endDate)}`;
      }
      const response = await customFetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('최근 게시글을 가져오는데 실패했습니다.');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // 월별 게시글 통계
  getMonthlyStats: async (year = new Date().getFullYear()) => {
    try {
      const response = await customFetch(`/api/admin/stats/monthly?year=${year}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('월별 통계를 가져오는데 실패했습니다.');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },
}; 