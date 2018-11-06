const router = require('express').Router();
const blogs = require('../controllers/blogs');
const letters = require('../controllers/letters');
const auth = require('../controllers/auth');
const secureRoute = require('../lib/secureRoute');

router.route('/blogs')
  .get(blogs.index)
  .post(secureRoute, blogs.create);

router.route('/blogs/:id')
  .get(blogs.show)
  .put(blogs.update)
  .delete(secureRoute, blogs.delete);

router.route('/blogs/:id/comments')
  .post(secureRoute, blogs.addComment);

router.route('/blogs/:id/comments/:commentId')
  .delete(secureRoute, blogs.deleteComment);

router.route('/letters')
  .get(letters.index)
  .post(secureRoute, letters.create);

router.route('/letters/:id')
  .get(letters.show)
  .put(letters.update)
  .delete(secureRoute, letters.delete);

router.route('/letters/:id/comments')
  .post(secureRoute, letters.addComment);

router.route('/letters/:id/comments/:commentId')
  .delete(secureRoute, letters.deleteComment);

router.route('/register')
  .post(auth.register);

router.route('/login')
  .post(auth.login);

router.all('/*', (req, res) => res.notFound());

module.exports = router;
