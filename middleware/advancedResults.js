const advancedResults = (model, populate) => async (req, res, next) => {
  const { query } = req
  const reqQuery = { ...query }

  const fieldsToRemove = ['select', 'sort', 'page', 'limit']
  fieldsToRemove.forEach(field => delete reqQuery[field])

  const queryString = JSON.stringify(reqQuery)
  const replacedQueryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    match => `$${match}`
  )

  console.log('req qeury', query)
  console.log('req params', req.params)

  let dbQuery = model.find(JSON.parse(replacedQueryString))

  if (query.select) {
    const selectBy = query.select.split(',').join(' ')
    dbQuery = dbQuery.select(selectBy)
  }

  if (query.sort) {
    const sortBy = query.sort.split(',').join(' ')
    dbQuery = dbQuery.sort(sortBy)
  } else {
    dbQuery = dbQuery.sort('-createdAt')
  }

  // 分页
  const page = parseInt(query.page, 10) || 1
  const limit = parseInt(query.limit, 10) || 2
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await model.countDocuments()

  dbQuery.skip(startIndex).limit(limit)

  // 是否关联
  if (populate) {
    dbQuery = dbQuery.populate(populate)
  }

  const results = await dbQuery

  // 分页返回值
  const pagination = {}
  if (startIndex > 0) {
    pagination.prev = { page: page - 1, limit }
  }

  if (endIndex < total) {
    pagination.next = { page: page + 1, limit }
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  }

  next()
}

module.exports = advancedResults
