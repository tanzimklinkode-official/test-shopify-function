// resources/js/pages/Home.jsx

import { useEffect, useState } from "react";
import { getRules, deleteRule } from "../api";
import {
  Page,
  Button,
  Card,
  EmptyState,
} from "@shopify/polaris";
import RulesTable from "../components/RulesTable";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (ruleId) => {
    if (window.confirm("Are you sure you want to delete this rule?")) {
      const id = ruleId.split("/").pop();
      const response = await deleteRule(id);

      if (response.success) {
        setRules((prevRules) =>
          prevRules.filter((rule) => rule.node.id !== ruleId)
        );
        alert("Rule deleted successfully");
      } else {
        alert("Failed to delete rule");
      }
    }
  };

  useEffect(() => {
    const fetchRules = async () => {
      const response = await getRules("/api/rules/get-rules");
      if (!response.success) {
        console.error("Failed to fetch rules");
        setLoading(false);
        return;
      }

      setRules(response.rules);
      setLoading(false);
    };

    fetchRules();
  }, []);

  return (
    <Page
      title="Discount App"
      primaryAction={{
        content: "Create discount",
        onAction: () => navigate("/rules/create"),
      }}
    >
      {rules.length === 0 && !loading ? (
        <Card sectioned>
          <EmptyState
            heading="No discount rules. Create one!"
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            fullWidth
            action={{
              content: "Create discount",
              onAction: () => navigate("/rules/create"),
            }}
          >
            <p>
              Add discount codes and automatic discounts that apply at checkout.
            </p>
          </EmptyState>
        </Card>
      ) : loading ? (
        <div>Loading...</div>
      ) : (
        <RulesTable rules={rules} handleDelete={handleDelete} />
      )}
    </Page>
  );
};

export default Home;