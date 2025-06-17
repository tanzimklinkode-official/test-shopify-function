// resources/js/components/Discount.jsx

import {
    IndexTable,
    Text,
    TextField,
    Button,
    Popover,
    ActionList,
    Icon,
    Layout,
    Card,
    useIndexResourceState,
    Badge,
    Checkbox,
} from "@shopify/polaris";
import {useState, useCallback} from 'react';
import {CaretDownIcon} from '@shopify/polaris-icons';

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

    // dropdown
    const [active, setActive] = useState(false);

    const handleToggle = () => {
        setActive((prevState) => !prevState);
    };

    const handleSelect = (selectedItem) => {
        console.log('Selected Item:', selectedItem);
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

    return (
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
                    
                </Card>
            </Layout.Section>

            <Layout.Section>
                <Card sectioned>
                    <Text variant="headingMd" as="h2">Discount settings</Text>

                    <TextField
                        label="Discount Name"
                        value={textFieldValue}
                        onChange={handleTextFieldChange}
                        maxLength={64} placeholder="New Discount Name"
                        autoComplete="off"
                        showCharacterCount
                    />

                </Card>
            </Layout.Section>


        </Layout>
       
       

        
    );
};

export default Discount;