import React, { useEffect, useState } from "react";
import "../Products/product.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";

const AllProduct = ({ refs, setRef }) => {
  const [products, setProducts] = useState([]);
  const [selectedWeights, setSelectedWeights] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search");
    fetchProducts(searchQuery);
  }, [location.search]);

  const fetchProducts = async (searchQuery) => {
    try {
      const response = await axios.get(
        "https://api.goelmewewale.com/api/get-product"
      );
      let filteredProducts = response.data.products.filter(
        (product) => product.productStatus === true
      );

      if (searchQuery) {
        filteredProducts = filteredProducts.filter((product) =>
          product.productName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

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

  const handleViewDetails = (productId) => {
    if (!selectedWeights[productId]) {
      Swal.fire({
        icon: "error",
        title: "Weight Not Selected",
        text: "Please select a weight before viewing details.",
      });
      return;
    }
    const { weight, price, stock } = selectedWeights[productId];
    navigate(
      `/product/product-details/${productId}?weight=${weight}&price=${price}&stock=${stock}`
    );
  };

  const addToCart = (product) => {
    const selected = selectedWeights[product._id];
    if (!selected) return;

    const existingCart = JSON.parse(sessionStorage.getItem("VesLakshna")) || [];
    const isProductInCart = existingCart.some(
      (item) => item.productId === product._id
    );

    if (isProductInCart) {
      Swal.fire({
        icon: "warning",
        title: "Product Already in Cart",
        text: "This product is already in your cart.",
      });
    } else {
      const cartProduct = {
        productId: product._id,
        productName: product.productName,
        productImage: product.productImage[0],
        price: selected.price,
        weight: selected.weight,
        quantity: 1,
      };
      existingCart.push(cartProduct);
      sessionStorage.setItem("VesLakshna", JSON.stringify(existingCart));
      dispatch({ type: "ADD_PRODUCT", payload: ["ADD_PRODUCT", existingCart] });
      setRef(!refs);
      Swal.fire({
        icon: "success",
        title: "Added to Cart",
        text: `${product.productName} has been added to your cart.`,
      });
    }
  };

  return (
    <>
      <Helmet>
    <title>Our Products - Goelmewewale | Premium Dry Fruits, Nuts & Seeds</title>
    <meta
        name="description"
        content="Explore Goelmewewale's extensive range of high-quality dry fruits, nutritious nuts, and healthy seeds. Discover fresh almonds, cashews, walnuts, pistachios, dates, raisins, chia seeds, pumpkin seeds, and more for a healthier lifestyle."
    />
    <meta
        name="keywords"
        content="Goelmewewale products, buy dry fruits online, premium nuts, healthy seeds, fresh almonds, quality cashews, organic walnuts, pistachios for sale, sweet dates, natural raisins, crunchy figs, dried apricots, sunflower seeds, pumpkin seeds, chia seeds, flax seeds, healthy snacks, superfoods, bulk dry fruits, dry fruit delivery, best prices dry fruits, online dry fruit store, Goelmewewale shop"
    />
</Helmet>
      <section className="productsPage">
        <div className="container">
          <div className="row">
            <div className="col-md-12 all-products product-top-spacing">
              <div className="row">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="col-md-3 col-6 pruduct-spacing"
                  >
                    <div className="product-card-page">
                      <div
                        className="product-image-product"
                        onClick={() => handleViewDetails(product._id)}
                      >
                        <img
                          src={product.productImage[0]}
                          alt={product.productName}
                          className="img-fluid"
                        />
                      </div>
                      <div
                        className="productName"
                        onClick={() => handleViewDetails(product._id)}
                      >
                        <h3 className="product-title">{product.productName}</h3>
                        <div className="price">
                          {selectedWeights[product._id]
                            ?.productDiscountPercentage > 0 && (
                            <>
                              <span className="current-price">
                                <del>
                                  &#8377;
                                  {selectedWeights[product._id]?.originalPrice}
                                </del>
                              </span>
                              <br />
                              <span className="current-price text-danger">
                                Off{" "}
                                {
                                  selectedWeights[product._id]
                                    ?.productDiscountPercentage
                                }
                                %
                              </span>
                              <br />
                            </>
                          )}
                          <span className="current-price">
                            &#8377;{selectedWeights[product._id]?.price}
                          </span>
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
                        {product.productInfo.map((info) => (
                          <option
                            key={info.productweight}
                            value={info.productweight}
                          >
                            {info.productweight}
                          </option>
                        ))}
                      </select>
                      <div
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
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AllProduct;
