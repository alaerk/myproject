require('dotenv').config();
const app = require('./app');
const request = require('supertest');
const mongoose = require('mongoose');
const User = require('./user');
beforeAll(async()=>{  
    await mongoose.connect(process.env.test_url);
    console.log(mongoose.connection.name);
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
    });
    test('login : succeful',async()=>{
        const reg = await request(app).post('/register').send({email:'ilyassi.s.a019@gmail.com',password:'alaerk.09'});
        // console.log(reg.statusCode,reg.body);
        const res = await request(app).post('/login')
        .send({email:'ilyassi.s.a019@gmail.com',password:'alaerk.09'});
        // console.log(res.statusCode,res.body);
        expect(res.statusCode).toBe(200);
    });
    test('login : email and password are required',async()=>{
        const res = await request(app).post('/login')
        .send({email:'ilyassi.s.a019@gmail.com'});
        expect(res.statusCode).toBe(400);
    });
    test('login : password incporrect or user not exist',async()=>{
        await request(app).post('/register').send({email:'ilyassi.s.a019@gmail.com',password:'alaerk.09'});
        const res = await request(app).post('/login')
        .send({email:'ilyassi.s.a019@gmail.com',password:'alae1rk.09'});
        expect(res.statusCode).toBe(401);
    });
    test('login : Error',async()=>{
        jest.spyOn(User,'findOne').mockRejectedValue(new Error('BD down'));
        const res = await request(app).post('/login').send({email:'ilyassi.s.a019@gmail.com',password:124567});
        expect(res.statusCode).toBe(500);
    })
});