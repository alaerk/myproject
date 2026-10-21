const app = require('./app');
const request = require('supertest');
const mongoose = require('mongoose');
const User = require('./user');
require('dotenv').config();
beforeAll(async()=>{
    await mongoose.connect(process.env.test_url);
})
beforeEach(async()=>{
    await User.deleteMany({});
})
afterAll(async()=>{
   await mongoose.connection.close();
})
describe('Auth API',()=>{
    test('registre : Succses ',async ()=>{
        const res = await request(app).post('/register').send({email:'ilyassi.s.a019@gmail.com',password:'alaerk.09'})
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('user created with succeful');
    });
    test('register : password required',async()=>{
        const res = await request(app).post('/register').send({email:'ilyassi.s.a019@gmail.com'});
        expect(res.statusCode).toBe(400);
    });
    test('register : email required',async()=>{
        const res = await request(app).post('/register').send({password:'alaerk.09'});
        expect(res.statusCode).toBe(400);
    });
    test('register : email exist',async()=>{
        await request(app).post('/register').send({email:'ilyassi.s.a019@gmail.com',password:'alaerk.09'});
        const res = await request(app).post('/register').send({email:'ilyassi.s.a019@gmail.com',password:'alaerk.09'});
        expect(res.statusCode).toBe(409);
    })
});