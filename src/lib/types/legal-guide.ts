export interface LegalGuideSection {
  id: string;
  title: string;
  items: string[];
}

export interface LegalGuide {
  intro: string;
  sections: LegalGuideSection[];
}

export interface LegalGuideSectionInput {
  id?: string;
  title: string;
  body: string;
}

export interface LegalGuideInput {
  intro: string;
  sections: LegalGuideSectionInput[];
}
