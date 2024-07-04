const request = require("supertest")
const app = require('../app')
const path = require('path')
let TOKEN
let imageId
const BASE_URL = '/api/v1/productImgs'
const BASE_URL_USERS = '/api/v1/users'

beforeAll(async () => {
    const body = {
    email: "juanperez@gmail.com",
    password: "2467juper",
  }
  const res = await request(app)
    .post(`${BASE_URL_USERS}/login`)
    .send(body)
  TOKEN = res.body.token
})

/*Asegura que:
Se haga autenticación con un token y subida de Imagen
En el caso de éxito devuelve un código de estado 201 (creado) y los campos url y filename de la imagen subida están presentes y definidos en la respuesta.*/
test("POST -> 'BASE_URL', async() should return status code 201, res.body.url, res.body.filename to be Defined", async () => {
  const localImage = path.join(__dirname, 'createData', 'imageTest.jpg')
  const res = await request(app)
    .post(BASE_URL)
    .set("Authorization", `Bearer ${TOKEN}`)
    .attach('image', localImage)
  imageId = res.body.id
  expect(res.status).toBe(201)
  expect(res.body.url).toBeDefined()
  expect(res.body.filename).toBeDefined()
})

test("Delete, 'BASE_URL', should return statusCode 204", async () => {
  const res = await request(app)
    .delete(`${BASE_URL}/${imageId}`)
    .set("Authorization", `Bearer ${TOKEN}`)
  expect(res.statusCode).toBe(204)
})

