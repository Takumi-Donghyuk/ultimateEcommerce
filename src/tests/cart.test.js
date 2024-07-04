require("../models")
const request = require("supertest")
const app = require("../app")
const Product = require("../models/Product")
const BASE_URL_USERS = "/api/v1/users"
const BASE_URL = "/api/v1/cart"
let TOKEN
let productContent
let cartContent
let product
let userId
let cartId

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

})

test("POST -> 'BASE_URL', should return status code 201 and res.body.quantity === cartContent.quantity", async () => {
  const res = await request(app)
    .post(BASE_URL)
    .send(cartContent)
    .set("Authorization", `Bearer ${TOKEN}`)
  cartId = res.body.id
  expect(res.status).toBe(201)
  expect(res.body).toBeDefined()
  expect(res.body.quantity).toBe(cartContent.quantity)
  expect(res.body.userId).toBe(userId)
})

test("GET -> 'BASE_URL',should return status code 200 and res.body.length === 1", async () => {
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
  expect(res.body[0].product.id).toBe(product.id)
})

test("GET -> 'BASE_URL/:id',should return status code 200 and res.body.quantity === cartContent.quantity", async () => {
  const res = await request(app)
    .get(`${BASE_URL}/${cartId}`)
    .set("Authorization", `Bearer ${TOKEN}`)
  expect(res.status).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body.quantity).toBe(cartContent.quantity)
  expect(res.body.userId).toBeDefined()
  expect(res.body.userId).toBe(userId)
  expect(res.body.product).toBeDefined()
  expect(res.body.productId).toBe(product.id)
  expect(res.body.product.id).toBe(product.id)

})

test("PUT -> 'BASE_URL/:id',should return status code 200 and res.body.quantity ===  contentUpdate.quantity", async () => {
  const contentUpdate = {
    quantity: 2
  }
  const res = await request(app)
    .put(`${BASE_URL}/${cartId}`)
    .send(contentUpdate)
    .set("Authorization", `Bearer ${TOKEN}`)
  expect(res.status).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body.quantity).toBe(contentUpdate.quantity)
})

test("DELETE -> 'BASE_URL/:id',should return status code 204", async () => {
  const res = await request(app)
    .delete(`${BASE_URL}/${cartId}`)
    .set("Authorization", `Bearer ${TOKEN}`)
  expect(res.status).toBe(204)
  await product.destroy()
})
