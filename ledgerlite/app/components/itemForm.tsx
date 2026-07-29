"use client"

import { useState } from "react"

export default function ItemForm(){
  const [name, setName]= useState("")
  const [lowStock, setLowStock]= useState(5)
  const [id, setid]= useState("xcvbnn")
  const [operationId, setOperationId]= useState("sdfcxveem345mm")
  const [currentStock, setCurrentStock]= useState(0)
  const [loading, setLoading]= useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    setLoading(true)
    const res = await fetch("/api/routes/item", {
      method: "POST",
      body: JSON.stringify({name, lowStock, currentStock, id, operationId})
    })
    const response = await res.json()
    setLoading(false)
    setName("")
    setLowStock(0)
    setCurrentStock(0)
    console.log(response)

  }


  return (
    <div className="min-h-screen w-screen bg-white flex items-center justify-center">
      <div className="bg-gray-300 rounded-md w-full max-w-md p-6">
        
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 items-center"
        >
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="name"
            className="w-full border p-2 rounded placeholder:text-black"
          />
          <input
            type="hidden"
            name="id"
            defaultValue={id}
            className="w-full border p-2 rounded placeholder:text-black"
          />
  
          <input
            type="number"
            name="lowStock"
            value={lowStock}
            onChange={(e) => setLowStock(Number(e.target.value))}
            placeholder="low stock"
            className="w-full border p-2 rounded"
          />
  
          <input
            type="number"
            name="currentStock"
            value={currentStock}
            onChange={(e) => setCurrentStock(Number(e.target.value))}
            placeholder="current stock"
            className="w-full border p-2 rounded"
          />
  
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}