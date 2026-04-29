interface Dialogue {
  id: string;
  startTime: string;
  startSeconds: number;
  endTime: string;
  endSeconds: number;
  lines: string[];
}

function pad(digits: number, str: string, padEnd: boolean = true): string {
  if (str.length === digits) {
    return str;
  } else if (str.length > digits) {
    return str.slice(0, digits);
  } else {
    if (padEnd) {
      return str.padEnd(digits, "0");
    } else {
      return str.padStart(digits, "0");
    }
  }
}

function getFixedTime(time: string): [string, number] {
  let [hr, min, sec, ms] = time.split(/[:,.]/);
  hr = pad(2, hr, false);
  min = pad(2, min, false);
  sec = pad(2, sec, false);
  ms = pad(3, ms);

  const timeStr = `${hr}:${min}:${sec},${ms}`;
  let timeSec =
    parseInt(ms) * 0.001 +
    parseInt(sec) +
    parseInt(min) * 60 +
    parseInt(hr) * 3600;

  timeSec = Math.round(timeSec * 1000) / 1000;

  return [timeStr, timeSec];
}

function fromSrt(data: string): Dialogue[] {
  if (typeof data !== "string") {
    throw new TypeError(`Expected a string, got ${typeof data}`);
  }

  // if the file has the '\r' line breaks, replace them
  data = data.replace(/\r(?!\n)/g, "\r\n");

  let arr = data.split(
    /(\d+)[^\S\r\n]*\r?\n(\d{1,2}:\d{1,2}:\d{1,2}[.,]\d+) --> (\d{1,2}:\d{1,2}:\d{1,2}[.,]\d+)/
  ).slice(1);

  const dialogues: Dialogue[] = [];
  for (let i = 0; i < arr.length; i += 4) {
    const text = arr[i + 3].trim();
    if (!text) continue;
    const [startTime, startSeconds] = getFixedTime(arr[i + 1]);
    const [endTime, endSeconds] = getFixedTime(arr[i + 2]);
    const dialogue: Dialogue = {
      id: arr[i],
      startTime,
      startSeconds,
      endTime,
      endSeconds,
      lines: text.split(/\r?\n/),
    };
    dialogues.push(dialogue);
  }
  return dialogues;
}

function toSrt(data: Dialogue[]) {
  const EOL = "\r\n";
  let res = "";
  for (const block of data) {
    res += block.id + EOL;
    res += block.startTime + " --> " + block.endTime + EOL;
    for (const line of block.lines) {
      res += line + EOL;
    }
    res += EOL;
  }
  return res;
}

export { fromSrt, toSrt };
export type { Dialogue };
