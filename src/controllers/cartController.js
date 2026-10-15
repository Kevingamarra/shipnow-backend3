import cartsService from "../services/carts.service.js";

const getCarts = async (req, res, next) => {
  try {
    const carts = await cartsService.getAll();
    res.json(carts);
  } catch (error) {
    next(error);
  }
};

const getCartById = async (req, res, next) => {
  try {
    const cart = await cartsService.getById(req.params.cid);

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado"
      });
    }

    res.json(cart);
  } catch (error) {
    next(error);
  }
};

const createCart = async (req, res, next) => {
  try {
    const newCart = await cartsService.create();
    res.status(201).json(newCart);
  } catch (error) {
    next(error);
  }
};

const addProductToCart = async (req, res, next) => {
  try {
    const cart = await cartsService.addProduct(
      req.params.cid,
      req.params.pid
    );

    res.json(cart);
  } catch (error) {
    next(error);
  }
};

const deleteProductFromCart = async (req, res, next) => {
  try {
    const cart = await cartsService.deleteProduct(
      req.params.cid,
      req.params.pid
    );

    res.json(cart);
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    await cartsService.clear(req.params.cid);

    res.json({
      status: "success",
      message: "Carrito vaciado"
    });
  } catch (error) {
    next(error);
  }
};

const updateCart = async (req, res, next) => {
  try {
    const cart = await cartsService.update(
      req.params.cid,
      req.body.products
    );

    res.json(cart);
  } catch (error) {
    next(error);
  }
};

const updateProductQuantity = async (req, res, next) => {
  try {
    const cart = await cartsService.updateProductQuantity(
      req.params.cid,
      req.params.pid,
      req.body.quantity
    );

    res.json(cart);
  } catch (error) {
    next(error);
  }
};

export {
  getCarts,
  getCartById,
  createCart,
  addProductToCart,
  deleteProductFromCart,
  clearCart,
  updateCart,
  updateProductQuantity
};
