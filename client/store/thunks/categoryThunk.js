import axios from "axios";
import {
  loadCategory,
  loadCategories,
  createCategory,
  editCategory,
  deleteCategory,
} from "../actionCreators/categoryActionCreator";

const fetchCategories = () => {
  return async (dispatch) => {
    const { data: categories } = await axios.get("/api/categories");
    dispatch(loadCategories(categories));
  };
};

const fetchCategory = (categoryId) => {
  return async (dispatch) => {
    const { data: category } = await axios.get(`/api/categories/${categoryId}`);
    dispatch(loadCategory(category));
  };
};

const addCategory = (newCategory) => {
  return async (dispatch) => {
    const { data: category } = await axios.post(
      `/api/categories/`,
      newCategory
    );
    dispatch(createCategory(category));
  };
};

const destroyCategory = (category) => {
  return async (dispatch) => {
    await axios.delete(`/api/categories/${category.id}`);
    dispatch(deleteCategory(category));
  };
};

const updateCategory = (category) => {
  return async (dispatch) => {
    const { data: updatedCategory } = await axios.put(
      `/api/categories/${category.id}`,
      category
    );
    dispatch(editCategory(updatedCategory));
  };
};

export {
  fetchCategories,
  fetchCategory,
  addCategory,
  destroyCategory,
  updateCategory,
};
