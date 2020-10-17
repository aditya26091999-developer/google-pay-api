const baseRequest = {
  apiVersion: 2,
  apiVersionMinor: 0,
};

const tokenizationSpecification = {
  type: "PAYMENT_GATEWAY",
  parameters: {
    gateway: "example",
    gatewayMerchantId: "exampleGatewayMerchantId",
  },
};

const allowedCardNetworks = [
  "AMEX",
  "DISCOVER",
  "INTERAC",
  "JCB",
  "MASTERCARD",
  "VISA",
];
const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];
const baseCardPaymentMethod = {
  type: "CARD",
  parameters: {
    allowedAuthMethods: allowedCardAuthMethods,
    allowedCardNetworks: allowedCardNetworks,
  },
};
const cardPaymentMethod = Object.assign(
  { tokenizationSpecification: tokenizationSpecification },
  baseCardPaymentMethod
);

const paymentsClient = new google.payments.api.PaymentsClient({
  environment: "TEST",
});

const isReadyToPayRequest = Object.assign({}, baseRequest);
isReadyToPayRequest.allowedPaymentMethods = [baseCardPaymentMethod];

paymentsClient
  .isReadyToPay(isReadyToPayRequest)
  .then(function (response) {
    if (response.result) {
      const button = paymentsClient.createButton({
        onClick: () => loadGPay(),
      });
      document.getElementById("container").appendChild(button);
    }
  })
  .catch(function (err) {
    // show error in developer console for debugging
    console.error(err);
  });

const paymentDataRequest = Object.assign({}, baseRequest);
paymentDataRequest.allowedPaymentMethods = [cardPaymentMethod];
paymentDataRequest.transactionInfo = {
  totalPriceStatus: "FINAL",
  totalPrice: "10",
  currencyCode: "INR",
  countryCode: "IN",
};

paymentDataRequest.merchantInfo = {
  merchantName: "Example Merchant",
  merchantId: "12345678901234567890",
};

const loadGPay = function () {
  paymentsClient
    .loadPaymentData(paymentDataRequest)
    .then(function (paymentData) {
      // if using gateway tokenization, pass this token without modification
      paymentToken = paymentData.paymentMethodData.tokenizationData.token;
    })
    .catch(function (err) {
      // show error in developer console for debugging
      console.error(err);
    });
};
