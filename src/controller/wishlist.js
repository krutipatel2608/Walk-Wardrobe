const _ = require("lodash");

const response = require("../constant/response");
const wishListModel = require("../models/wishlist");
const productModel = require("../models/product");

exports.add = async (req, res) => {
  try {
    const findProductStatus = await productModel.findOne(
      { _id: req.body.product_id, status: true },
      { variants: { $elemMatch: { _id: req.body.variant_id } } }
    );
    if (!findProductStatus) {
      return response(res, true, 204, "Product not available");
    } else {
      if (findProductStatus.variants[0]?.status === false || findProductStatus.variants[0]?.stock <= 0) {
        return response(res, true, 204, "Product not available");
      } else {
        const findExistingFav = await wishListModel.findOne({
          user_id: req.body.user_id,
          product_id: req.body.product_id,
          variant_id: req.body.variant_id,
        });
        if (findExistingFav) {
          return response(res, true, 201, "Product moved to wishlist");
        } else {
          await wishListModel
            .create(req.body)
            .then((wishListData) => {
              return response(
                res,
                true,
                201,
                "Product added to wishlist successfully",
                wishListData
              );
            })
            .catch(() => {
              return response(
                res,
                false,
                422,
                "error, Product not added to wishlist!"
              );
            });
        }
      }
    }
  } catch (error) {
    console.log(error, "---error");
    return response(res, false, 500, "Something went Wrong!");
  }
};

// user wishlist
exports.list = async (req, res) => {
  try {
    const findWishList = await wishListModel
      .find({ user_id: req.params.user_id })
      .populate("user_id")
      .populate(
        {
          path: "product_id",
          match: { status: true },
        },
      );

    const OutOfStockProductVArr = [];
    for (let i = 0; i < findWishList.length; i++) {
      if (findWishList[i].product_id === null) {
        findWishList[i]._doc.product = 'Out of Stock'

      } else {
        const findVariant = _.find(findWishList[i].product_id.variants, {
          _id: findWishList[i].variant_id,
        });
        if(findVariant.status === false){
          OutOfStockProductVArr.push({
           color_id: findVariant.color_id,
           size_id: findVariant.size_id,
           base_price: findVariant.base_price,
           selling_price: findVariant.selling_price,
           model_no: findVariant.model_no,
           stock: 'Out of Stock',
           status: false,
           _id: findVariant._id,
           main_image: findVariant.main_image,
           sub_image: findVariant.sub_image
          })
        }
       
        findWishList[i]._doc.variant_data = findVariant.status ? findVariant : OutOfStockProductVArr;
      }
    }

    if(!findWishList.length) {
      return response(res, false, 202, "Wishlist does not exist");
    } else {
      return response(res, true, 200, "Wishlist Data", findWishList);
    }
  } catch (error) {
    console.log(error, '----error');
    return response(res, false, 500, "Something went Wrong!");
  }
};
