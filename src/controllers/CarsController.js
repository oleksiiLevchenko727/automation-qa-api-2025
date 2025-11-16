import BaseController from "./BaseController.js";


export default class CarsController extends BaseController {

    getBrands(){
        return this.client.get('/api/cars/brands');
    }

    getBrandsById(id){
        return this.client.get(`/api/cars/brands/${id}`);
    }

    getModels(){
        return this.client.get('/api/cars/models');
    }

    getModelsById(id){
        return this.client.get(`/api/cars/models/${id}`);
    }

    getCars(){
        return this.client.get('/api/cars');
    }

    createCar(carData){
        return this.client.post('/api/cars', carData );
    }

    getCarsById(id){
        return this.client.get(`/api/cars/${id}`);
    }

    putCarById(id, carData){
        return this.client.put(`/api/cars/${id}`, carData);
    }

    deleteCarById(id){
        return this.client.delete(`/api/cars/${id}`);
    }
}