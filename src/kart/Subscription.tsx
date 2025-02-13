import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import { Menu, X, Check, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { message, Modal } from 'antd';
import decryptEas from './decryptEas';
import encryptEas from './encryptEas'; 

// Types
type SubscriptionPlan = {
  amount: number;
  getAmount: number;
  limitAmount: number;
  planId: string;
  status: boolean;
};

interface userSubscriptionPlan {
  subscriptionId: string;
  status: boolean;
  message:string
}


interface AlertProps {
  variant?: 'default' | 'destructive';
  children: React.ReactNode;
  className?: string;
}

interface AlertDescriptionProps {
  children: React.ReactNode;
}

interface ProfileData {
  userFirstName: '',
  userLastName: '',
  customerEmail: '',
}


// Components
const Alert: React.FC<AlertProps> = ({
  variant = 'default',
  children,
  className = ''
}) => {
  const baseStyles = "rounded-lg p-4 flex items-start gap-3 shadow-sm";
  const variantStyles = variant === 'destructive'
    ? 'bg-red-50 text-red-700 border border-red-200'
    : 'bg-blue-50 text-blue-700 border border-blue-200';

  return (
    <div className={`${baseStyles} ${variantStyles} ${className}`}>
      {children}
    </div>
  );
};

const AlertDescription: React.FC<AlertDescriptionProps> = ({ children }) => (
  <div className="text-sm font-medium">{children}</div>
);

const SubscriptionCard: React.FC<{
  plan: SubscriptionPlan;
  isSelected: boolean;
  planDetails: userSubscriptionPlan
  onSubscribe: (planId: string) => void;
}> = ({ plan, isSelected, onSubscribe , planDetails }) => (
  <div
    id={plan.planId}
    className={`relative rounded-xl border ${
      isSelected 
        ? 'border-purple-600 ring-2 ring-purple-600 ring-opacity-50' 
        : plan.status 
          ? 'border-purple-400 shadow-purple-100' 
          : 'border-gray-200'
    } bg-white shadow-lg transition-all duration-300 hover:shadow-xl flex flex-col h-full transform hover:-translate-y-1`}
  >
    {plan.status && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <span className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-1 rounded-full text-sm font-medium shadow-md">
          Most Popular
        </span>
      </div>
    )}

    <div className="p-6 flex-grow">
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
            ₹{plan.amount.toLocaleString()}
          </h2>
          <p className="text-lg font-medium text-purple-600">
          Wallet Balance:₹{plan.getAmount.toLocaleString()}
          </p>
          <p className="text-gray-600">
          Monthly Usage Limit: ₹{plan.limitAmount.toLocaleString()}

          </p>
        </div>
      </div>
    </div>

    <div className="p-6 pt-0">
    <button
  onClick={() => onSubscribe(plan.planId)}
  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 
    ${isSelected || planDetails?.status
      ? 'bg-purple-700 text-white shadow-lg cursor-not-allowed'
      : plan.status
        ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-md'
        : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
    } transform hover:scale-[1.02]`}
  disabled={isSelected || planDetails?.status}
>
  {isSelected || planDetails?.status ? 'Selected' : 'Choose Plan'}
</button>
    </div>
  </div>
);

const FeatureCard: React.FC<{ title: string; description: string }> = ({
  title,
  description
}) => (
  <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
    <h3 className="font-semibold text-gray-900 text-lg mb-2">
      {title}
    </h3>
    <p className="text-gray-600">
      {description}
    </p>
  </div>
);

const Subscription: React.FC = () => {
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [plandetails, setPlanDetails] = useState<userSubscriptionPlan>();
  const [loading,setLoading] = useState(false)
   const [profileData,setProfileData] = useState<ProfileData>({
    userFirstName: '',
    userLastName: '',
    customerEmail: '',
    })
     const [paymentStatus,setPaymentStatus] = useState()
  const activeSubscription = true;
  const navigate = useNavigate();
  const BASEURL = "https://meta.oxyglobal.tech/api";
  const token = localStorage.getItem('accessToken');

  const queryParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(queryParams.entries());
  const subscriptionID = params.trans;

  

    useEffect(()=>{
      const trans = localStorage.getItem('merchantTransactionId')
      const paymentId = localStorage.getItem('paymentId')
      if(trans===subscriptionID){
        Requery(paymentId)
      }
    },[subscriptionID])

  const handleSubscribe = async(planId: string, amount: number) => {
    setSelectedPlan(planId);
    try{
    const response = await axios.post(`${BASEURL}/order-service/userSubscriptionAmount`, { planId, customerId: localStorage.getItem('userId'),amount },
    {
      headers: {  "Authorization" : `Bearer ${token}` }
    }
    );
    if(response.data.paymentId){
      const data = {
        mid: "1152305",
        // amount: amount,
        amount: 1,
        merchantTransactionId: response.data.paymentId,
        transactionDate: new Date(),
        terminalId: "getepay.merchant128638@icici",
        udf1: localStorage.getItem('whatsappNumber'),
        udf2: `${profileData.userFirstName}  ${profileData.userLastName}`,
        udf3: profileData.customerEmail,
        udf4: "",
        udf5: "",
        udf6: "",
        udf7: "",
        udf8: "",
        udf9: "",
        udf10: "",
        ru: `https://sandbox.askoxy.ai/subscription?trans=${response.data.paymentId}`,
        callbackUrl: `https://sandbox.askoxy.ai/subscription?trans=${response.data.paymentId}`,
        currency: "INR",
        paymentMode: "ALL",
        bankId: "",
        txnType: "single",
        productType: "IPG",
        txnNote: "Subscription In Live",
        vpa: "getepay.merchant128638@icici",
      };
      console.log({ data });

      // You might need to call a payment function here (e.g., initiatePayment(data))
      getepayPortal(data);
    }
  }catch(error){
    console.log(error);
    setSelectedPlan(null);
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
          content: "Click Yes to continue to the payment gateway.",
          okText: "Yes",
          cancelText: "No",
          onOk() {
            window.location.href = paymentUrl; // Redirects to the payment page
          },
          onCancel() {
            setSelectedPlan(null);// Reset selection when user clicks "No"
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
                url: `${BASEURL}/order-service/userSubscriptionAmount`,
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
                  Modal.success({
                    content: "Subcription Added Successfully",
                    onOk: () => {
                      navigate("/wallet");
                    },
                  })
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

  const getPlans = async () => {
    try {
      const response = await axios.get(`${BASEURL}/order-service/getAllPlans`);
      setSubscriptionPlans(response.data);
    } catch (error) {
      console.error('Failed to fetch subscription plans:', error);
    }
  };

  const userPlanDetails = async () => {
    try {
      const response = await axios.post(`${BASEURL}/order-service/getSubscriptionsDetailsForaCustomer`, { customerId: localStorage.getItem('userId') },
      {
        headers: {  "Authorization" : `Bearer ${token}` }
      }
    );
      setPlanDetails(response.data);
    } catch (error) {
      console.error('Failed to fetch subscription plans:', error);
    }
  }

  useEffect(() => {
    getPlans();
    userPlanDetails();
    setCartCount(parseInt(localStorage.getItem('cartCount') || '0'));
    const userData = localStorage.getItem('profileData')
    if(userData){
      setProfileData(JSON.parse(userData))
    }
  }, []);




  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
     

      <div className="flex-1 p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          
          <main className="flex-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Choose Your Perfect Plan
                </h1>
                <p className="text-lg text-gray-600">
                Subscribe & Save Upto ₹500 – Hassle-Free Fresh Rice Delivery!
                </p>
              </div>

              {plandetails?.status && (
                <Alert variant="destructive" className="mb-8">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <AlertDescription>
                    You already have an active subscription. Please complete your current subscription before choosing a new plan.
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {subscriptionPlans.map((plan) => (
                  <SubscriptionCard
                    key={plan.planId}
                    plan={plan}
                    isSelected={selectedPlan === plan.planId}
                    onSubscribe={()=>handleSubscribe(plan.planId, plan.amount)}
                    planDetails={plandetails || {} as userSubscriptionPlan} // Ensure it's always a valid object
                  />
                ))}
              </div>

              {/* <div className="mt-16 space-y-8">
                <h2 className="text-2xl font-bold text-gray-900 text-center">
                  All Plans Include
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: "30-Day Money Back",
                      description: "Try risk-free with our guarantee"
                    },
                    {
                      title: "24/7 System Status",
                      description: "Check our uptime anytime"
                    },
                    {
                      title: "Regular Updates",
                      description: "Stay current with latest features"
                    }
                  ].map((feature, index) => (
                    <FeatureCard
                      key={index}
                      title={feature.title}
                      description={feature.description}
                    />
                  ))}
                </div>
              </div> */}
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Subscription;