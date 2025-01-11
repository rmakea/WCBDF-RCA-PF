export interface Discount {
    id: number;
    discountCode: string;
    discountAmount: number;
    validUntil: Date;
}