import React, { useEffect, useState } from 'react'
import DashSidebar from '../components/Dashboard/Dash-Sidebar'
import { useLocation } from 'react-router-dom'
import DashProfile from '../components/Dashboard/Dash-Profile'
import DashUsers from '../components/Dashboard/Dash-Users'
import DashCategory from '../components/Dashboard/Dash-Category'
import { useSelector } from 'react-redux'
import DashAddProduct from '../components/Dashboard/Dash-AddProduct'
import DashAllProducts from '../components/Dashboard/Dash-AllProducts'
import DashEditProduct from './EditProduct'
import DashOrders from '../components/Dashboard/Dash-Orders'
import DashDashboard from '../components/Dashboard/Dash-Dashboard'

function Dashboard() {
    const location = useLocation()
    const [tab, setTab] = useState('')
    const {currentUser} = useSelector((state) => state.user)

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const tab = urlParams.get('tab')
        if(tab){
            setTab(tab)
        }
    }, [location.search])
    
  return (
    <div className='flex min-h-screen flex-col md:flex-row'>
        <div><DashSidebar /></div>
        
        {tab==='dash' && currentUser.isAdmin && <DashDashboard />}
        {tab==='profile' && <DashProfile />}
        {tab==='users' && currentUser.isAdmin && <DashUsers />}
        {tab==='category' && currentUser.isAdmin && <DashCategory />}
        {tab==='addProduct' && currentUser.isAdmin && <DashAddProduct />}
        {tab==='allProducts' && currentUser.isAdmin && <DashAllProducts />}
        {tab==='orders' && currentUser.isAdmin && <DashOrders />}
    </div>
  )
}

export default Dashboard