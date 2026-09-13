# Customer prototype fixtures

The mock providers import these JSON files using import attributes and work on in-memory copies. Updates do not modify the files. Tests reset the copies before each case.

`parties.json` simulates platform-owned Party data in the test adapter only. Commercial's account provider reads only `customer-accounts.json`; it does not retrieve or assemble Party data.

The test adapter is not the platform internal API engine. Distributed `@core` registration and assembly are still pending.
