// resources/js/pages/Edit.jsx
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRule, updateRule } from "../api";
import {
  Page,
  FormLayout,
  TextField,
  Button,
  Card,
  Toast,
  Frame,
} from "@shopify/polaris";

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form state
  const [ruleName, setRuleName] = useState("");
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [metafieldId, setMetafieldId] = useState("");

  // Loading and notification
  const [loading, setLoading] = useState(true);
  const [toastActive, setToastActive] = useState(false);
  const [toastContent, setToastContent] = useState("");
  const [toastError, setToastError] = useState(false);

  // Close toast handler
  const toggleToastActive = useCallback(() => setToastActive((active) => !active), []);

  // Fetch rule data on mount
  useEffect(() => {
    const fetchRule = async () => {
      setLoading(true);
      try {
        const response = await getRule(id);
        if (response.success) {
          const parsedValue = JSON.parse(response.rule.value || "{}");

          if (!parsedValue.ruleData) {
            setToastContent("Invalid rule data");
            setToastError(true);
            setToastActive(true);
            setLoading(false);
            return;
          }

          setMetafieldId(response.rule.id);
          const { ruleName, amount, startDate, endDate, discountCode } = parsedValue.ruleData;

          setRuleName(ruleName || "");
          setAmount(amount || "");
          setStartDate(startDate || "");
          setEndDate(endDate || "");
          setDiscountCode(discountCode || "");
        } else {
          setToastContent("Failed to fetch rule");
          setToastError(true);
          setToastActive(true);
        }
      } catch (error) {
        setToastContent("Error fetching rule");
        setToastError(true);
        setToastActive(true);
        console.error(error);
      }
      setLoading(false);
    };

    fetchRule();
  }, [id]);

  // Handle form submission
  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedRule = {
      ruleName,
      amount,
      startDate,
      endDate,
      discountCode,
      metafieldId,
    };

    try {
      const response = await updateRule(id, updatedRule);

      if (response.success) {
        setToastContent("Rule updated successfully!");
        setToastError(false);
        setToastActive(true);
        setTimeout(() => navigate("/"), 1500);
      } else {
        setToastContent("Failed to update rule");
        setToastError(true);
        setToastActive(true);
      }
    } catch (error) {
      setToastContent("Error updating rule");
      setToastError(true);
      setToastActive(true);
      console.error(error);
    }
  };

  return (
    <Frame>
      <Page
        backAction={{ content: "Back", onAction: () => navigate("/") }}
        title={`Edit Rule: ${ruleName || "Loading..."}`}
        breadcrumbs={[{ content: "Back", onAction: () => navigate("/") }]}
      >
        <Card sectioned>
          {loading ? (
            <p>Loading rule...</p>
          ) : (
            <form onSubmit={handleUpdate}>
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
                  <Button primary submit>
                    Update Rule
                  </Button>
                </div>
              </FormLayout>
            </form>
          )}
        </Card>

        {toastActive && (
          <Toast
            content={toastContent}
            onDismiss={toggleToastActive}
            duration={4000}
            error={toastError}
          />
        )}
      </Page>
    </Frame>
  );
};

export default Edit;