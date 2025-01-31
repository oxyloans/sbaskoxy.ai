import React, { useEffect, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header3';
import Footer from '../components/Footer';
import Sidebar from './Sidebarrice';
import { message } from 'antd';

interface Address {
  id?: string;
  flatNo: string;
  landmark: string;
  address: string;
  pincode: string;
  addressType: 'Home' | 'Work' | 'Others';
}

interface CartItem {
  itemId: string;
  itemName: string;
  itemPrice: string;
  itemMrp: string;
  itemImage: string;
  itemDescription: string;
  units: string;
  quantity: string;
  cartQuantity: string;
  cartId: string;
}

interface AddressFormData {
  flatNo: string;
  landmark: string;
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
    landmark: '',
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
      const response = await axios.get(`${BASE_URL}/user-service/getAddresses?userId=${customerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(response.data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
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

  const handleAddAddress = async () => {
    if (!formData.flatNo || !formData.address || !formData.pincode) {
      message.error('Please fill all required fields.');
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/user-service/addAddress`,
        { userId: customerId, ...formData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAddresses([...addresses, { ...formData, id: response.data.id }]);
      setShowAddressForm(false);
      setFormData({
        flatNo: '',
        landmark: '',
        address: '',
        pincode: '',
        addressType: 'Home',
      });
      message.success('Address added successfully');
    } catch (error) {
      console.error('Error saving address:', error);
      message.error('Failed to add address');
    }
  };

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

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">
      <Header cartCount={cartCount} />

      <div className="block lg:hidden p-3">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-800 text-2xl">
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <div className="p-3 flex flex-col lg:flex-row">
  <div className={`lg:flex ${isSidebarOpen ? 'block' : 'hidden'} lg:block`}>
    <Sidebar />
  </div>

  <main className="flex-1 bg-white shadow-lg rounded-lg p-4 md:p-6 ml-0 md:ml-6">
    {(!cartData || cartData.length === 0) ? (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-xl font-bold mb-4">Your cart is empty</h2>
        <button
          onClick={() => navigate('/buyRice')}
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
              onClick={() => setSelectedItemDetails(item)}
            >
              <img
                src={item.itemImage}
                alt={item.itemName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-center md:text-left">{item.itemName}</h3>
              <p className="text-sm text-center md:text-left">
                Weight: {item.quantity} {item.units}
              </p>
              <p className="text-sm line-through text-red-500 text-center md:text-left">
                MRP: ₹{item.itemMrp}
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
  </main>

  <div className="bg-white shadow-lg rounded-lg p-4 md:p-6 ml-0 md:ml-6 mt-4 lg:mt-0">
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
            {address.flatNo}, {address.landmark}, {address.pincode}
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
      <div className="bg-gray-100 p-4 rounded-lg mt-4">
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
          name="landmark"
          value={formData.landmark}
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
        <div className="flex justify-between">
          <button
            onClick={handleAddAddress}
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
          >
            Save Address
          </button>
          <button
            onClick={() => setShowAddressForm(false)}
            className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition"
          >
            Cancel
          </button>
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
        onClick={() => navigate("/checkout")}
      >
        Proceed to Checkout
      </button>
    </div>
  </div>
</div>


      {/* Item Details Modal */}
      {selectedItemDetails && (
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
      )}

      <Footer />
    </div>
  );
};

export default CartPage;
