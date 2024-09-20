const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

router.get('/api/tags', async (req, res) => {
  const tags = await db.query('SELECT * FROM tags');
  res.json(tags.rows);

});

router.get('/api/tags:id', async (req, res) => {
  const { id } = req.params;
  const tag = await db.query('SELECT * FROM tags WHERE id = $1', [id]);
  if (tag.rows.length === 0) {
      return res.status(404).json({ error: 'Tag not found' });
  }
  res.json(tag.rows[0]);

});

router.post('/api/tags', async (req, res) => {
  const { name, description } = req.body;
    const result = await db.query('INSERT INTO tags (name, description) VALUES ($1, $2) RETURNING *', [name, description]);
    res.status(201).json(result.rows[0]);

});

router.put('/api/tags:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const result = await db.query('UPDATE tags SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *', [name, description, id]);
  if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tag not found' });
  }
  res.json(result.rows[0]);

});

router.delete('/api/tags:id', async(req, res) => {
  const { id } = req.params;
  const result = await db.query('DELETE FROM tags WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tag not found' });
  }
  res.status(204).send();

});

module.exports = router;
