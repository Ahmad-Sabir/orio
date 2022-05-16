class APIFeatures {
    constructor(query, queryParams) {
        this.query = query;
        this.queryParams = queryParams;
    }
    filter() {
        //QUERY FILTER
        const queryParams = { ...this.queryParams };
        const excludedFields = ['limit', 'page', 'sort', 'fields', 'keyword'];
        excludedFields.forEach((el) => delete queryParams[el]);
        // CASE INSENSITIVE SEARCH
        let newObj = {};
        const excluded = [
            'orio',
            '_id',
            'id',
        ];
        Object.keys(queryParams).forEach((el) => {
            if (!excluded.includes(el)) {
                if (Array.isArray(queryParams[el])) {
                    console.log(Array.isArray(queryParams[el]));
                    var regex = queryParams[el].map(function (val) {
                        return `^${val}$`;
                    });
                    const reg = regex.join('|');
                    newObj[el] = { regex: reg, options: 'i' };
                } else {
                    const value = `^${queryParams[el]}$`;
                    newObj[el] = { regex: value, options: 'i' };
                }
            } else {
                newObj[el] = queryParams[el];
            }
        });
        // FILTER MONGOOSE OPERATORS
        let queryStr = JSON.stringify(newObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt|regex|options)\b/g, (match) => `$${match}`);
        let obj = JSON.parse(queryStr);
        this.query = this.query.find(obj);
        return this;
    }
    sort() {
        if (this.queryParams.sort) {
            const sortBy = this.queryParams.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    limitFields() {
        if (this.queryParams.fields) {
            const fields = this.queryParams.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    pagination() {
        const page = this.queryParams.page * 1 || 1;
        const limit = this.queryParams.limit * 1 || 0;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = APIFeatures;
