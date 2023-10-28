import { request } from "@/utils/request"

export interface CategoriesParams {

}
export interface CategoriesBody { categories: Categorie[] }


export interface Categorie {
    color: string;
    description: string | null;
    postCount:number;
    icon: string;
    id: number;
    isHidden: boolean;
    name: string;
    parentId: number;
    slug: string;
    children: Categorie[];
}

export function getCategories( params?: CategoriesParams) {
    return request<CategoriesBody>("category", {
        method: "GET",
        params,
        
    });

}
export function getCategorie( id: number | string) {
    return request<Categorie>(`category/${id}`, {
        method: "GET",
        
    })
}