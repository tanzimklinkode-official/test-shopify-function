// extensions/discount-tanzim/node_modules/@shopify/shopify_function/run.ts
function run_default(userfunction) {
  try {
    ShopifyFunction;
  } catch (e) {
    throw new Error(
      "ShopifyFunction is not defined. Please rebuild your function using the latest version of Shopify CLI."
    );
  }
  const input_obj = ShopifyFunction.readInput();
  const output_obj = userfunction(input_obj);
  ShopifyFunction.writeOutput(output_obj);
}

// extensions/discount-tanzim/src/cart_lines_discounts_generate_run.js
function cartLinesDiscountsGenerateRun(input) {
  if (!input.cart.lines.length) {
    throw new Error("No cart lines found");
  }
  const hasOrderDiscountClass = input.discount.discountClasses.includes(
    "ORDER" /* Order */
  );
  const hasProductDiscountClass = input.discount.discountClasses.includes(
    "PRODUCT" /* Product */
  );
  if (!hasOrderDiscountClass && !hasProductDiscountClass) {
    return { operations: [] };
  }
  const maxCartLine = input.cart.lines.reduce((maxLine, line) => {
    if (line.cost.subtotalAmount.amount > maxLine.cost.subtotalAmount.amount) {
      return line;
    }
    return maxLine;
  }, input.cart.lines[0]);
  const operations = [];
  if (hasOrderDiscountClass) {
    operations.push({
      orderDiscountsAdd: {
        candidates: [
          {
            message: "10% OFF ORDER",
            targets: [
              {
                orderSubtotal: {
                  excludedCartLineIds: []
                }
              }
            ],
            value: {
              percentage: {
                value: 10
              }
            }
          }
        ],
        selectionStrategy: "FIRST" /* First */
      }
    });
  }
  if (hasProductDiscountClass) {
    operations.push({
      productDiscountsAdd: {
        candidates: [
          {
            message: "20% OFF PRODUCT",
            targets: [
              {
                cartLine: {
                  id: maxCartLine.id
                }
              }
            ],
            value: {
              percentage: {
                value: 20
              }
            }
          }
        ],
        selectionStrategy: "FIRST" /* First */
      }
    });
  }
  return {
    operations
  };
}

// extensions/discount-tanzim/src/cart_delivery_options_discounts_generate_run.js
function cartDeliveryOptionsDiscountsGenerateRun(input) {
  const rawValue = input?.discount?.metafield?.value;
  const parsed = JSON.parse(rawValue);
  const rules = parsed?.ruleData?.rules;
  var discountArr = [];
  let messageValue = "";
  let productQuantity = 0;
  for (const line of input.cart.lines) {
    productQuantity += line.quantity;
  }
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    switch (rule.label) {
      case "Cart Total":
        if (rule.type === "more_than" && input.cart.cost.totalAmount.amount > rule.value) {
          discountArr.push(true);
        } else if (rule.type === "less_than" && input.cart.cost.totalAmount.amount < rule.value) {
          discountArr.push(true);
        } else {
          discountArr.push(false);
        }
        break;
      case "Item Count":
        if (rule.type === "more_than" && productQuantity > rule.value) {
          discountArr.push(true);
        } else if (rule.type === "less_than" && productQuantity < rule.value) {
          discountArr.push(true);
        } else {
          discountArr.push(false);
        }
        break;
      case "SKU":
        break;
      default:
        console.log(`Unknown rule: ${rule.label}`);
        break;
    }
  }
  const firstDeliveryGroup = input.cart.deliveryGroups[0];
  if (!firstDeliveryGroup) {
    throw new Error("No delivery groups found");
  }
  const hasShippingDiscountClass = input.discount.discountClasses.includes(
    "SHIPPING" /* Shipping */
  );
  if (!hasShippingDiscountClass) {
    return { operations: [] };
  }
  const configuration = JSON.parse(input?.discount?.metafield?.value ?? "{}");
  console.log(discountArr.every(Boolean));
  if (discountArr.every(Boolean) === true) {
    messageValue = configuration?.ruleData?.discountMessagevalue;
    console.log(messageValue);
    return {
      operations: [
        {
          deliveryDiscountsAdd: {
            candidates: [
              {
                message: messageValue,
                targets: [
                  {
                    deliveryGroup: {
                      id: firstDeliveryGroup.id
                    }
                  }
                ],
                value: {
                  percentage: {
                    value: parseFloat(configuration?.ruleData?.amount)
                  }
                }
              }
            ],
            selectionStrategy: "ALL" /* All */
          }
        }
      ]
    };
  } else {
    return { operations: [] };
  }
  if (parseFloat(input.cart.cost.totalAmount.amount) > parseFloat(configuration?.ruleData?.amount)) {
    return {
      operations: [
        {
          deliveryDiscountsAdd: {
            candidates: [
              {
                message: "FREE DELIVERY",
                targets: [
                  {
                    deliveryGroup: {
                      id: firstDeliveryGroup.id
                    }
                  }
                ],
                value: {
                  percentage: {
                    value: 100
                  }
                }
              }
            ],
            selectionStrategy: "ALL" /* All */
          }
        }
      ]
    };
  } else {
    return { operations: [] };
  }
}

// <stdin>
function cartLinesDiscountsGenerateRun2() {
  return run_default(cartLinesDiscountsGenerateRun);
}
function cartDeliveryOptionsDiscountsGenerateRun2() {
  return run_default(cartDeliveryOptionsDiscountsGenerateRun);
}
export {
  cartDeliveryOptionsDiscountsGenerateRun2 as cartDeliveryOptionsDiscountsGenerateRun,
  cartLinesDiscountsGenerateRun2 as cartLinesDiscountsGenerateRun
};
