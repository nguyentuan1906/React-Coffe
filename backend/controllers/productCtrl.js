const Product = require("../models/productModel");
const Category = require("../models/categoryModel");

class API{
    constructer(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }
}

const productCtrl = {
    getProducts: async (req, res) => {
        try {
            // console.log(req.query);
            // const features = new API((Product.find()), req.query);
            const products = await Product.find();
            // console.log(features.query);
            res.json({products});
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    createProduct: async (req, res) => {
        try {
            const { categories, name, price, image} = req.body;
            if (!image) {
                return res.status(400).json({ msg: "No image selected!" });
            }
            const nameCategory = await Category.findOne({ category_name: categories });
            if (!nameCategory) {
                return res.status(400).json({ msg: "No category selected!" });
            }
            const newProduct = await Product({ product_category: categories, product_name: name, product_price: price, product_image: image});
            await newProduct.save();
            res.json("Create product complete!");
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    deleteProduct: async (req, res) => {
        try {
            await Product.findByIdAndDelete(req.params.id);
            res.json("Delete product complete!");
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    updateProduct: async (req, res) => {
        try {
            const { categories, name, price, image} = req.body;
            // if (!image) {
            //     return res.status(400).json({ msg: "No images selected" });
            // }
            categories = await Category.findOne({ category_name: categories });
            if (!categories) {
                return res.status(400).json({ msg: "No category selected!" });
            }
            await Product.findOneAndUpdate({ _id: req.params.id }, { product_category: categories, product_name: name, product_price: price, product_image: image });
            res.json("Update product complete!");
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
};
module.exports = productCtrl;