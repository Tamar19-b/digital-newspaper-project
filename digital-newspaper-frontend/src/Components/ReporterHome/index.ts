// ממשק כתבה
export interface Article {
  idArticle?: number;
  type: string;
  subType: string;
  title: string;
  text: string;
  reporterApproval: boolean;
  editorApproval: boolean;
  status: string;
  createdAt: string;
  lastModified: string;
  publishedAt: string;
  sectionId: number;
  sectionName: string;
  reporterId?: number;
  reporterName?: string;
  editorId?: number | null;
  editorName?: string | null;
  editorNotes?:string | null;
  imge?:string | null;
  propilReporter?:string | null;
  
  // נוספו:
  likeCount: number | null;
  dislikeCount: number | null;
  views: number | null;
}

// ממשק מדור
export interface Section {
  idSection: number;
  name: string;
}

// ממשק כתב
export interface ReporterData {
  id: number;
  name: string;
  email: string;
  section: Section;
  propil?: string | null;
  articles: Article[];
}
export interface EditorData {
  idE: number;
  nameE: string;
  emailE: string;
  sectionE: Section;
  propilE?: string | null;
  articles: Article[];

}
