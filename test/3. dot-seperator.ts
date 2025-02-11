// Test .srt file using "dot" between second and millisecond
// For example `00:00:52.34`
// Notice the "." in 52 and 34?
import { should, expect } from "chai";
import fs from "fs";
import { fromSrt } from "../index";

var srt = fs.readFileSync("./test-file/Welcome-648062.en.srt", {
  encoding: "utf-8",
});

describe("Read 00:00:00.05 --> 00:00:02.00", function () {
  should();
  var result = fromSrt(srt);

  it("into 00:00:00,050 and 00:00:02,000", function () {
    expect(result[0].startTime).to.equal("00:00:00,050");
    expect(result[0].endTime).to.equal("00:00:02,000");
    expect(result[0].startSeconds).to.equal(0.05);
    expect(result[0].endSeconds).to.equal(2);
  });
});
