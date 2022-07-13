import "mocha";
import * as chai from "chai";
import * as sinon from "sinon";
import { USER_DATA } from "../../src/constants/db.constants";
import { AuthService } from "../../src/services/authService";
import { expect } from "chai";
import { Users } from "../../src/entity/User";
import { Roles } from "../../src/entity/Roles";

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
  it("Must find a user Data", (done) => {
    const resultData: Users = {
      id: 0,
      name: "",
      email: "",
      password: "",
      place: "",
      contact: "",
      role: new Roles(),
      external: false,
    };
    const stub = sinon.stub(USER_DATA, "findOneBy").resolves(resultData);
    myObj.findUser(query).then((result) => {
      expect(stub.calledOnce).to.be.true;
      expect(stub.calledWith(query)).to.be.true;
      expect(result).to.be.an("object");
      expect(result).have.a.property("email");
      done();
    });
  });
});
