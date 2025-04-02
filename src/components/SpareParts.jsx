import React, { useEffect, useState } from 'react'
import { IoIosArrowDropdown } from "react-icons/io";
import { Link } from 'react-router-dom';
import { IoMdSearch } from "react-icons/io";
import { FaStar } from 'react-icons/fa'

const SpareParts = () => {
    const [showFilter,setShowFilter]=useState(false);
    const [products,setProducts]=useState([]);
    const [filteredProducts,setFilteredProducts]=useState([]);
    const [search,setSearch]=useState('');
    const [brands,setBrands]=useState([]);
    const [categories,setCategories]=useState([]);
    const [selectedBrands,setSelectedBrands]=useState([]);
    const [selectedCategories,setSelectedCategories]=useState([]);
    const [selectedRating,setSelectedRating]=useState([]);
    const [visibleCountBrands, setVisibleCountBrands] = useState(5);
    const [visibleCountCategories, setVisibleCountCategories] = useState(5);
    const [max,setMax]=useState();
    const [min,setMin]=useState();
    const getProducts=async()=>{
        const url = `http://localhost:5059/api/SpareParts/Get8`;
        try {
        const response = await fetch(url);
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
        const brandNames=[...new Set(data.map((item) => item.brand))];
        setBrands(brandNames);
        const categories=[...new Set(data.map((category) => category.category))];
        setCategories(categories);
        } catch (error) {
        console.error('Error fetching data:', error);
        }
    }
    const showMore = (val) => {
        if(val==='brand'){
            setVisibleCountBrands((prev) => Math.min(prev + 5, brands.length));
        }
        else if(val==='category'){
            setVisibleCountCategories((prev) => Math.min(prev + 5, categories.length));
        }
      };
    const handleCheckboxChange = (value,name) => {
        if(name==='brand'){
            setSelectedBrands((prev) =>
                prev.includes(value)
                ? prev.filter((brand) => brand !== value)
                : [...prev, value]
            );}
        else if(name==='category'){
            setSelectedCategories((prev) =>
                prev.includes(value)
                ? prev.filter((category) => category !== value)
                : [...prev, value]
            );
        }
        else if(name==='rating'){
            setSelectedRating((prev) =>
                prev.includes(value)
                ? prev.filter((rating) => rating !== value)
                : [...prev, value]
            );
        }
    };
    const handleChange=(e)=>{
        const term=e.target.value.toLowerCase();
        setSearch(term);
      }
    const handleSearch=()=>{
        const filtered=products.filter(product=>product.title.toLowerCase().includes(search));
        setFilteredProducts(filtered);
    }
    const handleFilter=async()=>{
        const requestBody = {
            selectedBrands: selectedBrands,
            selectedCategories: selectedCategories,          
            min: min || 0,
            max:max || Math.max(...products.map((p) => p.price)),
            selectedRating: selectedRating              
        };
        try {
            const response = await fetch("http://localhost:5059/api/SpareParts/Search", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json", 
                },
                body: JSON.stringify(requestBody),
            });
            if (response.ok) {
                const data = await response.json();
                setFilteredProducts(data); 
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    useEffect(()=>{
        getProducts();
    },[])
  return (
    <div className='mt-36 mb-60'>
        <div className='flex justify-center mb-2'>
            <div className="relative w-[500px]">
                <input 
                    className="w-full h-14 pl-6 pr-12 bg-white border border-gray-300 rounded-full shadow-md text-lg text-gray-700 placeholder-gray-500 outline-none hover:shadow-lg transition-shadow"
                    value={search}
                    onChange={handleChange}
                    placeholder="Search Spare Parts..."
                />
                <IoMdSearch onClick={handleSearch} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-2xl cursor-pointer" />
            </div>
        </div>
        <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 pl-4'>
            <div className='min-w-60'>
                <p className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTERS
                    <IoIosArrowDropdown onClick={()=>setShowFilter(!showFilter)} className={`w-5 h-5 text-gray-600 sm:hidden ${showFilter?'':'-rotate-90'}`}/>
                </p>
                <div className={`border border-gray-300 rounded-lg pl-5 py-3 mt-6 ${showFilter?'':'hidden'} sm:block`}>
                    <p className='mb-3 font-medium'>BRANDS</p>
                    <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                        {brands.slice(0, visibleCountBrands).map((brand, index) => (
                        <div key={index} className="flex items-center gap-1">
                            <input
                            type="checkbox"
                            id={brand}
                            className="w-5"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => handleCheckboxChange(brand,'brand')}
                            />
                            <label htmlFor={brand} className="font-medium text-base">
                            {brand}
                            </label>
                        </div>
                        ))}
                        {visibleCountBrands < brands.length && (
                            <button type="button"
                            className="text-blue-700 text-left"
                            onClick={()=>showMore('brand')}
                            >
                            Show More
                            </button>
                        )}
                    </div>
                </div>
                <div className={`border border-gray-300 rounded-lg pl-5 py-3 my-5 ${showFilter?'':'hidden'} sm:block`}>
                    <p className='mb-3 font-medium'>CATEGORIES</p>
                    <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                        {categories.slice(0, visibleCountCategories).map((category, index) => (
                        <div key={index} className="flex items-center gap-1">
                            <input
                            type="checkbox"
                            id={category}
                            className="w-5"
                            checked={selectedCategories.includes(category)}
                            onChange={() => handleCheckboxChange(category,'category')}
                            />
                            <label htmlFor={category} className="font-medium text-base">
                            {category}
                            </label>
                        </div>
                        ))}
                        {visibleCountCategories < categories.length && (
                            <button type="button"
                            className="text-blue-700 text-left"
                            onClick={()=>showMore('category')}
                            >
                            Show More
                            </button>
                        )}
                    </div>
                </div>
                <div className={`border border-gray-300 p-4 rounded-lg my-5 space-y-3 ${showFilter ? '' : 'hidden'} sm:block`}>
                    <p className="mb-3 font-medium">PRICE RANGE</p>
                    <div className="flex items-center space-x-3">
                        <input 
                            type="number" placeholder="Min" 
                            className="border border-gray-400 w-24 px-3 py-2 text-gray-700 rounded-md outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                            value={min} onChange={(e)=>setMin(e.target.value)}
                        />
                        <span className="text-gray-600">-</span>
                        <input 
                            type="number" placeholder="Max" 
                            className="border border-gray-400 w-24 px-3 py-2 text-gray-700 rounded-md outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                            value={max} onChange={(e)=>setMax(e.target.value)}
                        />
                    </div>
                </div>
                <div className={`border border-gray-300 p-4 rounded-lg my-5 space-y-3 ${showFilter ? '' : 'hidden'} sm:block`}>
                    <p className="mb-3 font-medium">RATING</p>
                    <div className="flex flex-col gap-1">
                        {[4,3].map((rating)=>(
                        <div className="flex items-center gap-x-2">
                            <input type="checkbox" checked={selectedRating.includes(rating)} onChange={()=>handleCheckboxChange(rating,'rating')}/>
                            <label className='flex items-center gap-x-1'>{rating}<FaStar className='text-yellow-500'/> & above</label>
                        </div>))}
                    </div>
                </div>
                <button className='w-full bg-green-700 text-medium text-white mt-4 p-3 rounded-lg uppercase hover:opacity-95' onClick={handleFilter}>
                    Search
                </button>
            </div>
            <div className='flex-1'>
                <div className='flex justify-between text-base sm:text-2xl mb-4'>
                    <div className='inline-flex gap-2 items-center mb-3'>
                        <p className='text-gray-700 text-3xl'>SPARE<span className='text-gray-700 font-medium'> PARTS</span></p>
                        <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700'></p>
                    </div>
                </div>
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6 p-6">
                        {filteredProducts.map((product) => (
                            <Link key={product.sparepart_id} className='text-gray-700 cursor-pointer' to={`/sparepartdetails/${product.sparepart_id}`}>
                                <div className='w-full aspect-[4/3] overflow-hidden rounded-lg'>
                                    <img className='w-full h-full object-cover hover:scale-105 transition ease-in-out duration-300' src={product.image_url} alt={product.title}/>
                                </div>
                                <p className='pt-2 text-[16px] text-gray-700'>{product.brand}</p>                         
                                <p className='pb-1 text-[17px]'>{product.title}</p>
                                <div className='flex items-center mb-2'>
                                    <p className="inline-flex w-fit items-center font-medium mr-2 bg-yellow-500 px-4 rounded-lg text-white">
                                        {product.rating ? product.rating.toFixed(1) : 0} <FaStar className='ml-1'/>
                                    </p>
                                    <p className="text-gray-600">({product.num_rating ? product.num_rating : 0})</p>
                                </div>
                                <p className='text-[16px] font-medium'>₹{product.price}</p>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center mt-40">
                        <p className="text-gray-500 font-semibold text-lg">No Spare Parts Available!</p>
                        <p className="text-gray-400 text-md mt-1">Try adjusting filters or check back later.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default SpareParts