const APIFeatures = require('../utilities/apiFeatures');

exports.filter = async (query, queryParams) => {
    const results = new APIFeatures(query, queryParams).filter().sort().limitFields();
    const totalCount = await results.query.countDocuments();
    const freatures = new APIFeatures(query, queryParams)
        .filter()
        .sort()
        .limitFields()
        .pagination();
    const doc = await freatures.query;
    let page = 1;
    let limit = 0;
    if (queryParams.page) {
        page = queryParams.page;
    }
    if (queryParams.limit) {
        limit = queryParams.limit;
    }
    let left = 0;
    if (limit <= 0) {
        left = totalCount - totalCount;
    } else {
        left = totalCount - page * limit;
    }
    let leftCount = 0;
    if (left <= 0) {
        leftCount = 0;
    } else {
        leftCount = left;
    }
    console.log(limit, page, leftCount);
    return [doc, totalCount, leftCount];
};
