import "mocha";
import * as chai from "chai";
import * as sinon from "sinon";
import { expect } from "chai";

import { Users } from "../../src/entity/User";
import { TourService } from "../../src/services/tourService";
import { TOUR_DATA } from "../../src/constants/db.constants";
import { Tours } from "../../src/entity/Tours";

const myObj = new TourService();

describe("Tour Service - Test", () => {
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
  it("Must find all Tours", (done) => {
    const stub = sinon.stub(TOUR_DATA, "find").resolves([]);
    myObj
      .getTours(query)
      .then((res) => {
        expect(stub.calledOnce).to.be.true;
        expect(res).to.be.an("array");
        done();
      })
      .catch((err) => {
        console.log(err);
      });
  });
  it("Must find One tour", (done) => {
    const resultData: Tours = {
      tour_id: 0,
      package_name: "",
      from: "",
      to: "",
      tour_image: "",
      provider_license: "",
      description: "",
      availablity: false,
      status: false,
      startDate: "",
      endDate: "",
      max_person: 0,
      total_days: 0,
      cost: 0,
      user: new Users(),
    };
    const stub = sinon.stub(TOUR_DATA, "findOneBy").resolves(resultData);
    myObj
      .getTourById(query)
      .then((res) => {
        expect(stub.calledOnce).to.be.true;
        expect(stub.calledWith(query)).to.be.true;
        expect(res).to.be.an("object");
        expect(res).to.have.a.property("package_name");
        done();
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
