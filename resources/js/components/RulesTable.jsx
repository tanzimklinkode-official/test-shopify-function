// resources/js/components/RulesTable.jsx

import {
    IndexTable,
    Text,
    Button,
    Card,
    useIndexResourceState,
    Badge,
} from "@shopify/polaris";
import { Link } from "react-router-dom";

function RulesTable({ rules, handleDelete }) {
    const resourceName = {
        singular: "rule",
        plural: "rules",
    };

    const rows = rules.map((rule) => ({
        id: rule.node.id,
        title: rule.node.discount.title,
        startsAt: rule.node.discount.startsAt,
        endsAt: rule.node.discount.endsAt,
        status: rule.node.discount.status,
    }));

    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(rows);

    return (
        <Card>
            <IndexTable
                resourceName={resourceName}
                itemCount={rows.length}
                selectedItemsCount={
                    allResourcesSelected ? "All" : selectedResources.length
                }
                onSelectionChange={handleSelectionChange}
                headings={[
                    { title: "Rule Name" },
                    { title: "Start Date" },
                    { title: "End Date" },
                    { title: "Status" },
                    { title: "Actions" },
                ]}
            >
                {rows.map((row, index) => (
                    <IndexTable.Row
                        id={row.id}
                        key={row.id}
                        selected={selectedResources.includes(row.id)}
                        position={index}
                    >
                        <IndexTable.Cell>
                            <Text
                                variant="bodyMd"
                                fontWeight="medium"
                                as="span"
                            >
                                {row.title}
                            </Text>
                        </IndexTable.Cell>
                        <IndexTable.Cell>{row.startsAt}</IndexTable.Cell>
                        <IndexTable.Cell>{row.endsAt}</IndexTable.Cell>
                        <IndexTable.Cell>
                            <Badge
                                status={
                                    row.status === "ACTIVE"
                                        ? "success"
                                        : "attention"
                                }
                            >
                                {row.status}
                            </Badge>
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: "0.5rem",
                                    alignItems: "center",
                                }}
                            >
                                <Link
                                    to={`/rules/edit/${row.id
                                        .split("/")
                                        .pop()}`}
                                >
                                    <Button plain>Edit</Button>
                                </Link>
                                <Button
                                    onClick={() => handleDelete(row.id)}
                                    destructive
                                    size="slim"
                                    tone="critical"
                                >
                                    Delete
                                </Button>
                            </div>
                        </IndexTable.Cell>
                    </IndexTable.Row>
                ))}
            </IndexTable>
        </Card>
    );
}

export default RulesTable;