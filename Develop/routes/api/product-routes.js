const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');


// get all products
router.get('/api/products', async(req, res) => {
  const tags = await db.query('SELECT * FROM tags');
  res.json(tags.rows);
});

// get one product
router.get('/api/product:id', async(req, res) => {
  const { id } = req.params;
  const tag = await db.query('SELECT * FROM tags WHERE id = $1', [id]);
  if (tag.rows.length === 0) {
      return res.status(404).json({ error: 'Tag not found' });
  }
  res.json(tag.rows[0]);
});

// create new product
router.post('/', (req, res) => {
  Product.create(req.body)
    .then((product) => {
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
     
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });
          const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.delete('/api/product:id', async(req, res) => {
  const { id } = req.params;
  const result = await db.query('DELETE FROM tags WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tag not found' });
  }
  res.status(204).send();
});

module.exports = router;
