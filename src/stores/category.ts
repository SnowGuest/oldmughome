import { defineStore } from "pinia"
import { getCategories, type Categorie } from "@/api/categorie";
import { ref } from "vue";

export const useCategorieStore = defineStore('categorie', () => {
    const categorie = ref<Categorie[]>([]);
    async function initCategorie() {
        const { data, error, refresh, execute } = await getCategories("global/catgorys")
        if (data.value?.code !== 0) return []
        categorie.value = [...data.value.data.categories]
    }
    return { initCategorie, categorie }
})