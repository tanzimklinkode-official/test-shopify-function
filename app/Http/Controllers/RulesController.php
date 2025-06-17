<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class RulesController extends Controller
{
    public function create_rule(Request $request)
    {
        $shop = Auth::user();
        $functionId = config('ship-right.function_id');
        $metafieldData = [
            "namespace" =>  '$app:discount-rules-function',
            'key' => 'function-configuration',
            'value' => json_encode([
                'ruleData' => $request->all(),
            ]),
            'type' => 'json',
        ];

        $mutation = '
                    mutation discountCodeAppCreate($codeAppDiscount: DiscountCodeAppInput!) {
                        discountCodeAppCreate(codeAppDiscount: $codeAppDiscount) {
                        codeAppDiscount {
                            discountId
                        }
                        userErrors {
                            field
                            message
                        }
                        }
                    }';

        $variables = [
            'codeAppDiscount' => [
                "code" => $request->input('discountCode'),
                "title" => $request->input('ruleName'),
                "functionId" => $functionId,
                "startsAt" => $request->input('startDate'),
                "endsAt" => $request->input('endDate'),
                "discountClasses" => ['SHIPPING'],
                'metafields' => [$metafieldData]
            ]
        ];
        $response = $shop->api()->graph($mutation, $variables);

        // dd($response);
        return response()->json([
            'success' => true,
            'message' => 'Discount rule created successfully.',
        ]);
    }
    public function show_rule($id)
    {
        $shop = Auth::user();
        $discountId = 'gid://shopify/DiscountCodeNode/' . $id;

        $query = '
                query getDiscountWithMetafield($id: ID!, $namespace: String!) {
                    discountNode(id: $id) {
                        id
                        discount {
                            __typename
                            ... on DiscountCodeApp {
                                title
                                status
                                startsAt
                                endsAt
                                usageLimit
                                appliesOncePerCustomer
                                codes(first: 10) {
                                            nodes {
                                                code
                                            }
                                        }
                            }
                        }
                        metafield(namespace:  $namespace, key: "function-configuration") {
                            namespace
                            key
                            id
                            value
                            type
                        }
                    }
                }
            ';




        $variables = [
            'id' => $discountId,
            'namespace' => '$app:discount-rules-function'
        ];
        $response = $shop->api()->graph($query, $variables);


        if (isset($response['body']['data']['discountNode']['metafield'])) {
            $metafield = json_decode($response['body']['data']['discountNode']['metafield']['value'], true);
            $response['body']['data']['discountNode']['metafield'] = $metafield;
        }
        if (isset($response['body']['data']['discountNode']['discount']['codes']['nodes'])) {
            $response['body']['data']['discountNode']['discount']['codes'] = $response['body']['data']['discountNode']['discount']['codes']['nodes'];
        }
        if (isset($response['body']['data']['discountNode']['discount']['startsAt'])) {
            $response['body']['data']['discountNode']['discount']['startsAt'] = Carbon::parse($response['body']['data']['discountNode']['discount']['startsAt'])->format('Y-m-d H:i:s');
        }
        if (isset($response['body']['data']['discountNode']['discount']['endsAt'])) {
            $response['body']['data']['discountNode']['discount']['endsAt'] = Carbon::parse($response['body']['data']['discountNode']['discount']['endsAt'])->format('Y-m-d H:i:s');
        }

        // dd($response['body']['data']['discountNode']['metafield']['value']);

        return response()->json([
            'rules' => $response,
            // 'rules' => $response['body']['data']['discountNode']['metafield']['value'],
        ]);
    }


    public function get_rules()
    {
        $shop = Auth::user();
        

        $query = '
            query getDiscounts($first: Int, $after: String) {
                discountNodes(first: $first, after: $after) {
                    edges {
                        node {
                            id
                            discount {
                                __typename
                                ... on DiscountCodeApp {
                                    title
                                    status
                                    startsAt
                                    endsAt
                                    usageLimit
                                     appDiscountType {
                                            title
                                            functionId
                                     }
                                }
                                ... on DiscountAutomaticApp {
                                    title
                                    status
                                    startsAt
                                    endsAt
                                     appDiscountType {
                                            title
                                            functionId

                                     }
                                }
                            }
                        }
                    }
                         pageInfo {
                        endCursor
                        hasNextPage
                        hasPreviousPage
                        startCursor
                    }
                }
            }
        ';

        $variables = [
            'first' => 250,
            'after' => null,
        ];

        $response = $shop->api()->graph($query, $variables);
        // dd($response)  ;      

        $discounts = $response['body']['data']['discountNodes']['edges'];
        // dd($discounts);

        return response()->json([
            'rules' => $discounts,
            'success' => true,
        ]);
    }

    public function delete_rule($id)
    {
        $shop = Auth::user();
        $globalId = 'gid://shopify/DiscountCodeNode/' . $id;
        $mutation = '
        mutation deleteDiscount($id: ID!) {
            discountCodeDelete(id: $id) {
                deletedCodeDiscountId
                userErrors {
                    field
                    code
                    message
                }
            }
        }';

        $variables = [
            'id' => $globalId
        ];

        try {
            $response = $shop->api()->graph($mutation, $variables);

            return response()->json([
                'success' => true,
                'message' => 'Discount rule deleted successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function get_rule($id)
    {
        $shop = Auth::user();
        $discountId = 'gid://shopify/DiscountCodeNode/' . $id;

        $query = '
                query getDiscountWithMetafield($id: ID!, $namespace: String!) {
                    discountNode(id: $id) {
                        id
                        discount {
                            __typename
                            ... on DiscountCodeApp {
                                title
                                status
                                startsAt
                                endsAt
                                usageLimit
                                appliesOncePerCustomer
                                codes(first: 10) {
                                            nodes {
                                                code
                                            }
                                        }
                            }
                        }
                        metafield(namespace:  $namespace, key: "function-configuration") {
                            namespace
                            key
                            id
                            value
                            type
                        }
                    }
                }
            ';

        $variables = [
            'id' => $discountId,
            'namespace' => '$app:discount-rules-function'
        ];
        $response = $shop->api()->graph($query, $variables);

        // dd($response);

        return response()->json([
            'rule' => $response['body']['data']['discountNode']['metafield'],
            'success' => true,
        ]);
    }


    public function update_rule(Request $request, $id)
    {
        $shop = Auth::user();
        $ruleData = $request->ruleData;


        $globalId = 'gid://shopify/DiscountCodeNode/' . $id;
        $metafieldId = $ruleData['metafieldId'];
        $functionId = config('ship-right.function_id');
        $metafieldData = [
            'id' => $metafieldId,
            'value' => json_encode([
                'ruleData' => $ruleData,
            ]),
            'type' => 'json',
        ];


        $mutation = '
                    mutation discountCodeAppUpdate($codeAppDiscount: DiscountCodeAppInput!, $id: ID!) {
                        discountCodeAppUpdate(codeAppDiscount: $codeAppDiscount, id: $id) {
                        codeAppDiscount {
                            discountId
                        }
                        userErrors {
                            field
                            message
                        }
                        }
                    }';

        $variables = [
            'id' => $globalId,
            'codeAppDiscount' => [
                // "id" => $globalId,
                "code" => $ruleData['discountCode'],
                "title" => $ruleData['ruleName'],
                "functionId" => $functionId,
                "startsAt" => $ruleData['startDate'],
                "endsAt" => $ruleData['endDate'],
                "discountClasses" => ['SHIPPING'],
                'metafields' => [$metafieldData]
            ]
        ];

        $response = $shop->api()->graph($mutation, $variables);
        // dd($ruleData,$response);
        return response()->json([
            'success' => true,
            'message' => 'Discount rule updated successfully.',
        ]);
    }
}