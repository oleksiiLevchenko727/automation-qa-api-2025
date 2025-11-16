import { test,describe, beforeEach, expect } from "@jest/globals";
import { faker } from '@faker-js/faker';
import AuthController from "../../src/controllers/AuthController.js";
import CarsController from "../../src/controllers/CarsController.js";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import api from '../../axiosConfig.js';

describe("Create car", ()=>{
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

    test("Should be able to create a Car",async ()=>{
        const carBrandsResponse = await carsController.getBrands();
        const brand = carBrandsResponse.data.data[0]

        const carModelsResponse = await carsController.getModels()
        const model = carModelsResponse.data.data.find(model => model.carBrandId === brand.id)

        const requestBody = {
            carBrandId: brand.id,
            carModelId: model.id,
            mileage: faker.number.int({ min: 1, max: 200_000 }),
        }

        const beforeCarCreatedTime = new Date();
        const response = await carsController.createCar(requestBody);
        expect(response.status).toBe(201);
        expect(response.data.status).toBe("ok");


        const createdCar = response.data.data;
        const expectedData = {
            "id": expect.any(Number),
            "carBrandId": requestBody.carBrandId,
            "carModelId": requestBody.carModelId,
            "initialMileage": requestBody.mileage,
            "carCreatedAt":  expect.any(String) , //"2021-05-17T15:26:36.000Z",
            "updatedMileageAt":  expect.any(String) , //"2021-05-17T15:26:36.000Z",
            "mileage": requestBody.mileage,
            "brand": brand.title,
            "model": model.title,
            "logo": brand.logoFilename
        }
        expect(createdCar).toEqual(expectedData)

        const carByIdResponse = await carsController.getCarsById(createdCar.id)
        expect(carByIdResponse.status).toBe(200);
        expect(carByIdResponse.data.data).toEqual(expectedData);
    })
})