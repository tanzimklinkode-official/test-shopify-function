import { useState,useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    Page,
    Card,
    Text,
    FormLayout,
    TextField,
    Button,
    InlineError,
    InlineStack,
    BlockStack,
    Popover,
    ActionList,
    Banner,
} from "@shopify/polaris";
import { postRequest } from "../api";
import { CaretDownIcon } from '@shopify/polaris-icons';
const Create = () => {
    const navigate = useNavigate();
    const [ruleName, setRuleName] = useState("");
    const [amount, setAmount] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [discountCode, setDiscountCode] = useState("");
    const [error, setError] = useState(null);

    // dropdown rules and condition

    const [active, setActive] = useState(false);
    const [inputs, setInputs] = useState([]);
    const activatorRef = useRef(null);
    const maxConditions = 3;

    const handleToggle = () => {
        setActive((prevState) => !prevState);
    };


    const handleSelect = useCallback((label) => {
        if (inputs.length < maxConditions) {
            setInputs((prev) => [...prev, { label, value: '' }]);
        }
        setActive(false); // close the popover
    }, [inputs]);

    const handleInputChange = (index) => (value) => {
        setInputs((prev) => {
            const updated = [...prev];
            updated[index].value = value;
            return updated;
        });
    }

    const handleRemove = (indexToRemove) => {
    setInputs((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

    // end dropdown

    const handleSubmit = async () => {
        setError(null);
        if (!ruleName || !amount) {
            setError("Please fill in all required fields");
            return;
        }
        try {
            const data = {
                ruleName,
                amount,
                startDate,
                endDate,
                discountCode,
            };
            const response = await postRequest("/api/rules", data);
            if (response.success) {
                navigate("/");
            } else {
                setError("Failed to create rule");
            }
        } catch (err) {
            setError("An unexpected error occurred");
            console.error(err);
        }
    };
    return (
        <Page
            backAction={{ content: "Back", onAction: () => navigate("/") }}
            title="Create New Rule"
            breadcrumbs={[{ content: "Home", onAction: () => navigate("/") }]}
        >
            <Card sectioned>
                {error && (
                    <Banner title="Error" status="critical">
                        <p>{error}</p>
                    </Banner>
                )}
                <FormLayout>
                    <TextField
                        label="Rule Name"
                        value={ruleName}
                        onChange={setRuleName}
                        autoComplete="off"
                        requiredIndicator
                    />

                    <BlockStack gap="200">
                        <Text variant="headingMd" as="h2">
                            Rules & conditions ({inputs.length} / {maxConditions})
                        </Text>

                        {inputs.length === 0 ? (
                            <Text as="span" tone="subdued">No conditions added yet</Text>
                        ) : (
                            inputs.map((input, index) => (

                                <BlockStack key={`${input.label}-${index}`} gap="200">
                                    <InlineStack align="space-between">
                                        <Text variant="bodyMd">{input.label}</Text>
                                        <Button
                                            variant="plain"
                                            size="medium"
                                            onClick={() => handleRemove(index)}
                                        >
                                            <Text variant="bodySm" ><small>remove</small></Text>
                                        </Button>
                                    </InlineStack>
                                    <TextField
                                        value={input.value}
                                        onChange={handleInputChange(index)}
                                        autoComplete="off"
                                        
                                    />
                                </BlockStack>

                                // <TextField
                                //     key={`${input.label}-${index}`}
                                //     label={input.label}
                                //     value={input.value}
                                //     onChange={handleInputChange(index)}
                                //     autoComplete="off"
                                // />


                            ))
                        )}

                        {inputs.length < maxConditions && (
                            <Popover
                                active={active}
                                activator={
                                    <Button icon={CaretDownIcon} variant="primary" onClick={() => setActive((prev) => !prev)} disclosure>
                                        Add condition
                                    </Button>
                                }
                                onClose={() => setActive(false)}
                            >
                                <ActionList
                                    items={[
                                        {
                                            content: 'Cart Total',
                                            onAction: () => handleSelect('Cart Total'),
                                        },
                                        {
                                            content: 'Item Count',
                                            onAction: () => handleSelect('Item Count'),
                                        },
                                        {
                                            content: 'SKU',
                                            onAction: () => handleSelect('SKU'),
                                        },
                                    ]}
                                />
                            </Popover>
                        )}
                        
                    </BlockStack>
                       

                    {/* <TextField
                        label="Amount"
                        type="number"
                        value={amount}
                        onChange={setAmount}
                        autoComplete="off"
                        requiredIndicator
                    /> */}
                    <FormLayout.Group style={{ gap: "1rem" }}>
                        <TextField
                            label="Start Date"
                            type="date"
                            value={startDate}
                            onChange={setStartDate}
                        />
                        <TextField
                            label="End Date"
                            type="date"
                            value={endDate}
                            onChange={setEndDate}
                        />
                    </FormLayout.Group>
                    <TextField
                        label="Discount Code"
                        value={discountCode}
                        onChange={setDiscountCode}
                        autoComplete="off"
                    />
                    <div style={{ textAlign: "right" }}>
                        <Button primary onClick={handleSubmit}>
                            Create Rule
                        </Button>
                    </div>
                </FormLayout>
            </Card>
        </Page>
    );
};
export default Create;