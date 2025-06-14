import React, { useState, useEffect } from "react";
import "./product-tabs.css";
import Slider from "react-slick";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const ProductsTabs = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [selectedWeights, setSelectedWeights] = useState({}); // New state for selected weights

  const settings = {
    dots: true,
    infinite: true, // changed from false to true for smoother UX
    speed: 400,
    autoplay: true,
    autoplaySpeed: 3000, // autoplay every 3s
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2, // typically better on small screens
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],
  };

  useEffect(() => {
    axios
      .get("https://api.goelmewewale.com/api/all-category")
      .then((response) => {
        setCategories(response.data);
        if (response.data.length > 0) setActiveTab(response.data[0]._id);
      });
  }, []);

  useEffect(() => {
    if (activeTab) {
      axios
        .get("https://api.goelmewewale.com/api/get-product")
        .then((response) => {
          const filteredProducts = response.data.products.filter(
            (product) => product.categoryName._id === activeTab
          );
          setProducts(
            filteredProducts.filter((product) => product.productStatus === true)
          );

          // Initialize selected weights for each product
          const initialWeights = {};
          filteredProducts.forEach((product) => {
            initialWeights[product._id] =
              product.productInfo[0]?.productweight || "";
          });
          setSelectedWeights(initialWeights);
        })
        .catch((error) => console.error(error));
    }
  }, [activeTab]);

  const handleWeightChange = (productId, weight) => {
    setSelectedWeights((prev) => ({
      ...prev,
      [productId]: weight,
    }));
  };

  const addToCart = (product) => {
    if (!product) return;

    const selectedWeight = selectedWeights[product._id];
    if (!selectedWeight) {
      Swal.fire({
        icon: "warning",
        title: "Select Weight",
        text: "Please select a weight before adding to cart.",
      });
      return;
    }

    const selectedInfo = product.productInfo.find(
      (info) => info.productweight === selectedWeight
    );

    if (!selectedInfo) {
      Swal.fire({
        icon: "error",
        title: "Invalid Selection",
        text: "Selected weight is not available for this product.",
      });
      return;
    }

    const quantity = 1;
    const price = selectedInfo.productFinalPrice;

    const existingCart = JSON.parse(sessionStorage.getItem("VesLakshna")) || [];
    const isProductInCart = existingCart.some(
      (item) => item.productId === product._id && item.weight === selectedWeight
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
        price: price,
        weight: selectedWeight,
        quantity,
      };
      existingCart.push(cartProduct);
      sessionStorage.setItem("VesLakshna", JSON.stringify(existingCart));
      Swal.fire({
        icon: "success",
        title: "Added to Cart",
        text: `${product.productName} has been added to your cart.`,
      });
      navigate("/cart");
    }
  };

  const handleViewDetails = (productId) => {
    const selectedWeight = selectedWeights[productId];

    if (!selectedWeight) {
      Swal.fire({
        icon: "error",
        title: "Weight Not Selected",
        text: "Please select a weight before viewing details.",
      });
      return;
    }

    const selectedProductInfo = products
      .find((product) => product._id === productId)
      ?.productInfo.find((info) => info.productweight === selectedWeight);

    if (selectedProductInfo) {
      navigate(
        `/product/product-details/${productId}?weight=${selectedWeight}&price=${selectedProductInfo.productFinalPrice}&stock=${selectedProductInfo.stock}`
      );
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid Selection",
        text: "Please select a valid weight.",
      });
    }
  };

  return (
    <section className="products-tabs mt-3">
      <div className="container">
        <div className="product_heading_tab">
          <div className="tabsection">
            <h2>
              <b>Pure Dry Fruits & More </b> <br />
              Bringing Nature’s Goodness to Your Home!
            </h2>
          </div>
          <div className="tabs">
            {categories.slice(0, 7).map((category) => (
              <button
                key={category._id}
                className={`tab-button ${
                  activeTab === category._id ? "active" : ""
                }`}
                onClick={() => setActiveTab(category._id)}
                style={{ textTransform: "capitalize", fontSize: "14px" }}
              >
                {category.categoryName}
              </button>
            ))}
          </div>
        </div>

        <div className="tab-content mt-3">
          <div className="slider-container">
            {products.length > 0 ? (
              <Slider {...settings}>
                {products.map((product, index) => {
                  const selectedWeight = selectedWeights[product._id];
                  const selectedProductInfo = product.productInfo.find(
                    (info) => info.productweight === selectedWeight
                  );

                  return (
                    <div
                      key={product._id}
                      style={{ width: "100%", background: "red" }}
                    >
                      <div className="product-card">
                        {/* <Link to={"/product/product-details"}> */}
                        <div
                          className="product-image"
                          onClick={() => handleViewDetails(product._id)}
                        >
                          <img
                            src={product.productImage[0]}
                            alt={`Product ${index + 1}`}
                          />
                        </div>
                        <div className="p-2">
                          <div
                            className="productName"
                            onClick={() => handleViewDetails(product._id)}
                          >
                            <h3 className="product-title">
                              {product.productName.length > 15
                                ? product.productName.slice(0, 15) + "..."
                                : product.productName}{" "}
                            </h3>
                            <div className="price text-end">
                              {selectedProductInfo?.productDiscountPercentage >
                              0 ? (
                                <>
                                  <div>
                                    <span className="current-price">
                                      <del>
                                        ₹{" "}
                                        {selectedProductInfo?.productPrice ||
                                          "0.00"}
                                      </del>
                                    </span>
                                  </div>
                                  <div className="mobile-original-price">
                                    <span className="original-price">
                                      Off{" "}
                                      {
                                        selectedProductInfo.productDiscountPercentage
                                      }{" "}
                                      %
                                    </span>
                                  </div>
                                  <div>
                                    {selectedProductInfo?.productFinalPrice && (
                                      <span className="current">
                                        ₹{" "}
                                        {selectedProductInfo.productFinalPrice}
                                      </span>
                                    )}
                                  </div>
                                </>
                              ) : (
                                <div>
                                  <span className="current">
                                    ₹ {selectedProductInfo.productFinalPrice}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          {/* </Link> */}
                          <label
                            htmlFor={`pot-${product._id}`}
                            className="pot-label"
                          >
                            *Weight:
                          </label>
                          <select
                            id={`pot-${product._id}`}
                            className="pot-select"
                            value={selectedWeights[product._id] || ""}
                            onChange={(e) =>
                              handleWeightChange(product._id, e.target.value)
                            }
                          >
                            <option value="">--- Please Select ---</option>
                            {product.productInfo.map((info, idx) => (
                              <option key={idx} value={info.productweight}>
                                {info.productweight}
                              </option>
                            ))}
                          </select>

                          <div
                            className=""
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: 5,
                            }}
                          >
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
                  );
                })}
              </Slider>
            ) : (
              <p>No products found.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsTabs;
