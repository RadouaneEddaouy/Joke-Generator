const verifyJoke = (author, joke) => {
  if (!author) return { state: false, msg: "author is required" };
  if (!joke || joke.length < 5)
    return {
      state: false,
      msg: "Joke is required and must be at least 5 caracters",
    };
  return { state: true, msg: "" };
};
const middlewareVerification = (req, res, next) => {
  let { author, joke } = req.body;
  let { state, msg } = verifyJoke(author, joke);
  if (state) return next();
  res.status(400).send(msg);
};
module.exports = {
  verifyJoke,
  middlewareVerification,
};
