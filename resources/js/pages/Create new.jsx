// resources/js/components/Discount.jsx

import {
    Page,
    Text,
    TextField,
    Button,
    ButtonGroup,
    Popover,
    ActionList,
    Icon,
    Layout,
    BlockStack,
    InlineStack,
    Card,
    Box,
    Select,
    Grid,
    Badge,
    LegacyStack,
    RadioButton,
    Checkbox,
} from "@shopify/polaris";
import { useState, useCallback } from 'react';
import { CaretDownIcon } from '@shopify/polaris-icons';
import { postRequest } from "../api";

const Discount = () => {

    const [selectedDiscounts, setSelectedDiscounts] = useState({
        orderDiscount: false,
        productDiscount: false,
        shippingDiscount: false,
    });

    // Handle checkbox change
    const handleCheckboxChange = useCallback((newValue, discountType) => {
        setSelectedDiscounts((prevState) => ({
            ...prevState,
            [discountType]: newValue,
        }));
    }, []);

    // dropdown rules and condition
    const [active, setActive] = useState(false);

    const handleToggle = () => {
        setActive((prevState) => !prevState);
    };

    const handleSelect = (selectedItem) => {
        
        setActive(false);  // Close the popover after selection
    };

    const activator = (
        <Button onClick={handleToggle} aria-expanded={active} icon={CaretDownIcon} variant="primary">
            <Text>Add a Condition</Text>

        </Button>
    );

    const [textFieldValue, setTextFieldValue] = useState('');

    const handleTextFieldChange = useCallback(
        (value) => setTextFieldValue(value),
        []
    );

    //discount message

    const [discountMessagevalue, setDiscountMessageValue] = useState('');
    const handleDiscountMessage = useCallback(
        (value) => setDiscountMessageValue(value),
        []
    );



    const [isCode, setIsCode] = useState('0');
    

    // pressed button

    const [activeButtonIndex, setActiveButtonIndex] = useState(0);

    const handleButtonClick = useCallback(
        (index) => {
            if (activeButtonIndex === index) return;
            setActiveButtonIndex(index);
            setIsCode(index); 
        },
        [activeButtonIndex],
    );
    
    // textfield
     
     const handleChange = useCallback(
    (newValue) => setValue(newValue),
    [],
  );

  // generate code

   const [discountCode, setDiscountCode] = useState('');
    const handleDiscountCodeChange = useCallback(
    (value) => setDiscountCode(value),
    []
  );

    const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase(); // generates 8 random alphanumeric characters
    setDiscountCode(code);
  };

  // select discount value

  const [selected, setSelected] = useState('today');

  const handleSelectChange = useCallback(
    (value) => setSelected(value),
    [],
  );

  const options = [
    {label: 'Percentage', value: 'percentage'},
    {label: 'Fixed Amount', value: 'fixedAmount'},
  ];
    const [discountValue, setDiscountValue] = useState(10);
    const [discountType, setDiscountType] = useState('percentage');
    const handleDiscountValueChange = useCallback((value) => setDiscountValue(value), []);


  // radio discount apply

  const [value, setValue] = useState('all');

  const handleRadioChange = useCallback(
    (newValue) => setValue(newValue),
    [],
  );

  // selected product seelction

  const [selectedProduct, setSelectedProduct] = useState('apply');

  const handleSelectProductChange = useCallback(
    (value) => setSelectedProduct(value),
    [],
  );

  const selectionBehaviourOptions = [
    {label: 'Skip this discount for the selected items below', value: 'skip'},
    {label: 'Apply this discount for the selected items below', value: 'apply'},
  ];

    // checkbox select items
    const [selectedOptions, setSelectedOptions] = useState({
        products: false,
        productTags: false,
        collections: false,
        vendor: false,
        sku: false,
    });

   
    const SelectionCheckboxes = useCallback((newValue, field) => {
        setSelectedOptions((prevState) => ({
            ...prevState,
            [field]: newValue,
        }));
    }, [setSelectedOptions]);
    


    const [isLimitUsedChecked, setIsLimitUsedChecked] = useState(false);
    const [isLimitToOneChecked, setIsLimitToOneChecked] = useState(false);
    const [limitValue, setLimitValue] = useState('');

    const handleLimitUsedChange = () => {
        setIsLimitUsedChecked(prevState => !prevState);
    };
    const handleLimitToOneChange = () => {
        setIsLimitToOneChecked(prevState => !prevState);
    };

    // Handle change for the limit value input
    const handleLimitValueChange = (e) => {
        setLimitValue(e.target.value);
    };

    // discount combo checkbox

   
    const [selectedComboDiscounts, setSelectedComboDiscounts] = useState({
    productDiscount: false,
    orderDiscount: false,
    shippingDiscount: false,
  });


   const handleComboChange = useCallback((newValue, field) => {
    setSelectedComboDiscounts((prevState) => ({
      ...prevState,
      [field]: newValue,  
    
    }));
  }, []);

    return (
        <Page
            backAction={{ content: "Back", onAction: () => navigate("/") }}
            title="Create New Discount"
            breadcrumbs={[{ content: "Home", onAction: () => navigate("/") }]}
        >
            <Layout>
                <Layout.Section>
                    <Card sectioned>

                        <Text variant="headingMd" as="h2">Discount type</Text>

                        <div style={{ marginBottom: '10px', marginTop: '10px' }}>
                            <Checkbox
                                label="Order discount - (applies to order subtotal)"
                                checked='true'
                                onChange={(newValue) => handleCheckboxChange(newValue, 'orderDiscount')}
                            />
                        </div>


                        <div style={{ marginBottom: '10px' }}>
                            <Checkbox
                                label="Product discount - (applies to individual line items)"
                                checked={selectedDiscounts.productDiscount}
                                onChange={(newValue) => handleCheckboxChange(newValue, 'productDiscount')}
                            />
                        </div>


                        <div style={{ marginBottom: '10px' }}>
                            <Checkbox
                                label="Shipping discount - (applies to shipping rates)"
                                checked={selectedDiscounts.shippingDiscount}
                                onChange={(newValue) => handleCheckboxChange(newValue, 'shippingDiscount')}
                            />
                        </div>
                        Select whether the discount applies to order subtotal, cart line products, or shipping rates.
                    </Card>
                </Layout.Section>

                <Layout.Section>
                    <Card sectioned>
                        <BlockStack gap="200"> 
                        <Text variant="headingMd" as="h2">Rules & conditions( 1 / 3 )</Text>

                        No conditions added yet

                        <Popover
                            active={active}
                            activator={activator}
                            onClose={() => setActive(false)}  // Close the popover when clicking outside
                        >
                            <ActionList
                                items={[
                                    {
                                        content: 'Option 1',
                                        onAction: () => handleSelect('Option 1'),
                                    },
                                    {
                                        content: 'Option 2',
                                        onAction: () => handleSelect('Option 2'),
                                    },
                                    {
                                        content: 'Option 3',
                                        onAction: () => handleSelect('Option 3'),
                                    },
                                ]}
                            />
                        </Popover>
                        </BlockStack> 
                    </Card>
                </Layout.Section>

                <Layout.Section>
                    <Card sectioned>
                        <Box display="flex" >
                            <BlockStack gap="200">
                                <Text variant="headingMd" as="h2">Discount settings</Text>

                                <TextField
                                    label="Discount Name"
                                    value={textFieldValue}
                                    onChange={handleTextFieldChange}
                                    maxLength={64} placeholder="New Discount Name"
                                    autoComplete="off"
                                    showCharacterCount
                                />
                                Used only for configuration purposes as a reference and not visible to customers.

                                <Text variant="bodymd" as="h4" >
                                    Discount Method
                                </Text>

                                <ButtonGroup variant="segmented">
                                    <Button
                                        pressed={activeButtonIndex === 0}
                                        onClick={() => handleButtonClick(0)}
                                    >Discount Code</Button>
                                    <Button
                                        pressed={activeButtonIndex === 1}
                                        onClick={() => handleButtonClick(1)}
                                    >Automatic Discount</Button>
                                </ButtonGroup>

                               
                                {isCode === 0 ? (
                                <div>
                                <Box>
                                    <InlineStack
                                        align="space-between"
                                        wrap
                                        gap="2"
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

                                        Customers must enter this code at checkout.
                                    </div>
                                ) : (
                                    <div>
                                        <TextField
                                            label="Applied discount message"
                                            value={discountMessagevalue}
                                            onChange={handleDiscountMessage}
                                            autoComplete="off"
                                            showCharacterCount
                                        />
                                        Enter the informational text which will be displayed at the checkout once the discount is successfully applied.
                                    </div>
                                )}

                                <Grid>
                                    <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                                        <Select
                                            label="Discount Value"
                                            value={selected}
                                            options={options}
                                            onChange={handleSelectChange}
                                        />
                                    </Grid.Cell>
                                    <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                                        <TextField
                                            label="Discount Amount"
                                            value={discountValue}
                                            onChange={handleDiscountValueChange}
                                            type="number"
                                            suffix="%"
                                            labelStyle={{
                                                visibility: 'hidden',
                                            }}

                                        />
                                    </Grid.Cell>
                                </Grid>
                            </BlockStack>
                        </Box>
                    </Card>
                </Layout.Section>


                <Layout.Section>

                    <Card sectioned>
                        <Box >
                            <LegacyStack vertical gap="200">
                                <Text variant="headingMd" as="h2">Discount applies to</Text>

                                <RadioButton
                                    label="All Products"
                                    checked={value === 'all'}
                                    id="allProductsRadio"
                                    name="discountType"
                                     onChange={() => handleRadioChange('all')}
                                />
                                <RadioButton
                                    label="Selected Products Only"
                                    id="specificProductsRadio"
                                    name="discountType"
                                    checked={value === 'specificProducts'}
                                     onChange={() => handleRadioChange('specificProducts')}
                                />

                                {value==='specificProducts'  && (
                                    <div >
                                        <Select
                                            label="Selection behavior"
                                            value={selectedProduct}
                                            options={selectionBehaviourOptions}
                                            onChange={handleSelectProductChange}
                                        />
                                        <br />

                                        <Box marginBlockStart="200" >
                                            
                                            <Text variant="bodyMd">Select items by</Text>
                                           

                                            <InlineStack align="start" wrap gap="400">
                                                <Checkbox
                                                    label="Products"
                                                    checked={selectedOptions.products}
                                                    onChange={(value) => SelectionCheckboxes(value, 'products')}
                                                />
                                                <Checkbox
                                                    label="Product tags"
                                                    checked={selectedOptions.productTags}
                                                    onChange={(value) => SelectionCheckboxes(value, 'productTags')}

                                                />
                                                <Checkbox
                                                    label="Collections"
                                                    checked={selectedOptions.collections}
                                                    onChange={(value) => SelectionCheckboxes(value, 'collections')}

                                                />
                                                <Checkbox
                                                    label="Vendor"
                                                    checked={selectedOptions.vendor}
                                                    onChange={(value) => SelectionCheckboxes(value, 'vendor')}

                                                />
                                                <Checkbox
                                                    label="SKU"
                                                    checked={selectedOptions.sku}
                                                    onChange={(value) => SelectionCheckboxes(value, 'sku')}

                                                />
                                            </InlineStack>
                                        </Box>
                                    </div>
                                )}
                                
                            </LegacyStack >
                        </Box>
                    </Card>

                </Layout.Section>

                <Layout.Section>

                    <Card sectioned>
                        <Box >
                            <LegacyStack vertical gap="200">
                                <Text variant="headingMd" as="h2">Maximum Discount Use</Text>

                                <Checkbox
                                    label="Limit number of times this discount can be used in total"
                                    checked={isLimitUsedChecked}
                                    onChange={handleLimitUsedChange}
                                />
                                {isLimitUsedChecked && (
                                    <input
                                        type="number"
                                        value={limitValue}
                                        onChange={handleLimitValueChange}
                                        placeholder="Enter the limit"
                                    />
                                )}
                                <Checkbox
                                    label="Limit to one user per customer"
                                    checked={isLimitToOneChecked}
                                     onChange={handleLimitToOneChange}
                                />
                            </LegacyStack >
                        </Box>
                    </Card>

                </Layout.Section>


                <Layout.Section>

                    <Card sectioned>

                        <Text variant="headingMd" as="h2">Combinations</Text>
                        <br/>
                        This discount can be combined with:
                        
                        <div style={{ marginBottom: '10px', marginTop: '10px' }}>
                            <Checkbox
                                label="Order discount"
                                checked={selectedComboDiscounts.orderDiscount}
                                onChange={(newValue) => handleComboChange(newValue, 'orderDiscount')}
                            />
                        </div>


                        <div style={{ marginBottom: '10px' }}>
                            <Checkbox
                                label="Product discount"
                                checked={selectedComboDiscounts.productDiscount}
                                onChange={(newValue) => handleComboChange(newValue, 'productDiscount')}
                            />
                        </div>


                        <div style={{ marginBottom: '10px' }}>
                            <Checkbox
                                label="Shipping discount"
                                checked={selectedComboDiscounts.shippingDiscount}
                                onChange={(newValue) => handleComboChange(newValue, 'shippingDiscount')}
                            />
                        </div>
                    </Card>

                </Layout.Section>

            </Layout>


        </Page>

    );
};

export default Discount;