import "mocha";
import * as chai from "chai";
import * as sinon from "sinon";
import { expect } from "chai";

import { CategoryService } from "../../src/services/categoryService";
import { CATEGORY_DATA } from "../../src/constants/db.constants";

const myObj = new CategoryService();

describe("Category Service - Test", () => {
  let query: {},
    expectedResult: any,
    search: string,
    limit: number,
    skip: number;
  beforeEach(() => {
    query = {};
    search = "";
    limit = 5;
    skip = 0;
  });
  afterEach(() => {
    sinon.restore();
  });
  it("Must category Data", (done) => {
    const stub = sinon
      .stub(CATEGORY_DATA, "findOneBy")
      .withArgs(query)
      .resolves({
        id: 0,
        category: "",
        image: "",
      });
    myObj
      .getCategoryLocation(query)
      .then((result) => {
        expect(result).to.be.an("object");
        expect(stub.calledOnce).to.be.true;
        expect(stub.calledWith(query)).to.be.true;
        expect(result).have.a.property("category");
        done();
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
