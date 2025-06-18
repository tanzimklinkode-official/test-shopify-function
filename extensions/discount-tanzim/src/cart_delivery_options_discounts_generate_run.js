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

    const rawValue = input?.discount?.metafield?.value;
    const parsed = JSON.parse(rawValue);
    const rules = parsed?.ruleData?.rules;
    var discountArr = [];
    let messageValue = '';
    
    // console.log(input);

    // calculate item quantity.

    let productQuantity = 0;

    for (const line of input.cart.lines) {
        productQuantity += line.quantity;
    }

    for (let i = 0; i < rules.length; i++) {
        const rule = rules[i]; 

        switch (rule.label) {
            case 'Cart Total':
                if(rule.type==='more_than' && (input.cart.cost.totalAmount.amount > rule.value)){
                discountArr.push(true);
                }else if(rule.type==='less_than' && (input.cart.cost.totalAmount.amount < rule.value) ){
                discountArr.push(true);
                }else{
                discountArr.push(false);
                }
                break;

            case 'Item Count':
                if(rule.type==='more_than' && (productQuantity > rule.value)){
                discountArr.push(true);
                }else if(rule.type==='less_than' && (productQuantity < rule.value) ){
                discountArr.push(true);
                }else{
                discountArr.push(false);
                }
                break;

            case 'SKU':
                
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
        DiscountClass.Shipping
    );

    if (!hasShippingDiscountClass) {
        return { operations: [] };
    }

    const configuration = JSON.parse(input?.discount?.metafield?.value ?? "{}");
    
    // discount rules

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
                                            id: firstDeliveryGroup.id,
                                        },
                                    },
                                ],
                                value: {
                                    percentage: {
                                        value: parseFloat(configuration?.ruleData?.amount),
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
    }else{
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