import "mocha";
import * as chai from "chai";
import chaiHttp = require("chai-http");
//import * as app from "../src/index";
import { adminController } from "../src/router/adminRouter";
import { AdminController } from "../src/controller/AdminController";
import { expect } from "chai";

chai.use(chaiHttp);

let token = "";

const app = "http://localhost:8080";

describe("Admin Controller imports", () => {
  const myObj = adminController;
  it("Must have a auth controller", () => {
    new chai.Assertion(myObj).to.be.a.instanceOf(AdminController);
  });
});

describe("Login Admin to Check", () => {
  it("Must login & set token", (done) => {
    chai
      .request(app)
      .post("/signin")
      .send({
        email: "admin@abc.com",
        password: "admin123",
      })
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("object");
        expect(res.body).to.have.a.property("token");
        token = res.body.token;
        done();

        if (err) {
          console.log(err);
        }
      });
  });
});

describe("Get All Admin Details", () => {
  it("Must get all tour Requests", (done) => {
    chai
      .request(app)
      .get("/admin/request/tour")
      .set({ Authorization: `Bearer ${token}`, Role: 1 })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("array");
        expect(res.body).length.greaterThan(1);
        done();
      });
  });
  it("Must get all hotel Requests", (done) => {
    chai
      .request(app)
      .get("/admin/request/hotel")
      .set({ Authorization: `Bearer ${token}`, Role: 1 })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("array");
        expect(res.body).length.greaterThan(1);
        done();
      });
  });
  it("Must get all banner", (done) => {
    chai
      .request(app)
      .get("/admin/banner")
      .set({ Authorization: `Bearer ${token}`, Role: 1 })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("array");
        expect(res.body).length.greaterThan(1);
        done();
      });
  });
  it("Must get all category", (done) => {
    chai
      .request(app)
      .get("/admin/category")
      .set({ Authorization: `Bearer ${token}`, Role: 1 })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("array");
        expect(res.body).length.greaterThan(1);
        done();
      });
  });
  it("Must get all notification", (done) => {
    chai
      .request(app)
      .get("/admin/notification")
      .set({ Authorization: `Bearer ${token}`, Role: 1 })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.a.property("notification");
        done();
      });
  });
  it("Must get all users", (done) => {
    chai
      .request(app)
      .get("/admin/all/users")
      .set({ Authorization: `Bearer ${token}`, Role: 1 })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("array");
        expect(res.body).length.greaterThan(1);
        done();
      });
  });
  it("Must get all tour orders", (done) => {
    chai
      .request(app)
      .get("/admin/tour/orders")
      .set({ Authorization: `Bearer ${token}`, Role: 1 })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.a.property("tourOrder");
        expect(res.body.tourOrder).length.greaterThan(1);
        done();
      });
  });
  it("Must get all hotel orders", (done) => {
    chai
      .request(app)
      .get("/admin/hotel/orders")
      .set({ Authorization: `Bearer ${token}`, Role: 1 })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.a.property("hotelOrder");
        expect(res.body.hotelOrder).length.greaterThanOrEqual(1);
        done();
      });
  });
});
