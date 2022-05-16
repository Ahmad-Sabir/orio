const SellAndBuyOrio = require('../models/SellAndBuyOrio');
const AppError = require('../utilities/AppError');
const catchAsync = require('../utilities/catchAsync');
const { ERRORS, STATUS_CODE, SUCCESS_MSG, STATUS, ROLES } = require('../constants/index');
/*
Description
  Date wise data is used to fetch the data of last month and SUM the data of a single day and return for bulding graph.
*/

const getDateWiseData = async (action) => {
    const response = await SellAndBuyOrio.find({
        status: 'COMPLETED',
        action: `${action}`,
        createdAt: {
            $lte: new Date().toString(),
            $gt: new Date(new Date().getTime() - 2592000000).toString(),
        },
    }).sort({ createdAt: 1 });
    let respArray = [];
    let sum = 0;
    for (let i = 0; i < response.length; i++) {
        let actualDate = response[i].createdAt.toString().slice(0, 10);
        if (i + 1 == response.length) {
            sum += Number(response[i].orio);
            respArray.push({
                date: response[i].createdAt,
                sum: sum.toFixed(4),
            });
            break;
        }
        let nextDate = response[i + 1].createdAt.toString().slice(0, 10);
        if (actualDate === nextDate) {
            sum += Number(response[i].orio);
            continue;
        } else if (sum !== 0 && actualDate === response[i - 1].createdAt.toString().slice(0, 10)) {
            sum += Number(response[i].orio);
        } else {
            sum += Number(response[i].orio);
        }

        respArray.push({
            date: response[i].createdAt,
            sum: sum.toFixed(4),
        });
        sum = 0;
    }
    return respArray;
};

exports.buyLastMonth = catchAsync(async (req, res, next) => {
    const response = await getDateWiseData('BUY');
    return res.status(STATUS_CODE.OK).json({
        status: STATUS.SUCCESS,
        result: response,
    });
});

exports.sellLastMonth = catchAsync(async (req, res, next) => {
    let response = await getDateWiseData('SELL');
    res.send({
        status: STATUS.SUCCESS,
        result: response,
    });
});
