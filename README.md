# srt-parser-2

An SRT parser for Javascript.

It reads an `.srt` file into an array.

This is a fork of [`srt-parser-2`](https://github.com/1c7/srt-parser-2).

## What's changed

- Removed the unnecessary class instantiation
- Text is parsed as an array of strings (by line) instead of a single string with `\n` characters

## Install

`npm`

```
npm install @ltftf/srt-parser-2
```

or `yarn`

```
yarn add @ltftf/srt-parser-2
```

## Example

This is an SRT format file:

```
1
00:00:11,544 --> 00:00:12,682
Hello
World
```

it would become:

```
[{
    id: "1",
    startTime: "00:00:11,544",
    startSeconds: 11.544,
    endTime: "00:00:12,682",
    endSeconds: 12.682,
    text: [ "Hello", "World" ]
}]
```

### Environment support

Since it only process text,  
it should work in both `Browser` and `Node.js` environment

## Usage

```javascript
let srt = `
1
00:00:11,544 --> 00:00:12,682
Hello
`;

import { fromSrt, toSrt } from "@ltftf/srt-parser-2";
var srtArray = fromSrt(srt);
console.log(srtArray);

// turn array back to SRT string.
var srtString = toSrt(srtArray);
console.log(srtString);
```

You can run this example using `node example/1.Comma.js`

## CLI

```
npx srt-parser-2 -i input.srt -o output.json --minify
```

Options:

| Option         | Required | Default     |
| -------------- | -------- | ----------- |
| --input or -i  | Yes      |             |
| --output or -o | No       | output.json |
| --minify       | No       | false       |

## License

MIT

## Why?

Why this one special? There are plenty of SRT parsers on npm:

- [subtitles-parser](https://www.npmjs.com/package/subtitles-parser)
- [subtitles-parser-vtt](https://www.npmjs.com/package/subtitles-parser-vtt)
- [subtitle](https://www.npmjs.com/package/subtitle)
- [srt](https://www.npmjs.com/package/srt)

## What's wrong with them?

Nothing wrong.  
All of them can handle this format:

```
1
00:00:11,544 --> 00:00:12,682
Hello
```

## But I want to handle format like these:

```
00:00:11.544
```

This is wrong format, it use period as separator

Or this:

```
00:00:11,5440
```

This is also wrong format, millisecond has 4 digit (should be 3)

Or this:

```
1:00:11,5
```

Similar, hour & millisecond is only 1 digit (wrong)

Or this

```
00:00:00.05
```

etc

## Format Support

| Format        | Other parser                    | srt-parser-2           | srt-parser-2 would turn this into |
| ------------- | ------------------------------- | ---------------------- | --------------------------------- |
| 00:00:01,544  | Yes :white_check_mark:          | Yes :white_check_mark: | 00:00:01,544                      |
| 00:00:01.544  | :question: Yes for some of them | Yes :white_check_mark: | 00:00:01,544                      |
| 00:00:01.54   | :question: Yes for some of them | Yes :white_check_mark: | 00:00:01,544                      |
| 00:00:00.3333 | No :x:                          | Yes :white_check_mark: | 00:00:00,333                      |
| 00:00:00.3    | No :x:                          | Yes :white_check_mark: | 00:00:00,300                      |
| 1:2:3.4       | No :x:                          | Yes :white_check_mark: | 01:02:03,400                      |

Basic principle:

1. If hour,minute,second is shorter than 2 digit, pad start with "0", if longer than 2 digit, only save first 2 digit.
2. Millisecond is the same, but it's 3 digit.
3. Separator can be `.`(periods) or `,`(comma), periods(incorrect) will be replace with comma(correct)

<!-- ## SRT Format Standard (kind of)
| Format       | Is this SRT standard  |
|--------------|-----------------------|
| 00:00:01,544 | Yes :white_check_mark:|
| 00:00:01.544 | No     :x:            |
| 00:00:00.05  | No     :x:            |

Note: There are no official SRT standard.
`00:00:01.544` and `00:00:00.05` is not 100% wrong. There are gray area.
But most tutorial/file/example/code on the internet use `00:00:01,544`    -->

## Conclusion

1. Support more time format (even wrong format)
2. Have extensive test
