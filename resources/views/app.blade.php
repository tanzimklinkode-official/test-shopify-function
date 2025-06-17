<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="shopify-api-key" content="{{ \Osiset\ShopifyApp\Util::getShopifyConfig('api_key', $shopDomain ?? Auth::user()->name ?? null ) }}" />
    <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>

@viteReactRefresh
@vite('resources/js/index.jsx')


</head>
<body>

</body>
</html>