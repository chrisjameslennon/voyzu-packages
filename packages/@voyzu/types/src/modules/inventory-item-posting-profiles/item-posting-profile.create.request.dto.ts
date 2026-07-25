export interface ItemPostingProfileCreateRequestDto {
  profile_code: string;
  profile_name: string;
  description: string;
  is_sold: boolean;
  is_purchased: boolean;
  is_consumed: boolean;
  revenue_code: string | null;
  cogs_code: string | null;
  purchase_expense_code: string | null;
  consumption_code: string | null;
  adjustment_gain_code: string | null;
  adjustment_loss_code: string | null;
}
