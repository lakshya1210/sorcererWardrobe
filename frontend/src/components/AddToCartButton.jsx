import { Button, Spinner } from 'flowbite-react'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

function AddToCartButton({productId, quantity=1, className=""}) {
    const [loading, setLoading] = useState(false)
    const addToCart = async(e) => {
        e.stopPropagation();
        e.preventDefault();
        setLoading(true)
        try {
            const res = await fetch(`/api/cart`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({productId, quantity})
            })
            const data = await res.json()
            if(res.ok){
                setLoading(false)
                return toast.success('Added to cart!')
            }
            else{
                setLoading(false)
                return toast.error(data.msg)
            }
        } catch (error) {
            setLoading(false)
            console.log(error.message)
        }
    }

  return (
    <button className={`${className}`} onClick={addToCart}>
        {
            loading ? (<Spinner />) : ('Add to Cart')
        }
    </button>
  )
}

export default AddToCartButton