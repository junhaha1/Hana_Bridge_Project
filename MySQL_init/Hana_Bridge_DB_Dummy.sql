#users 테이블 더미 데이터
INSERT INTO `users` (`email`, `password`, `name`, `nickname`, `oauth_provider`, `oauth_id`, `role`)
VALUES
('alice@example.com', 'hashed_pw_123', 'Alice', 'alice_dev', NULL, NULL, 'ROLE_USER'),
('bob@example.com', 'hashed_pw_456', 'Bob', 'bobby88', 'google', 'google-uid-789', 'ROLE_USER'),
('carol@example.com', 'hashed_pw_789', 'Carol', 'carol_js', NULL, NULL, 'ROLE_USER'),
('dave@example.com', 'hashed_pw_321', 'Dave', 'dave_the_dev', 'kakao', 'kakao-uid-456', 'ROLE_USER'),
('erin@example.com', 'hashed_pw_654', 'Erin', 'erin_ai', NULL, NULL, 'ROLE_ADMIN');

#board 테이블 더미 데이터
INSERT INTO `board` (`user_id`, `title`, `category`, `code`, `content`)
VALUES
(1, 'Spring Boot 에러 해결 도와주세요', 'code', NULL, '프로젝트 구동 시 Failed to load ApplicationContext 에러가 납니다.'),
(2, 'Java로 백준 문제 푸는 팁 공유', 'code', 'public class Solution { public static void main(String[] args) { System.out.println("백준 팁 공유!"); } }', '자바로 알고리즘 풀 때 편한 팁 몇 가지 정리했어요.'),
(3, 'React 상태관리 관련 질문', 'code', NULL, 'useState와 useReducer 중 언제 어떤 걸 쓰는지 잘 모르겠습니다.'),
(4, 'HTML/CSS 간단한 질문입니다', 'code', NULL, 'flex와 grid 차이, 언제 어떤 걸 써야 할까요?'),
(5, 'Python Flask 배포 시 CORS 문제', 'code', NULL, '서버는 돌아가는데 CORS 에러가 계속 납니다.'),
(1, 'Spring Security 로그인 설정 정리', 'code', 'SecurityConfig 설정 예시', 'JWT와 OAuth2 로그인 설정 방법을 정리했습니다.'),
(2, 'Node.js Express 라우팅 질문', 'code', NULL, '라우팅을 분리해서 구성할 때 best practice가 있을까요?'),
(3, 'MySQL 조인문 최적화 질문', 'code', 'SELECT * FROM A JOIN B ON A.id = B.a_id', '조회 속도가 너무 느려서 도움 요청드립니다.'),
(4, 'Vue.js Composition API 전환 팁', 'code', NULL, 'Options API 쓰다가 Composition으로 넘어가려는데 감이 잘 안 잡힙니다.'),
(5, 'REST API 응답 설계 질문', 'code', NULL, '에러 응답 포맷을 통일하는 게 좋을까요? 어떻게 설계하는 게 좋을지 고민 중입니다.');

#good 테이블 더미 데이터
INSERT INTO `good` (`board_id`, `user_id`) VALUES
(1, 2),
(1, 3),
(1, 4),
(2, 1),
(2, 5),
(3, 1),
(3, 2),
(3, 5),
(4, 1),
(4, 3),
(5, 2),
(5, 4),
(6, 1),
(6, 5),
(7, 2),
(7, 3),
(8, 4),
(9, 1),
(9, 5),
(10, 3);

