import "mocha";
import * as express from "express";
import * as chai from "chai";
import * as sinon from "sinon";

import { OtpService } from "../../src/services/OtpService";
import { OTP_DATA } from "../../src/constants/db.constants";

const myObj = new OtpService();

describe("Otp Service - Test", () => {
  let email: string, otp: number, expiresIn: number;
  beforeEach(() => {
    email = "";
    otp = 0;
    expiresIn = 0;
  });
  afterEach(() => {
    sinon.restore();
  });
  it("Must successfully find Otp", (done) => {
    const spy = sinon.spy(OTP_DATA, "findOneBy");
    myObj.findOtp(otp);
    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy);
    done();
  });
  it("Must Clear Otp data", (done) => {
    const spy = sinon.spy(OTP_DATA, "findOneBy");
    myObj.clearOtpData(email);
    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy);
    done();
  });
});
