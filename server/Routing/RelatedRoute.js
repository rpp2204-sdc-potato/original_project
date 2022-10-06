require('dotenv').config();
const express = require('express');

const app = express();
const router = express.Router();
const axios = require('axios');
const Promise = require('bluebird');
const { averageRating } = require('../../client/src/utilities');

const headers = {
  headers: {
    Authorization: process.env.AUTH,
  },
};

router.get('/:id', (req, res) => {
  axios.get(`http://localhost:1234/products/${req.params.id}/related`, headers)
    // .then((result) => res.send(result.data))
    // [71702, 71702, 71704, 71705, 71697, 71699]
    .then((results) => {
      // remove original product Id
      console.log(results);
      const newProdsArr = results.data.filter((value) => value !== req.params.id);
      // remove duplicate product Ids
      const uniqueArr = [...new Set(newProdsArr)];
      return Promise.resolve(uniqueArr);
    })
    .then((arr) => {
      const promiseArr = [];
      // push promises for productID call
      arr.forEach((value) => {
        promiseArr.push(axios.get(`http://localhost:1234/products/${value}`, headers)
          .then((result) => result.data));
      });
      // push promises for product styles call
      arr.forEach((value) => {
        promiseArr.push(axios.get(`http://localhost:1234/products/${value}/styles`, headers)
          .then((result) => result.data));
      });
      // push promises for review ratings
      arr.forEach((value) => {
        promiseArr.push(axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/reviews/meta/?product_id=${value}`, headers)
          .then((result) => result.data)
          .then((product) => {
            // replace product_id key to prevent overwriting properties when merging object
            product.review_id = product.product_id;
            product.ratings = averageRating(product.ratings) || 0;
            delete product.product_id;
            return product;
          }));
      });
      return promiseArr;
    })
    .then((promiseArr) => Promise.all(promiseArr))
    .then((result) => {
      const finalResult = [];
      // push productInfo
      result.forEach((value) => {
        if (value.id) {
          finalResult.push({
            id: value.id,
            category: value.category,
            name: value.name,
            description: value.description,
            features: value.features,
            slogan: value.slogan,
            default_price: value.default_price,
          });
        }
      });
      // push styles info
      finalResult.forEach((product) => {
        result.forEach((style) => {
          if (product.id === Number(style.product_id)) {
            product.styles = style.results;
          }
          if (product.id === Number(style.review_id)) {
            product.ratings = style.ratings;
          }
        });
      });
      res.send(finalResult);
    })
    .catch((err) => {
      // console.log(err);
      res.status(404).send(err);
    });
});

module.exports = router;
