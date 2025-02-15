import React, { useEffect, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';
import { message } from 'antd';
import { isWithinRadius } from "./LocationCheck";

interface Address {
  id?: string;
  flatNo: string;
  landMark: string;
  address: string;
  pincode: string;
  addressType: 'Home' | 'Work' | 'Others';
}

interface CartItem {
  itemId: string;
  itemName: string;
  itemPrice: string;
  priceMrp: number | string;
  image: string;
  itemDescription: string;
  units: string;
  weight: string;
  cartQuantity: string;
  cartId: string;
}

interface AddressFormData {
  flatNo: string;
  landMark: string;
  address: string;
  pincode: string;
  addressType: 'Home' | 'Work' | 'Others';
}

const CartPage: React.FC = () => {
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [cartItems, setCartItems] = useState<{ [key: string]: number }>({});
  const [cartCount, setCartCount] = useState<number>(0);
  const [loadingItems, setLoadingItems] = useState<{ [key: string]: boolean }>({});
  const [selectedItemDetails, setSelectedItemDetails] = useState<CartItem | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [formData, setFormData] = useState<AddressFormData>({
    flatNo: '',
    landMark: '',
    address: '',
    pincode: '',
    addressType: 'Home',
  });

  const navigate = useNavigate();
  const BASE_URL = 'https://meta.oxyglobal.tech/api';
  const customerId = localStorage.getItem('userId');
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    fetchCartData();
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      // setIsLoading(true);
      const response = await axios.get(`${BASE_URL}/user-service/getAllAdd?customerId=${customerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(response.data);
      // setError('');
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      // setIsLoading(false);
    }
  };
  const handleImageClick = (item: CartItem) => {
    navigate(`/main/itemsdisplay/${item.itemId}`, { state: { item } });
  };

  const fetchCartData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/cart-service/cart/customersCartItems?customerId=${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.customerCartResponseList) {
        const cartItemsMap = response.data.customerCartResponseList.reduce(
          (acc: { [key: string]: number }, item: CartItem) => {
            acc[item.itemId] = parseInt(item.cartQuantity);
            return acc;
          },
          {}
        );
        setCartItems(cartItemsMap);
        setCartCount(response.data.customerCartResponseList.length);
        localStorage.setItem('cartCount', response.data.customerCartResponseList.length.toString());
      } else {
        setCartItems({});
        localStorage.setItem('cartCount', '0');
        setCartCount(0);
      }
      setCartData(response.data?.customerCartResponseList || []);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getCoordinates = async (address: string) => {
    try {
      const API_KEY = "AIzaSyAM29otTWBIAefQe6mb7f617BbnXTHtN0M";
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;
      const response = await axios.get(url);
      return response.data.results[0]?.geometry.location;
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };



  const handleAddAddress = async () => {
    try {
      // setIsLoading(true);
      const fullAddress = formData.flatNo + ',' + formData.landMark + ', ' + formData.address + ', ' + formData.pincode;
      const coordinates = await getCoordinates(fullAddress);

      if (!coordinates) {
        // setError('Unable to find location coordinates. Please check the address.');
        return;
      }
      const WithinRadius = await isWithinRadius(coordinates);
      console.log(WithinRadius);
      if (!WithinRadius) {
        // setError('Sorry, we do not deliver to this location');
        return;
      }

      const { lat, lng } = coordinates;
      const data = {
        userId: customerId,
        flatNo: formData.flatNo,
        landMark: formData.landMark,
        address: formData.address,
        pincode: formData.pincode,
        addressType: formData.addressType,
        latitude: lat.toString(),
        longitude: lng.toString(),
      };

      const response = await axios.post(`${BASE_URL}/user-service/addAddress`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        await fetchAddresses(); // Refresh the addresses list
        setShowAddressForm(false)
      }
    } catch (error) {
      // setError('Failed to add address. Please try again.');
      console.error("Error adding address:", error);
    } finally {
    }
  }

  const handleIncrease = async (item: CartItem) => {
    setLoadingItems((prev) => ({ ...prev, [item.itemId]: true }));
    try {
      const currentQuantity = cartItems[item.itemId] || 0;
      const newQuantity = currentQuantity + 1;

      await axios.patch(
        `${BASE_URL}/cart-service/cart/incrementCartData`,
        {
          cartQuantity: newQuantity,
          customerId,
          itemId: item.itemId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      await fetchCartData();
    } catch (error) {
      console.error('Failed to increase cart item:', error);
      message.error('Failed to update quantity');
    } finally {
      setLoadingItems((prev) => ({ ...prev, [item.itemId]: false }));
    }
  };

  const handleDecrease = async (item: CartItem) => {
    setLoadingItems((prev) => ({ ...prev, [item.itemId]: true }));
    try {
      const currentQuantity = cartItems[item.itemId];
      if (currentQuantity > 1) {
        const newQuantity = currentQuantity - 1;

        await axios.patch(
          `${BASE_URL}/cart-service/cart/decrementCartData`,
          {
            cartQuantity: newQuantity,
            customerId,
            itemId: item.itemId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        await fetchCartData();
      } else {
        await removeCartItem(item);
      }
    } catch (error) {
      console.error('Failed to decrease cart item:', error);
      message.error('Failed to update quantity');
    } finally {
      setLoadingItems((prev) => ({ ...prev, [item.itemId]: false }));
    }
  };

  const removeCartItem = async (item: CartItem) => {
    try {
      await axios.delete(`${BASE_URL}/cart-service/cart/remove`, {
        data: {
          id: item.cartId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      await fetchCartData();
      message.success('Item removed from cart successfully.');
    } catch (error) {
      console.error('Failed to remove cart item:', error);
      message.error('Failed to remove item');
    }
  };

  const handleToProcess = () => {
    if (!selectedAddress) {
      message.error("Please select an address");
      return;
    }
    console.log(selectedAddress);
    navigate("/main/checkout", { state: { selectedAddress } })
  }

  return (
    <div className="flex flex-col min-h-screen">


      <div className="flex-1 p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <main className="flex-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {(!cartData || cartData.length === 0) ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <h2 className="text-xl font-bold mb-4">Your cart is empty</h2>
                  <button
                    onClick={() => navigate('/main/dashboard/products')}
                    className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
                  >
                    Browse items
                  </button>
                </div>
              ) : (
                cartData.map((item) => (
                  <div
                    key={item.itemId}
                    className="border rounded-lg p-4 mb-4 flex flex-col md:flex-row items-center md:justify-between space-y-4 md:space-y-0"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-20 h-20 bg-gray-200 cursor-pointer"
                        onClick={() => handleImageClick(item)}
                      >
                        <img
                          src={item.image}
                          alt={item.itemName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-center md:text-left">{item.itemName}</h3>
                        <p className="text-sm text-center md:text-left">
                          Weight: {item.weight} {item.units}
                        </p>
                        <p className="text-sm line-through text-red-500 text-center md:text-left">
                          MRP: ₹{item.priceMrp}
                        </p>
                        <p className="text-green-600 font-bold text-center md:text-left">₹{item.itemPrice}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between space-x-4">
                      <div className="flex items-center border rounded-md">
                        <button
                          className="px-3 py-1"
                          onClick={() => handleDecrease(item)}
                          disabled={loadingItems[item.itemId]}
                        >
                          -
                        </button>
                        <span className="px-3 py-1">{cartItems[item.itemId]}</span>
                        <button
                          className="px-3 py-1"
                          onClick={() => handleIncrease(item)}
                          disabled={loadingItems[item.itemId]}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-md"
                        onClick={() => removeCartItem(item)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </main>

          <div className="w-full lg:w-1/4 bg-white shadow-lg rounded-lg p-4 md:p-6 mb-4 lg:mb-0 lg:ml-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Cart Summary</h2>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Select Address</label>
              <select
                value={selectedAddress?.address || ""}
                onChange={(e) => {
                  const selected = addresses.find((addr) => addr.address === e.target.value);
                  setSelectedAddress(selected || null);
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose an Address</option>
                {addresses.map((address, index) => (
                  <option key={index} value={address.address}>
                    {address.flatNo}, {address.address}, {address.landMark},{address.pincode}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowAddressForm(true)}
                className="mt-3 w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
              >
                + Add New Address
              </button>
            </div>

            {showAddressForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white p-6 rounded-lg w-full max-w-md">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Add New Address</h3>
                  <input
                    type="text"
                    placeholder="Flat No"
                    name="flatNo"
                    value={formData.flatNo}
                    onChange={handleInputChange}
                    className="w-full p-2 mb-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Landmark"
                    name="landMark"
                    value={formData.landMark}
                    onChange={handleInputChange}
                    className="w-full p-2 mb-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-2 mb-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full p-2 mb-2 border border-gray-300 rounded-md"
                  />
                  <div className="flex flex-col sm:flex-row gap-2 justify-end">
                    <button
                      onClick={handleAddAddress}
                      className="w-full sm:w-auto bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
                    >
                      Save Address
                    </button>
                    <button
                      onClick={() => setShowAddressForm(false)}
                      className="w-full sm:w-auto bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex justify-between mb-2 text-gray-700">
                <span>Subtotal</span>
                <span className="font-semibold">
                  ₹{cartData?.reduce((acc, item) => acc + parseFloat(item.itemPrice) * parseInt(item.cartQuantity), 0).toFixed(2) || "0.00"}
                </span>
              </div>
              <div className="flex justify-between mb-2 text-gray-700">
                <span>Shipping</span>
                <span className="font-semibold">₹0.00</span>
              </div>
              <div className="flex justify-between mb-4 text-gray-800 font-bold text-lg">
                <span>Total</span>
                <span>
                  ₹{cartData?.reduce((acc, item) => acc + parseFloat(item.itemPrice) * parseInt(item.cartQuantity), 0).toFixed(2) || "0.00"}
                </span>
              </div>
              <button
                className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition"
                onClick={() => handleToProcess()}
                disabled={!cartData || cartData.length === 0}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
        </div>


        {/* Item Details Modal */}
        {/* {selectedItemDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-bold">{selectedItemDetails.itemName}</h2>
              <p className="mt-4">{selectedItemDetails.itemDescription}</p>
              <button
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md"
                onClick={() => setSelectedItemDetails(null)} // Close the details view
              >
                Close
              </button>
            </div>
          </div>
        )} */}

        <Footer />
      </div>
      );
};

export default CartPage;
