let express = require('express');
require('dotenv').config();
require('./utilities/dbConnection');
const errorHandler = require('./utilities/errorhandler');
const socket = require('socket.io');
const AppError = require('./utilities/AppError');
const userRouter = require('./routes/userRouter');
const buyOrioRouter = require('./routes/buyOrioRouter');
const session = require('cookie-session');
const sellOrioRouter = require('./routes/sellOrioRouter');
const buyAndSellRouter = require('./routes/buyAndSellRouter');
const toCryptoRouter = require('./routes/toCryptoRouter');
const currencyRouter = require('./routes/currenciesRoute');
const checkAllPendingRecords = require('./utilities/checkAllPendingRecords');
const nftRouter = require('./routes/nftRouter');
const { onConnection } = require('./controllers/socketConnection');
const app = express();

app.use(express.json());
app.use(
    session({
        signed: false,
    })
);
app.use('/v1/user', userRouter);
app.use('/v1/to-crypto', toCryptoRouter);
app.use('/v1/buy', buyOrioRouter);
app.use('/v1/sell', sellOrioRouter);
app.use('/v1/buyAndSell', buyAndSellRouter);
app.use('/v1/nft', nftRouter);
app.use('/v1/currencies', currencyRouter);

app.all('*', (req, res, next) => {
    return next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler);
// const PORT =  process.env.PORT || 2083;
const PORT = 3083;
const server = app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
const io = socket(server, {
    cors: {
        origin: '*',
    },
});

io.on('connection', onConnection);
