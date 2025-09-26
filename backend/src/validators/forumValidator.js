import Joi from 'joi';

const createPostSchema = Joi.object({
  title: Joi.string().trim().min(5).max(100).required(),
  content: Joi.string().trim().min(10).required(),
  author: Joi.string().trim().required(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  courseId: Joi.string().trim().optional(),
});

export const validateCreateForumPost = (req, res, next) => {
  const { error } = createPostSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }
  next();
};
