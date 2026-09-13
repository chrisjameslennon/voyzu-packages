# Customer prototype fixtures

The mock providers import these JSON files using import attributes and work on in-memory copies. Updates do not modify the files. Tests reset the copies before each case.

Party fixtures and Customer assembly live in Platform's `packages/@voyzu/business-objects` folder. Commercial's account provider reads only `customer-accounts.json`; it does not retrieve or assemble Party data.

Tests use the generated internal API registry. Platform's Customer implementation retrieves the Commercial account contribution through `@core/customer/account`.
