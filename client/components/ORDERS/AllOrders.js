import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchOrders } from "../../store/thunks/orderThunk";
import { fetchUser } from "../../store/thunks/userThunk";

class AllOrders extends React.Component {
  constructor(props) {
    super(props);
    this.props.loadUser(Number(window.localStorage.userId));
    this.renderOrders = this.renderOrders.bind(this);
    this.state = {
      orders: [],
    };
  }
  async componentDidMount() {
    await this.props.loadUser(Number(window.localStorage.userId));
    await this.props.getOrders();
    this.setState({ orders: this.props.orderReducer.orders });
  }
  renderOrders(orderType) {
    const filteredOrders = this.props.orderReducer.orders.filter(
      (order) => order.status === orderType
    );
    this.setState({ orders: filteredOrders });
  }
  render() {
    const activeUser = this.props.userReducer.selectedUser;
    if (activeUser.isAdmin) {
      return (
        <div>
          <div>
            <button onClick={() => this.renderOrders("in progress")}>
              in progress
            </button>
            <button onClick={() => this.renderOrders("created")}>
              created
            </button>
            <button onClick={() => this.renderOrders("processing")}>
              processing
            </button>
            <button onClick={() => this.renderOrders("cancelled")}>
              cancelled
            </button>
            <button onClick={() => this.renderOrders("completed")}>
              completed
            </button>
          </div>
          <div>
            {this.state.orders.map((order) => {
              return (
                <Link key={order.id} to={`/orders/${order.id}`}>
                  <div>
                    <div>
                      {order.tracking_number}: {order.status}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      );
    } else if (activeUser.isAdmin === false) {
      return (
        <div>
          {this.props.orderReducer.orders
            .filter((order) => order.userId === activeUser.id)
            .filter((order) => order.status !== "in progress")
            .map((filteredOrder) => {
              return (
                <Link key={filteredOrder.id} to={`/orders/${filteredOrder.id}`}>
                  <div key={filteredOrder.id}>
                    {filteredOrder.tracking_number}
                  </div>
                </Link>
              );
            })}
        </div>
      );
    } else {
      return <div>Log in to view your orders!</div>;
    }
  }
}
const mapStateToProps = ({ orderReducer, userReducer }) => ({
  orderReducer,
  userReducer,
});

const mapDispatchToProps = (dispatch) => ({
  getOrders: () => dispatch(fetchOrders()),
  loadUser: (id) => dispatch(fetchUser(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AllOrders);
