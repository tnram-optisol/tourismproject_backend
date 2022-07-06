import "mocha";
import * as express from "express";
import * as chai from "chai";
import * as sinon from "sinon";

import { BannerService } from "../../src/services/bannerService";
import { BANNER_DATA } from "../../src/constants/db.constants";

const myObj = new BannerService();

describe("Banner Service - Test", () => {
  let query, expectedResult, search, limit, skip, id, as;
  beforeEach(() => {
    query = {};
    search = "";
    limit = 5;
    skip = 0;
    id = 1;
    as = "";
  });
  afterEach(() => {
    sinon.restore();
  });
  it("Must get all Banner Data", async (done) => {
    const spy = sinon.spy(BANNER_DATA, "find");
    myObj.getAllBanner(query);
    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, query);
    done();
  });
  it("Must get banner byId", async (done) => {
    const spy = sinon.spy(BANNER_DATA, "findOneBy");
    myObj.getBannerById(query);
    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, query);
    done();
  });
  it("Must get banner by TourId", (done) => {
    const spy = sinon.spy(BANNER_DATA, "findOneBy");
    myObj.getBannerByTourId(id);
    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, { tour: { tour_id: id } });
    done();
  });
  it("Must get Tour Banner", (done) => {
    const spy = sinon.spy(BANNER_DATA, "createQueryBuilder");
    myObj.getTourBanner(query, "tour");
    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, "banner");
    done();
  });
  it("Must get Admin Banner", (done) => {
    const spy = sinon.spy(BANNER_DATA, "findAndCount");
    myObj.getAdminBannerData(limit, skip, search);
    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, {
      take: limit,
      skip: skip,
      order: { sequence: "ASC" },
    });
    done();
  });
  it("Must get Sequence", (done) => {
    const spy = sinon.spy(BANNER_DATA, "createQueryBuilder");
    myObj.getSequence(query, "tour");
    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, "banner");
    done();
  });
});
