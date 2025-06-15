//@ts-nocheck
import { RouteRecordRaw } from 'vue-router';

import { useNavbar } from '@cmmv/blog/admin/composable/useNavbar';
import AdminLayout from '@cmmv/blog/admin/layouts/AdminLayout.vue';
import FootballPredictionsView from './views/FootballPredictionsView.vue';

export const footballPredictionsRoutes: RouteRecordRaw[] = [
    {
        path: '/football-predictions',
        component: AdminLayout,
        children: [
            {
                path: 'manage',
                component: FootballPredictionsView,
                name: 'football-predictions-manage'
            }
        ]
    },
] as RouteRecordRaw[]

useNavbar().addItems([
    {
        label: 'Football Predictions',
        icon: 'fas fa-futbol',
        to: '/football-predictions/manage',
        group: 'Content'
    }
]) 