import { test,describe, beforeEach, afterEach, expect } from "@jest/globals";
import { faker } from '@faker-js/faker';
import AuthController from "../../src/controllers/AuthController.js";
import CarsController from "../../src/controllers/CarsController.js";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import api from '../../axiosConfig.js';

describe("Get list of cars by Id", ()=>{
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

    let createdCarId = null; 

afterEach(async () => {
    if (createdCarId) {
        await carsController.deleteCarById(createdCarId); 
        createdCarId = null;
    }
});

   test("Should get car by id and validate structure", async () => {

        const carBrandsResponse = await carsController.getBrands();
        const brand = carBrandsResponse.data.data[0];

        const carModelsResponse = await carsController.getModels();
        const model = carModelsResponse.data.data.find(m => m.carBrandId === brand.id);

        const requestBody = {
            carBrandId: brand.id,
            carModelId: model.id,
            mileage: faker.number.int({ min: 1, max: 200_000 }),
        };

        const createResponse = await carsController.createCar(requestBody);
        expect(createResponse.status).toBe(201);

        const createdCarId = createResponse.data.data.id;

        const response = await carsController.getCarsById(createdCarId);
        expect(response.status).toBe(200);
        expect(response.data.status).toBe("ok");

        expect(response.data.data).toEqual({
            id: createdCarId,
            carBrandId: requestBody.carBrandId,
            carModelId: requestBody.carModelId,
            initialMileage: requestBody.mileage,
            carCreatedAt: expect.any(String),
            updatedMileageAt: expect.any(String),
            mileage: requestBody.mileage,
            brand: brand.title,
            model: model.title,
            logo: brand.logoFilename,
        });
    });
})