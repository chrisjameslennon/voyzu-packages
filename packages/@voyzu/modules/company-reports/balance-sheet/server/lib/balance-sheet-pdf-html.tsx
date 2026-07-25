import type { BalanceSheetReportTemplateProps } from "../../templates/BalanceSheetReportTemplate";
import { BalanceSheetReportTemplate } from "../../templates/BalanceSheetReportTemplate";
import { balanceSheetReportCss } from "../../templates/balance-sheet-report.css";

type RenderBalanceSheetPdfHtmlOptions = Omit<BalanceSheetReportTemplateProps, "includeCss">;

export async function renderBalanceSheetPdfHtml(options: RenderBalanceSheetPdfHtmlOptions): Promise<string> {
  const { renderToStaticMarkup } = await import("react-dom/server");
  const markup = renderToStaticMarkup(<BalanceSheetReportTemplate {...options} includeCss={false} />);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Balance Sheet</title>
  <style>
    html,
    body {
      margin: 0;
      padding: 0;
      background: #fff;
    }

    ${balanceSheetReportCss}
  </style>
</head>
<body>${markup}</body>
</html>`;
}
