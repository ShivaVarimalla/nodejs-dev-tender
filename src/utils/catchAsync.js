const catchAsync = (routeHandler) => {
  return (req, res, next) => {
    Promise.resolve(routeHandler(req, res, next)).catch(next);
  };
};

module.exports = catchAsync;