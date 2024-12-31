import React from 'react'
import { Link } from 'react-router-dom'

function DashCard({ title, value, icon, linkk }) {
  return (
    <div className="p-6 pb-1 border bg-white rounded-md shadow-dashboard">
    <div className="flex flex-wrap items-center justify-between mb-1 -m-2">
        <div className="w-auto p-2">
            <h2 className="text-2xl font-medium ">{title}</h2>
        </div>
        {
            linkk && (
                <Link to={linkk}>
        <div className="w-auto p-2">
            <div className="flex items-center justify-center w-12 h-12 text-lg text-blue-500 hover:text-blue-600 rounded-md">
                See all
            </div>
        </div>
        </Link>
            )
        }
    </div>
    <div className="flex flex-wrap">
        <div className="w-full ">
            <div className="flex flex-wrap items-center gap-5 py-2 text-gray-700 ">
                    {icon}
                    <h3 className="text-3xl font-medium">{value}</h3>
            </div>
        </div>
    </div>
</div>
  )
}

export default DashCard