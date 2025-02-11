import { fromSrt, toSrt, type Line } from "../index";

import { expect, should } from "chai";
import fs from "fs";
import rewire from "rewire";

// Read a correct .srt file
var srt = fs.readFileSync("./test-file/correct.srt", { encoding: "utf-8" });

describe("Test basic function", function () {
  should();
  var result: Line[];

  it("parser.fromSrt() should execute without crashes", function () {
    result = fromSrt(srt);
  });

  it("parser.fromSrt() should return array", function () {
    expect(result).to.be.a("array");
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

  var originalData: string;
  it("parser.toSrt() should execute without crashes", function () {
    originalData = toSrt(result);
  });

  it("parser.toSrt() should convert object back as it was before without changes", function () {
    expect(srt.trim() === originalData.trim()).to.be.ok;
  });
});

const module = rewire("../index");
const getFixedTime: (time: string) => [string, number] =
  module.__get__("getFixedTime");

describe("Test files with the same content but different line breaks and formatting", function () {
  it("both files should be parsed correctly", function () {
    for (const srt of [
      fs.readFileSync("./test-file/test-bom-posix.srt", { encoding: "utf-8" }),
      fs.readFileSync("./test-file/test-win.srt", { encoding: "utf-8" }),
    ]) {
      const parsed = fromSrt(srt);

      expect(parsed).to.be.a("array");
      expect(parsed).to.have.lengthOf(3);

      expect(parsed[0].startSeconds).to.be.equal(getFixedTime("00:00:03,120")[1]);
      expect(parsed[0].endSeconds).to.be.equal(getFixedTime("00:00:06,040")[1]);
      expect(parsed[1].startSeconds).to.be.equal(getFixedTime("00:00:06,040")[1]);
      expect(parsed[1].endSeconds).to.be.equal(getFixedTime("00:00:08,219")[1]);
      expect(parsed[2].startSeconds).to.be.equal(getFixedTime("00:00:08,219")[1]);
      expect(parsed[2].endSeconds).to.be.equal(getFixedTime("00:00:12,080")[1]);

      for (const block of parsed) {
        expect(block.text).to.be.a("array");
      }
      expect(parsed[0].text).to.have.lengthOf(1);
      expect(parsed[1].text).to.have.lengthOf(2);
      expect(parsed[2].text).to.have.lengthOf(1);

      expect(parsed[0].text[0])
        .to.be.equal(
          "Hi, I’m Carrie Anne, and welcome to Crash Course Computer Science!"
        );
      expect(parsed[1].text[0]).to.be.equal("We’re here: the final episode!");
      expect(parsed[1].text[1]).to.be.equal("Second line");
      expect(parsed[2].text[0]).to.be.equal(
        "If you’ve watched the whole series, hopefully you’ve developed a newfound appreciation"
      );
    }
  });
});
