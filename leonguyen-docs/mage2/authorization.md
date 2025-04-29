# Authorization


## Pages (controllers)
## RESTful/SOAP web API endpoints
## UI components


## Explicit authorization
### Page (controller) for authenticated customers
```
class MyController implements \Magento\Framework\App\ActionInterface, \Magento\Framework\App\Action\HttpGetActionInterface {
    private \Magento\Authorization\Model\UserContextInterface $userContext;
    ...
    public function construct(\Magento\Authorization\Model\UserContextInterface $userContext) {
        $this->userContext = $userContext;
    }
    ...

    public function execute() {
        ...

        if ($this->userContext->getUserType() == UserContextInterface::USER_TYPE_CUSTOMER
            && $this->userContext->getUserId()) {
            ...
        } else {
            throw new AuthorizationException(__('Please log in'));
        }
    }
}
```
### GraphQL node for authenticated customers
```
class MyResolver implements \Magento\Framework\GraphQl\Query\ResolverInterface
{
    ...
    public function resolve(
        Field $field,
        $context,
        ResolveInfo $info,
        array $value = null,
        array $args = null
    ) {
        /** @var \Magento\GraphQl\Model\Query\ContextInterface $context */
        if (false === $context->getExtensionAttributes()->getIsCustomer()) {
            throw new GraphQlAuthorizationException(__('The current customer isn\'t authorized.'));
        }
        ...
    }
}
```

### Ownership verification
```
if ($userContext->getUserType() === UserContextInterface::USER_TYPE_CUSTOMER
    && $userContext->getUserId() === $wishListItem->getCustomerId()) {
    return $wishListItem;
} else {
    throw new AuthorizationException(__('Not authorized'));
}
```

### Explicit authorization in blocks and UI component data providers