const request = require("supertest");
const { Course } = require("../../models/course");
const { User } = require("../../models/user");
const mongoose = require("mongoose");

let server;

describe("/api/courses", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await User.remove({});
    await Course.remove({});
    await server.close();
  });

  describe("GET /", () => {
    it("should return all courses", async () => {
      await Course.collection.insertMany([
        {
          name: "course1",
          number: "1",
          university: mongoose.Types.ObjectId(),
          major: mongoose.Types.ObjectId()
        },
        {
          name: "course2",
          number: "2",
          university: mongoose.Types.ObjectId(),
          major: mongoose.Types.ObjectId()
        }
      ]);

      const res = await request(server)
        .get("/api/courses")
        .set("x-auth-token", new User().generateAuthToken());

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.name === "course1")).toBeTruthy();
      expect(res.body.some(g => g.name === "course2")).toBeTruthy();
    });
  });

  describe("GET /course/:id", () => {
    it("should retrun a course for the given Id", async () => {
      const course = new Course({
        name: "course1",
        number: "1",
        university: mongoose.Types.ObjectId(),
        major: mongoose.Types.ObjectId()
      });
      await course.save();

      const res = await request(server)
        .get("/api/courses/course/" + course._id)
        .set("x-auth-token", new User().generateAuthToken());

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", course.name);
    });

    it("should return 404 if no course with the given id exists", async () => {
      const id = mongoose.Types.ObjectId();

      const res = await request(server)
        .get("/api/courses/course" + id)
        .set("x-auth-token", new User().generateAuthToken());

      expect(res.status).toBe(404);
    });
  });

  describe("GET /:id/students", () => {
    it("should return student lists for the given courseId", async () => {
      const course = new Course({
        name: "course1",
        number: "1",
        university: mongoose.Types.ObjectId(),
        major: mongoose.Types.ObjectId()
      });
      await course.save();

      const user = new User({
        email: "a@b.c",
        password: 123456,
        courses: [course._id]
      });
      await user.save();

      const res = await request(server)
        .get("/api/courses/" + course._id + "/students")
        .set("x-auth-token", user.generateAuthToken());

      expect(res.status).toBe(200);
      expect(res.body.some(g => g._id == user._id)).toBeTruthy();
    });

    it("should return 404 if no course with the given Id exists", async () => {
      const id = mongoose.Types.ObjectId();

      const res = await request(server)
        .get("/api/courses" + id + "/students")
        .set("x-auth-token", new User().generateAuthToken());

      expect(res.status).toBe(404);
    });
  });

  describe("GET /mycourses", () => {
    it("should return user's course list", async () => {
      const course = new Course({
        name: "course1",
        number: "1",
        university: mongoose.Types.ObjectId(),
        major: mongoose.Types.ObjectId()
      });
      await course.save();

      const user = new User({
        email: "a@b.c",
        password: 123456,
        courses: [course._id]
      });
      await user.save();

      const res = await request(server)
        .get("/api/courses/mycourses")
        .set("x-auth-token", user.generateAuthToken());

      expect(res.status).toBe(200);
      expect(res.body.some(g => g._id == course._id)).toBeTruthy();
    });
  });

  describe("GET /admin", () => {
    it("should return admining course lists for the user", async () => {
      const user = new User({
        email: "a@b.c",
        password: 123456,
        isAdmin: true
      });
      await user.save();

      const course = new Course({
        name: "course1",
        number: "1",
        university: mongoose.Types.ObjectId(),
        major: mongoose.Types.ObjectId(),
        admin: [user._id]
      });
      await course.save();

      const res = await request(server)
        .get("/api/courses/admin")
        .set("x-auth-token", user.generateAuthToken());

      expect(res.status).toBe(200);
      expect(res.body.some(g => g._id == course._id)).toBeTruthy();
    });
  });

  describe("POST /", () => {
    let token;
    let payload;
    let universityId;

    const exec = async () => {
      return await request(server)
        .post("/api/courses")
        .set("x-auth-token", token)
        .send(payload);
    };

    beforeEach(() => {
      token = new User({ isAdmin: true }).generateAuthToken();
      universityId = mongoose.Types.ObjectId();
      payload = {
        name: "course1",
        number: "1",
        university: universityId,
        major: mongoose.Types.ObjectId()
      };
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 403 if client is not admin", async () => {
      token = new User({ isAdmin: false }).generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it("should return 400 if course with input (university and number) already exist", async () => {
      const existCourse = new Course({
        name: "course2",
        number: "1",
        university: universityId,
        major: mongoose.Types.ObjectId()
      });
      await existCourse.save();

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save the course if it is valid", async () => {
      await exec();

      const course = await Course.find({ name: "course1" });

      expect(course).not.toBeNull();
    });

    it("should return the course if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty(
        "_id",
        "name",
        "number",
        "university",
        "major"
      );
    });
  });
});
