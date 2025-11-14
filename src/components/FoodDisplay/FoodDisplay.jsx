import React, { useContext, useState, useEffect } from 'react'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({ category, search }) => {
    const { foodList } = useContext(StoreContext)
    const [displayedItems, setDisplayedItems] = useState(5) // Mặc định hiển thị 5 items
    const [isLoading, setIsLoading] = useState(false)
    
    const filteredFoodList = foodList?.filter((food) => category === 'All' || food?.category === category);
    const filteredFoodListBySearch = filteredFoodList?.filter((food) => food?.name?.toLowerCase().includes(search?.toLowerCase()));
    
    // Reset displayed items khi category hoặc search thay đổi
    useEffect(() => {
        setDisplayedItems(5)
    }, [category, search])
    
    // Lấy danh sách items hiển thị
    const displayedFoodList = filteredFoodListBySearch?.slice(0, displayedItems) || []
    const hasMoreItems = filteredFoodListBySearch?.length > displayedItems
    
    // Function để load thêm items
    const handleLoadMore = () => {
        setIsLoading(true)
        
        // Simulate loading delay
        setTimeout(() => {
            setDisplayedItems(prev => prev + 5)
        }, 200)
        setIsLoading(false)
    }
    
    return (
        <section 
            className="py-5"
            style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                minHeight: '60vh'
            }}
        >
            <div className="container">
                {/* Results Header */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="text-center text-white">
                            <h2 className="fw-bold mb-3" style={{
                                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                                animation: 'slideInUp 0.8s ease-out'
                            }}>
                                <i className="fas fa-utensils me-3"></i>
                                {category === 'All' ? 'All Food Items' : `${category} Menu`}
                            </h2>
                            <p className="lead" style={{
                                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                                animation: 'slideInUp 1s ease-out'
                            }}>
                                {filteredFoodListBySearch?.length > 0 
                                    ? `Showing ${displayedFoodList.length} of ${filteredFoodListBySearch.length} delicious items`
                                    : 'No items found matching your criteria'
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {/* Food Items Grid */}
                <div className="row g-4">
                    {displayedFoodList?.length > 0 ? (
                        displayedFoodList?.map((foodList, index) => {
                            return (
                                <div 
                                    key={index} 
                                    className="col-12 col-sm-6 col-md-4 col-lg-3"
                                    style={{
                                        animation: `slideInUp ${0.8 + (index * 0.1)}s ease-out`
                                    }}
                                >
                                    <FoodItem 
                                        file={foodList.file} 
                                        name={foodList.name} 
                                        description={foodList.description} 
                                        price={foodList.price} 
                                        id={foodList._id} 
                                    />
                                </div>
                            )
                        })
                    ) : (
                        <div className="col-12">
                            <div className="text-center py-5">
                                <div 
                                    className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                                    style={{
                                        width: '120px',
                                        height: '120px',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                                        animation: 'pulse 2s ease-in-out infinite'
                                    }}
                                >
                                    <i className="fas fa-search text-muted" style={{ fontSize: '3rem' }}></i>
                                </div>
                                <h3 className="text-white fw-bold mb-3" style={{
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                                }}>
                                    No Food Found
                                </h3>
                                <p className="text-white lead" style={{
                                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                                }}>
                                    Try adjusting your search or browse different categories
                                </p>
                                <div className="mt-4">
                                    <button 
                                        className="btn btn-light btn-lg px-4 py-2 rounded-pill"
                                        onClick={() => window.location.reload()}
                                        style={{
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.transform = 'translateY(-3px)';
                                            e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                                        }}
                                    >
                                        <i className="fas fa-refresh me-2"></i>
                                        Refresh Page
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Load More Button */}
                {hasMoreItems && (
                    <div className="row mt-5">
                        <div className="col-12 text-center">
                            <button 
                                className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill"
                                style={{
                                    transition: 'all 0.3s ease',
                                    borderWidth: '2px',
                                    minWidth: '200px'
                                }}
                                onClick={handleLoadMore}
                                disabled={isLoading}
                                onMouseOver={(e) => {
                                    if (!isLoading) {
                                        e.target.style.transform = 'translateY(-3px)';
                                        e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (!isLoading) {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.backgroundColor = 'transparent';
                                    }
                                }}
                            >
                                {isLoading ? (
                                    <>
                                        <span 
                                            className="spinner-border spinner-border-sm me-2" 
                                            role="status" 
                                            aria-hidden="true"
                                        ></span>
                                        <i className="fas fa-spinner fa-spin me-2"></i>
                                        Loading...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-plus me-2"></i>
                                        Load More Items
                                        <span className="badge bg-light text-dark ms-2">
                                            +5
                                        </span>
                                    </>
                                )}
                            </button>
                            
                            {/* Progress indicator */}
                            <div className="mt-3">
                                <small className="text-white-50">
                                    Showing {displayedFoodList.length} of {filteredFoodListBySearch?.length} items
                                </small>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 0.7; }
                    50% { transform: scale(1.05); opacity: 1; }
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .load-more-animation {
                    animation: fadeIn 0.5s ease-out;
                }
                
                .btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                
                .spinner-border-sm {
                    width: 1rem;
                    height: 1rem;
                }
            `}</style>
        </section>
    )
}

export default FoodDisplay