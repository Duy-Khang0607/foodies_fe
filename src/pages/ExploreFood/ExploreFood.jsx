import React from 'react'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import { useState } from 'react'
import { useEffect } from 'react'

const ExploreFood = () => {
    const [category, setCategory] = useState('All')
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, 500)
        return () => clearTimeout(timer)
    }, [search])
    return (
        <>
            <section className='container py-5 mt-5'>
                <div className='row justify-content-center'>
                    <div className='col-md-6'>
                        <form action="" className='mt-1' onSubmit={(e) => e.preventDefault()}>
                            <div className='d-flex flex-row'>
                                <select name="" id="" className='form-select' style={{maxWidth: '150px'}} value={category} onChange={(e) => setCategory(e.target.value)}>
                                    <option value="All">All</option>
                                    <option value="Isoject Whey Protein Isolate">Isoject Whey Protein Isolate</option>
                                    <option value="EVP Xtreme N.O. Pre-Workout">EVP Xtreme N.O. Pre-Workout</option>
                                    <option value="Amino K.E.M. EAA">Amino K.E.M. EAA</option>
                                    <option value="Creatine">Creatine</option>
                                </select>
                                <div className='input-group'>
                                    <input type="text" className='form-control' placeholder='Search for food' value={search} onChange={(e) => setSearch(e.target.value)} />
                                    <button className='btn btn-primary'>Search</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
            <section className='container'>
                <FoodDisplay category={category} search={debouncedSearch} />
            </section>
        </>
    )
}

export default ExploreFood