import "mocha";
import * as chai from "chai";
import * as sinon from "sinon";
import { expect } from "chai";

import { REQUEST_DATA, USER_DATA } from "../../src/constants/db.constants";
import { AdminService } from "../../src/services/adminService";
import { Users } from "../../src/entity/User";

const myObj = new AdminService();

describe("Admin Service - Test", () => {
  let query, expectedResult, search, limit, skip;
  beforeEach(() => {
    query = {};
    search = "";
    limit = 5;
    skip = 1;
  });
  afterEach(() => {
    sinon.restore();
  });
  it("Must get all requests", (done) => {
    const stub = sinon.stub(REQUEST_DATA, "findBy").resolves([]);
    myObj.getAllRequests(query).then((res) => {
      expect(stub.calledOnce).to.be.true;
      expect(res).to.be.an("array");
      done();
    });
  });
  it("Must find All User", (done) => {
    const user: Users[] = [];
    const stub = sinon.stub(USER_DATA, "findAndCount").resolves([user, 0]);
    myObj.findAllUser(search, limit, skip).then((res) => {
      expect(res).to.be.an("array");
      expect(stub.calledWith({ take: limit, skip: skip })).to.be.true;
      expect(stub.calledOnce).to.be.true;
      done();
    });
  });
});
