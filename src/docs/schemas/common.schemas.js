/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       description: Usuario del sistema. La contraseña no se incluye en las respuestas públicas.
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         first_name:
 *           type: string
 *           example: "Juan"
 *         last_name:
 *           type: string
 *           example: "Pérez"
 *         email:
 *           type: string
 *           format: email
 *           example: "juan@example.com"
 *         role:
 *           type: string
 *           example: "user"
 *
 *     OrderItem:
 *       type: object
 *       properties:
 *         product:
 *           type: string
 *           description: ID del producto.
 *           example: "507f191e810c19729de860ea"
 *         quantity:
 *           type: integer
 *           example: 2
 *
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439012"
 *         user:
 *           type: string
 *           description: ID del usuario que realizó el pedido.
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         status:
 *           type: string
 *           description: Estado del pedido, restringido por el modelo.
 *         priority:
 *           type: string
 *           description: Prioridad del pedido, restringida por el modelo.
 *         total:
 *           type: number
 *           example: 2500
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     Delivery:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439013"
 *         order:
 *           type: string
 *           description: ID del pedido.
 *         driver:
 *           type: string
 *           description: ID del repartidor.
 *         status:
 *           type: string
 *           description: Estado de la entrega, restringido por el modelo.
 *         deliveredAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "error"
 *         code:
 *           type: string
 *           example: "INVALID_MOCK_QTY"
 *         message:
 *           type: string
 *           example: "qty debe ser un número entero entre 1 y 100"
 *
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         payload:
 *           description: Datos devueltos por la operación.
 *           nullable: true
 */
