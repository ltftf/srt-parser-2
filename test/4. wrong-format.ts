import { fromSrt, toSrt, type Line } from "../index";

import { should, expect } from "chai";
import fs from "fs";

describe("Test wrong format: dot as separator", function () {
  var srt = fs.readFileSync("./test-file/dot-as-separator.srt", {
    encoding: "utf-8",
  });

  should();
  var result: Line[];

  it("parser.fromSrt() should execute without crashes", function () {
    result = fromSrt(srt);
  });

  it("parser.fromSrt() should return array", function () {
    expect(result).to.be.a("array");
    expect(result).to.have.lengthOf(2);
  });

  it("parser.fromSrt() should contain valid subtitle objects", function () {
    for (var i in result) {
      var s = result[i];
      expect(s).to.have.property("id");
      expect(s).to.have.property("startTime");
      expect(s).to.have.property("endTime");
      expect(s).to.have.property("text");
    }
  });

  it("parser.toSrt() should execute without crashes", function () {
    toSrt(result);
  });
});

describe("Test wrong format: single digit hour", function () {
  var srt = fs.readFileSync("./test-file/single-digit-hour.srt", {
    encoding: "utf-8",
  });

  should();
  var result: Line[];

  it("parser.fromSrt() should execute without crashes", function () {
    result = fromSrt(srt);
  });

  it("parser.fromSrt() should return array", function () {
    expect(result).to.be.a("array");
    expect(result).to.have.lengthOf(3);
  });

  it("parser.fromSrt() should contain valid subtitle objects", function () {
    for (var i in result) {
      var s = result[i];
      expect(s).to.have.property("id");
      expect(s).to.have.property("startTime");
      expect(s).to.have.property("endTime");
      expect(s).to.have.property("text");
    }
  });

  it("parser.toSrt() should execute without crashes", function () {
    toSrt(result);
  });
});

describe("Test wrong format: single digit timecodes", function () {
  var srt = fs.readFileSync("./test-file/single-digit-timecodes.srt", {
    encoding: "utf-8",
  });

  should();
  var result: Line[];

  it("parser.fromSrt() should execute without crashes", function () {
    result = fromSrt(srt);
  });

  it("parser.fromSrt() should return array", function () {
    expect(result).to.be.a("array");
    expect(result).to.have.lengthOf(10);
  });

  it("parser.fromSrt() should contain valid subtitle objects", function () {
    for (var i in result) {
      var s = result[i];
      expect(s).to.have.property("id");
      expect(s).to.have.property("startTime");
      expect(s).to.have.property("endTime");
      expect(s).to.have.property("text");
    }
  });

  it("parser.toSrt() should execute without crashes", function () {
    toSrt(result);
  });
});
