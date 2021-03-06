import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import StripeCheckout from 'react-stripe-checkout';
import {
  destroyCart,
  checkoutOrder,
  fetchRecent,
} from '../../store/thunks/orderThunk';
import { withRouter } from 'react-router';

// const pubStripeKey = process.env.STRIPE_PUBLIC_KEY;
class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderTotal: this.props.orderReducer.currentCart.total || '',
      tax: this.props.orderReducer.currentCart.tax || '',
      billingAddress: true,
      shippingAddress: true,
    };
    this.handleStripeToken = this.handleStripeToken.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    this.setState({ orderTotal: this.props.orderReducer.currentCart.total });
  }
  async handleStripeToken(token, addresses) {
    try {
      const { orderTotal } = this.state;
      const response = await axios.post('/api/orders/checkout', {
        token,
        addresses,
        amount: orderTotal,
      });

      if (response.status === 200) {
        alert('Thank you for your purchase');
        this.props.getRecent(this.props.orderReducer.currentCart.id);
        this.props.orderCheckout(this.props.orderReducer.currentCart.id);
      } else {
        alert(
          'There was an error placing your order. Please re-enter your information to try again.'
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
  handleSubmit(ev) {
    ev.preventDefault();
  }
  render() {
    return (
      <div>
        <StripeCheckout
          stripeKey="pk_test_51InBcEEes67tS3iNBPHPk9lvUj91J4oopBOiXM2e7scJ4hS7DZkLWhV0bBp67tYQs3Ngp42OCuJ14KEmzK5r98PR00mbzeN1He"
          token={this.handleStripeToken}
          billingAddress={this.state.billingAddress}
          shippingAddress={this.state.shippingAddress}
          amount={(+this.state.orderTotal + Number(this.state.tax)) * 100}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ userReducer, orderReducer }) => ({
  userReducer,
  orderReducer,
});

const mapDispatchToProps = (dispatch, { history }) => ({
  orderCheckout: (id) => dispatch(checkoutOrder(id, history)),
  getRecent: (id) => dispatch(fetchRecent(id)),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Checkout)
);
