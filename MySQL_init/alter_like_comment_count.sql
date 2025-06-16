/*데이터베이스 컬럼 추가 파일*/

ALTER TABLE board ADD COLUMN like_count BIGINT default 0;
ALTER TABLE board ADD COLUMN comment_count BIGINT default 0;

/*board 게시글 좋아요, 댓글 갯수 추가*/
UPDATE board b
JOIN (
    SELECT board_id, COUNT(good_id) AS cnt
    FROM good
    GROUP BY board_id
) t ON b.board_id = t.board_id
SET b.like_count = t.cnt;

UPDATE board b
JOIN (
    SELECT board_id, COUNT(comment_id) AS cnt
    FROM comment
    GROUP BY board_id
) t ON b.board_id = t.board_id
SET b.comment_count = t.cnt;

SELECT * FROM board;

/*assembleboard 좋아요 갯수 추가*/
ALTER TABLE assembleboard ADD COLUMN like_count BIGINT default 0;

UPDATE assembleboard b
JOIN (
    SELECT assembleboard_id, COUNT(assemblegood_id) AS cnt
    FROM assemblegood
    GROUP BY assembleboard_id
) t ON b.assembleboard_id = t.assembleboard_id
SET b.like_count = t.cnt;

SELECT * FROM assembleboard;




ALTER TABLE users ADD COLUMN question_count INT NOT NULL default 30;
ALTER TABLE users ADD COLUMN summary_count INT NOT NULL default 5;
UPDATE users SET question_count = 1, summary_count = 0 WHERE id = 15;

select * from users;