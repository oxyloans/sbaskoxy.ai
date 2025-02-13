import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { message,Alert, Modal } from 'antd';
import Footer from '../components/Footer';
import { ArrowLeft, CreditCard, Truck, Tag, ShoppingBag } from 'lucide-react';
import { FaBars, FaTimes } from 'react-icons/fa';
import decryptEas from './decryptEas';
import encryptEas from './encryptEas';

interface CartItem {
  itemId: string;
  itemName: string;
  itemPrice: string;
  cartQuantity: string;
}

interface Address {
  flatNo: string;
  landMark: string;
  address: string;
  pincode: string;
  addressType: 'Home' | 'Work' | 'Others';
}

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  whatsappNumber: string;
}

const CheckoutPage: React.FC = () => {
  const { state } = useLocation();
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [cartCount, setCartCount] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<'ONLINE' | 'COD'>('ONLINE');
  const [selectedAddress,setSelectedAddress] = useState<Address>(state?.selectedAddress || null)
  const [grandTotalAmount, setGrandTotalAmount] = useState<number>(0);
  const [profileData,setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    whatsappNumber: '',
  })
  const [merchantTransactionId,setMerchantTransactionId] = useState()
  const [paymentStatus,setPaymentStatus] = useState()
  const navigate = useNavigate();

  const BASE_URL = 'https://meta.oxyglobal.tech/api';
  const customerId = localStorage.getItem('userId');
  const token = localStorage.getItem('accessToken');
  const userData = localStorage.getItem('profileData')

  const queryParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(queryParams.entries());
  const orderId = params.trans;


  useEffect(() => {
    fetchCartData();
    totalCart()
    
    if(userData){
      setProfileData(JSON.parse(userData))
    }
    setCartCount(parseInt(localStorage.getItem('cartCount') || '0'));
  }, []);

  useEffect(()=>{
    const trans = localStorage.getItem('merchantTransactionId')
    const paymentId = localStorage.getItem('paymentId')
    if(trans===orderId){
      Requery(paymentId)
    }
  },[orderId])


  const fetchCartData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/cart-service/cart/customersCartItems?customerId=${customerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCartData(response.data?.customerCartResponseList || []);
      
    } catch (error) {
      console.error('Error fetching cart items:', error);
      message.error('Failed to fetch cart items');
    }
  };

  const totalCart = async() => {
    try {
      const response = await axios.post(
        `${BASE_URL}/cart-service/cart/cartItemData`,{
        customerId
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setGrandTotalAmount(parseFloat(response.data.totalSum));
      
    } catch (error) {
      console.error('Error fetching cart items:', error);
      message.error('Failed to fetch cart items');
    }

   
  };

  const calculateSubTotal = () => {
   const totalCartAmount = cartData.reduce(
    (acc, item) => acc + parseFloat(item.itemPrice) * parseInt(item.cartQuantity),
    0
  ).toFixed(2);
    
    return totalCartAmount
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      message.warning('Please enter a coupon code');
      return;
    }
    message.info('Coupon functionality to be implemented');
  };

  const handlePayment = async () => {
    try {
      if (grandTotalAmount === 0) {
        message.error("Please add items to cart");
        navigate("/main/dashboard/products");
        return;
      }
  
      setLoading(true); // Prevent multiple clicks
  
      console.log({ selectedPayment });
  
      const response = await axios.post(
        BASE_URL + "/order-service/orderPlacedPaymet",
        {
          address: selectedAddress.address,
          amount: grandTotalAmount,
          customerId: customerId,
          flatNo: selectedAddress.flatNo,
          landMark: selectedAddress.landMark,
          orderStatus: selectedPayment,
          pincode: selectedAddress.pincode,
          walletAmount: 0,
          couponCodeUsed: null,
          couponCodeValue: 0,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      console.log(response.data);
  
      if (response.status === 200 && response.data) {
        if (selectedPayment === "COD" && response.data.paymentId === null) {
          Modal.success({
            title: "Successfull",
            content: "Order placed successfully",
            okText: "Yes",
            cancelText: "No",
            onOk() {
              navigate("/main/myorders"); // Open link in new tab
            },
          });
        } else if (
          selectedPayment === "ONLINE" &&
          response.data.paymentId !== null
        ) {
          const data = {
            mid: "1152305",
            // amount: grandTotalAmount,
            amount: 1,
            merchantTransactionId: response.data.paymentId,
            transactionDate: new Date(),
            terminalId: "getepay.merchant128638@icici",
            udf1: profileData.whatsappNumber,
            udf2: `${profileData.firstName}  ${profileData.lastName}`,
            udf3: profileData.email,
            udf4: "",
            udf5: "",
            udf6: "",
            udf7: "",
            udf8: "",
            udf9: "",
            udf10: "",
            ru: "https://sandbox.askoxy.ai/checkout?trans=" + response.data.paymentId,
            callbackUrl: `https://sandbox.askoxy.ai/checkout?trans=${response.data.paymentId}`,
            currency: "INR",
            paymentMode: "ALL",
            bankId: "",
            txnType: "single",
            productType: "IPG",
            txnNote: "Rice Order In Live",
            vpa: "getepay.merchant128638@icici",
          };
          console.log({ data });
  
          // You might need to call a payment function here (e.g., initiatePayment(data))
          getepayPortal(data);
        }
      } else {
        message.error("Order failed");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      message.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getepayPortal = async (data:any) => {
    console.log("getepayPortal", data);
    const JsonData = JSON.stringify(data);

    var ciphertext = encryptEas(JsonData);
    var newCipher = ciphertext.toUpperCase();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      mid: data.mid,
      terminalId: data.terminalId,
      req: newCipher,
    });
    await fetch(
      "https://portal.getepay.in:8443/getepayPortal/pg/generateInvoice",
      {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      }
    )
      .then((response) => response.text())
      .then((result) => {
        var resultobj = JSON.parse(result);
        var responseurl = resultobj.response;
        console.log("===getepayPortal responseurl======",responseurl);
        var data = decryptEas(responseurl);
        console.log("===getepayPortal data======");
        console.log(data);
        data = JSON.parse(data);
        localStorage.setItem("paymentId", data.paymentId)
        localStorage.setItem("merchantTransactionId", data.merchantTransactionId)
        const paymentUrl = data.paymentUrl; // Assuming API returns a payment link

        Modal.confirm({
          title: "Proceed to Payment?",
          content: "Click OK to continue to the payment gateway.",
          okText: "Yes",
          cancelText: "No",
          onOk() {
            window.location.href = paymentUrl; // Open link in new tab
          },
        });
      })
      .catch((error) => console.log("getepayPortal", error.response));
    setLoading(false);
  };

  function Requery(paymentId:any) {
    setLoading(false);
    if (
      paymentStatus === "PENDING" ||
      paymentStatus === "" ||
      paymentStatus === null
    ) {
      // console.log("Before.....",paymentId)

      const Config = {
        "Getepay Mid": 1152305,
        "Getepay Terminal Id": "getepay.merchant128638@icici",
        "Getepay Key": "kNnyys8WnsuOXgBlB9/onBZQ0jiYNhh4Wmj2HsrV/wY=",
        "Getepay IV": "L8Q+DeKb+IL65ghKXP1spg==",
      };

      const JsonData = {
        mid: Config["Getepay Mid"],
        paymentId: parseInt(paymentId),
        referenceNo: "",
        status: "",
        terminalId: Config["Getepay Terminal Id"],
        vpa: "",
      };

      var ciphertext = encryptEas(
        JSON.stringify(JsonData),
        Config["Getepay Key"],
        Config["Getepay IV"]
      );

      var newCipher = ciphertext.toUpperCase();

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append(
        "Cookie",
        "AWSALBAPP-0=remove; AWSALBAPP-1=remove; AWSALBAPP-2=remove; AWSALBAPP-3=remove"
      );

      var raw = JSON.stringify({
        mid: Config["Getepay Mid"],
        terminalId: Config["Getepay Terminal Id"],
        req: newCipher,
      });

      fetch(
        "https://portal.getepay.in:8443/getepayPortal/pg/invoiceStatus",
        {
          method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
        }
      )
        .then((response) => response.text())
        .then((result) => {
          var resultobj = JSON.parse(result);
          if (resultobj.response != null) {
            console.log("Requery ID result", paymentId);
            var responseurl = resultobj.response;
            console.log({ responseurl });
            var data = decryptEas(responseurl);
            data = JSON.parse(data);
            console.log("Payment Result", data);
            setPaymentStatus(data.paymentStatus);
            console.log(data.paymentStatus);
            if (
              data.paymentStatus == "SUCCESS" ||
              data.paymentStatus == "FAILURE"
            ) {
              // clearInterval(intervalId); 294182409
              axios({
                method: "POST",
                url: BASE_URL + "/order-service/orderPlacedPaymet",
                data: {
                  paymentId: localStorage.getItem('merchantTransactionId'),
                  paymentStatus: data.paymentStatus,
                },
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              })
                .then((secondResponse) => {
                  console.log(
                    "Order Placed with Payment API:",
                    secondResponse.data
                  );
                  localStorage.removeItem('paymentId')
                  localStorage.removeItem('merchantTransactionId')
                  // setLoading(false);
                })
                .catch((error) => {
                  console.error("Error in payment confirmation:", error);
                });
            } else {
            }
          }
        })
        .catch((error) => console.log("Payment Status", error));
    }
    // else{
    //   clearInterval(intervalId)
    // }
  }
  


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">



      <div className="flex-1 p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
         

          <main className="flex-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center mb-6">
                <button
                  onClick={() => navigate(-1)}
                  className="text-gray-600 hover:text-gray-800 mr-3"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center">
                  <ShoppingBag className="w-6 h-6 text-green-500 mr-2" />
                  <h2 className="text-xl font-bold text-purple-600">Checkout Details</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center">
                        <Tag className="w-5 h-5 text-orange-500 mr-2" />
                        <h2 className="text-lg font-semibold">Apply Coupon</h2>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter coupon code"
                          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          className="bg-orange-500 text-white px-4 py-2 text-sm font-medium rounded-lg hover:bg-orange-600 transition"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                      Note: Wallet usage not applicable for this order
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                      <h2 className="text-lg font-semibold">Payment Method</h2>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm transition ${selectedPayment === 'ONLINE'
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 hover:border-green-500'
                            }`}
                          onClick={() => setSelectedPayment('ONLINE')}
                        >
                          <CreditCard className="w-4 h-4" />
                          <span className="font-medium">Online Payment</span>
                        </button>
                        <button
                          className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm transition ${selectedPayment === 'COD'
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 hover:border-green-500'
                            }`}
                          onClick={() => setSelectedPayment('COD')}
                        >
                          <Truck className="w-4 h-4" />
                          <span className="font-medium">Cash on Delivery</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-4">
                    <div className="p-4 border-b border-gray-100">
                      <h2 className="text-lg font-semibold">Order Summary</h2>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Items Total</span>
                        <span className="font-medium">₹{calculateSubTotal()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Delivery Fee</span>
                        <span className="font-medium text-green-600">FREE</span>
                      </div>
                      <div className="border-t border-gray-100 pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Grand Total</span>
                          <span className="text-lg font-bold text-green-600">₹{calculateSubTotal()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50">
                      <button
                        onClick={()=>handlePayment()}
                        disabled={loading}
                        className="w-full bg-green-500 text-white py-3 rounded-lg text-sm font-medium shadow-sm hover:bg-green-600 transition transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          'Processing...'
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <span>Proceed to Pay</span>
                            <span className="font-bold">₹{calculateSubTotal()}</span>
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;