////
import { test,describe, beforeEach, expect } from "@jest/globals";
import { faker } from '@faker-js/faker';
import AuthController from "../../src/controllers/AuthController.js";
import CarsController from "../../src/controllers/CarsController.js";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import api from '../../axiosConfig.js';

describe("Get cars brands", ()=>{
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

  test("Should be able to get a cars brands", async ()=>{
  const carBrandsResponse = await carsController.getBrands();
  expect(carBrandsResponse.status).toBe(200);
  expect(carBrandsResponse.data.status).toBe("ok");

  const carBrands = carBrandsResponse.data.data;
  expect(Array.isArray(carBrands)).toBe(true);
  expect(carBrands.length).toBeGreaterThan(0);

  for (const brand of carBrands) {
    expect(brand).toMatchObject({
      id: expect.any(Number),
      title: expect.any(String),
      logoFilename: expect.any(String),
    });
  }
})
})