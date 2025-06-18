// resources/js/pages/Edit.jsx
import { useEffect, useState, useCallback,useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRule, updateRule } from "../api";
import {
  Page,
  FormLayout,
  TextField,
  Button,
  Card,
  Text,
  Grid,
  Select,
  Box,
  InlineStack,
  BlockStack,
  Popover,
  ActionList,
  Toast,
  Frame,
} from "@shopify/polaris";
import { CaretDownIcon } from '@shopify/polaris-icons';

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
  const [discountMessagevalue, setDiscountMessageValue] = useState('');

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
          const { ruleName, amount, startDate, endDate, discountCode,discountMessagevalue,rules } = parsedValue.ruleData;

          setRuleName(ruleName || "");
          setAmount(amount || "");
          setStartDate(startDate || "");
          setEndDate(endDate || "");
          setDiscountCode(discountCode || "");
          setDiscountMessageValue(discountMessagevalue || "");


          setInputs(
            (rules || []).map(rule => {
              let options = [];

              if (rule.label === 'Cart Total' || rule.label === 'Item Count') {
                options = [
                  { label: 'More than', value: 'more_than' },
                  { label: 'Less than', value: 'less_than' },
                ];
              } else if (rule.label === 'SKU') {
                options = [
                  { label: 'If found', value: 'if_found' },
                  { label: 'If not found', value: 'if_not_found' },
                  { label: 'If starts with', value: 'starts_with' },
                ];
              }

              return {
                label: rule.label,
                condition: rule.type, 
                value: rule.value,
                options,
              };
            })
          );

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

  // dropdown rules and condition

  const [active, setActive] = useState(false);
  const [inputs, setInputs] = useState([]);
  const activatorRef = useRef(null);
  const maxConditions = 3;

  const handleToggle = () => {
    setActive((prevState) => !prevState);
  };


  const handleSelect = useCallback((label) => {
    let options = [];
    if (label === 'Cart Total' || label === 'Item Count') {
      options = [
        { label: 'More than', value: 'more_than' },
        { label: 'Less than', value: 'less_than' },
      ];
    } else if (label === 'SKU') {
      options = [
        { label: 'If found', value: 'if_found' },
        { label: 'If not found', value: 'if_not_found' },
        { label: 'If starts with', value: 'starts_with' },
      ];
    }
    if (inputs.length < maxConditions) {
      setInputs((prev) => [...prev, {
        label,
        condition: options.length ? options[0].value : '',
        options,
        value: '',
      }]);
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

  const handleSelectChange = (index) => (newValue) => {
    setInputs((prev) => {
      const updated = [...prev];
      updated[index].condition = newValue;
      return updated;
    });
  };

  const handleRemove = (indexToRemove) => {
    setInputs((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // end dropdown

  // amount percentage


    const handleAmountChange = (value) => {
        
        const num = Number(value);

        if (!Number.isInteger(num) || num < 1 || num >100) {
            return; 
        }

        setAmount(value);
    };

    // generate code

    const handleDiscountCodeChange = useCallback(
    (value) => setDiscountCode(value),
    []
  );

    const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase(); // generates 8 random alphanumeric characters
    setDiscountCode(code);
  };


  //discount message

    const handleDiscountMessage = useCallback(
        (value) => setDiscountMessageValue(value),
        []
    );

  // Handle form submission
  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedRule = {
      ruleName,
      amount,
      startDate,
      endDate,
      discountCode,
      discountMessagevalue,      
      rules: inputs.map(input => ({
        label: input.label,
        type: input.condition,
        value: input.value,
      })),
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


                  <Box style={{
                    border: '1px solid #dfe3e8',
                    padding: '16px',
                  }}>
                    <BlockStack gap="200" >
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



                            <Grid>
                              <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                                {input.options && (
                                  <Select
                                    labelHidden
                                    options={input.options}
                                    onChange={handleSelectChange(index)}
                                    value={input.condition}
                                  />
                                )}
                              </Grid.Cell>
                              <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                                <TextField
                                  value={input.value}
                                  onChange={handleInputChange(index)}
                                  autoComplete="off"
                                  labelHidden
                                  placeholder={input.label === 'SKU' ? 'Separate by commas' : `Enter value for ${input.label.toLowerCase()}`}
                                  suffix={input.label === 'SKU' ? undefined : ''}

                                />
                              </Grid.Cell>
                            </Grid>


                          </BlockStack>




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
                  </Box>
                  Maximum 3 conditions allwed per rule

                <TextField
                  label="Amount"
                  type="integer"
                  value={amount}
                  onChange={handleAmountChange}
                  autoComplete="off"
                  suffix="%"
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

                  <Box>
                    <InlineStack
                      align="space-between"
                      wrap
                      gap="1"
                      direction="row"
                    >
                      <Text variant="bodyMd">Discount code</Text>
                      <Button variant="plain" size="medium" onClick={generateCode} >
                        <Text variant="bodySm">Generate random code</Text>
                      </Button>
                    </InlineStack>
                  </Box>
                <TextField
                  value={discountCode}
                  onChange={handleDiscountCodeChange}
                  autoComplete="off"
                />

                 <TextField
                        label="Applied discount message"
                        value={discountMessagevalue}
                        maxLength={64}
                        onChange={handleDiscountMessage}
                        autoComplete="off"
                        showCharacterCount
                    />
                    Enter the informational text which will be displayed at the checkout once the discount is successfully applied.


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