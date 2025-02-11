// node example/1.Comma.js

let srt = `
1
00:00:11,544 --> 00:00:12,682
Hello
`;

import { fromSrt, toSrt } from "@ltftf/srt-parser-2";
var result = fromSrt(srt);
console.log(result);
console.log("\n\n");

// turn array back to SRT string.
var srt_string = toSrt(result);
console.log(srt_string);
