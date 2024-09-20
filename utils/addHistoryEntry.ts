import fs from "fs";
import path from "path";

export default function addHistoryEntry<T>(
  dataType: string,
  historyEntry: HistoryEntry<T>
) {
  const historyFilePath = path.join(
    "data",
    "history",
    `${dataType}.json`
  );

  let historyData: HistoryEntry<T>[] = [];

  if (fs.existsSync(historyFilePath)) {
    const historyContent = fs.readFileSync(historyFilePath, "utf8");
    historyData = JSON.parse(historyContent);
  }

  historyData.push(historyEntry);

  fs.writeFileSync(
    historyFilePath,
    JSON.stringify(historyData, null, 2),
    "utf8"
  );
}
