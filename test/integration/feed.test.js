const request = require("supertest");
const { Feed } = require("../../models/feed");
const { User } = require("../../models/user");
const { Course } = require("../../models/course");
const mongoose = require("mongoose");
const moment = require("moment");

let server;

describe("/api/feeds", () => {
    let user;
    let token;
    const course1 = mongoose.Types.ObjectId();
    const course2 = mongoose.Types.ObjectId();

    beforeEach(async () => {
        server = require("../../index");

        user = await new User({
            password: "12345678",
            email: "test@mail.com",
            courses: [course1, course2],
        });

        await user.save()

        token = user.generateAuthToken();

        await Feed.collection.insertMany([
            {
                postedBy: user._id,
                type: "homework",
                course: course1,
                deadline: moment().toJSON(),
                datePosted: moment().toJSON(),
                content: "This is a test content"
            },
            {
                postedBy: user._id,
                type: "announcement",
                course: course2,
                deadline: moment().toJSON(),
                datePosted: moment().toJSON(),
                content: "This is another test content"
            }
        ]);
    });

    afterEach(async () => {
        await User.remove({});
        await Feed.remove({});
        await server.close();
    });

    describe("GET /", () => {

        const exec = async () => {
            return await request(server)
                .get("/api/feeds")
                .set("x-auth-token", token);
        };

        it("should return 401 if client is not logged in", async () => {
            token = "";

            const res = await exec();

            expect(res.status).toBe(401)
        });

        it("it should return all feeds for req.user", async () => {

            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(f => f.type === "homework")).toBeTruthy();
            expect(res.body.some(f => f.type === "announcement")).toBeTruthy();

        });
    });

    describe("GET /homeworks", () => {

        it("it should return all the homework for req.user", async () => {
            const res = await request(server)
                .get("/api/feeds/homeworks")
                .set("x-auth-token", token);

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1);
        });
    });

    describe("GET /announcement", () => {

        it("it should return all the announcements for req.user", async () => {
            const res = await request(server)
                .get("/api/feeds/announcements")
                .set("x-auth-token", token);

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1);
        });
    });

    describe("GET /:id/homeworks", () => {
        let course;

        it("it should return all the homework for class with given id", async () => {
            course = await new Course({
                _id: course1,
                name: "test course1",
                number: 123456,
                major: mongoose.Types.ObjectId(),
                university: mongoose.Types.ObjectId()
            });
            await course.save();

            const res = await request(server)
                .get(`/api/feeds/${course._id}/homeworks`)
                .set("x-auth-token", token);

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1);
        });
    });

    describe("GET /:id/announcement", () => {
        let course;

        it("it should return all the announcements for class with given id", async () => {
            course = await new Course({
                _id: course2,
                name: "test course1",
                number: 123456,
                major: mongoose.Types.ObjectId(),
                university: mongoose.Types.ObjectId()
            });
            await course.save();

            const res = await request(server)
                .get(`/api/feeds/${course._id}/announcements`)
                .set("x-auth-token", token);

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1);
        });
    });

    describe("POST /", () => {
        let token;
        let payload;

        const exec = async () => {
            return await request(server)
                .post("/api/feeds")
                .set("x-auth-token", token)
                .send(payload);
        };

        beforeEach(() => {
            payload = {
                postedBy: user._id,
                type: "homework",
                course: course1,
                deadline: moment().toJSON(),
                datePosted: moment().toJSON(),
                content: "Post test content"
            };
        });

        it("should return 401 if client is not logged in", async () => {
            token = ""

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it("should return 403 if client is not admin", async () => {
            token = user.generateAuthToken()

            const res = await exec();

            expect(res.status).toBe(403)
        });

        it("should return feed if feed was created", async () => {
            user = await User.findByIdAndUpdate(user._id, {
                isAdmin: true
            }, { new: true });

            token = user.generateAuthToken();

            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("content");
            expect(res.body).toHaveProperty("postedBy");
            expect(res.body).toHaveProperty("course");
        })
    });

    describe("PUT /", () => {
        let id;
        let newContent;

        const exec = async () => {
            return await request(server)
                .put(`/api/feeds/${id}`)
                .set("x-auth-token", token)
                .send({ content: newContent })
        };

        beforeEach(async () => {
            const feed = new Feed({
                postedBy: user._id,
                type: "announcement",
                course: mongoose.Types.ObjectId(),
                deadline: moment().toJSON(),
                datePosted: moment().toJSON(),
                content: "This is another test content"
            });

            await feed.save();

            id = feed._id;

            newContent = "new content";
        });

        it("should return 401 if client is not logged in", () => {
            token = "";

            const res = exec();

            expect(res.status).toBe(401);
        });

        it("should return 200", () => {

            const res = exec();

            expect(res.status).toBe(200);
        });
    });
});