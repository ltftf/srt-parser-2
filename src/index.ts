interface Line {
  id: string;
  startTime: string;
  endTime: string;
  text: string;
}

export default class Parser {
  seperator = ",";

  correctFormat(time: string) {
    // Fix the format if the format is wrong
    // 00:00:28.9670 Become 00:00:28,967
    // 00:00:28.967  Become 00:00:28,967
    // 00:00:28.96   Become 00:00:28,960
    // 00:00:28.9    Become 00:00:28,900

    // 00:00:28,96   Become 00:00:28,960
    // 00:00:28,9    Become 00:00:28,900
    // 00:00:28,0    Become 00:00:28,000
    // 00:00:28,01   Become 00:00:28,010
    let str = time.replace(".", ",");
    var [front, ms] = str.split(',');
    if (ms.length == 3) {
      return str;
    }
    if (ms.length > 3) {
      return `${front}${this.seperator}${ms.slice(0, 3)}`;
    }
    if (ms.length < 3) {
      return `${front}${this.seperator}${ms.padEnd(3, "0")}`;
    }
  }

  private tryComma(data: string) {
    data = data.replace(/\r/g, "");
    var regex = /(\d+)\n(\d{2}:\d{2}:\d{2},\d{1,3}) --> (\d{2}:\d{2}:\d{2},\d{1,3})/g;
    let data_array = data.split(regex);
    data_array.shift(); // remove first '' in array
    return data_array;
  }

  private tryDot(data: string) {
    data = data.replace(/\r/g, "");
    var regex = /(\d+)\n(\d{2}:\d{2}:\d{2}\.\d{1,3}) --> (\d{2}:\d{2}:\d{2}\.\d{1,3})/g;
    let data_array = data.split(regex);
    data_array.shift(); // remove first '' in array
    this.seperator = ".";
    return data_array;
  }

  fromSrt(data: string) {
    var originalData = data;
    var data_array = this.tryComma(originalData);
    if (data_array.length == 0) {
      data_array = this.tryDot(originalData);
    }

    var items = [];
    for (var i = 0; i < data_array.length; i += 4) {
      var new_line = {
        id: data_array[i].trim(),
        startTime: this.correctFormat(data_array[i + 1].trim()),
        endTime: this.correctFormat(data_array[i + 2].trim()),
        text: data_array[i + 3].trim()
      };
      items.push(new_line);
    }

    return items;
  }

  toSrt(data: Array<Line>) {
    var res = "";

    for (var i = 0; i < data.length; i++) {
      var s = data[i];
      res += s.id + "\r\n";
      res += s.startTime + " --> " + s.endTime + "\r\n";
      res += s.text.replace("\n", "\r\n") + "\r\n\r\n";
    }

    return res;
  }
}
