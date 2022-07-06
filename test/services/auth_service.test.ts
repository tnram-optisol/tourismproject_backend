import "mocha";
import * as express from "express";
import * as chai from "chai";
import * as sinon from "sinon";
import { REQUEST_DATA, USER_DATA } from "../../src/constants/db.constants";
import { AuthService } from "../../src/services/authService";
import { expect } from "chai";

const myObj = new AuthService();

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
  it("Must find a user Data", async (done) => {
    const spy = sinon.spy(USER_DATA, "findOneBy");
    myObj.findUser(query);
    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, query);
    done();
  });
});
