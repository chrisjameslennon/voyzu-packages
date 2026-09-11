# Semantic contracts

The manifest registers definitions and implementations under
`contracts.semanticDataDefinition` and `contracts.semanticCapabilityDefinition`.

```typescript
capabilities.use()
capabilities.optional()
capabilities.transaction()

semanticData.get()
semanticData.getOptional()
semanticData.query()
semanticData.queryOptional()
semanticData.compose()
semanticData.isImplemented()
```

Definitions are owned here; providers remain in the implementing package.
