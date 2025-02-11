interface Line {
  id: string;
  startTime: string;
  startSeconds: number;
  endTime: string;
  endSeconds: number;
  text: string[];
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
  // Fix the format if the format is wrong
  // 00:00:28.9670 Become 00:00:28,967
  // 00:00:28.967  Become 00:00:28,967
  // 00:00:28.96   Become 00:00:28,960
  // 00:00:28.9    Become 00:00:28,900

  // 00:00:28,96   Become 00:00:28,960
  // 00:00:28,9    Become 00:00:28,900
  // 00:00:28,0    Become 00:00:28,000
  // 00:00:28,01   Become 00:00:28,010
  // 0:00:10,500   Become 00:00:10,500

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

function fromSrt(data: string): Line[] {
  const arr = data
    .split(
      /(\d+)\r?\n(\d{1,2}:\d{1,2}:\d{1,2}[.,]\d+) --> (\d{1,2}:\d{1,2}:\d{1,2}[.,]\d+)/
    )
    .slice(1);
  const items: Line[] = [];
  for (let i = 0; i < arr.length; i += 4) {
    const [startTime, startSeconds] = getFixedTime(arr[i + 1]);
    const [endTime, endSeconds] = getFixedTime(arr[i + 2]);
    const newLine: Line = {
      id: arr[i],
      startTime,
      startSeconds,
      endTime,
      endSeconds,
      text: arr[i + 3].trim().split(/\r?\n/),
    };
    items.push(newLine);
  }
  return items;
}

function toSrt(data: Line[]) {
  const EOL = "\r\n";
  let res = "";
  for (const block of data) {
    res += block.id + EOL;
    res += block.startTime + " --> " + block.endTime + EOL;
    for (const line of block.text) {
      res += line + EOL;
    }
    res += EOL;
  }
  return res;
}

export { fromSrt, toSrt };
export type { Line };
