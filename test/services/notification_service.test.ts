import "mocha";
import * as express from "express";
import * as chai from "chai";
import * as sinon from "sinon";

import { NotificationService } from "../../src/services/notificationService";
import { ADMIN_NOTIFICATION_DATA } from "../../src/constants/db.constants";
import { assert } from "console";
import { expect } from "chai";

const myObj = new NotificationService();

describe("Notification Service - Test", () => {
  let email: string, otp: number, expiresIn: number, id: number;
  beforeEach(() => {
    email = "";
    otp = 0;
    expiresIn = 0;
    id = 0;
  });
  afterEach(() => {
    sinon.restore();
  });
  it("Must get all Notifications data", (done) => {
    const stub = sinon.stub(ADMIN_NOTIFICATION_DATA, "find").resolves([]);
    myObj.getAllNotification().then((result) => {
      expect(stub.calledOnce).to.be.true;
      expect(result).to.be.an("array");
      done();
    });
  });
  it("Must remove notifications Data", (done) => {
    const dataStub = sinon.stub(ADMIN_NOTIFICATION_DATA, "findOneBy").resolves({
      id: 0,
      notification: "",
      type: "",
    });
    const stub = sinon.stub(ADMIN_NOTIFICATION_DATA, "remove");
    myObj
      .discardNotification(id)
      .then((result) => {
        expect(result).to.be.undefined;
        expect(stub.calledOnce).to.be.true;
        done();
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
