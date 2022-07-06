import "mocha";
import * as express from "express";
import * as chai from "chai";
import * as sinon from "sinon";
import { REQUEST_DATA, USER_DATA } from "../../src/constants/db.constants";
import { AdminService } from "../../src/services/adminService";

const myObj = new AdminService();

let sandbox = sinon.createSandbox();

describe("Admin Service - Test", () => {
  let query, expectedResult, search, limit, skip;
  beforeEach(() => {
    query = {};
    search = "";
    limit = 5;
    skip = 0;
  });
  afterEach(() => {
    sinon.restore();
  });
  it("Must get all requests", (done) => {
    const spy = sinon.spy(REQUEST_DATA, "findBy");
    myObj.getAllRequests(query).then((res) => {
      console.log(res);
    });
    sinon.assert.calledWith(spy, query);
    done();
  });
  it("Must find All User", (done) => {
    const spy = sinon.spy(USER_DATA, "findAndCount");
    myObj.findAllUser(search, limit, skip).then((res) => {
      console.log(res);
    });
    sinon.assert.calledWith(spy, { take: limit, skip: skip });
    sinon.assert.calledOnce(spy);
    done();
  });
});
