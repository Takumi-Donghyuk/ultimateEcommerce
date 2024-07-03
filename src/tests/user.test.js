const request = require('supertest')
const app = require('../app')
const BASE_URL = '/api/v1/users'
let TOKEN
let userId
// Hook before All del login
beforeAll(async () => {
  const body = {
    email: "juanperez@gmail.com",
    password: "2467juper",
  }
  const res = await request(app)
    .post(`${BASE_URL}/login`)
    .send(body)
  TOKEN = res.body.token
})

// Test de post
test("POST -> 'BASE_URL', should return statusCode 201, and res.body.firstName === user.firstName", async () => {
  const user = {
    firstName: "Andrés",
    lastName: "Garzón",
    email: "andresgarzon@gmail.com",
    password: "andgar1398*",
    phone: "+57 3101005698"
  }
  const res = await request(app)
    .post(BASE_URL)
    .send(user)
  userId = res.body.id
  expect(res.statusCode).toBe(201)
  expect(res.body).toBeDefined()
  expect(res.body.firstName).toBe(user.firstName)
})

// Test de get
test("GET -> 'BASE_URL', should return statusCode 200, and res.body.length === 2", async () => {
  const res = await request(app)
    .get(BASE_URL)
    .set('Authorization', `Bearer ${TOKEN}`)

  expect(res.status).toBe(200)
})

// Test de put
test("PUT -> 'URL_BASE/:id', should return status code 200 and res.body.firstName === user.firstName", async () => {
  const user = {
    firstName: "Marian",
  }
  const res = await request(app)
    .put(`${BASE_URL}/${userId}`)
    .send(user)
    .set('Authorization', `Bearer ${TOKEN}`)

  expect(res.status).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body.firstName).toBe(user.firstName)

})


// Test de login fallido
test("POST -> 'BASE_URL/login', should return statusCode 401", async () => {
  const body = {
    email: "andresgarzon@gmail.com",
    password: "invalid password"
  }

  const res = await request(app)
    .post(`${BASE_URL}/login`)
    .send(body)

  expect(res.statusCode).toBe(401)
})


// Test de login exitoso 
test("POST -> 'BASE_URL/login', should return statusCode 200, res.body.user and res.body.token to be defined, and res.body.user.email === body.email", async () => {
  const body = {
    email: "andresgarzon@gmail.com",
    password: "andgar1398*"
  }

  const res = await request(app)
    .post(`${BASE_URL}/login`)
    .send(body)

  expect(res.status).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body.user).toBeDefined()
  expect(res.body.token).toBeDefined()
  expect(res.body.user.email).toBe(body.email)
})


// Test del delete
test("DELETE -> 'URL_BASE/:id', should return status code 204", async () => {
  const res = await request(app)
    .delete(`${BASE_URL}/${userId}`)
    .set("Authorization", `Bearer ${TOKEN}`)

  expect(res.status).toBe(204)
})