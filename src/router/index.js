import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import Login from '@/components/user/Login'
import Register from '@/components/user/Register'
import UserInfo from '@/components/user/UserInfo'
import VerifyEmail from '@/components/user/VerifyEmail'
import NftProfiler from "@/components/nft/NftProfiler";
import VerifyCode from '@/components/user/VerifyCode'
import ResetPsd from '@/components/user/ResetPsd'

import WalletProfiler from '@/components/walletProfiler/WalletProfiler'
import WalletProfilerDetail from '@/components/walletProfiler/WalletProfilerDetail'
import WalletLabelSetting from '@/components/walletProfiler/WalletLabelSetting'

import ParaChainProfiler4Kusama from '@/components/paraChainProfiler/kusama/ParaChainProfiler'
import ParaChainCrowdloanContributionDetail4Kusama from '@/components/paraChainProfiler/kusama/ContributionDetail'

import ParaChainProfiler4Polkadot from '@/components/paraChainProfiler/polkadot/ParaChainProfiler'
import ParaChainCrowdloanContributionDetail4Polkadot from '@/components/paraChainProfiler/polkadot/ContributionDetail'

import CDPProfiler from '@/components/cdpProfiler/CDPProfiler'
import CDPDetail from '@/components/cdpProfiler/CDPDetail'
import CDPActionDetail from '@/components/cdpProfiler/CDPActionDetail'

import CustomQuery from '@/components/customQuery/CustomQuery'
import MoonRiver from '@/components/moonRiver/index'
import MoonRiverAction from '@/components/moonRiver/action'
import AddressTagManage from '@/components/sysConfig/AddressTagManage'

import NotReady from '@/components/NotReady'


Vue.use(Router)

export default new Router({
    routes: [

        {
            path: '/',
            name: 'HomePage',
            component: HomePage
        },
        {
            path: '/NotReady',
            name: 'NotReady',
            component: NotReady
        },
        {
            path: "/NftProfiler",
            name: "NftProfiler",
            component: NftProfiler
        },
        {
            path: '/Login',
            name: 'Login',
            meta: {
                noHead: true
            },
            component: Login
        },
        {
            path: '/Register',
            name: 'Register',
            meta: {
                noHead: true
            },
            component: Register
        },
        {
            path: '/UserInfo',
            name: 'UserInfo',
            component: UserInfo
        },
        {
            path: '/VerifyEmail',
            name: 'VerifyEmail',
            meta: {
                noHead: true
            },
            component: VerifyEmail
        },
        {
            path: '/VerifyCode',
            name: 'VerifyCode',
            meta: {
                noHead: true
            },
            component: VerifyCode
        },
        {
            path: '/ResetPsd',
            name: 'ResetPsd',
            meta: {
                noHead: true
            },
            component: ResetPsd
        },
        {
            path: '/WalletProfiler',
            name: 'WalletProfiler',
            component: WalletProfiler
        },

        {
            path: '/WalletProfilerDetail',
            name: 'WalletProfilerDetail',
            meta: {
                noHead: true
            },
            component: WalletProfilerDetail
        }, {
            path: '/WalletLabelSetting',
            name: 'WalletLabelSetting',
            component: WalletLabelSetting
        },

        {
            path: '/ParaChainProfiler',
            name: 'ParaChainProfiler',
            meta: {
                noHead: true
            },
            component: ParaChainProfiler4Kusama
        },
        {
            path: '/ParaChainProfiler4Polkadot',
            name: 'ParaChainProfiler4Polkadot',
            meta: {
                noHead: true
            },
            component: ParaChainProfiler4Polkadot
        },
        {
            path: '/ParaChainCrowdloanContributionDetail',
            name: 'ParaChainCrowdloanContributionDetail',
            component: ParaChainCrowdloanContributionDetail4Kusama
        },
        {
            path: '/ParaChainCrowdloanContributionDetail4Polkadot',
            name: 'ParaChainCrowdloanContributionDetail4Polkadot',
            component: ParaChainCrowdloanContributionDetail4Polkadot
        },
        {
            path: '/CDPProfiler',
            name: 'CDPProfiler',
            meta: {
                noHead: true
            },
            component: CDPProfiler
        },

        {
            path: '/CDPDetail',
            name: 'CDPDetail',
            meta: {
                noHead: true
            },
            component: CDPDetail
        },
        {
            path: '/CDPActionDetail',
            name: 'CDPActionDetail',
            meta: {
                noHead: true
            },
            component: CDPActionDetail
        },
        {
            path: '/CustomQuery',
            name: 'CustomQuery',
            component: CustomQuery
        },
        {
            path: '/MoonRiver',
            name: 'MoonRiver',
            component: MoonRiver
        },
        {
            path: '/CollectorAction',
            name: 'CollectorAction',
            meta: {
                noHead: true
            },
            component: MoonRiverAction
        },
        {
            path: '/AddressTagManage',
            name: 'AddressTagManage',
            component: AddressTagManage
        },
    ]
})