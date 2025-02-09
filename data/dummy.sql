-- Insert some notes
INSERT INTO notes (text, creator_id) VALUES
('First note content', 'user1'),
('Second note content', 'user2'),
('Another interesting note', 'user1');

-- Insert some tags
INSERT INTO tags (label, creator_id) VALUES
('Important', 'user1'),
('Work', 'user1'),
('Personal', 'user2');

-- Retrieve IDs of inserted notes and tags
WITH note_ids AS (
  SELECT id FROM notes ORDER BY id LIMIT 3
),
tag_ids AS (
  SELECT id FROM tags ORDER BY id LIMIT 3
)
-- Insert relationships into note_tags
INSERT INTO note_tags (note_id, tag_id)
VALUES 
  ((SELECT id FROM note_ids OFFSET 0 LIMIT 1), (SELECT id FROM tag_ids OFFSET 0 LIMIT 1)), -- First note gets first tag
  ((SELECT id FROM note_ids OFFSET 1 LIMIT 1), (SELECT id FROM tag_ids OFFSET 1 LIMIT 1)), -- Second note gets second tag
  ((SELECT id FROM note_ids OFFSET 2 LIMIT 1), (SELECT id FROM tag_ids OFFSET 2 LIMIT 1)), -- Third note gets third tag
  ((SELECT id FROM note_ids OFFSET 0 LIMIT 1), (SELECT id FROM tag_ids OFFSET 2 LIMIT 1)); -- First note gets another tag
