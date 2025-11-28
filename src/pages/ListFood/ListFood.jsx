import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Loading from '../../components/Loading/Loading'
import { assets } from '../../assets/assets'
import { formatCurrency, convertToApiPrice,parseCurrencyInput,convertToBase64 } from '../../utils/utils'
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { deleteFood, getFoods, updateFood } from '../../services/FoodServices'

const ListFood = () => {
  const [data, setData] = useState([])
  const [editItem, setEditItem] = useState(null)
  const [editData, setEditData] = useState({})
  const [loading, setLoading] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState({})

  const handlePriceChange = (value) => {
    const cleanValue = parseCurrencyInput(value);
    setEditData({ ...editData, price: cleanValue });
  }

  const fetchDataList = async () => {
    setLoading(true);
    try {
      const response = await getFoods();
      console.log({ response })
      setData(response?.data?.data);
      toast.success('Get food successfully')
    } catch (error) {
      toast.error('Get food failed')
    } finally {
      setLoading(false);
    }
  }
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await deleteFood(id);
      if (response?.status === 200) {
        toast.success('Delete food successfully')
        await fetchDataList();
      } else {
        toast.error('Delete food failed')
      }
    } catch (error) {
      toast.error('Delete food failed')
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (index, item) => {
    setEditItem(index)
    setEditData({ ...item, category: item.category || 'Protein' })
  }
  const handleSave = async (id, data) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        price: convertToApiPrice(data?.price),
        file: data?.file instanceof File ? await convertToBase64(data?.file, 100, 100, 0.5) : data?.file
      }

      console.log('Update payload being sent to API:', payload);

      const response = await updateFood(id, payload);
      if (response?.status === 200) {
        toast.success('Update food successfully')
        setEditItem(null);
        setEditData({});
        await fetchDataList();
      } else {
        console.log({ response })
        toast.error('Update food failed')
      }
    } catch (error) {
      console.log({ error })
      toast.error('Update food failed')
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    setEditItem(null);
    setEditData({});
  };

  useEffect(() => {
    fetchDataList();
  }, [])

  return (
    <section className='container-fluid mt-5'>
      {
        loading ? <Loading /> : (
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className='thead-dark text-center'>
                <tr>
                  <th scope="col-1">Image</th>
                  <th scope="col-1">Name</th>
                  <th scope="col-1">Description</th>
                  <th scope="col-1">Price</th>
                  <th scope="col-1">Category</th>
                  <th scope="col-1">Action</th>
                </tr>
              </thead>
              <tbody className='text-center'>
                {data?.map((item, index) => (
                  <tr key={index}>
                    <td className='overflow-hidden'>
                      {editItem === index ? (
                        <>
                          <label htmlFor="image" className='form-label'>
                            <img
                              src={
                                editData?.file
                                  ? (editData.file instanceof File
                                    ? URL.createObjectURL(editData.file)
                                    : editData.file
                                  )
                                  : assets?.upload
                              }
                              alt='image'
                              width={50}
                              height={50}
                              className='img-fluid object-fit-cover'
                              style={{ cursor: 'pointer' }} />
                          </label>
                          <input type="file" id='image' name='image' className="form-control" hidden required onChange={e => setEditData({ ...editData, file: e.target.files[0] })} />
                        </>
                      ) : (
                        <PhotoProvider>
                          <PhotoView src={item?.file || assets?.upload} className='object-fit-cover w-100 h-100'>
                            <img src={item?.file || assets?.upload} alt='Image' className='object-fit-cover' width={50} height={50} style={{ cursor: 'pointer' }} />
                          </PhotoView>
                        </PhotoProvider>
                      )}
                    </td>
                    <td>
                      {editItem === index ? (
                        <input
                          className="form-control"
                          value={editData.name}
                          onChange={e => setEditData({ ...editData, name: e.target.value })}
                        />
                      ) : (
                        <p>{item.name}</p>
                      )}
                    </td>
                    <td style={{ maxWidth: '200px', maxHeight: '200px', overflow: 'hidden' }}>
                      {editItem === index ? (
                        <input
                          className="form-control"
                          value={editData.description}
                          onChange={e => setEditData({ ...editData, description: e.target.value })}
                        />
                      ) : (
                        <>
                          <p style={{ display: 'inline' }}>
                            {showFullDescription[index]
                              ? item.description
                              : item.description && item.description.length > 50
                                ? item.description.slice(0, 50) + '...'
                                : item.description}
                          </p>
                          {item.description && item.description.length > 50 && !showFullDescription[index] && (
                            <button
                              className="btn btn-link btn-sm p-0 ms-1"
                              style={{ verticalAlign: 'baseline' }}
                              onClick={() => setShowFullDescription(prev => ({ ...prev, [index]: true }))}
                            >
                              Xem thêm
                            </button>
                          )}
                        </>
                      )}
                    </td>
                    <td>
                      {editItem === index ? (
                        <input
                          type="text"
                          className="form-control"
                          value={formatCurrency(editData?.price)}
                          onChange={e => handlePriceChange(e.target.value)}
                        />
                      ) : (
                        <p>{formatCurrency(item?.price)}</p>
                      )}
                    </td>
                    <td>
                      {editItem === index ? (
                        <select name="category" id="category" value={editData.category} onChange={e => setEditData({ ...editData, category: e.target.value })} className='form-select'>
                          <option value="Protein">Protein</option>
                          <option value="Pre-Workout">Pre-Workout</option>
                          <option value="Build muscle">Build muscle</option>
                          <option value="Health & Wellness">Health & Wellness</option>
                        </select>
                      ) : (
                        <p>{item.category}</p>
                      )}
                    </td>
                    <td>
                      {editItem === index ? (
                        <>
                          <button className="btn btn-success btn-sm me-2" onClick={() => handleSave(item?._id, editData)}>Save</button>
                          <button className="btn btn-secondary btn-sm" onClick={handleCancel}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(index, item)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item._id)}>Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }

    </section>
  )
}

export default ListFood