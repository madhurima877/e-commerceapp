const express = require("express");
const router =  express.Router();
const Product = require("../models/Product");


// get all the products

router.get("/", async(req,res)=>{

    const products =  await Product.find({});
//   const message=req.flash("success");
    res.render("products/index",{products})
})

// get form to create new product

router.get("/new", (req,res)=>{

    res.render("products/new")

})

// create a new product

router.post("/",async(req,res)=>{

    const {name, img, price, desc} = req.body;

     await Product.create({name, price, desc, img});
   
     req.flash("success","Product added successfully!");

     res.redirect("/products")
})


// show product route

router.get("/:productid", async(req,res)=>{

    const {productid} = req.params;

      const product = await Product.findById(productid).populate("reviews");

     // console.log(product)

      res.render("products/show", {product})

})

// get edit form

router.get("/:productid/edit", async(req,res)=>{

    const {productid} = req.params;

    const product = await Product.findById(productid);
  
      res.render("products/edit", {product})
})

router.patch("/:productid", async(req,res)=>{

     const {productid} = req.params;

     const {name,img,price, desc} =req.body;

     await Product.findByIdAndUpdate(productid, {name, price, img, desc});
    
     req.flash("success","Product edited successfully!");
     res.redirect(`/products/${productid}`)
})


router.delete("/:productid", async(req,res)=>{

    const {productid} = req.params;

    await Product.findByIdAndDelete(productid);

    req.flash("error","Product deleted successfully!");
    res.redirect("/products")

  
   
})

module.exports = router