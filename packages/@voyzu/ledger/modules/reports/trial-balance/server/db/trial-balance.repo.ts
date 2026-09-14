import type { DbExecutor } from "@voyzu/capability/db";
import type { TrialBalanceLineDto } from "../../types/trial-balance.response.dto";

import { TrialBalanceSnapshotRepo } from "../../../server/db/trial-balance-snapshot.repo";

export class TrialBalanceRepo {
  private readonly trialBalanceSnapshot: TrialBalanceSnapshotRepo;

  constructor(db: DbExecutor) {
    this.trialBalanceSnapshot = new TrialBalanceSnapshotRepo(db);
  }

  async getLines(companyId: number, asAtDate?: string | null): Promise<TrialBalanceLineDto[]> {
    const rows = await this.trialBalanceSnapshot.getLines(companyId, asAtDate);

    return rows.map((r) => ({
      glAccountId: r.glAccountId,
      glAccountCode: r.glAccountCode,
      glAccountName: r.glAccountName,
      accountType: r.accountType,
      debitTotal: r.debitAmount,
      creditTotal: r.creditAmount,
    }));
  }
}

