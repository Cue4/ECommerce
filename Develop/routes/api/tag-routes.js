const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/api/tags', async (req, res) => {
  const tags = await db.query('SELECT * FROM tags');
  res.json(tags.rows);
  // find all tags
  // be sure to include its associated Product data
});

router.get('/api/tags:id', async (req, res) => {
  const { id } = req.params;
  const tag = await db.query('SELECT * FROM tags WHERE id = $1', [id]);
  if (tag.rows.length === 0) {
      return res.status(404).json({ error: 'Tag not found' });
  }
  res.json(tag.rows[0]);
  // find a single tag by its `id`
  // be sure to include its associated Product data
});

router.post('/api/tags', async (req, res) => {
  const { name, description } = req.body;
    const result = await db.query('INSERT INTO tags (name, description) VALUES ($1, $2) RETURNING *', [name, description]);
    res.status(201).json(result.rows[0]);
  // create a new tag
});

router.put('/api/tags:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const result = await db.query('UPDATE tags SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *', [name, description, id]);
  if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tag not found' });
  }
  res.json(result.rows[0]);
  // update a tag's name by its `id` value
});

router.delete('/api/tags:id', async(req, res) => {
  const { id } = req.params;
  const result = await db.query('DELETE FROM tags WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tag not found' });
  }
  res.status(204).send();
  // delete on tag by its `id` value
});

module.exports = router;
