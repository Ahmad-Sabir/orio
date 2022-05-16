var Client = require("coinbase").Client;
module.exports.getBtcUsd = async (conversion) => {
  let credentials = {
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
    strictSSL: false
  }
  let client = new Client(credentials);
    return new Promise(async (resolve, reject) => {
        try {
          client.getBuyPrice(
            {
              currencyPair: conversion,
            },
            function (err, price) {
              if (err) {
                throw err;
              } else {
                console.log(price);
                resolve(price);
              }
            }
          );
        } catch (error) {
          reject(err);
        }
    });
} 