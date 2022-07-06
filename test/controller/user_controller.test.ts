import "mocha";
import * as express from "express";
import * as chai from "chai";
import * as sinon from "sinon";
import { UserController } from "../../src/controller/UserController";
import { TourService } from "../../src/services/tourService";
import { expect } from "chai";

const myObj = new UserController();
const tourObj = new TourService();

describe("User Controller _test", () => {
  const req: any = {
    body: {},
    params: {},
    headers: {},
  };
  const res: any = {
    json: sinon.spy(),
    status: sinon.stub().returns({ end: sinon.spy() }),
  };
  const next = () => {};
  it("Must get all Tours", () => {
    const spy = sinon.spy(myObj, "getAllTours");
    myObj.getAllTours(req, res, next);
    sinon.assert.calledOnce(spy);
  });
});
