<template>
    <ul class="list">
        <li v-for="[id, item] in list" :key="id" class="userCard ">
            <RouterLink :to="`/account/${item.id}`" target="_blank" class="userCardbody  flex items-center">
                <UserCard :user="item" :size="62" />
                <div class="ml-4">
                    <div class="font1">{{ item.nickName }}</div>
                    <div class="font2">{{ item.bio }}</div>
                </div>
            </RouterLink>
        </li>
    </ul>
</template>

<script lang="ts" setup>
import { type User } from '@/api/user';
import UserCard from '@/components/userCard.vue';
interface Props {
    list: Map<string | number, User>
}
defineProps<Props>()
</script>
<style lang="scss" scoped>
.list {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    row-gap: 20px;
    column-gap: 20px;
    padding: 20px 0;

    .userCard {
        .userCardbody {
            padding: 12px 25px;
        }

        background: #fff;
        box-shadow: 0 2px 4px 0 #f3f3f3;
        position: relative;
        cursor: pointer;
        height: 90px;

        .font1 {
            font-size: 24px;
        }

        .font2 {
            font-size: 14px;
            color: #6a789a;
            margin-top: 4px;
        }
    }
}
</style>