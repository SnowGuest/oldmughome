import { createRouter, createWebHistory } from 'vue-router'
import Layout from "@/layouts/index.vue"
import Home from "@/pages/home/index.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: Layout,
      children: [{
        path: "/",
        component: Home
      },
      {
        path: "search",
        component: () => import("@/pages/search/index.vue")
      }, {
        path: "categories",
        component: () => import("@/pages/categories/index.vue")
      }, {
        path: "categorie/:id",
        component: () => import("@/pages/categorie/index.vue")
      }, {
        path: "article/:id",
        component: () => import("@/pages/article/index.vue")
      }, {
        path: "bof/2023",
        component: () => import("@/pages/bof/2023.vue")
      }
        // {
        //   path: "monf2023",
        //   component
        // }
      ]
    },

  ]
})

export default router
