const request = require("supertest");
const { User } = require("../../models/user");
const bcrypt = require("bcrypt");

let server;

describe("/api/users", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await User.remove({});
    await server.close();
  });

  describe("GET /me", () => {
    let token;
    let user;

    const exec = async () => {
      return await request(server)
        .get("/api/users/me")
        .set("x-auth-token", token);
    };

    beforeEach(async () => {
      user = new User({ email: "a@b.c", password: "123456" });
      await user.save();

      token = user.generateAuthToken();
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return logged user", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("email", user.email);
    });
  });

  describe("POST /", () => {
    let email;
    let password;

    const exec = async () => {
      return await request(server)
        .post("/api/users")
        .send({ email, password });
    };

    beforeEach(() => {
      email = "a@b.c";
      password = "123456";
    });

    it("should return 400 if email is not fomatted", async () => {
      email = "123";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if password is less than 6 characters", async () => {
      password = "1";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if the email is exist", async () => {
      const existUser = new User({ email: "a@b.c", password: "123456" });
      await existUser.save();

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save the user if it is valid", async () => {
      await exec();

      const result = User.find({ email: email });

      expect(result).not.toBeNull();
    });

    it("should save token in header if user is saved", async () => {
      const res = await exec();

      expect(res.header).toHaveProperty("x-auth-token");
    });
  });

  describe("DELETE", () => {
    let user;
    let token;
    let password;

    const exec = async () => {
      return await request(server)
        .delete("/api/users")
        .set("x-auth-token", token)
        .send({ email: "a@b.c", password });
    };

    beforeEach(async () => {
      password = "123456";

      user = new User({ email: "a@b.c", password });
      await user.save();

      token = user.generateAuthToken();
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if password is less than 6 characters", async () => {
      password = "1";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if password is not match with email", async () => {
      password = "654321";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    // it("should delete the user", async () => {
    //  await exec();

    //   const result = await User.findById(user._id);

    //   expect(result).toBeNull();
    // });
  });

  describe("PUT /password", () => {
    let token;
    let password;
    let newPassword;
    let user;

    const exec = async () => {
      return await request(server)
        .put("/api/users/password")
        .set("x-auth-token", token)
        .send({ email: "a@b.c", password, newPassword });
    };

    beforeEach(async () => {
      password = "123456";

      user = new User({
        email: "a@b.c",
        password: password
      });
      await user.save();

      token = user.generateAuthToken();
      newPassword = "1234567";
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if newPassword is less than 6 characters", async () => {
      newPassword = "1";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if password is not match with email", async () => {
      password = "654321";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    // it("should update user password", async () => {
    //   await exec();

    //   const updatedUser = await User.findById(user._id);

    //   const result = await bcrypt.compare(newPassword, updatedUser.password);

    //   expect(result).toBeTruthy();
    // });

    // it("should save token in header if user is saved", async () => {
    //   const res = await exec();

    //   expect(res.header).toHaveProperty("x-auth-token");
    // });
  });

  describe("PUT /", () => {
    let token;
    let newUserName;
    let user;

    const exec = async () => {
      return await request(server)
        .put("/api/users")
        .set("x-auth-token", token)
        .send({ userName: newUserName });
    };

    beforeEach(async () => {
      user = new User({
        email: "a@b.c",
        password: "123456",
        userName: "username"
      });
      await user.save();

      token = user.generateAuthToken();
      newUserName = "newUsername";
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if newUserName is less than 1 character", async () => {
      newUserName = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should update the user if it is valid", async () => {
      await exec();

      const updatedUser = await User.findById(user._id);

      expect(updatedUser.userName).toBe(newUserName);
    });

    it("should return the updated user if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("userName", newUserName);
    });
  });
});
