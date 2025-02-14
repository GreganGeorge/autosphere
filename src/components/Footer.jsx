import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="text-white bg-black py-15">
            <div className="container mx-auto px-20 lg:px-20 py-20 flex flex-col gap-10 md:flex-row justify-between border-t border-slate-800">
                <div className="flex">
                    <p className="font-bold text-xl text-center">
                        <h1 className="text-2xl font-bold ">Auto<span className='text-green-400'>Sphere</span></h1>
                    </p>
                </div>

                <div>
                    <p className="mb-3">QUICK LINKS</p>

                    <div className="flex flex-col text-start mb-1 md:mb-0">
                        <a
                            href='/'
                            className='block md:inline-block py-1 hover:text-gray-500'
                        >
                            Home
                        </a>
                        <a
                            href='/'
                            className='block md:inline-block py-1 hover:text-gray-500'
                        >
                            Alert
                        </a>
                        <a
                            href='/'
                            className='block md:inline-block py-1 hover:text-gray-500'
                        >
                            Spare Parts
                        </a>
                        <a
                            href='/'
                            className='block md:inline-block py-1 hover:text-gray-500'
                        >
                            Car Wash
                        </a>
                        <a
                            href='/'
                            className='block md:inline-block py-1 hover:text-gray-500'
                        >
                            Price Prediction
                        </a>
                        <a
                            href='/'
                            className='block md:inline-block py-1 hover:text-gray-500'
                        >
                            Car Rental
                        </a>
                    </div>
                </div>

                <div>
                    <p className="mb-3">LEGAL</p>
                    <div className='flex flex-col text-start mb-1 md:mb-0 text-[14px]'>
                        <a
                            href='#'
                            className='block md:inline-block py-1 hover:text-gray-500'
                        >
                            Terms and Conditions
                        </a>
                        <a
                            href='#'
                            className='block md:inline-block py-1 hover:text-gray-500'
                        >
                            License Agreement
                        </a>
                        <a
                            href='#'
                            className='block md:inline-block py-1 hover:text-gray-500'
                        >
                            Privacy Policy
                        </a>
                        <a
                            href='#'
                            className='block md:inline-block py-1 hover:text-gray-500'
                        >
                            Copyright Information
                        </a>
                        <a
                            href='#'
                            className='block md:inline-block py-1 hover:text-gray-500'
                        >
                            Cookies Policy
                        </a>
                    </div>
                </div>

                <div className="flex flex-col">
                    <p>SOCIAL MEDIA</p>
                    <div className="flex mt-4 gap-3">
                        <a
                            href='#'
                            className='bg-blue-600 p-1.5 rounded-sm text-white hover:text-gray-500 hover:scale-110'
                        >
                            <FaFacebook size={18} />
                        </a>

                        <a
                            href='#'
                            className='bg-pink-600 p-1.5 rounded-sm text-white hover:text-gray-500 hover:scale-110'
                        >
                            <FaInstagram size={18} />
                        </a>
                        <a
                            href='#'
                            className='bg-blue-600 p-1.5 rounded-sm text-white hover:text-gray-500 hover:scale-110'
                        >
                            <FaTwitter size={18} />
                        </a>
                        <a
                            href='#'
                            className='bg-red-600 p-1.5 rounded-sm text-white hover:scale-110'
                        >
                            <FaYoutube size={18} />
                        </a>
                    </div>

                    
                </div>
            </div>

            
        </footer>
    )
}

export default Footer