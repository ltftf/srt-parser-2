// node example/2.Dot.js
import { fromSrt } from "@ltftf/srt-parser-2";

var srt = `
1
00:00:11.544 --> 00:00:12.682
Hello
`;

var result = fromSrt(srt);
console.log(result);
