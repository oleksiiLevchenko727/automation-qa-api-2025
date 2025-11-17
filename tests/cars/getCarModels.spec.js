////
import { test,describe, beforeEach, expect } from "@jest/globals";
import { faker } from '@faker-js/faker';
import AuthController from "../../src/controllers/AuthController.js";
import CarsController from "../../src/controllers/CarsController.js";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import api from '../../axiosConfig.js';

describe("Get cars models", ()=>{
    const jar = new CookieJar()
     const client = wrapper(api.create({
        validateStatus: () => true,
        jar
    }))

    const authController = new AuthController(client)
    const carsController = new CarsController(client)

    const password = `Qwerty${faker.number.int({min: 100, max: 999})}`
    const userData = {
        "name": faker.person.firstName(),
        "lastName": faker.person.lastName(),
        "email": faker.internet.email(),
        "password": password,
        "repeatPassword": password
    }

    beforeEach(async()=>{
        const signupResponse = await authController.signUp(userData);
        expect(signupResponse.status).toBe(201);

        const signinResponse = await authController.signIn({
            "email": userData.email,
            "password": userData.password,
            "remember": false
        });
        expect(signinResponse.status).toBe(200);
    }, 20000)

  test("Should be able to get a cars models", async ()=>{
  const carModelsResponse = await carsController.getModels();
  expect(carModelsResponse.status).toBe(200);
  expect(carModelsResponse.data.status).toBe("ok");

  const carModels = carModelsResponse.data.data;
  expect(Array.isArray(carModels)).toBe(true);
  expect(carModels.length).toBeGreaterThan(0);

  for (const brand of carModels) {
    expect(brand).toMatchObject({
      id: expect.any(Number),
      carBrandId: expect.any(Number),
      title: expect.any(String),
    });
  }
})
})