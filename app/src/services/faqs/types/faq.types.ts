/**
 * FAQ Types
 */

export interface FaqItem {
  questionEn: string;
  questionAr: string;
  answerEn: string;
  answerAr: string;
}

export interface Faqs {
  id: number;
  items: FaqItem[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateFaqsDto {
  items: FaqItem[];
}