#comment 테이블 더미 데이터
INSERT INTO `comment` (`board_id`, `user_id`, `content`) VALUES
(1, 2, '저도 이 에러 겪었어요! application.properties 확인해보세요.'),
(1, 3, 'Context 에러는 주로 테스트 설정 문제인 경우가 많아요.'),
(2, 1, '좋은 팁 감사합니다! 자바 처음 시작하는 분들께 도움 될 것 같아요.'),
(2, 4, 'System.out.println 대신 로깅 쓰는 것도 추천드려요.'),
(3, 5, '저는 useReducer가 더 직관적이었어요. 특히 복잡한 상태에서는요.'),
(3, 2, '공감합니다. 상태가 단순할 땐 useState가 편하더라고요.'),
(4, 1, 'flex는 간단한 레이아웃에, grid는 복잡한 격자 구조에 좋아요!'),
(4, 3, '저도 처음에 flex만 쓰다가 grid 배우고 나서 레이아웃 구현이 쉬워졌어요.'),
(5, 4, 'Flask에 CORS 라이브러리 설치하고 allow 설정하면 될 거예요.'),
(5, 2, 'frontend에서 origin이 맞는지도 꼭 확인해보세요.'),
(6, 1, 'Spring Security 설정 잘 정리해주셔서 감사합니다. 도움이 됐어요.'),
(6, 5, 'JWT 적용까지 설명해주셔서 좋아요!'),
(7, 2, '라우팅은 기능별로 나누는 게 관리하기 좋아요.'),
(7, 4, '저는 router/index.js로 중앙 관리하는 방식 추천합니다.'),
(8, 3, '조인 조건과 인덱스 확인해보셨나요? explain 붙여서 분석해보세요.'),
(8, 5, 'join이 느리면 서브쿼리도 고려해보세요.'),
(9, 1, 'Composition API 전환할 땐 watch, computed 연습 많이 해보세요.'),
(9, 2, '공식 문서에 나와 있는 Todo 앱 예제가 도움 많이 됐어요.'),
(10, 4, 'REST 응답은 일관성 있게 설계하는 게 유지보수에 좋아요.'),
(10, 5, '에러 코드 구조도 같이 맞추면 프론트엔드가 처리하기 편해요.');



#assembleboard 테이블 더미 데이터
INSERT INTO `assembleboard` (`user_id`, `title`, `category`, `content`)
VALUES
(1, '함께 백엔드 스터디 하실 분?', 'assemble', 'Spring Boot, JPA 위주로 공부할 사람 구해요!'),
(2, 'React + TypeScript 팀 프로젝트 하실 분?', 'assemble', '프론트엔드 팀플 구합니다. 주 1회 온/오프라인 회의 예정입니다.'),
(3, 'Python 크롤러 만들기 모임', 'assemble', '간단한 웹 크롤러 프로젝트 같이 하실 분 있나요?'),
(4, 'AI 모델 논문 읽기 스터디', 'assemble', 'Transformer 기반 논문 읽고 리뷰하는 스터디 모집합니다.'),
(5, 'Android 앱 개발 협업할 분', 'assemble', 'Kotlin 사용해서 간단한 앱 만들어보려 합니다.'),
(1, '실시간 채팅 웹앱 팀 구성 중입니다.', 'assemble', 'Socket.io, WebRTC 관심 있는 분 연락 주세요!'),
(2, 'FastAPI로 백엔드 서버 만들 팀원 모집', 'assemble', 'FastAPI + Vue.js 구성으로 간단한 프로젝트 계획 중입니다.'),
(3, '게임 개발 유니티 팀 구합니다', 'assemble', '캐주얼 게임 개발 목표, 유니티 가능하신 분 환영합니다.'),
(4, 'SQL 기초부터 실전까지 스터디', 'assemble', 'RDB 기초부터 실무 쿼리까지 함께 공부해요.'),
(5, '포트폴리오용 풀스택 프로젝트', 'assemble', 'Spring Boot + React 기반 팀원 모집합니다.');

#assemblegood 테이블 더미 데이터
INSERT INTO `assemblegood` (`assembleboard_id`, `user_id`) VALUES
(1, 2),
(1, 3),
(1, 4),
(2, 1),
(2, 3),
(2, 5),
(3, 1),
(3, 2),
(3, 4),
(4, 1),
(4, 5),
(5, 2),
(5, 3),
(6, 1),
(6, 4),
(6, 5),
(7, 2),
(8, 3),
(9, 4),
(10, 5);



