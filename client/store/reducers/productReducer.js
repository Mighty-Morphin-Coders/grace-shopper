const initialState = {
  products: [],
  singleProduct: {},
};

import {
  LOAD_PRODUCTS,
  LOAD_PRODUCT,
  CREATE_PRODUCT,
  EDIT_PRODUCT,
  DELETE_PRODUCT,
} from "../actions/index";

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_PRODUCTS:
      return { ...state, products: action.products };
    case LOAD_PRODUCT:
      return { ...state, singleProduct: action.product };
    case CREATE_PRODUCT:
      return { ...state, products: [...state.products, action.product] };
    case EDIT_PRODUCT:
      const theProducts = state.products.filter(
        (product) => product.id !== action.product.id
      );
      return { ...state, products: [...theProducts, action.product] };
    case DELETE_PRODUCT:
      const leftoverProducts = state.products.filter(
        (product) => product.id !== action.product.id
      );
      return { ...state, products: leftoverProducts };
    default:
      return state;
  }
};

export default productReducer;
