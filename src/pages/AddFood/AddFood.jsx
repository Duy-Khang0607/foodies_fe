import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { addFood } from '../../services/FoodServices'
import { formatCurrency, parseCurrencyInput, convertToBase64, convertToApiPrice } from '../../utils/utils'
import { assets } from '../../assets/assets'

const AddFood = () => {
  const [image, setImage] = useState(null)
  const [data, setData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Protein'
  })
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'price') {
      // Only allow numbers for price input
      newValue = parseCurrencyInput(value);
    }

    setData(prev => ({
      ...prev,
      [name]: newValue
    }));
  }



  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!image) return toast.error('Please upload an image');
    const payload = {
      ...data,
      price: convertToApiPrice(data.price),
      file: await convertToBase64(image, 100, 100, 0.5)
    }

    try {
      const response = await addFood(payload);
      if (response?.status === 201) {
        setData({
          name: '',
          description: '',
          price: '',
          category: 'Protein'
        })
        setImage(null)
        toast.success('Food added successfully');
      }
    } catch (error) {
      toast.error('Something went wrong !');
    }
  }
  return (
    <div className="row justify-content-start p-3">
      <div className="col-md-8 col-lg-6 card p-3">
        <form onSubmit={handleSubmit} className="contact-form">
          <h2 className="text-center mb-4">Add Food</h2>
          <div className="mb-3">
            <label htmlFor="image" className="form-label">
              <img src={image ? URL.createObjectURL(image) : assets?.upload || ''} alt="image" width={100} height={100} className='img-fluid object-fit-cover rounded' style={{ cursor: 'pointer' }} />
            </label>
            <input type="file" id='image' name='image' className="form-control" required hidden onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control" id="name" name='name' value={data.name} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <input type="text" className="form-control" id="description" name='description' value={data.description || ''} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="price" className="form-label">Price</label>
            <input type="text" className="form-control" id="price" name='price' value={formatCurrency(data?.price)} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="category" className="form-label">Category</label>
            <select name="category" id="category" value={data.category} onChange={handleChange} className='form-select'>
              <option value="Protein">Protein</option>
              <option value="Pre-Workout">Pre-Workout</option>
              <option value="Build muscle">Build muscle</option>
              <option value="Health & Wellness">Health & Wellness</option>
            </select>
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary btn-lg">
              <i className="bi bi-plus-lg me-2"></i>
              Add Food
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddFood