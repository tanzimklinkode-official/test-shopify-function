import {
    DeliveryDiscountSelectionStrategy,
    DiscountClass,
} from "../generated/api";

/**
 * @typedef {import("../generated/api").DeliveryInput} RunInput
 * @typedef {import("../generated/api").CartDeliveryOptionsDiscountsGenerateRunResult} CartDeliveryOptionsDiscountsGenerateRunResult
 */

/**
 * @param {RunInput} input
 * @returns {CartDeliveryOptionsDiscountsGenerateRunResult}
 */

export function cartDeliveryOptionsDiscountsGenerateRun(input) {
    const firstDeliveryGroup = input.cart.deliveryGroups[0];
    if (!firstDeliveryGroup) {
        throw new Error("No delivery groups found");
    }

    const hasShippingDiscountClass = input.discount.discountClasses.includes(
        DiscountClass.Shipping
    );

    if (!hasShippingDiscountClass) {
        return { operations: [] };
    }

    const configuration = JSON.parse(input?.discount?.metafield?.value ?? "{}");


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
                                            id: firstDeliveryGroup.id,
                                        },
                                    },
                                ],
                                value: {
                                    percentage: {
                                        value: 100,
                                    },
                                },
                            },
                        ],
                        selectionStrategy:
                            DeliveryDiscountSelectionStrategy.All,
                    },
                },
            ],
        };
    } else {
        return { operations: [] };
    }
}