import {
  DiscountClass,
  OrderDiscountSelectionStrategy,
  ProductDiscountSelectionStrategy,
} from '../generated/api';


/**
  * @typedef {import("../generated/api").CartInput} RunInput
  * @typedef {import("../generated/api").CartLinesDiscountsGenerateRunResult} CartLinesDiscountsGenerateRunResult
  */

/**
  * @param {RunInput} input
  * @returns {CartLinesDiscountsGenerateRunResult}
  */

export function cartLinesDiscountsGenerateRun(input) {
  if (!input.cart.lines.length) {
    throw new Error('No cart lines found');
  }

  const hasOrderDiscountClass = input.discount.discountClasses.includes(
    DiscountClass.Order,
  );
  const hasProductDiscountClass = input.discount.discountClasses.includes(
    DiscountClass.Product,
  );

  if (!hasOrderDiscountClass && !hasProductDiscountClass) {
    return {operations: []};
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
            message: '10% OFF ORDER',
            targets: [
              {
                orderSubtotal: {
                  excludedCartLineIds: [],
                },
              },
            ],
            value: {
              percentage: {
                value: 10,
              },
            },
          },
        ],
        selectionStrategy: OrderDiscountSelectionStrategy.First,
      },
    });
  }

  if (hasProductDiscountClass) {
    operations.push({
      productDiscountsAdd: {
        candidates: [
          {
            message: '20% OFF PRODUCT',
            targets: [
              {
                cartLine: {
                  id: maxCartLine.id,
                },
              },
            ],
            value: {
              percentage: {
                value: 20,
              },
            },
          },
        ],
        selectionStrategy: ProductDiscountSelectionStrategy.First,
      },
    });
  }

  return {
    operations,
  };
}