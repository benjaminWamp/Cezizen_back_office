import { ArticleType } from "./article";

export interface ImageType {
    id: number;
    path: string;
    ressources: ArticleType[];
}