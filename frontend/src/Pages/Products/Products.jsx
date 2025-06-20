import React, { useEffect, useState } from "react";
import "./product.css";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import Swal from "sweetalert2";

const Products = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedWeights, setSelectedWeights] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://api.goelmewewale.com/api/all-category"
        );
        const fetchedCategories = response?.data;
        setCategories(fetchedCategories);

        // Automatically select the first category
        if (fetchedCategories.length > 0) {
          const firstCategory = fetchedCategories[0];
          setSelectedCategory(firstCategory._id);
          fetchProducts(firstCategory._id);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const fetchProducts = async (categoryId) => {
    try {
      const response = await axios.get(
        "https://api.goelmewewale.com/api/get-product"
      );
      const filteredProducts = response.data.products.filter(
        (product) => product.categoryName._id === categoryId
      );

      // Set default weights for each product
      const defaultWeights = {};
      filteredProducts.forEach((product) => {
        if (product.productInfo.length > 0) {
          const defaultInfo = product.productInfo[0];
          defaultWeights[product._id] = {
            weight: defaultInfo.productweight,
            price: defaultInfo.productFinalPrice,
            originalPrice: defaultInfo.productPrice,
            productDiscountPercentage: defaultInfo.productDiscountPercentage,
            stock: defaultInfo.stock,
          };
        }
      });

      setProducts(filteredProducts);
      setSelectedWeights(defaultWeights);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    fetchProducts(categoryId);
  };

  // Updated handleWeightChange to store full info per productId
  const handleWeightChange = (productId, productWeight) => {
    const selectedProduct = products.find(
      (product) => product._id === productId
    );
    const productInfo = selectedProduct?.productInfo.find(
      (info) => info.productweight === productWeight
    );

    if (productInfo) {
      setSelectedWeights((prev) => ({
        ...prev,
        [productId]: {
          weight: productWeight,
          price: productInfo.productFinalPrice,
          originalPrice: productInfo.productPrice,
          productDiscountPercentage: productInfo.productDiscountPercentage,
          stock: productInfo.stock,
        },
      }));
    }
  };

  const addToCart = (product) => {
    if (!product) return;

    const selectedWeightInfo = selectedWeights[product._id];

    if (!selectedWeightInfo || !selectedWeightInfo.weight) {
      Swal.fire({
        icon: "warning",
        title: "Select Weight",
        text: "Please select a weight before adding to cart.",
      });
      return;
    }

    const quantity = 1;

    const existingCart = JSON.parse(sessionStorage.getItem("VesLakshna")) || [];
    // Check product + weight uniqueness in cart
    const isProductInCart = existingCart.some(
      (item) =>
        item.productId === product._id &&
        item.weight === selectedWeightInfo.weight
    );

    if (isProductInCart) {
      Swal.fire({
        icon: "warning",
        title: "Product Already in Cart",
        text: "This product with the selected weight is already in your cart.",
      });
    } else {
      const cartProduct = {
        productId: product._id,
        productName: product.productName,
        productImage: product.productImage[0],
        price: selectedWeightInfo.price,
        weight: selectedWeightInfo.weight,
        quantity,
      };
      existingCart.push(cartProduct);
      sessionStorage.setItem("VesLakshna", JSON.stringify(existingCart));
      Swal.fire({
        icon: "success",
        title: "Added to Cart",
        text: `${product.productName} (${selectedWeightInfo.weight}) has been added to your cart.`,
      });
      navigate("/cart");
    }
  };

  const handleViewDetails = (productId) => {
    if (!selectedWeights[productId]) {
      Swal.fire({
        icon: "error",
        title: "Weight Not Selected",
        text: "Please select a weight before viewing details.",
      });
      return;
    }
    // Navigate to product details page with the selected weight and price
    navigate(
      `/product/product-details/${productId}?weight=${selectedWeights[productId].weight}&price=${selectedWeights[productId].price}&stock=${selectedWeights[productId].stock}`
    );
  };

  return (
    <>
      <Helmet>
        <title>
          Shipping Policy - Goelmewewale | Fast & Fresh Dry Fruit Delivery
        </title>
        <meta
          name="description"
          content="Understand Goelmewewale's shipping policy for fresh dry fruits, nuts, and seeds. Learn about our delivery times, shipping costs, and covered areas for a smooth and timely delivery right to your door."
        />
        <meta
          name="keywords"
          content="Goelmewewale shipping, dry fruit delivery, shipping policy, delivery information, shipping charges, estimated delivery, order tracking, shipping areas, fast delivery dry fruits, fresh product delivery, online dry fruit shipping, nuts delivery, seeds delivery, Goelmewewale logistics"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://goelmewewale.com/shipping-policy" />
      </Helmet>
      <section className="productsPage">
        <div className="container">
          <div className="row">
            {/* Sidebar */}
            <div className="col-md-3 productSidebar">
              <h4>Categories</h4>
              <hr />
              <ul className="category-list">
                {categories.map((category) => (
                  <li
                    key={category._id}
                    className={
                      selectedCategory === category._id ? "active-category" : ""
                    }
                    onClick={() => handleCategoryChange(category._id)}
                  >
                    {category.categoryName}
                  </li>
                ))}
              </ul>
            </div>

            {/* All Products */}
            <div className="col-md-9 all-products product-top-spacing">
              <div className="row">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="col-md-4 col-6 pruduct-spacing"
                  >
                    <div className="product-card">
                      <div
                        className="product-image"
                        onClick={() => handleViewDetails(product._id)}
                      >
                        <img
                          src={product.productImage[0]}
                          alt={product.productName}
                          className="img-fluid"
                        />
                      </div>

                      <div className="p-2">
                        <div
                          className="productName"
                          onClick={() => handleViewDetails(product._id)}
                        >
                          <h3 className="product-title">
                            {product.productName}
                          </h3>
                          <div className="price">
                            {selectedWeights[product._id]
                              ?.productDiscountPercentage > 0 ||
                            product.productInfo[0].productDiscountPercentage >
                              0 ? (
                              <>
                                <div>
                                  <span className="current-price">
                                    <del>
                                      &#8377;
                                      {selectedWeights[product._id]
                                        ?.originalPrice ||
                                        product.productInfo[0].productPrice}
                                    </del>
                                  </span>
                                  <span className="original-price">
                                    Off{" "}
                                    {selectedWeights[product._id]
                                      ?.productDiscountPercentage ||
                                      product.productInfo[0]
                                        .productDiscountPercentage}{" "}
                                    %
                                  </span>
                                </div>
                              </>
                            ) : null}
                            <div>
                              <span className="current">
                                &#8377;
                                {selectedWeights[product._id]?.price ||
                                  product.productInfo[0].productFinalPrice}
                              </span>
                            </div>
                          </div>
                        </div>

                        <label
                          htmlFor={`pot-${product._id}`}
                          className="pot-label"
                        >
                          *Weight:
                        </label>
                        <select
                          id={`pot-${product._id}`}
                          className="pot-select"
                          onChange={(e) =>
                            handleWeightChange(product._id, e.target.value)
                          }
                          value={selectedWeights[product._id]?.weight || ""}
                        >
                          <option value="">--- Please Select ---</option>
                          {product.productInfo.map((info) => (
                            <option
                              key={info.productweight}
                              value={info.productweight}
                            >
                              {info.productweight}
                            </option>
                          ))}
                        </select>

                        <div>
                          <button
                            onClick={() => addToCart(product)}
                            className="add-to-cart w-100"
                          >
                            ADD TO CART
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Products;
