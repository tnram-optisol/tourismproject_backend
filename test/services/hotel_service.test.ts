import "mocha";
import * as chai from "chai";
import * as sinon from "sinon";
import { expect } from "chai";

import { HOTEL_DATA, ROOM_DATA } from "../../src/constants/db.constants";
import { HotelService } from "../../src/services/hotelService";
import { Rooms } from "../../src/entity/Rooms";
import { Hotels } from "../../src/entity/Hotels";

const myObj = new HotelService();

describe("Hotel Service - Test", () => {
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
  it("Must get all Hotel data", (done) => {
    const stub = sinon.stub(HOTEL_DATA, "findBy").resolves([]);
    myObj.getHotels(query).then((result) => {
      expect(stub.calledOnce).to.be.true;
      expect(result).to.be.an("array");
      expect(stub.calledWith(query)).to.be.true;
      done();
    });
  });
  it("Must get all Rooms", (done) => {
    const stub = sinon.stub(ROOM_DATA, "find").resolves([]);
    myObj.getAllRooms(query).then((result) => {
      expect(stub.calledOnce).to.be.true;
      expect(result).to.be.an("array");
      expect(stub.calledWith(query)).to.be.true;
      done();
    });
  });
  it("Must get Room by Id", (done) => {
    const resultData: Rooms = {
      room_id: 0,
      room_name: "",
      room_price: 0,
      room_image: "",
      max_person: "",
      availablity: false,
      description: "",
      hotel: new Hotels(),
    };
    const stub = sinon.stub(ROOM_DATA, "findOneBy").resolves(resultData);
    myObj
      .getRoomById(query)
      .then((result) => {
        expect(stub.calledOnce).to.be.true;
        expect(result).to.be.an("object");
        expect(stub.calledWith(query)).to.be.true;
        expect(result).to.have.a.property("room_name");
        done();
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
