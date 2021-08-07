export const convertMStoHHMMSS = (time: number) => {
  const giveSeconds = Math.round(time / 1000);
  let hours = Math.floor(giveSeconds / 3600);
  let minutes = Math.floor((giveSeconds - hours * 3600) / 60);
  let seconds = giveSeconds - hours * 3600 - minutes * 60;

  return (
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    seconds.toString().padStart(2, "0")
  );
};
