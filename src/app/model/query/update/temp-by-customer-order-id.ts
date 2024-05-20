export class TempByCustomerOrderId {
  customerOrderId: number;
  temp: number;

  constructor(customerOrderId: number, minTemp: number) {
    this.customerOrderId = customerOrderId;
    this.temp = minTemp;
  }
}
