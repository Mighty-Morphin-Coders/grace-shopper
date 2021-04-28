//all users
export const LOAD_PRODUCTS = "LOAD_PRODUCTS";
export const LOAD_PRODUCT = "LOAD_PRODUCT";

export const EDIT_USER = "EDIT_USER";
export const DELETE_USER = "DELETE_USER";

export const LOAD_USER = "LOAD_USER";
export const LOAD_ORDERS = "LOAD_ORDERS";

export const LOAD_CATEGORIES = "LOAD_CATEGORIES";
//admin should not be able to edit an order (unless something becomes out of stock - edge case to deal with later?)
// export const EDIT_ORDER = "EDIT_ORDER";
//export const DELETE_ORDER = 'DELETE_ORDER';
//loading orders is to look at all past, COMPLETE orders
export const LOAD_ORDERS = "LOAD_ORDERS";
//a cart is an order that's status is "in progress"
export const EDIT_CART = "EDIT_CART";
export const DELETE_CART = "DELETE_CART";
export const LOAD_CART = "LOAD_CART";

export const LOAD_REVIEWS = "LOAD_REVIEWS";
export const CREATE_REVIEW = "CREATE_REVIEW";
export const EDIT_REVIEW = "EDIT_REVIEW";
export const DELETE_REVIEW = "DELETE_REVIEW";

//admin actions

export const CREATE_CATEGORY = "CREATE_CATEGORY";
export const EDIT_CATEGORY = "EDIT_CATEGORY";
export const DELETE_CATEGORY = "DELETE_CATEGORY";

export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const EDIT_PRODUCT = "EDIT_PRODUCT";
export const DELETE_PRODUCT = "DELETE_PRODUCT";

export const LOAD_USERS = "LOAD_USERS";
