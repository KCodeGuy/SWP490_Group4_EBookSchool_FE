import axios from "axios";

export const getAllProduct = async () => {
  const res = await axios.get("https://dummyjson.com/products");
  return res.data;
};

// export const addProduct = async (data) => {
//   const res = await axios.post(`${process.env.REACT_APP_API_KEY}/product/addProduct`, data);
//   return res.data;
// };

// export const getProductById = async (id) => {
//   const res = await axios.get(`${process.env.REACT_APP_API_KEY}/product/getProductById/${id}`);
//   return res;
// };

// export const updateProduct = async (id, data) => {
//   const res = await axios.put(`${process.env.REACT_APP_API_KEY}/product/updateProduct/${id}`, data);
//   return res;
// };

// export const deleteProduct = async (id) => {
//   const res = await axios.put(`${process.env.REACT_APP_API_KEY}/product/deleteProduct/${id}`);
//   return res;
// };
