// const request = require("supertest");
// const { Courses } = require("../../models/course");
// const { User } = require("../../models/user");
// const mongoose = require("mongoose");

// let server;

// describe("/api/courses", () => {
//   beforeEach(() => {
//     server = require("../../index");
//   });
//   afterEach(async () => {
//     await User.remove({});
//     await Course.remove({});
//     await server.close();
//   });

//   describe("GET /", () => {

//     let token;
//     let path;

//     const exec = ()=>{
//         return request(server).set('x-auth-token', ).get(path)
//     }

//     beforeEach(async()=>{
//         token:
//     })

//     it("should return all courses", async () => {
//       await Courses.collection.insertMany([
//         {
//           name: "course1",
//           number: "1",
//           university: mongoose.Types.ObjectId(),
//           major: mongoose.Types.ObjectId()
//         },
//         {
//           name: "course2",
//           number: "2",
//           university: mongoose.Types.ObjectId(),
//           major: mongoose.Types.ObjectId()
//         }
//       ]);

//       const res = await request(server).get("/api/genres");

//       expect(res.status).toBe(200);
//       expect(res.body.length).toBe(2);
//       expect(res.body.some(g => g.name === "course1")).toBeTruthy();
//       expect(res.body.some(g => g.name === "course2")).toBeTruthy();
//     });
//   });
//   describe("GET /course/:id", () => {
//     it("should retrun a course for the given Id", async () => {
//       const course = new Courses({
//         name: "course1",
//         number: "1",
//         university: mongoose.Types.ObjectId(),
//         major: mongoose.Types.ObjectId()
//       });
//       await course.save();

//       const res = await request(server).get(
//         "/api/courses/course/" + course._id
//       );

//       expect(res.status).toBe(200);
//       expect(res.body).toHaveProperty("name", course.name);
//     });

//     it("should return 404 if no course with the given id exists", async () => {
//       const id = mongoose.Types.ObjectId();

//       const res = await request(server).get("/api/courses/course" + id);

//       expect(res.status).toBe(404);
//     });
//   });

//   describe("GET /:id/students", () => {
//     it("should return students lists for the given courseId", async () => {
//       const course = new Course({
//         name: "course1",
//         number: "1",
//         university: mongoose.Types.ObjectId(),
//         major: mongoose.Types.ObjectId()
//       });
//       await course.save();

//       const user = new User({
//         email: "a@b.c",
//         password: 123456,
//         courses: [course._id],
//         userName: "username"
//       });
//       await user.save();

//       const res = await request(server).get("/api/" + course._id + "/students");

//       expect(res.status).toBe(200);
//       expect(res.body).toHaveProperty("_id", user._id);
//     });

//     it("should return 404 if no course with the given Id exists", async()=>{
//         const id =mongoose.Types.ObjectId();

//         const res = await request(server).get("/api/"+id+"/students")

//         expect(res.status).toBe(404);
//     })
//   });
// });
