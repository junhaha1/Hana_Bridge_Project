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
    `qeustion_count` INT NOT NULL DEFAULT 30,
    `summary_count` INT NOT NULL DEFAULT 5
);

CREATE TABLE `board` (
	`board_id`	BIGINT	NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`user_id`	BIGINT	NOT NULL,
	`title`	VARCHAR(255)	NOT NULL,
	`category`	VARCHAR(50)	NOT NULL	DEFAULT 'code',
	`code`	MEDIUMTEXT	NULL,
	`content`	MEDIUMTEXT	NULL,
	`create_at`	DATETIME	NOT NULL	DEFAULT CURRENT_TIMESTAMP,
	`update_at`	DATETIME	NOT NULL	DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `assembleboard` (
	`assembleboard_id`	BIGINT	NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`user_id`	BIGINT	NOT NULL,
	`title`	VARCHAR(255)	NOT NULL,
	`category`	VARCHAR(50)	NOT NULL	DEFAULT 'assemble',
	`content`	MEDIUMTEXT	NULL,
	`create_at`	DATETIME	NOT NULL	DEFAULT CURRENT_TIMESTAMP
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

