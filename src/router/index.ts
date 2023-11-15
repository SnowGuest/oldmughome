import { createRouter, createWebHistory } from 'vue-router'
import Layout from "@/layouts/index.vue"
import Auth from "@/layouts/authorize.vue"

import Home from "@/pages/home/index.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: Layout,
      children: [
        {
          path: "/",
          component: Home
        }, {
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
        }, {
          path: "monf/2023",
          component: () => import("@/pages/monf/2023.vue")
        }, {
          path: "monf/:id",
          component: () => import("@/pages/monf/article.vue")
        }, {
          path: "/account/:id",
          component: () => import("@/pages/account/index.vue")
        }, {
          path: "reset/account",
          component: () => import("@/pages/reset/account.vue")
        }, {
          path: "reset/email",
          component: () => import("@/pages/reset/email.vue")
        }, {
          path: "error",
          component: () => import("@/error.vue")
        },
      ]
    },
    {
      path: "/reset",
      component: Auth,
      children: [{
        path: "password",
        component: () => import("@/pages/reset/password.vue")
      }]
    },
    {
      path: "/register",
      component: () => import("@/pages/register.vue")
    }
  ]
})

export default router
