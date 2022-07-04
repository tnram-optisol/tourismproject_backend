import "mocha";
import * as chai from "chai";
import chaiHttp = require("chai-http");
import * as app from "../src/index";
import { authController } from "../src/router/authRouter";
import { AuthController } from "../src/controller/AuthController";
import { expect } from "chai";
import { USER_DATA } from "../src/constants/db.constants";

chai.use(chaiHttp);

describe("Auth Controller imports", () => {
  const myObj = authController;
  it("Must have a auth controller", () => {
    new chai.Assertion(myObj).to.be.a.instanceOf(AuthController);
  });
});

describe("Register Check", () => {
  const user = {
    name: "test",
    email: "test1@abc.com",
    password: "test123",
    contact: "8765432109",
    place: "london",
    roleId: 4,
  };
  it("Must register a user successfully", (done) => {
    chai
      .request(app)
      .post("/signup")
      .send({ user })
      .end((err, res) => {
        if (err) {
          console.log("err", err);
        }
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe("Login Check", () => {
  it("Must login & return token", (done) => {
    chai
      .request(app)
      .post("/signin")
      .send({
        email: "test1@abc.com",
        password: "test123",
      })
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("object");
        expect(res.body).to.have.a.property("token");
        done();

        if (err) {
          console.log(err);
        }
      });
    afterEach(async () => {
      const user = await USER_DATA.findOneBy({
        email: "test1@abc.com",
      });
      USER_DATA.remove(user).then((res) => {
        console.log("Removed user -- test@abc.com");
      });
    });
  });
});
