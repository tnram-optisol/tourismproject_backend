import "mocha";
import * as chai from "chai";
import * as sinon from "sinon";
import { expect } from "chai";
import { REQUEST_DATA, USER_DATA } from "../../src/constants/db.constants";
import { AdminService } from "../../src/services/adminService";

const myObj = new AdminService();

describe("Admin Service _tests", () => {
  it("Must get all User data", (done) => {
    const search = "";
    const take = 5;
    const skip = 0;
    sinon.stub(USER_DATA, "findAndCount");
    myObj.findAllUser(search, take, skip).then((res) => {
      console.log("test", res);
      expect(res).to.be.an("array");
      done();
    });
    afterEach(() => {
      sinon.restore();
    });
  });
  it("Must get all User data", (done) => {
    sinon.stub(REQUEST_DATA, "findBy");
    myObj.getAllRequests({ status: false }).then((res) => {
      console.log("test", res);
      expect(res).to.be.an("array");
      done();
    });
    afterEach(() => {
      sinon.restore();
    });
  });
});
