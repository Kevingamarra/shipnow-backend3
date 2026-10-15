import productsService from "../services/products.service.js";

const getProducts = async (req, res, next) => {
  try {
    const products = await productsService.getAll(req.query);

    res.json({
      status: "success",
      ...products
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await productsService.getById(req.params.pid);

    if (!product) {
      return res.status(404).json({
        error: "Producto no encontrado"
      });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const newProduct = await productsService.create(req.body);

    res.json(newProduct);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    await productsService.delete(req.params.pid);

    res.json({
      message: "Producto eliminado"
    });
  } catch (error) {
    next(error);
  }
};

export {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct
};
