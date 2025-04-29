---
sidebar_position: 9
---
# Using the Entity-Attribute-Value(EAV)

# Product attributes
For now, we’ll just quickly go through most important ones:

- group: Means that we add an attribute to the attribute group “General”, which is present in all attribute sets.
- type: varchar means that the values will be stored in the catalog_eav_varchar table.
- label: A label of the attribute (that is, how it will be rendered in the backend and on the frontend).
- `source/frontend/backend`: Special classes associated with the attribute:
    + source model: provides a list of options
    + frontend: defines how it should be rendered on the frontend
    + backend: allows you to perform certain actions when an attribute is loaded or saved. In our example, it will be validation.
- Global: defines the scope of its values (global, website, or store)
- visible_on_front: A flag that defines whether an attribute should be shown on the “More Information” tab on the frontend
- is_html_allowed_on_front: Defines whether an attribute value may contain HTML

```
Magento\Eav\Setup\EavSetup $eavSetup
$eavSetup->addAttribute(
    \Magento\Catalog\Model\Category::ENTITY,
    'url_key',
    [
        'type' => 'varchar',
        'label' => 'URL Key',
        'input' => 'text',
        'required' => false,
        'sort_order' => 3,
        'global' => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE,
        'group' => 'General Information',
    ]
);
$eavSetup->getAttributeId($eavSetup->getEntityTypeId('catalog_product'), 'your_attribute_code');
$eavSetup->addAttributeOption($options);
```