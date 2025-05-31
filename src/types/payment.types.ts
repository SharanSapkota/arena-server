export interface PaymentMethod {
  id: string;
  user_id: string;
  method_type: 'credit_card' | 'paypal';
  details: Record<string, any>;
  added_at: Date;
}

export interface Payment {
  id: string;
  payer_id: string;
  receiver_id: string;
  arena_id: string;
  method_id: string;
  amount: number;
  paid_at: Date;
}

export interface CreatePaymentMethodDto {
  method_type: 'credit_card' | 'paypal';
  details: Record<string, any>;
}

export interface CreatePaymentDto {
  receiver_id: string;
  arena_id: string;
  method_id: string;
  amount: number;
} 