const { default: mongoose } = require('mongoose')
const supertest = require('supertest')
const app = require('./index');
const Post = require('./models/Post');

beforeAll((done)=>{
 mongoose.connect('mongodb://127.0.0.1:27017/test', {useNewUrlParser: true}, ()=> done());
})




describe('Integration test for posts api', ()=>{
    it('GET /api/post - works', async ()=>{
       const test = await supertest(app).get('/api/post')
       expect(test.status).toBe(200)
      expect.arrayContaining([
        expect.objectContaining({
            _id: test.body._id,
            title: expect.any(String),
            content:expect.any(String)
        })
      ])
    })

    it('POST should create new post', async ()=>{
        const data =    {
            title: "joe biden",
            content: "all about joe"
        }
        const res = await supertest(app).post('/api/posts').send(data)
        expect(res.status).toBe(200)
        expect(res.body._id).toBeTruthy(),
        expect(res.body.title).toBe(data.title)

        const avail = await Post.findOne({_id: res.body._id})
        expect(avail).toBeTruthy()
        expect(avail.title).toBe(data.title)
        expect(avail.content).toBe(data.content)
    })

    it('GET should get particular post', async()=>{
        const post = await Post.create({
            title: "The tales of Eve",
            "content":"All about Eve"
        })

        const res  =  await supertest(app).get('/api/posts/' + post._id)
        expect(res.status).toBe(200)
        expect(res.body._id).toEqual(post.id)
        expect(res.body.title).toEqual(post.title)
        expect(res.body.content).toEqual('All about Eve')
    })

    it('PATCH should update a particular post', async()=>{
        const post = await Post.create({
            title: "Lorem Ipsum",
            content: "test"
        })
        const update = {
            title: "bad ass",
            content: " Bye"
        }

        const res = await supertest(app).patch('/api/posts/' + post._id).send(update)
        expect(res.status).toBe(200)
        expect(res.body._id).toBe(post.id)
        expect(res.body.title).toBe(update.title)

        //check db
        const check = await Post.findOne({title: "bad ass"})
        expect(check.content).toBe(update.content)
    })

    it('DELETE should delete posts', async()=>{
        const post = await Post.create({
            title: "Sad",
            content:"AS F*CK"
        })
        const res = await supertest(app).delete('/api/posts/' + post._id)
        expect(res.status).toBe(204)
        expect(await Post.findOne({_id: post.id})).toBeFalsy()
    })
})



jest.setTimeout(50000)