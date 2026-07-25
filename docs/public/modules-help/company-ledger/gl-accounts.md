# General Ledger Accounts

General Ledger Accounts manages the chart of accounts used by the selected company.

## Concepts

* [What Is a Financial Ledger?](../../concepts/what-is-a-financial-ledger.md) explains the general ledger and immutable entries.
* [Financial Settings and Tethering](/broken/pages/8yyiyzggr2y0AScYWDBt) explains organization standards and company-owned settings.
* [Financial Document Processing](../../concepts/financial-document-processing.md) explains how documents post to accounts.

## Viewing general ledger accounts

The list shows code, name, account type, reporting category, status, and whether postings exist. Search by code or name, filter by account type or status, and open a row for detail. Select rows for status, deletion, and export actions.

## In use

An account is in use when a posting or another financial setting refers to it. Posted accounts must remain available to explain history. Tethered companies use the organization standard; company maintenance becomes relevant only when the company owns its financial settings.

## Create a new general ledger account

Select **Add GL Account**. Enter a stable code, clear name, account type, and reporting category. The account type controls its financial behavior and must agree with the chosen category.

## Make changes

Open the account and change only fields allowed by its usage state. Keep the code and financial meaning stable after use. Changes affect later processing, not historical entries.

## Change status

Activate an account to allow new use. Deactivate only an unused account; inactive accounts remain visible for history.

## Delete

Delete only an account with no postings and no references. Deletion is permanent.

## See also

* [Reporting Categories](reporting-categories.md)
* [Journals](journals.md)
* [Account Activity](account-activity.md)
