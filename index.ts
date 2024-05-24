import { readFile, writeFile } from "fs";
import { dominantStrongDirection } from "./textDirection";

function fixSubtitles(filename: string): void {
  readFile(filename, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    const lines = data.split("\n");
    let newContent = "";

    for (const line of lines) {
      if (line.match(/^\d+$/) || line.match(/^[0-9:, -->]+$/)) {
        newContent += line + "\n";
        continue;
      }

      if (dominantStrongDirection(line) === "rtl") {
        newContent += "\u202b" + line + "\u202c" + "\n";
      } else {
        newContent += line + "\n";
      }
    }

    writeFile(filename, newContent, "utf8", (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
      console.log("Subtitles fixed successfully.");
    });
  });
}

fixSubtitles("file.srt");
