const Blog = require('../models/blog');

function indexRoute(req, res, next) {
  Blog
    .find()
    .populate('createdBy')
    .exec()
    .then((blogs) => res.json(blogs))
    .catch(next);
}

function createRoute(req, res, next) {

  // if(req.file) req.body.image = req.file.filename;
  req.body.createdBy = req.user;

  Blog
    .create(req.body)
    .then((blog) => res.status(201).json(blog))
    .catch(next);
}

function showRoute(req, res, next) {
  Blog
    .findById(req.params.id)
    .populate('createdBy comments.createdBy')
    .exec()
    .then((blog) => {
      if(!blog) return res.notFound();

      res.json(blog);
    })
    .catch(next);
}

function updateRoute(req, res, next) {

  // if(req.file) req.body.image = req.file.filename;
  Blog
    .findById(req.params.id)
    .exec()
    .then((blog) => {
      if(!blog) return res.notFound();

      for(const field in req.body) {
        blog[field] = req.body[field];
      }

      return blog.save();
    })
    .then((blog) => res.json(blog))
    .catch(next);
}

function deleteRoute(req, res, next) {
  Blog
    .findById(req.params.id)
    .exec()
    .then((blog) => {
      if(!blog) return res.notFound();

      return blog.remove();
    })
    .then(() => res.status(204).end())
    .catch(next);
}

function addCommentRoute(req, res, next) {

  req.body.createdBy = req.user;

  Blog
    .findById(req.params.id)
    .exec()
    .then((blog) => {
      if(!blog) return res.notFound();

      const comment = blog.comments.create(req.body);
      blog.comments.push(comment);

      return blog.save()
        .then(() => res.json(comment));
    })
    .catch(next);
}

function deleteCommentRoute(req, res, next) {
  Blog
    .findById(req.params.id)
    .exec()
    .then((blog) => {
      if(!blog) return res.notFound();

      const comment = blog.comments.id(req.params.commentId);
      comment.remove();

      return blog.save();
    })
    .then(() => res.status(204).end())
    .catch(next);
}

module.exports = {
  index: indexRoute,
  create: createRoute,
  show: showRoute,
  update: updateRoute,
  delete: deleteRoute,
  addComment: addCommentRoute,
  deleteComment: deleteCommentRoute
};
