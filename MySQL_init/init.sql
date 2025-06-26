/*실제 서비스용 데이터베이스 생성 파일*/
/*조회 성능 향상을 위한 인덱스 추가 예정*/

CREATE TABLE `users` (
	`id`	BIGINT	NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`email`	VARCHAR(255)	NOT NULL,
	`password`	VARCHAR(255)	NULL,
	`name`	VARCHAR(100)	NOT NULL,
	`nickname`	VARCHAR(100)	UNIQUE,
	`oauth_provider`	VARCHAR(50)	NULL,
	`oauth_id`	VARCHAR(255)	NULL,
	`role`	VARCHAR(50)	NOT NULL	DEFAULT 'ROLE_USER',
	`create_at`	DATETIME	NOT NULL	DEFAULT CURRENT_TIMESTAMP,
    `question_count` INT NOT NULL DEFAULT 30,
    `summary_count` INT NOT NULL DEFAULT 5,
    `total_question` INT DEFAULT 0,
    `total_summary` INT DEFAULT 0
);

CREATE TABLE `board` (
	`board_id`	BIGINT	NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`user_id`	BIGINT	NOT NULL,
	`title`	VARCHAR(255)	NOT NULL,
	`category`	VARCHAR(50)	NOT NULL	DEFAULT 'code',
	`code`	MEDIUMTEXT	NULL,
	`content`	MEDIUMTEXT	NULL,
	`create_at`	DATETIME	NOT NULL	DEFAULT CURRENT_TIMESTAMP,
	`update_at`	DATETIME	NOT NULL	DEFAULT CURRENT_TIMESTAMP,
    `like_count` BIGINT NOT NULL DEFAULT 0,
    `comment_count` BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE `assembleboard` (
	`assembleboard_id`	BIGINT	NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`user_id`	BIGINT	NOT NULL,
	`title`	VARCHAR(255)	NOT NULL,
	`category`	VARCHAR(50)	NOT NULL	DEFAULT 'assemble',
	`content`	MEDIUMTEXT	NULL,
	`create_at`	DATETIME	NOT NULL	DEFAULT CURRENT_TIMESTAMP,
	`like_count` BIGINT NOT NULL DEFAULT 0,
    `category_id` INT NOT NULL
);

CREATE TABLE `assemblegood` (
	`assemblegood_id`	BIGINT	NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`assembleboard_id`	BIGINT	NOT NULL,
	`user_id`	BIGINT	NOT NULL,
	`create_at`	DATETIME	NOT NULL	DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `good` (
	`good_id`	BIGINT	NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`board_id`	BIGINT	NOT NULL,
	`user_id`	BIGINT	NOT NULL,
	`create_at`	DATETIME	NOT NULL	DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `comment` (
	`comment_id`	BIGINT	NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`board_id`	BIGINT	NOT NULL,
	`user_id`	BIGINT	NOT NULL,
	`content`	TEXT	NOT NULL,
	`create_at`	DATETIME	NOT NULL	DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `prompt` (
	`prompt_id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT	NOT NULL,
    `prompt_name` TEXT,
    `prompt_role`	MEDIUMTEXT,
    `prompt_form` MEDIUMTEXT,
    `prompt_level` MEDIUMTEXT,
    `prompt_option` MEDIUMTEXT
);

CREATE TABLE `category`(
	`id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `parent_id` INT
);

ALTER TABLE `category` ADD CONSTRAINT `FK_category_TO_category` FOREIGN KEY (
	`parent_id`
)
REFERENCES `category` (
	`id`
) ON DELETE CASCADE;

ALTER TABLE `board` ADD CONSTRAINT `FK_users_TO_board_1` FOREIGN KEY (
	`user_id`
)
REFERENCES `users` (
	`id`
) ON DELETE CASCADE;

ALTER TABLE `assembleboard` ADD CONSTRAINT `FK_users_TO_assembleboard_1` FOREIGN KEY (
	`user_id`
)
REFERENCES `users` (
	`id`
) ON DELETE CASCADE;

ALTER TABLE `assemblegood` ADD CONSTRAINT `FK_assembleboard_TO_assemblegood_1` FOREIGN KEY (
	`assembleboard_id`
)
REFERENCES `assembleboard` (
	`assembleboard_id`
) ON DELETE CASCADE;

ALTER TABLE `assemblegood` ADD CONSTRAINT `FK_assembleboard_TO_assemblegood_2` FOREIGN KEY (
	`user_id`
)
REFERENCES `users` (
	`id`
) ON DELETE CASCADE;

ALTER TABLE assemblegood ADD CONSTRAINT unique_user_assembleboard UNIQUE (user_id, assembleboard_id);

ALTER TABLE `good` ADD CONSTRAINT `FK_board_TO_good_1` FOREIGN KEY (
	`board_id`
)
REFERENCES `board` (
	`board_id`
) ON DELETE CASCADE;

ALTER TABLE `good` ADD CONSTRAINT `FK_board_TO_good_2` FOREIGN KEY (
	`user_id`
)
REFERENCES `users` (
	`id`
) ON DELETE CASCADE;

ALTER TABLE good ADD CONSTRAINT unique_user_board UNIQUE (user_id, board_id);

ALTER TABLE `comment` ADD CONSTRAINT `FK_board_TO_comment_1` FOREIGN KEY (
	`board_id`
)
REFERENCES `board` (
	`board_id`
) ON DELETE CASCADE;

ALTER TABLE `comment` ADD CONSTRAINT `FK_board_TO_comment_2` FOREIGN KEY (
	`user_id`
)
REFERENCES `users` (
	`id`
) ON DELETE CASCADE;

ALTER TABLE `prompt` ADD CONSTRAINT `FK_users_TO_prompt_1` FOREIGN KEY (
	`user_id`
)
REFERENCES `users` (
	`id`
) ON DELETE CASCADE;

ALTER TABLE `assembleboard` ADD CONSTRAINT `FK_assembleboard_TO_category` FOREIGN KEY (
	`category_id`
)
REFERENCES `category` (
	`id`
) ON DELETE CASCADE;

-- 대분류
INSERT INTO category (id, name, parent_id) VALUES
(1, '프로그래밍 언어', NULL),
(2, '운영체제', NULL),
(3, '데이터베이스', NULL),
(4, '프레임워크', NULL),
(5, '클라우드', NULL),
(6, '인프라', NULL),
(7, '알고리즘 & 자료구조', NULL),
(8, '협업 & 도구', NULL),
(9, '기타', NULL);

-- 소분류
INSERT INTO category (name, parent_id) VALUES
-- 프로그래밍 언어
('Python', 1),
('Java', 1),
('JavaScript', 1),
('TypeScript', 1),
('C / C++', 1),
('기타 언어', 1),

-- 운영체제
('Linux', 2),
('Ubuntu', 2),
('CentOS', 2),
('기타 Linux 배포판', 2),
('Windows', 2),
('macOS', 2),
('WSL (Windows Subsystem for Linux)', 2),

-- 데이터베이스
('SQL 쿼리', 3),
('MySQL', 3),
('Oracle', 3),
('PostgreSQL', 3),
('NoSQL', 3),

-- 프레임워크
('React', 4),
('Spring Boot', 4),
('Django', 4),
('Vue.js', 4),
('Next.js', 4),
('Flask', 4),

-- 클라우드
('AWS', 5),
('KT Cloud', 5),
('Azure', 5),

-- 인프라
('Docker / 컨테이너', 6),
('Kubernetes', 6),
('Nginx / Apache', 6),
('CI/CD', 6),
('DevOps', 6),

-- 알고리즘 & 자료구조
('코딩 테스트', 7),
('알고리즘 이론', 7),

-- 협업 & 도구
('Git / GitHub', 8),

-- 기타
('기타 문서', 9);


CREATE EVENT reset_question_summary_count
ON SCHEDULE
    EVERY 1 DAY
    STARTS '2025-06-17 06:00:00'
DO
    UPDATE users
    SET question_count = 30,
        summary_count = 5;