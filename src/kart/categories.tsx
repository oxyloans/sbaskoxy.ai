import React,{useState,useEffect} from "react";
import axios from "axios";
import { log } from "node:console";
const BASE_URL = "https://meta.oxyglobal.tech/api";

interface Item {
  itemId: string;
  itemName: string;
  itemImage: string;
}

interface Category {
  categoryName: string;
  categoryLogo: string;
  itemsResponseDtoList: Item[];
}

interface CategoriesProps {
  categories: Category[];
  activeCategory: string | null;
  onCategoryClick: (categoryName: string) => void;
  loading: boolean;
  cart: { [key: string]: number };
  onItemClick: (item: Item) => void;
  updateCart: (cart: { [key: string]: number }) => void;
  customerId: string; // Added customerId as a prop
}
interface CartItem {
  itemId: string;
  cartQuantity: number;
  cartId: string;
}
const Categories: React.FC<CategoriesProps> = ({
  categories,
  activeCategory,
  onCategoryClick,
  loading,
  cart,
  onItemClick,
  updateCart,
  customerId, // Retrieve customerId from props
}) => {
 const [cartItems, setCartItems] = useState<Record<string, number>>({});
   const [cartData, setCartData] = useState<CartItem[]>([]);

   useEffect(() => {
    console.log("useEffect triggered");
    fetchCartData();
  }, []);
  

  const handleAddToCart = async (item: Item) => {
    const data = { customerId, itemId: item.itemId, quantity: 1 }; // Correctly use item
    try {
      await axios.post(
        `${BASE_URL}/cart-service/cart/add_Items_ToCart`,
        data
      );
      updateCart({ ...cart, [item.itemName]: (cart[item.itemName] || 0) + 1 });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };
  // call for cartItems for a particular customer
  const fetchCartData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/cart-service/cart/customersCartItems?customerId=${customerId}`,
        
      );
      const cartItemsMap = response.data.reduce(
        (acc: Record<string, number>, item: CartItem) => {
          acc[item.itemId] = item.cartQuantity;
          return acc;
        },
        {}
      );
      console.log(response.data.customerCartResponseList);
      
      setCartData(response.data.customerCartResponseList);
      setCartItems(cartItemsMap);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const removeCartItem = async (item: Item) => {
    const targetCartId = cartData.find((cart) => cart.itemId === item.itemId)?.cartId;
    if (!targetCartId) return;

    try {
      await axios.delete(`${BASE_URL}/cart-service/cart/remove`, {
        data: { id: targetCartId },
        
      });
      // Update the cart state after removal
      // console.log("data",data);
      
      setCartItems((prevCartItems) => {
        const newCartItems = { ...prevCartItems };
        delete newCartItems[item.itemId];
        return newCartItems;
      });
      fetchCartData();
    } catch (error) {
      console.error("Failed to remove cart item:", error);
    }
  };

  const handleIncreaseQuantity = async (item: Item) => {
    try {
      await axios.patch(
        `${BASE_URL}/cart-service/cart/incrementCartData`,
        { customerId, itemId: item.itemId }
      );
      updateCart({ ...cart, [item.itemName]: cart[item.itemName] + 1 });
    } catch (error) {
      console.error("Error increasing quantity:", error);
    }
  };

  const handleDecreaseQuantity = async (item: Item) => {
    try {
      if (cart[item.itemName] > 1) {
        await axios.patch(
          `${BASE_URL}/cart-service/cart/decrementCartData`,
          { customerId, itemId: item.itemId }
        );
        updateCart({ ...cart, [item.itemName]: cart[item.itemName] - 1 });
      } else {
    const targetCartId = cartData.find((cart) => cart.itemId === item.itemId)?.cartId;
     console.log(cartData,"cartData");
     
        await axios.delete(
          `${BASE_URL}/cart-service/cart/remove`,
          {
            data: { id: targetCartId },
          }
        );
        const updatedCart = { ...cart };
        delete updatedCart[item.itemName];
        updateCart(updatedCart);
      }
    } catch (error) {
      console.error("Error decreasing quantity or removing item:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`cursor-pointer bg-purple-50 border rounded-lg p-4 text-center shadow hover:shadow-md transition ${
                activeCategory === category.categoryName
                  ? "border-blue-800 bg-blue-60"
                  : "border-gray-300"
              }`}
              onClick={() => onCategoryClick(category.categoryName)}
            >
              <div className="w-25 h-25 bg-gray-100 rounded mb-2 flex items-center justify-center">
                <img
                  src={category.categoryLogo}
                  alt={category.categoryName}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <p className="font-medium text-gray-700 text-sm sm:text-base">
                {category.categoryName}
              </p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader border-t-4 border-purple-600 w-16 h-16 rounded-full animate-spin"></div>
          </div>
        ) : activeCategory ? (
          <>
            <h2 className="text-center text-lg sm:text-2xl font-semibold text-gray-800 mb-6 mt-5">
              {activeCategory} Items
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {categories
                .find((category) => category.categoryName === activeCategory)
                ?.itemsResponseDtoList.map((item, index) => (
                  <div
                    key={index}
                    className="bg-purple-50 border rounded-lg p-4 text-center shadow hover:shadow-md transition hover:scale-105"
                  >
                    <div
                      className="w-25 h-25 bg-gray-100 rounded mb-2 flex items-center justify-center"
                      onClick={() => onItemClick(item)}
                    >
                      <img
                        src={item.itemImage}
                        alt={item.itemName}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <p className="font-medium text-gray-700 mb-2 text-sm sm:text-base">
                      {item.itemName}
                    </p>
                    <div className="flex items-center justify-between sm:justify-center space-x-2">
                      {cart[item.itemName] ? (
                        <>
                          <button
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                            onClick={() => handleDecreaseQuantity(item)}
                          >
                            -
                          </button>
                          <span className="text-gray-800 font-bold text-sm sm:text-base">
                            {cart[item.itemName]}
                          </span>
                          <button
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                            onClick={() => handleIncreaseQuantity(item)}
                          >
                            +
                          </button>
                        </>
                      ) : (
                        <button
                          className="flex-1 px-2 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm sm:text-base text-center"
                          onClick={() => handleAddToCart(item)}
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 text-sm sm:text-base">
            Please select a category.
          </p>
        )}
      </div>
    </div>
  );
};

export default Categories;
