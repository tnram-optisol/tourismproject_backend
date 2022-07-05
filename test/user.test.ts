import "mocha";
import * as chai from "chai";
import chaiHttp = require("chai-http");
//import * as app from "../src/index";
import { userController } from "../src/router/userRouter";
import { UserController } from "../src/controller/UserController";
import { assert, expect } from "chai";
import {
  ADMIN_MAIL,
  ADMIN_MAIL_DATA,
  TOUR_REVIEW_DATA,
} from "../src/constants/db.constants";

chai.use(chaiHttp);


const token = "";

const app = "http://localhost:8080";

describe("Require a controller", () => {
  const myObj = userController;
  it("Must have a controller", () => {
    new chai.Assertion(myObj).to.be.instanceOf(UserController);
  });
});

describe("Must get a value on Call", () => {
  it("Should return a data On call", (done) => {
    chai
      .request(app)
      .get("/home/tour")
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("array");
        done();
      });
  });
  it("Should return a data On call", (done) => {
    chai
      .request(app)
      .get("/view/hotel")
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("array");
        done();
      });
  });
  it("Should return a data On call", (done) => {
    chai
      .request(app)
      .get("/view/tour/11")
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("object");
        expect(res.body).to.have.property("tour_id").eq(11);
        done();
      })
      .catch((err) => {
        console.log(err);
      });
  });
  it("Should  return all category data", (done) => {
    chai
      .request(app)
      .get("/all/category")
      .set({ Authorization: `Bearer ${token}`, Role: 4 })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("array");
        expect(res.body).length(6);
        done();
      })
      .catch((err) => {
        console.log(err);
      });
  });
  it("Should  return all hotel data", (done) => {
    chai
      .request(app)
      .get("/view/hotel")
      .set({ Authorization: `Bearer ${token}`, Role: 4 })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("array");
        expect(res.body).length(1);
        done();
      })
      .catch((err) => {
        console.log(err);
      });
  });
  it("Should  return a room data for a hotel", (done) => {
    chai
      .request(app)
      .get("/get/rooms/1")
      .set({ Authorization: `Bearer ${token}`, Role: 4 })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("array");
        expect(res.body).length(2);
        done();
      })
      .catch((err) => {
        console.log(err);
      });
  });
  it("Should  return a particular room data", (done) => {
    chai
      .request(app)
      .get("/view/room/6")
      .set({ Authorization: `Bearer ${token}`, Role: 4 })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("object");
        done();
      })
      .catch((err) => {
        console.log(err);
      });
  });
  it("Should  return two tour value", (done) => {
    chai
      .request(app)
      .get("/get/user/tour/2")
      .set({ Authorization: `Bearer ${token}`, Role: 4 })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("array");
        expect(res.body).length(2);
        done();
      })
      .catch((err) => {
        console.log(err);
      });
  });
  it("Should  return review", (done) => {
    chai
      .request(app)
      .get("/review/2")
      .set({ Authorization: `Bearer ${token}`, Role: 4 })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("array");
        done();
      })
      .catch((err) => {
        console.log(err);
      });
  });
  it("Should  return rating", (done) => {
    chai
      .request(app)
      .get("/rating/2")
      .set({ Authorization: `Bearer ${token}`, Role: 4 })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("object");
        done();
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

describe("Post a review", () => {
  it("Must Post a review", (done) => {
    chai
      .request(app)
      .post("/review")
      .send({
        name: "Bob",
        rating: 4,
        comment: "Super Package",
      })
      .then(function (res) {
        expect(res).to.have.status(200);
        done();
      })
      .catch(function (err) {
        console.log(err);
      });
    afterEach(async () => {
      const reviewExist = await TOUR_REVIEW_DATA.findOneBy({
        review: "Super Package",
        rating: 4,
        posted_By: "Bob",
      });
      TOUR_REVIEW_DATA.delete(reviewExist).then((res) => {
        console.log("deleted");
      });
    });
  });
});
