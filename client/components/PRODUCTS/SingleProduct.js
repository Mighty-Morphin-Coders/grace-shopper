import React, { Component } from "react";
import { connect } from "react-redux";

import { fetchProduct } from "../../store/thunks/productThunk";

class SingleProduct extends Component {
  componentDidMount() {
    this.props.getProduct(Number(this.props.match.params.id));
  }
  render() {
    const { singleProduct } = this.props.productReducer;

    // if (!this.props.productReducer) return null;
    // console.log(this.props);
    // console.log("props are: ", this.props.productReducer.singleProduct);
    // const { singleProduct } = this.props.productReducer;
    // console.log("single product is: ", singleProduct);
    return (
      <div id="single-product">
        <h1>{singleProduct.name}</h1>
        <img src={singleProduct.image}></img>
        <p>{singleProduct.description}</p>
        <h3>${singleProduct.price}</h3>
        <p>Size: {singleProduct.size} </p>
        <p>{singleProduct.inventory} of these beauties in stock!</p>
      </div>
    );
  }
}

const mapStateToProps = ({ productReducer }) => ({
  productReducer,
});

const mapDispatchToProps = (dispatch) => ({
  getProduct: (id) => dispatch(fetchProduct(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SingleProduct);
