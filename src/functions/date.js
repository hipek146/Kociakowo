export function date(value, mode = "full") {
  if (
    !(
      value !== null &&
      new Date(value) !== "Invalid Date" &&
      !isNaN(new Date(value)) &&
      Number(value) !== value
    )
  ) {
    return value;
  }
  value = new Date(value);
  var months = [
    "styczenia",
    "lutego",
    "marca",
    "kwietnia",
    "maja",
    "czerwca",
    "lipca",
    "sierpnia",
    "września",
    "października",
    "listopada",
    "grudnia"
  ];
  return (
    value.getDate() +
    " " +
    months[value.getMonth()].slice(0, 3) +
    " " +
    value.getFullYear() +
    (mode === "full"
      ? " " +
        value.getHours() +
        ":" +
        (value.getMinutes() < 10 ? "0" : "") +
        value.getMinutes()
      : "")
  );
}
