CREATE TABLE `prompt` (
	`prompt_id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT	NOT NULL,
    `prompt_name` TEXT,
    `prompt_role`	MEDIUMTEXT,
    `prompt_form` MEDIUMTEXT,
    `prompt_level` MEDIUMTEXT,
    `prompt_option` MEDIUMTEXT
);

ALTER TABLE `prompt` ADD CONSTRAINT `FK_users_TO_prompt_1` FOREIGN KEY (
	`user_id`
)
REFERENCES `users` (
	`id`
) ON DELETE CASCADE;