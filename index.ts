interface Dialogue {
  id: string;
  startTime: string;
  startSeconds: number;
  endTime: string;
  endSeconds: number;
  lines: string[];
  position?: number;
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

function fromSrt(data: string, preserveEmptyLines?: boolean): Dialogue[] {
  if (typeof data !== "string") {
    throw new TypeError(`Expected a string, got ${typeof data}`);
  }

  data = data.replace(/\r\n?/g, "\n");

  let arr = data.split(
    /(\d+)[^\S\n]*\n(\d{1,2}:\d{1,2}:\d{1,2}[.,]\d+)[ \t]+-->[ \t]+(\d{1,2}:\d{1,2}:\d{1,2}[.,]\d+)[^\n]*\n/
  ).slice(1);

  const dialogues: Dialogue[] = [];
  for (let i = 0; i < arr.length; i += 4) {
    let text = arr[i + 3];
    if (!text) continue;
    const [startTime, startSeconds] = getFixedTime(arr[i + 1]);
    const [endTime, endSeconds] = getFixedTime(arr[i + 2]);
    let position;
    const positionMatch = text.match(/{\\(an?)(\d{1,2})}/);
    if (positionMatch) {
      const [, type, pos] = positionMatch;
      const posInt = parseInt(pos);
      if (type === "an") {
        if (posInt >= 1 && posInt <= 9) {
          position = posInt;
        }
      } else {
        if ([1, 2, 3].includes(posInt)) {
          position = posInt;
        } else if ([5, 6, 7].includes(posInt)) {
          position = posInt + 2;
        } else if ([9, 10, 11].includes(posInt)) {
          position = posInt - 5;
        }
      }
    }
    text = text.replace(/{\\an?\d{1,2}}/g, "");
    const dialogue: Dialogue = {
      id: arr[i],
      startTime,
      startSeconds,
      endTime,
      endSeconds,
      lines: text.split("\n")
        .map(line => line.trim())
        .filter(line => line || preserveEmptyLines),
      position,
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
    if (block.position) {
      res += `{\\an${block.position}}`;
    }
    for (const line of block.lines) {
      res += line + EOL;
    }
    res += EOL;
  }
  return res;
}

export { fromSrt, toSrt };
export type { Dialogue };
