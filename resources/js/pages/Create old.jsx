import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Page,
    Card,
    FormLayout,
    TextField,
    Button,
    InlineError,
    Banner,
} from "@shopify/polaris";
import { postRequest } from "../api";
const Create = () => {
    const navigate = useNavigate();
    const [ruleName, setRuleName] = useState("");
    const [amount, setAmount] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [discountCode, setDiscountCode] = useState("");
    const [error, setError] = useState(null);
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
                    <TextField
                        label="Amount"
                        type="number"
                        value={amount}
                        onChange={setAmount}
                        autoComplete="off"
                        requiredIndicator
                    />
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