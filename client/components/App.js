import React, { Component } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import store from "../store/store";
import axios from "axios";
import { connect } from "react-redux";
import { fetchUser, fetchUsers } from "../store/thunks/userThunk";
import AllProducts from "./PRODUCTS/AllProducts";
import SingleProduct from "./PRODUCTS/SingleProduct";
import CreateProduct from "./PRODUCTS/CreateProduct";
import EditProduct from "./PRODUCTS/EditProduct";
import AllOrders from "./ORDERS/AllOrders";
import SingleOrder from "./ORDERS/SingleOrder";
import EditOrder from "./ORDERS/EditOrder";
import OrderSummary from "./CART/OrderSummary";
import ProductReviews from "./REVIEWS/ProductReviews";
import CreateReview from "./REVIEWS/CreateReview";
import AllUsers from "./USERS/AllUsers";
import SingleUser from "./USERS/SingleUser";
import EditUser from "./USERS/EditUser";
import CreateUser from "./USERS/CreateUser";
import Cart from "./CART/Cart";
import Checkout from "./CART/Checkout";
import Login from "./NAVBAR/Login";
import Settings from "./NAVBAR/Settings";
import SignUp from "./NAVBAR/SignUp";
import Navbar from "./NAVBAR/Navbar";
import Header from "./HEADER/Header";
import AllCategories from "./CATEGORIES/AllCategories";
import SingleCategory from "./CATEGORIES/SingleCategory";
import CreateCategory from "./CATEGORIES/CreateCategory";
import EditCategory from "./CATEGORIES/EditCategory";
import About from "./ABOUT/About";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: {
        fullName: "",
        id: 1,
        isAdmin: false,
        role: "",
        first: "",
        last: "",
        password: "",
        email: "",
        createdAt: "",
        updatedAt: "",
      },
    };
  }

  async componentDidMount() {
    console.log(REACT_APP_SECRET_KEY);
    const token = window.localStorage.getItem("token");
    if (!token) {
      let response = await axios.post("/api/auth", {
        email: "guest@guest.com",
        password: "guest_pw",
      });
      const { token } = response.data;
      window.localStorage.setItem("token", token);
      // const guestUser = await axios.get('/api/users/1');
      // window.localStorage.setItem('token', guestUser.data.password);
    }
    const { data: loggedInUser } = await axios.get("/api/auth", {
      headers: {
        authorization: token,
      },
    });
    this.setState({ loggedInUser });
    await this.props.loadUsers();
    await this.props.loadUser(this.state.loggedInUser.id);
  }

  render() {
    return (
      <Router>
        <div>
          <Navbar />
          {/* <Header /> */}
          <Switch>
            <Route exact path="/" component={AllProducts} />
            <Route exact path="/categories" component={AllCategories} />
            <Route
              exact
              path="/products/:id/reviews"
              component={ProductReviews}
            />
            <Route exact path="/products" component={AllProducts} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/settings" component={Settings} />
            <Route exact path="/products/:id" component={SingleProduct} />
            <Route exact path="/createProduct" component={CreateProduct} />
            <Route exact path="/products/:id/edit" component={EditProduct} />
            <Route exact path="/categories/:id" component={SingleCategory} />
            <Route exact path="/createCategory" component={CreateCategory} />
            <Route exact path="/categories/:id/edit" component={EditCategory} />
            <Route exact path="/orders" component={AllOrders}></Route>
            <Route exact path="/orders/:id" component={SingleOrder}></Route>
            <Route exact path="/orders/:id/edit" component={EditOrder}></Route>
            <Route exact path="/users" component={AllUsers}></Route>
            <Route exact path="/users/:id" component={SingleUser}></Route>
            <Route exact path="/users/:id/edit" component={EditUser}></Route>
            <Route exact path="/signup/create" component={CreateUser}></Route>
            <Route exact path="/cart" component={Cart}></Route>
            <Route exact path="/about" component={About}></Route>
            <Route exact path="/orderSummary" component={OrderSummary}></Route>
            <Route exact path="/checkout" component={Checkout}></Route>
            {/* <Route exact path="/users/:id/edit" component={EditUser}></Route> Most likely don't need this if I am going to include the edit user form on a single user view regardless!*/}
          </Switch>
        </div>
      </Router>
    );
  }
}
const mapState = (state) => {
  return state;
};

const mapDispatch = (dispatch) => {
  return {
    loadUsers: () => dispatch(fetchUsers()),
    loadUser: (id) => dispatch(fetchUser(id)),
  };
};
export default connect(mapState, mapDispatch)(App);
