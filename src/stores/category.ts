import { defineStore } from "pinia"
import { getCategories, type Categorie } from "@/api/categorie";
import { ref } from "vue";

export const useCategorieStore = defineStore('categorie', () => {
    const categorie = ref<Categorie[]>([]);
    async function initCategorie() {
        const { data: { categories }, code } = await getCategories()
        if (code !== 0) return []
        categorie.value = [...categories]
    }
    return { initCategorie, categorie }
})