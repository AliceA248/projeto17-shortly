export function validateSchema(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(422).send(errorMessages);
    }

    req.validatedData = value;
    next();
  };
}

