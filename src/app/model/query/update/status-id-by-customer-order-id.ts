export class StatusIdByCustomerOrderId {
  statusId: number;
  customerOrderId: number;

  constructor(customerOrderId: number, statusId: number) {
    this.customerOrderId = customerOrderId;
    this.statusId = statusId;
  }
}
