const Letter = require('../models/letter');

function indexRoute(req, res, next) {
  Letter
    .find()
    .populate('createdBy')
    .exec()
    .then((letters) => res.json(letters))
    .catch(next);
}

function createRoute(req, res, next) {

  // if(req.file) req.body.image = req.file.filename;
  req.body.createdBy = req.user;

  Letter
    .create(req.body)
    .then((letter) => res.status(201).json(letter))
    .catch(next);
}

function showRoute(req, res, next) {
  Letter
    .findById(req.params.id)
    .populate('createdBy comments.createdBy')
    .exec()
    .then((letter) => {
      if(!letter) return res.notFound();

      res.json(letter);
    })
    .catch(next);
}

function updateRoute(req, res, next) {

  // if(req.file) req.body.image = req.file.filename;
  Letter
    .findById(req.params.id)
    .exec()
    .then((letter) => {
      if(!letter) return res.notFound();

      for(const field in req.body) {
        letter[field] = req.body[field];
      }

      return letter.save();
    })
    .then((letter) => res.json(letter))
    .catch(next);
}

function deleteRoute(req, res, next) {
  Letter
    .findById(req.params.id)
    .exec()
    .then((letter) => {
      if(!letter) return res.notFound();

      return letter.remove();
    })
    .then(() => res.status(204).end())
    .catch(next);
}

function addCommentRoute(req, res, next) {

  req.body.createdBy = req.user;

  Letter
    .findById(req.params.id)
    .exec()
    .then((letter) => {
      if(!letter) return res.notFound();

      const comment = letter.comments.create(req.body);
      letter.comments.push(comment);

      return letter.save()
        .then(() => res.json(comment));
    })
    .catch(next);
}

function deleteCommentRoute(req, res, next) {
  Letter
    .findById(req.params.id)
    .exec()
    .then((letter) => {
      if(!letter) return res.notFound();

      const comment = letter.comments.id(req.params.commentId);
      comment.remove();

      return letter.save();
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
