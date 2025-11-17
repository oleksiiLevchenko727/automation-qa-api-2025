////
import { test,describe, beforeEach, expect } from "@jest/globals";
import { faker } from '@faker-js/faker';
import AuthController from "../../src/controllers/AuthController.js";
import CarsController from "../../src/controllers/CarsController.js";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import api from '../../axiosConfig.js';

describe("Change car by Id", ()=>{
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

    test(" #6 Should be able to create a Car",async ()=>{
        const carBrandsResponse = await carsController.getBrands();
    const brand = carBrandsResponse.data.data[0];

    const carModelsResponse = await carsController.getModels();
    const model = carModelsResponse.data.data.find(m => m.carBrandId === brand.id);

    const createBody = {
        carBrandId: brand.id,
        carModelId: model.id,
        mileage: faker.number.int({ min: 1, max: 200_000 }),
    };

    const createResponse = await carsController.createCar(createBody);
    expect(createResponse.status).toBe(201);

    const createdCar = createResponse.data.data;
    const carId = createdCar.id;

    const updateBody = {
        mileage: faker.number.int({ min: 100_000, max: 300_000 }),
        carBrandId: brand.id,
        carModelId: model.id
    };

    const updateResponse = await carsController.putCarById(carId, updateBody);
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.data.status).toBe("ok");

    const updatedCar = updateResponse.data.data;
    const expectedUpdatedCar = {
        id: carId,
        carBrandId: updateBody.carBrandId,
        carModelId: updateBody.carModelId,
        initialMileage: createBody.mileage,
        carCreatedAt: expect.any(String),
        updatedMileageAt: expect.any(String),
        mileage: updateBody.mileage,
        brand: brand.title,
        model: model.title,
        logo: brand.logoFilename,
    };

    expect(updatedCar).toEqual(expectedUpdatedCar);
    })
    // expect(moment(beforeCarCreatedTime).diff(moment(createdCar.carCreatedAt), "minute")).toBeLessThanOrEqual(1)
    // expect(moment(beforeCarCreatedTime).diff(moment(createdCar.updatedMileageAt), "minute")).toBeLessThanOrEqual(1)
})