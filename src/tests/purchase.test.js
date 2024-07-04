require("../models")
const request = require("supertest")
const app = require("../app")
const Product = require("../models/Product")
const BASE_URL_USERS = "/api/v1/users"
const BASE_URL = "/api/v1/purchase"
let TOKEN
let userId
let productContent
let product
let cartContent

beforeAll(async () => {
  const body = {
    email: "juanperez@gmail.com",
    password: "2467juper",
  }
  const res = await request(app)
    .post(`${BASE_URL_USERS}/login`)
    .send(body)
    TOKEN = res.body.token
    userId = res.body.user.id
    productContent = {
        title: "Cubiertos dorados",
        description: "Cubetería de acero inoxidable",
        price: 358
      }
    product = await Product.create(productContent)
    cartContent = {
        quantity: 1,
        productId: product.id
    }
 await request(app)
    .post('/api/v1/cart')
    .send(cartContent)
    .set("Authorization", `Bearer ${TOKEN}`)
})
afterAll(async () => {
  await product.destroy()
})
test("POST 'BASE_URL', should return status code 201 and res.body.quantity ===cartContent.quantity", async () => {
  const res = await request(app)
    .post(BASE_URL)
    .set("Authorization", `Bearer ${TOKEN}`)
  expect(res.status).toBe(201)
  expect(res.body[0].quantity).toBe(cartContent.quantity)
})
test("GET -> 'BASE_URL', should return status code 200 res.body.length === 1", async () => {
  const res = await request(app)
    .get(BASE_URL)
    .set("Authorization", `Bearer ${TOKEN}`)
  expect(res.status).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body).toHaveLength(1)
  expect(res.body[0].userId).toBeDefined()
  expect(res.body[0].userId).toBe(userId)
  expect(res.body[0].product).toBeDefined()
  expect(res.body[0].productId).toBe(product.id)
})

