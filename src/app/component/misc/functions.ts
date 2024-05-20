
export function generateRandomString(length: number): string {
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz";
  let text = "";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export function generateRandomToken(): string {
  return generateRandomString(150);
}

export function makeRandomNumber(lengthOfCode: number): number {
  return Math.floor(Math.random() * Math.pow(10, lengthOfCode));
}

export function getDateTime(dateTime: string) {
  let split = dateTime.split(" ")
  let date = split[0].split("-")
  let times=split[1].split(":")

  return date[0] + "/" + date[1] + "/" + date[2] + " at " + times[0] + ":" + times[1];
}

export function composeDeliveryAddress(street: string | undefined, city: string | undefined, postalCode: string | undefined, country: string | undefined): string {
  return (street + ", " + city + ", " + postalCode + ", " + country)
}

export function randomIntFromInterval(min: number, max: number): number{
  return Math.floor(Math.random()* (max-min+1)+ min);
}

export function getCurrentDate(): string {
  return new Date().toISOString().slice(0, 10).replace('T', ' ');
}
