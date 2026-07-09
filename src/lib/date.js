export function getDateParts(dateInput, displayFormat = "text") {
  const date = new Date();

  if (Number.isNaN(date.getTime())) {
    return ["", "", ""];
  }

  const day = date.getDate();
  const month =
    displayFormat === "number"
      ? String(date.getMonth() + 1).padStart(2, "0")
      : date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  return [day, month, year];
}
