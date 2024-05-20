export class DeliveryPersonIdByCustomerOrderId {
  deliveryPersonId: number;
  customerOrderId: number;

  constructor(deliveryPersonId: number, customerOrderId: number) {
    this.customerOrderId = customerOrderId;
    this.deliveryPersonId = deliveryPersonId;
  }
}
