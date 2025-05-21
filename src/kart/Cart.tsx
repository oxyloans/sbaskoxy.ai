import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2, X, Trash2, Info, Gift } from "lucide-react";
import { motion } from "framer-motion";
import { isWithinRadius } from "./LocationCheck";
import { Button, message, Modal, Input, Tag } from "antd";
import Footer from "../components/Footer";
import { CartContext } from "../until/CartContext";
import { LoadingOutlined } from "@ant-design/icons";
import BASE_URL from "../Config";

interface Address {
  id?: string;
  flatNo: string;
  landMark: string;
  address: string;
  pincode: string;
  addressType: "Home" | "Work" | "Others";
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
  cartQuantity: number;
  cartId: string;
  status: string;
  quantity: number;
  freeQuantity?: number;
  promotionType?: string;
}

interface AddressFormData {
  flatNo: string;
  landMark: string;
  address: string;
  pincode: string;
  addressType: "Home" | "Work" | "Others";
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface ContainerEligibility {
  eligible: boolean;
  reason?: string;
  containerType?: "HEAVY_BAG" | "LIGHT_BAG";
  containerId?: string;
}

const CartPage: React.FC = () => {
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [cartItems, setCartItems] = useState<{ [key: string]: number }>({});
  const [loadingItems, setLoadingItems] = useState<{ [key: string]: boolean }>({});
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [checkoutError, setCheckoutError] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const whatsappNumber = localStorage.getItem("whatsappNumber") || "";
  const mobileNumberRaw = localStorage.getItem("mobileNumber") || "";
  const rawNumber = mobileNumberRaw || whatsappNumber;
  const [selectedPlan, setSelectedPlan] = useState<string[]>([]);
  const [isPlanModalVisible, setIsPlanModalVisible] = useState(false);
  const [forcePlanModalDisplay, setForcePlanModalDisplay] = useState(false);
  const isFreeItem = (item: any) => item.status === "FREE";
  const modalDisplayedRef = useRef<boolean>(false);

  const [regularCartItems, setRegularCartItems] = useState<{ [key: string]: number }>({});
  const [freeCartItems, setFreeCartItems] = useState<{ [key: string]: number }>({});

  const [isPlanDetailsModalOpen, setIsPlanDetailsModalOpen] = useState<boolean>(false);
  const [currentPlanDetails, setCurrentPlanDetails] = useState<"planA" | "planB" | null>(null);
  const [containerPreference, setContainerPreference] = useState<string | null>(null);
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [isReferralModalVisible, setIsReferralModalVisible] = useState<boolean>(false);
  const [mobileNumbers, setMobileNumbers] = useState<string[]>([]);
  const [currentNumber, setCurrentNumber] = useState<string>("");
  const containerExistsRef = useRef<boolean>(false);

  const CONTAINER_ITEM_IDS = {
    HEAVY_BAG: "9b5c671a-32bb-4d18-8b3c-4a7e4762cc61",
    LIGHT_BAG: "53d7f68c-f770-4a70-ad67-ee2726a1f8f3",
  };

  const [addressFormData, setAddressFormData] = useState<AddressFormData>({
    flatNo: "",
    landMark: "",
    address: "",
    pincode: "",
    addressType: "Home",
  });

  const [addressFormErrors, setAddressFormErrors] = useState({
    flatNo: "",
    landmark: "",
    address: "",
    pincode: "",
  });

  const navigate = useNavigate();
  const customerId = localStorage.getItem("userId");
  const token = localStorage.getItem("accessToken");

  const context = useContext(CartContext);

  if (!context) {
    throw new Error("CartDisplay must be used within a CartProvider");
  }

  const { setCount } = context;

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user-service/getAllAdd?customerId=${customerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAddresses(response.data);
      setSelectedAddress(response.data[0] || null);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const updateContainerPreference = async (preferenceTypes: string[], collectedNumb: string[]) => {
    try {
      const itemIds = cartData.map((item) => item.itemId);

      let trimmed = rawNumber.trim();
      let mobilenumber = trimmed.length > 10 ? trimmed.replace(/^(\+91|91)/, "") : trimmed;

      const requestBody: any = {
        created_at: new Date().toISOString(),
        itemIds: itemIds,
        mobilenumber: mobilenumber,
        referenceMobileNumbers: collectedNumb,
        user_id: customerId,
      };

      if (preferenceTypes.includes("planA")) {
        requestBody.plana = "YES";
      }

      if (preferenceTypes.includes("planB")) {
        requestBody.planb = "YES";
      }

      const response = await axios.post(
        `${BASE_URL}/reference-service/referenceoffer`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          validateStatus: () => true,
        }
      );

      if (response.status === 400) {
        if (preferenceTypes.includes("planA") || preferenceTypes.includes("planB")) {
          message.error(response.data.message || "Something went wrong.", 5);
        }
        return false;
      }

      if (response.status === 200) {
        const resData = response.data;
        const messages = [];

        const isPlanA = preferenceTypes.includes("planA");
        const isPlanB = preferenceTypes.includes("planB");

        const alreadySaved = Array.isArray(resData.alreadySavedReferences)
          ? resData.alreadySavedReferences
          : [];
        const newlySaved = Array.isArray(resData.newlySavedReferences)
          ? resData.newlySavedReferences
          : [];

        if ((isPlanA && isPlanB) || isPlanB) {
          if (alreadySaved.length > 0 && newlySaved.length > 0) {
            messages.push(
              `Already referred numbers: ${alreadySaved.join(", ")}. ` +
                `Newly referred numbers: ${newlySaved.join(", ")}.`
            );
          } else if (alreadySaved.length > 0) {
            messages.push(`These numbers are already referred: ${alreadySaved.join(", ")}`);
          } else if (newlySaved.length > 0) {
            messages.push(
              `The following numbers have been referred successfully: ${newlySaved.join(", ")}`
            );
          }
        } else if (isPlanA) {
          messages.push("Plan A updated successfully.");
        } else if (isPlanB) {
          if (alreadySaved.length > 0 && newlySaved.length === 0) {
            messages.push(
              `These numbers are referred successfully : ${alreadySaved.join(", ")}`
            );
          }

          if (alreadySaved.length === 0 && newlySaved.length > 0) {
            messages.push(
              `The following numbers have been referred successfully: ${newlySaved.join(", ")}`
            );
          }
        }

        if (messages.length > 0) {
          message.success({
            content: messages.join(" "),
            duration: 8,
          });
        } else {
          message.success({
            content: resData.message || "Plans updated successfully.",
            duration: 5,
          });
        }

        return true;
      }

      message.error("Unexpected response from the server.");
      return false;
    } catch (error) {
      console.error("Error submitting reference offer:", error);
      return false;
    }
  };

  const handleReferralOk = async () => {
    if (mobileNumbers.length === 0) {
      message.error("Please enter at least one mobile number.");
      return;
    }

    const prefUpdated = await updateContainerPreference(selectedPlans, mobileNumbers);

    if (prefUpdated) {
      try {
        await axios.post(
          `${BASE_URL}/cart-service/cart/updateContainerStatus`,
          {
            customerId,
            status: "interested",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.error("Error updating container status:", error);
      }

      const eligibility = checkEligibilityForContainer(cartData);
      if (eligibility.eligible && eligibility.containerType) {
        await addContainerToCart(eligibility.containerType as "HEAVY_BAG" | "LIGHT_BAG");
      }
    }

    setIsReferralModalVisible(false);
  };

  const handleReferralCancel = async () => {
    if (mobileNumbers.length === 0) {
      Modal.confirm({
        title: "No Mobile Numbers Entered",
        content:
          "Are you sure you want to skip? Without adding at least one mobile number, the container will not be added to your cart and the offer will not be applied.",
        okText: "Yes, Skip",
        cancelText: "Go Back",
        onOk() {
          setIsReferralModalVisible(false);
        },
      });
    } else {
      handleReferralOk();
    }
  };

  const handleModalClose = () => {
    Modal.confirm({
      title: "Are you sure you want to close?",
      content:
        "Are you sure you want to close? Without adding at least one mobile number, the container will not be added to your cart and the offer will not be applied.",
      okText: "Yes, Close",
      cancelText: "Stay",
      onOk() {
        setIsReferralModalVisible(false);
      },
    });
  };

  const handleAddNumber = () => {
    if (!currentNumber || currentNumber.length !== 10 || !/^[6-9]\d{9}$/.test(currentNumber)) {
      message.error("Please enter a valid 10-digit mobile number");
      return;
    }
    if (mobileNumbers.includes(currentNumber)) {
      message.error("This mobile number is already added");
      return;
    }
    if (currentNumber === rawNumber) {
      message.error("Adding your own number is not allowed.");
      return;
    }

    setMobileNumbers([...mobileNumbers, currentNumber]);
    setCurrentNumber("");
  };

  const handleRemoveNumber = (index: number) => {
    const newNumbers = [...mobileNumbers];
    newNumbers.splice(index, 1);
    setMobileNumbers(newNumbers);
  };

  // const showContainerModal = async () => {
  //   console.log("Attempting to show container modal");

  //   const freeContainer = cartData.find(
  //     (item) =>
  //       [CONTAINER_ITEM_IDS.HEAVY_BAG, CONTAINER_ITEM_IDS.LIGHT_BAG].includes(item.itemId) &&
  //       item.status === "FREE"
  //   );

  //   if (freeContainer) {
  //     console.log("Free container found in cart, showing plans modal directly");
  //     setIsPlanModalVisible(true);
  //     modalDisplayedRef.current = true;
  //     return;
  //   }

  //   if (!forcePlanModalDisplay) {
  //     const containerPref = await fetchContainerPreference();
  //     console.log("Current container preference:", containerPref);

  //     if (containerPref === "interested" || containerPref === "completed" || containerPref === "declined") {
  //       console.log("User already has container preference, not showing modal");
  //       return;
  //     }
  //   }

  //   const eligibility = checkEligibilityForContainer(cartData);
  //   console.log("Eligibility check result:", eligibility);

  //   if (!eligibility.eligible) {
  //     console.log("Not eligible for container, not showing modal");
  //     return;
  //   }

  //   console.log("Showing container modal");
  //   setIsPlanModalVisible(true);
  //   setSelectedPlan([]);
  // };

  const showContainerModal = () => {
  console.log("Showing container modal");
  setIsPlanModalVisible(true);
  modalDisplayedRef.current = true;
};

  useEffect(() => {
    if (cartData.length === 0) {
      modalDisplayedRef.current = false;
      containerExistsRef.current = false;
    }
  }, [cartData.length]);

  // useEffect(() => {
  //   const checkAndShowModal = async () => {
  //     if (cartData.length > 0) {
  //       const freeContainer = cartData.find(
  //         (item) =>
  //           [CONTAINER_ITEM_IDS.HEAVY_BAG, CONTAINER_ITEM_IDS.LIGHT_BAG].includes(item.itemId) &&
  //           item.status === "FREE"
  //       );

  //       if (freeContainer && !modalDisplayedRef.current) {
  //         console.log("Free container found in cart, showing container plans modal");
  //         setIsPlanModalVisible(true);
  //         modalDisplayedRef.current = true;
  //         containerExistsRef.current = true;
  //         return;
  //       }

  //       if (!modalDisplayedRef.current && !containerExistsRef.current) {
  //         const hasContainer = cartData.some((item) =>
  //           [CONTAINER_ITEM_IDS.HEAVY_BAG, CONTAINER_ITEM_IDS.LIGHT_BAG].includes(item.itemId)
  //         );

  //         containerExistsRef.current = hasContainer;

  //         if (!hasContainer) {
  //           const eligibility = checkEligibilityForContainer(cartData);
  //           console.log("Container eligibility check result:", eligibility);

  //           if (eligibility.eligible) {
  //             const containerPref = await fetchContainerPreference();
  //             if (
  //               containerPref !== "interested" &&
  //               containerPref !== "completed" &&
  //               containerPref !== "declined"
  //             ) {
  //               showContainerModal();
  //               modalDisplayedRef.current = true;
  //             }
  //           }
  //         }
  //       }
  //     }
  //   };

  //   checkAndShowModal();
  // }, [cartData]);

  useEffect(() => {
  const checkAndShowModal = async () => {
    if (cartData.length > 0 && !modalDisplayedRef.current) {
      const freeContainer = cartData.find(
        (item) =>
          [CONTAINER_ITEM_IDS.HEAVY_BAG, CONTAINER_ITEM_IDS.LIGHT_BAG].includes(item.itemId) &&
          item.status === "FREE"
      );

      if (freeContainer) {
        console.log("Free container found in cart, showing container plans modal");
        showContainerModal();
        containerExistsRef.current = true;
      }
    }
  };

  checkAndShowModal();
}, [cartData]);

  const fetchContainerPreference = async (): Promise<string | null> => {
    try {
      console.log(`Fetching container preference for customer ID: ${customerId}`);
      const response = await axios.get(
        `${BASE_URL}/cart-service/cart/ContainerInterested/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response && response.data) {
        const status = response.data.freeContainerStatus
          ? response.data.freeContainerStatus.toLowerCase()
          : null;
        console.log("Fetched container preference:", status);
        return status;
      }
      console.log("No container preference found, returning null");
      return null;
    } catch (error) {
      console.error("Error fetching container preference:", error);
      return null;
    }
  };

  const parseWeight = (weight: unknown): number => {
    if (typeof weight === "number") {
      return weight;
    }
    if (typeof weight !== "string" || !weight) {
      console.warn(`Invalid weight value: ${weight}, defaulting to 0`);
      return 0;
    }
    const cleanedWeight = weight.replace(/[^0-9.]/g, "");
    const result = parseFloat(cleanedWeight) || 0;
    console.log(`Parsed weight ${weight} to ${result}`);
    return result;
  };

  const checkEligibilityForContainer = (cartItems: CartItem[]): ContainerEligibility => {
    console.log("Checking eligibility with items:", cartItems);

    if (!cartItems || cartItems.length === 0) {
      return { eligible: false, reason: "empty_cart" };
    }

    const hasContainer = cartItems.some((item) =>
      [CONTAINER_ITEM_IDS.HEAVY_BAG, CONTAINER_ITEM_IDS.LIGHT_BAG].includes(item.itemId)
    );

    if (hasContainer) {
      console.log("Container already in cart");
      return { eligible: false, reason: "already_has_container" };
    }

    const hasHeavyRice = cartItems.some((item) => {
      const weight = parseWeight(item.weight);
      const isHeavyRice =
        item.itemName.toLowerCase().includes("rice") &&
        weight >= 25 &&
        weight <= 27 &&
        item.status !== "FREE";

      if (isHeavyRice) {
        console.log(`Found 26kg rice: ${item.itemName}, weight: ${weight}kg`);
      }
      return isHeavyRice;
    });

    const hasLightRice = cartItems.some((item) => {
      const weight = parseWeight(item.weight);
      const isLightRice =
        item.itemName.toLowerCase().includes("rice") &&
        weight >= 9 &&
        weight <= 11 &&
        item.status !== "FREE";

      if (isLightRice) {
        console.log(`Found 10kg rice: ${item.itemName}, weight: ${weight}kg`);
      }
      return isLightRice;
    });

    if (hasHeavyRice) {
      return {
        eligible: true,
        containerType: "HEAVY_BAG",
        containerId: CONTAINER_ITEM_IDS.HEAVY_BAG,
      };
    } else if (hasLightRice) {
      return {
        eligible: true,
        containerType: "LIGHT_BAG",
        containerId: CONTAINER_ITEM_IDS.LIGHT_BAG,
      };
    }

    console.log("No eligible rice items found for container");
    return { eligible: false, reason: "no_eligible_items" };
  };

  const addContainerToCart = async (containerType: "HEAVY_BAG" | "LIGHT_BAG") => {
    try {
      const containerId = CONTAINER_ITEM_IDS[containerType];
      console.log(`Adding container to cart: ${containerType}, ID: ${containerId}`);

      await axios.post(
        `${BASE_URL}/cart-service/cart/addAndIncrementCart`,
        {
          cartQuantity: 1,
          customerId,
          itemId: containerId,
          status: "FREE",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      message.success("Free container added to your cart!");
      await fetchCartData();
      containerExistsRef.current = true;
      return true;
    } catch (error) {
      console.error("Failed to add container to cart:", error);
      message.error("Failed to add container to your cart");
      return false;
    }
  };

  const removeContainerFromCart = async () => {
    try {
      const containerItem = cartData.find(
        (item) =>
          [CONTAINER_ITEM_IDS.HEAVY_BAG, CONTAINER_ITEM_IDS.LIGHT_BAG].includes(item.itemId) &&
          item.status === "FREE"
      );

      if (containerItem) {
        console.log(
          `Removing free container from cart: ID ${containerItem.itemId}, cartId ${containerItem.cartId}`
        );

        await axios.delete(`${BASE_URL}/cart-service/cart/removeFreeContainer`, {
          data: {
            id: containerItem.cartId,
            customerId,
            itemId: containerItem.itemId,
            status: "FREE",
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        message.info("Container removed from your cart");
        await fetchCartData();
        containerExistsRef.current = false;
        return true;
      } else {
        console.log("No container found in cart to remove");
        return false;
      }
    } catch (error) {
      console.error("Failed to remove container from cart:", error);
      message.error("Failed to remove container from cart");
      return false;
    }
  };

  const fetchCartData = async () => {
    try {
      console.log("Fetching cart data for customer ID:", customerId);

      const response = await axios.get(
        `${BASE_URL}/cart-service/cart/userCartInfo?customerId=${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.customerCartResponseList) {
        const cartItems = response.data.customerCartResponseList;
        console.log(`Fetched ${cartItems.length} items in cart`);

        const hasContainer = cartItems.some((item: CartItem) =>
          [CONTAINER_ITEM_IDS.HEAVY_BAG, CONTAINER_ITEM_IDS.LIGHT_BAG].includes(item.itemId)
        );

        containerExistsRef.current = hasContainer;
        console.log(`Container exists in cart: ${hasContainer}`);

        // Separate regular and free items
        const regularItemsMap = cartItems
          .filter((item: CartItem) => item.status !== "FREE")
          .reduce((acc: { [key: string]: number }, item: CartItem) => {
            acc[item.itemId] = item.cartQuantity || 0;
            return acc;
          }, {});

        const freeItemsMap = cartItems
          .filter((item: CartItem) => item.status === "FREE")
          .reduce((acc: { [key: string]: number }, item: CartItem) => {
            acc[item.itemId] = item.cartQuantity || 0;
            return acc;
          }, {});

        setRegularCartItems(regularItemsMap);
        setFreeCartItems(freeItemsMap);

        // Calculate total quantity for regular items only
        const totalQuantity = Object.values(regularItemsMap as Record<string, number>).reduce(
          (sum, qty) => sum + qty,
          0
        );
        setCount(totalQuantity);
      } else {
        setRegularCartItems({});
        setFreeCartItems({});
        setCount(0);
      }

      const cartWithFreeItems = response.data?.customerCartResponseList || [];

      cartWithFreeItems.forEach((item: CartItem) => {
        if (
          item.itemName.toLowerCase().includes("rice") &&
          item.weight &&
          parseFloat(item.weight) >= 5
        ) {
          const freeItems = Math.floor(item.cartQuantity / 5) * 2;
          item.freeQuantity = freeItems;
        } else if (
          item.itemName.toLowerCase().includes("rice") &&
          item.weight &&
          parseFloat(item.weight) === 1 &&
          item.status === "FREE"
        ) {
          item.freeQuantity = 1;
        }
      });

      const outOfStockItems = cartWithFreeItems.filter(
        (item: CartItem) => item.cartQuantity > item.quantity
      );

      if (outOfStockItems.length > 0) {
        setCheckoutError(true);
        message.warning(
          `Please decrease the quantity for: ${outOfStockItems
            .map((item: CartItem) => item.itemName)
            .join(", ")} before proceeding to checkout.`,
          5
        );
      }

      setCartData(cartWithFreeItems);
      return cartWithFreeItems;
    } catch (error) {
      console.error("Error fetching cart items:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getCoordinates = async (address: string) => {
    try {
      const API_KEY = "AIzaSyAM29otTWBIAefQe6mb7f617BbnXTHtN0M";
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${API_KEY}`;
      const response = await axios.get(url);
      return response.data.results[0]?.geometry.location;
    } catch (error) {
      return null;
    }
  };

  const validateAddressForm = () => {
    const errors = {
      flatNo: "",
      landmark: "",
      address: "",
      pincode: "",
    };

    if (!addressFormData.flatNo.trim()) errors.flatNo = "Flat/House number is required";
    if (!addressFormData.landMark.trim()) errors.landmark = "Landmark is required";
    if (!addressFormData.address.trim()) errors.address = "Address is required";
    if (!addressFormData.pincode.trim()) errors.pincode = "PIN code is required";
    else if (!/^\d{6}$/.test(addressFormData.pincode))
      errors.pincode = "Please enter a valid 6-digit PIN code";

    setAddressFormErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  const handleAddressSubmit = async (): Promise<void> => {
    if (!validateAddressForm()) return;

    try {
      setIsLoading(true);
      setError("");
      setSuccessMessage("");

      const fullAddress = `${addressFormData.flatNo}, ${addressFormData.landMark}, ${addressFormData.address}, ${addressFormData.pincode}`;
      const coordinates = await getCoordinates(fullAddress);

      if (!coordinates) {
        message.error("Unable to find location coordinates. Please check the address.");
        return;
      }

      const withinRadius = await isWithinRadius(coordinates);
      console.log({ withinRadius });

      if (!withinRadius.isWithin) {
        setAddressFormData({
          flatNo: "",
          landMark: "",
          address: "",
          pincode: "",
          addressType: "Home",
        });
        Modal.error({
          title: "Delivery Unavailable",
          content: (
            <>
              <p>
                Sorry! We're unable to deliver to this address as it is{" "}
                {withinRadius.distanceInKm} km away, beyond our 20 km delivery radius. Please select
                another saved address within the radius or add a new one to proceed. We appreciate your
                understanding!
              </p>
              <div className="flex justify-end space-x-2 mt-4">
                <Button type="default" onClick={() => Modal.destroyAll()}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    Modal.destroyAll();
                    setIsAddressModalOpen(true);
                  }}
                >
                  Add New Address
                </Button>
              </div>
            </>
          ),
          footer: null,
        });
        return;
      }

      const data = {
        userId: customerId,
        flatNo: addressFormData.flatNo,
        landMark: addressFormData.landMark,
        address: addressFormData.address,
        pincode: addressFormData.pincode,
        addressType: addressFormData.addressType,
        latitude: coordinates.lat.toString(),
        longitude: coordinates.lng.toString(),
      };

      if (editingAddressId) {
        await axios.put(`${BASE_URL}/user-service/updateAddress/${editingAddressId}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Address updated successfully.", 5);
      } else {
        await axios.post(`${BASE_URL}/user-service/addAddress`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Address added successfully.", 5);
        setAddressFormData({
          flatNo: "",
          landMark: "",
          address: "",
          pincode: "",
          addressType: "Home",
        });
      }

      setError("");
      await fetchAddresses();
      setTimeout(resetAddressForm, 3000);
    } catch (err) {
      setSuccessMessage("");
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || "Failed to save address");
    } finally {
      setIsLoading(false);
      setIsAddressModalOpen(false);
      setSuccessMessage("");
      setError("");
    }
  };

  const handleIncrease = async (item: CartItem) => {
    setLoadingItems((prev) => ({ ...prev, [item.itemId]: true }));

    try {
      const isFreeItem = item.status === "FREE";
      const currentQuantity = isFreeItem
        ? freeCartItems[item.itemId] || 0
        : regularCartItems[item.itemId] || 0;

      if (currentQuantity >= item.quantity) {
        message.warning(`Only ${item.quantity} units available in stock`);
        setLoadingItems((prev) => ({ ...prev, [item.itemId]: false }));
        return;
      }

      const newQuantity = currentQuantity + 1;

      await axios.post(
        `${BASE_URL}/cart-service/cart/addAndIncrementCart`,
        {
          cartQuantity: newQuantity,
          customerId,
          itemId: item.itemId,
          status: isFreeItem ? "FREE" : undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update the appropriate cart items state
      if (isFreeItem) {
        setFreeCartItems((prev) => ({
          ...prev,
          [item.itemId]: newQuantity,
        }));
      } else {
        setRegularCartItems((prev) => ({
          ...prev,
          [item.itemId]: newQuantity,
        }));
        // Update count for regular items only
        const currentCount = context.count || 0;
        setCount(currentCount + 1);
      }

      await fetchCartData();
    } catch (error) {
      console.error("Failed to increase cart item:", error);
      message.error("Failed to update quantity");
    } finally {
      setLoadingItems((prev) => ({ ...prev, [item.itemId]: false }));
    }
  };

  const handleDecrease = async (item: CartItem) => {
    setLoadingItems((prev) => ({ ...prev, [item.itemId]: true }));

    try {
      const isFreeItem = item.status === "FREE";
      const currentQuantity = isFreeItem ? freeCartItems[item.itemId] : regularCartItems[item.itemId];

      if (currentQuantity > 1) {
        const newQuantity = currentQuantity - 1;

        await axios.patch(
          `${BASE_URL}/cart-service/cart/minusCartItem`,
          {
            cartQuantity: newQuantity,
            customerId,
            itemId: item.itemId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Update the appropriate cart items state
        if (isFreeItem) {
          setFreeCartItems((prev) => ({
            ...prev,
            [item.itemId]: newQuantity,
          }));
        } else {
          setRegularCartItems((prev) => ({
            ...prev,
            [item.itemId]: newQuantity,
          }));
          // Update count for regular items only
          const currentCount = context.count || 0;
          setCount(Math.max(0, currentCount - 1));
        }

        await fetchCartData();
      } else {
        await removeCartItem(item);
      }
    } catch (error) {
      console.error("Failed to decrease cart item:", error);
      message.error("Failed to update quantity");
    } finally {
      setLoadingItems((prev) => ({ ...prev, [item.itemId]: false }));
    }
  };

  const removeCartItem = async (item: CartItem) => {
    try {
      setLoadingItems((prev) => ({ ...prev, [item.itemId]: true }));

      const itemIdToRemove = item.itemId;
      const cartIdToRemove = item.cartId;

      const isFreeItem = item.status === "FREE";
      const isEligibleRice =
        item.itemName.toLowerCase().includes("rice") &&
        (parseWeight(item.weight) === 10 || parseWeight(item.weight) === 26);
      const isContainer = [CONTAINER_ITEM_IDS.HEAVY_BAG, CONTAINER_ITEM_IDS.LIGHT_BAG].includes(
        itemIdToRemove
      );

      console.log(
        `Removing item: ${item.itemName}, ID: ${itemIdToRemove}, cartId: ${cartIdToRemove}, ` +
          `isFreeItem: ${isFreeItem}, isEligibleRice: ${isEligibleRice}, isContainer: ${isContainer}`
      );

      if (isFreeItem) {
        // Remove free items using removeFreeContainer API
        await axios.delete(`${BASE_URL}/cart-service/cart/removeFreeContainer`, {
          data: {
            id: cartIdToRemove,
            customerId,
            itemId: itemIdToRemove,
            status: "FREE",
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      } else {
        // Remove non-free items using the standard remove API
        await axios.delete(`${BASE_URL}/cart-service/cart/remove`, {
          data: {
            id: cartIdToRemove,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      // Handle eligible rice removal and container cleanup
      if (isEligibleRice && containerExistsRef.current) {
        const remainingRiceItems = cartData.filter(
          (ci) =>
            ci.itemId !== itemIdToRemove &&
            ci.itemName.toLowerCase().includes("rice") &&
            (parseWeight(ci.weight) === 10 || parseWeight(ci.weight) === 26)
        );

        if (remainingRiceItems.length === 0) {
          console.log("Removing container after rice removal");
          await removeContainerFromCart();
        }
      }

      if (isContainer) {
        console.log("Container removed from cart, updating preference");
        containerExistsRef.current = false;
      }

      setCartData((prev) => prev.filter((ci) => ci.cartId !== cartIdToRemove));

      // Update the appropriate cart items state
      if (isFreeItem) {
        setFreeCartItems((prev) => {
          const updated = { ...prev };
          delete updated[itemIdToRemove];
          return updated;
        });
      } else {
        setRegularCartItems((prev) => {
          const updated = { ...prev };
          delete updated[itemIdToRemove];
          return updated;
        });
        const currentCount = context.count || 0;
        setCount(Math.max(0, currentCount - (item.cartQuantity || 0)));
      }

      const updatedCartData = await fetchCartData();

      if (!updatedCartData || updatedCartData.length === 0) {
        window.location.reload();
      }

      message.success("Item removed from cart successfully.", 5);
    } catch (error) {
      console.error("Failed to remove cart item:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error response:", error.response.status, error.response.data);
      }
      message.error("Failed to remove item");

      await fetchCartData();
    } finally {
      setLoadingItems((prev) => ({ ...prev, [item.itemId]: false }));
    }
  };

  const resetAddressForm = () => {
    setAddressFormData({
      flatNo: "",
      landMark: "",
      address: "",
      pincode: "",
      addressType: "Home",
    });
    setAddressFormErrors({
      flatNo: "",
      landmark: "",
      address: "",
      pincode: "",
    });
    setEditingAddressId(null);
    setShowAddressForm(false);
  };

  const handleToProcess = async () => {
    if (isCheckoutDisabled()) {
      Modal.error({
        title: "Stock Issues",
        content:
          "Unable to proceed with checkout. Please remove out-of-stock items or adjust quantities to match available stock.",
      });
      return;
    }

    if (!cartData || cartData.length === 0) {
      message.error("Your cart is empty, Please Add At least one Item");
      return;
    }

    if (!selectedAddress) {
      message.error("Please select an address");
      return;
    }

    const isAddressValid = await handleAddressChange(selectedAddress);
    if (isAddressValid?.isWithin) {
      navigate("/main/checkout", { state: { selectedAddress } });
    }
  };

  const handleAddressModalClose = () => {
    setIsAddressModalOpen(false);
    setEditingAddressId(null);
    setSuccessMessage("");
    setError("");
    setAddressFormData({
      flatNo: "",
      landMark: "",
      address: "",
      pincode: "",
      addressType: "Home",
    });
  };

  const handleInterested = async (selectedPlanTypes: string[]) => {
    modalDisplayedRef.current = true;

    if (selectedPlanTypes.length === 0) {
      console.log("User declined container offer");
      if (containerExistsRef.current) {
        await removeContainerFromCart();
      }
      try {
        await axios.post(
          `${BASE_URL}/cart-service/cart/updateContainerStatus`,
          {
            customerId,
            status: "declined",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        message.info("Container preference updated");
      } catch (error) {
        console.error("Error updating container preference:", error);
      }
      return false;
    }

    const eligibility = checkEligibilityForContainer(cartData);
    setSelectedPlans(selectedPlanTypes);

    if (!eligibility.eligible) {
      if (eligibility.reason === "already_has_container") {
        message.info("You have already opted for a container.");
      } else {
        message.info("No eligible items for a free container.");
      }
      return false;
    }

    if (selectedPlanTypes.includes("planB") && mobileNumbers.length === 0) {
      setMobileNumbers([]);
      setCurrentNumber("");
      setIsReferralModalVisible(true);
      return false;
    }

    const prefUpdated = await updateContainerPreference(selectedPlanTypes, mobileNumbers);

    if (prefUpdated === true) {
      try {
        await axios.post(
          `${BASE_URL}/cart-service/cart/updateContainerStatus`,
          {
            customerId,
            status: "interested",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.error("Error updating container status:", error);
      }

      const success = await addContainerToCart(
        eligibility.containerType as "HEAVY_BAG" | "LIGHT_BAG"
      );
      return success;
    }
    return false;
  };

  const forceShowContainerModal = () => {
    setForcePlanModalDisplay(true);
    modalDisplayedRef.current = false;
  };

  useEffect(() => {
    if (isPlanDetailsModalOpen && currentPlanDetails) {
      try {
        Modal.info({
          title: currentPlanDetails === "planA" ? "Free Steel Container Policy" : "Referral Program",
          content: (
            <div className="space-y-4 text-left">
              {currentPlanDetails === "planA" ? (
                <>
                  <ul className="list-disc pl-5 text-gray-700 space-y-1">
                    <li>Buy 9 bags of rice in 3 years to keep the container forever</li>
                    <li>Refer 9 friends who make a purchase – keep the container</li>
                    <li>Gap of 90 days = container is taken back</li>
                  </ul>
                </>
              ) : (
                <>
                  <ul className="list-disc pl-5 text-gray-700 space-y-1">
                    <li>Refer friends using your unique link</li>
                    <li>They must sign up and buy rice</li>
                    <li>You get a free container + ₹50 cashback</li>
                  </ul>
                </>
              )}
            </div>
          ),
          onOk: () => setIsPlanDetailsModalOpen(false),
          okText: "Close",
          cancelButtonProps: { style: { display: "none" } },
        });
      } catch (error) {
        console.error("Error displaying plan details modal:", error);
      }
    }
  }, [isPlanDetailsModalOpen, currentPlanDetails]);

  useEffect(() => {
    const initializeCartPage = async () => {
      setIsLoading(true);
      try {
        console.log("Initializing cart page...");
        await fetchAddresses();
        const [cartResponse, preference] = await Promise.all([fetchCartData(), fetchContainerPreference()]);
        console.log("Initialization complete - preference:", preference);
        setContainerPreference(preference);

        modalDisplayedRef.current = false;
        // Skip showing the container modal
        console.log("Free container modal is disabled");
      } catch (error) {
        console.error("Error initializing cart page:", error);
        message.error("Failed to load cart data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeCartPage();
  }, []);

  useEffect(() => {
    const hasStockIssues = cartData.some(
      (item) => item.quantity === 0 || -0 || item.cartQuantity > item.quantity
    );
    setCheckoutError(hasStockIssues);
  }, [cartData]);

  const handleAddressChange = async (selectedAddress: Address) => {
    const fullAddress = `${selectedAddress?.flatNo}, ${selectedAddress?.landMark}, ${selectedAddress?.address}, ${selectedAddress?.pincode}`;
    const coordinates = await getCoordinates(fullAddress);

    if (!coordinates) {
      message.error("Unable to find location coordinates. Please check the address.");
      return;
    }

    const withinRadius = await isWithinRadius(coordinates);
    console.log({ withinRadius });

    if (!withinRadius.isWithin) {
      Modal.error({
        title: "Delivery Unavailable",
        content: (
          <>
            <p>
              Sorry! We're unable to deliver to this address as it is{" "}
              {withinRadius.distanceInKm} km away, beyond our 20 km delivery radius. Please select
              another saved address within the radius or add a new one to proceed. We appreciate your
              understanding!
            </p>
            <div className="flex justify-end space-x-2 mt-4">
              <Button type="default" onClick={() => Modal.destroyAll()}>
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  Modal.destroyAll();
                  setIsAddressModalOpen(true);
                }}
              >
                Add New Address
              </Button>
            </div>
          </>
        ),
        footer: null,
      });

      const updatedWithinRadius = {
        ...withinRadius,
        isWithin: false,
      };

      return updatedWithinRadius;
    }
    setSelectedAddress(selectedAddress);
    return withinRadius;
  };

  const isCheckoutDisabled = (): boolean => {
    if (!cartData || cartData.length === 0) {
      return true;
    }

    const hasOutOfStockItems = cartData.some((item) => item.quantity === 0);
    if (hasOutOfStockItems) {
      return true;
    }

    const hasExceededStockItems = cartData.some((item) => {
      const quantity =
        item.status === "FREE" ? freeCartItems[item.itemId] || 0 : regularCartItems[item.itemId] || 0;
      return quantity > item.quantity;
    });
    if (hasExceededStockItems) {
      return true;
    }

    return false;
  };

  const removeOutOfStockItems = async () => {
    try {
      const outOfStockItems = cartData.filter((item) => item.quantity === 0);

      for (const item of outOfStockItems) {
        await removeCartItem(item);
      }

      message.success("Out-of-stock items removed successfully.");
      await fetchCartData();
    } catch (error) {
      console.error("Failed to remove out-of-stock items:", error);
      message.error("Failed to remove out-of-stock items");
      await fetchCartData();
    }
  };

  const handleConfirmReferrals = async () => {
    if (selectedPlans.includes("planB") && mobileNumbers.length === 0) {
      message.error("Please add at least one referral mobile number");
      return;
    }

    setIsReferralModalVisible(false);

    const eligibility = checkEligibilityForContainer(cartData);
    if (!eligibility.eligible || !eligibility.containerType) {
      message.error("Something went wrong. Please try again.");
      return;
    }

    const res = await updateContainerPreference(selectedPlans, mobileNumbers);
    if (res) {
      try {
        await axios.post(
          `${BASE_URL}/cart-service/cart/updateContainerStatus`,
          {
            customerId,
            status: "interested",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.error("Error updating container status:", error);
      }

      await addContainerToCart(eligibility.containerType as "HEAVY_BAG" | "LIGHT_BAG");
    }
  };

  const handlePlanOk = async () => {
  if (selectedPlan.length === 0) {
    Modal.confirm({
      title: "Decline Free Container?",
      content:
        "You haven't selected any plan. Are you sure you want to decline the free container offer?",
      okText: "Yes, Decline",
      cancelText: "Go Back",
      onOk: async () => {
        try {
          // Remove free container from cart using the specified API
          await removeContainerFromCart(); // Calls /api/cart-service/cart/removeFreeContainer

          message.info("Container offer declined and removed from cart");
          setIsPlanModalVisible(false);
        } catch (error) {
          console.error("Error declining container offer:", error);
          message.error("Failed to decline container offer");
        }
      },
    });
    return;
  }

  setIsPlanModalVisible(false);

  const eligibility = checkEligibilityForContainer(cartData);
  if (!eligibility.eligible || !eligibility.containerType) {
    message.error("Something went wrong. No eligible container found.");
    return;
  }

  if (selectedPlan.includes("planB")) {
    setMobileNumbers([]);
    setCurrentNumber("");
    setIsReferralModalVisible(true);
  } else {
    await handleInterested(selectedPlan);
  }
};

  const handlePlanCancel = async () => {
    Modal.confirm({
      title: "Decline Container Offer?",
      content:
        "Are you sure you want to decline the free container offer? You can always select this offer later from your cart.",
      okText: "Yes, Decline",
      cancelText: "Stay",
      onOk: async () => {
        try {
          await axios.post(
            `${BASE_URL}/cart-service/cart/updateContainerStatus`,
            {
              customerId,
              status: "declined",
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          // Remove free container from cart if it exists
          await removeContainerFromCart();

          message.info("Container offer declined");
        } catch (error) {
          console.error("Error declining container offer:", error);
          message.error("Failed to decline container offer");
        }

        setIsPlanModalVisible(false);
      },
      onCancel: () => {},
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Custom Styles for Hidden Scrollbar */}
      <style>
        {`
          .container-scroll-container::-webkit-scrollbar {
            display: none;
          }
          .container-scroll-container {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
        `}
      </style>

      <div className="flex-1 p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <main className="flex-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                </div>
              ) : !cartData || cartData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <h2 className="text-xl font-bold mb-4">Your cart is empty</h2>
                  <button
                    onClick={() => navigate("/main/dashboard/products")}
                    className=" bg-gradient-to-r from-purple-600 to-purple-400 text-white px-6 py-2 rounded-md hover:bg-purple-700"
                  >
                    Browse items
                  </button>
                </div>
              ) : (
                cartData.map((item) => (
                  <div
                    key={item.itemId}
                    className="border rounded-lg p-4 mb-4 flex flex-col md:flex-row w-full"
                  >
                    <div className="flex flex-1 mb-4 md:mb-0">
                      <div
                        className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 cursor-pointer shadow-sm"
                        onClick={() =>
                          navigate(`/main/itemsdisplay/${item.itemId}`, {
                            state: { item },
                          })
                        }
                      >
                        <img
                          src={item.image}
                          alt={item.itemName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="ml-4 flex flex-col justify-center">
                        {item.quantity < 6 && item.quantity > 0 && (
                          <p className="text-xs font-medium text-red-500 mb-1">
                            Only {item.quantity} {item.quantity === 1 ? "item" : "items"} left
                          </p>
                        )}
                        <h3 className="text-smc md:text-lg font-bold text-gray-800 mb-1 line-clamp-2">
                          {item.itemName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Weight: {item.weight} {item.units}
                        </p>
                        <div className="flex items-center mt-1">
                          <p className="text-sm line-through text-gray-400 mr-2">₹{item.priceMrp}</p>
                          <p className="text-green-600 font-bold">₹{item.itemPrice}</p>
                        </div>
                      </div>
                    </div>

                    {item.quantity !== 0 ? (
                      isFreeItem(item) ? (
                        <div className="flex flex-col md:items-end justify-center space-y-3 w-full md:w-auto">
                          <p className="text-green-600 font-bold text-base mb-2">FREE Item</p>
                          <div className="w-full flex justify-end">
                            <p className="text-green-600 font-semibold">Total: ₹0.00</p>
                          </div>

                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="bg-red-500 hover:bg-red-600 hover:shadow-md text-white px-3 py-1 rounded-md transition-all duration-200 text-sm flex items-center justify-center"
                            onClick={async () => {
                              await removeCartItem(item);
                            }}
                            aria-label="Delete item from cart"
                          >
                            <Trash2 size={14} className="mr-1" />
                            Remove
                          </motion.button>
                        </div>
                      ) : (
                        <div className="flex flex-col md:items-end justify-center space-y-3 w-full md:w-auto">
                          <div className="flex items-center justify-between md:justify-end w-full">
                            <div className="flex items-center justify-between bg-purple-50 rounded-lg p-1">
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-purple-600 hover:shadow-md transition-shadow"
                                onClick={() => handleDecrease(item)}
                                disabled={loadingItems[item.itemId]}
                                aria-label="Decrease quantity"
                              >
                                <span className="font-medium">-</span>
                              </motion.button>

                              <div className="px-4">
                                {loadingItems[item.itemId] ? (
                                  <Loader2 className="animate-spin text-purple-600" />
                                ) : (
                                  <span className="font-medium text-purple-700">
                                    {regularCartItems[item.itemId] || 0}
                                  </span>
                                )}
                              </div>

                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                className={`w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-purple-600 hover:shadow-md transition-shadow ${
                                  regularCartItems[item.itemId] >= item.quantity
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                onClick={() => {
                                  if (regularCartItems[item.itemId] < item.quantity) {
                                    handleIncrease(item);
                                  }
                                }}
                                disabled={
                                  regularCartItems[item.itemId] >= item.quantity ||
                                  loadingItems[item.itemId]
                                }
                                aria-label="Increase quantity"
                              >
                                <span className="font-medium">+</span>
                              </motion.button>
                            </div>

                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              className="ml-4 bg-red-500 hover:bg-red-600 hover:shadow-md text-white w-8 h-8 rounded-md transition-all duration-200 flex items-center justify-center"
                              onClick={async () => {
                                await removeCartItem(item);
                              }}
                              aria-label="Delete item from cart"
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          </div>

                          <div className="w-full flex justify-end">
                            <p className="text-purple-700 font-bold text-base">
                              Total: ₹
                              {(parseFloat(item.itemPrice) * (regularCartItems[item.itemId] || 0)).toFixed(
                                2
                              )}
                            </p>
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="flex flex-col md:items-end justify-center space-y-3 w-full md:w-auto">
                        <p className="text-red-600 font-bold text-base mb-2">Out of Stock</p>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          className="bg-red-500 hover:bg-red-600 hover:shadow-md text-white px-4 py-2 rounded-md transition-all duration-200 text-sm flex items-center justify-center"
                          onClick={async () => {
                            await removeCartItem(item);
                          }}
                          aria-label="Delete item from cart"
                        >
                          <Trash2 size={16} className="mr-1" />
                          Delete
                        </motion.button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </main>

          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border broder-black-500">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Delivery Address</h2>
                <button
                  onClick={() => setIsAddressModalOpen(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center gap-1"
                >
                  <span>+</span> Add
                </button>
              </div>
              {selectedAddress === null ? (
                <p>No addresses found.</p>
              ) : (
                <span className="flex justify-between mb-2 text-gray-700">
                  {selectedAddress.flatNo}, {selectedAddress.address}, {selectedAddress.landMark},{" "}
                  {selectedAddress.pincode}
                </span>
              )}
              <div className="mb-4">
                <label className="block font-bold text-gray-700  mb-1">Select Address</label>
                <select
                  value={selectedAddress?.address || ""}
                  onChange={(e) => {
                    const selected = addresses.find((addr) => addr.address === e.target.value);

                    if (selected) {
                      handleAddressChange(selected);
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Choose an Address</option>
                  {addresses.map((address, index) => (
                    <option key={index} value={address.address}>
                      {address.flatNo}, {address.address}, {address.landMark}, {address.pincode}
                    </option>
                  ))}
                </select>
              </div>
              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between mb-2 text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      ₹
                      {cartData
                        ?.filter((item) => item.status !== "FREE")
                        .reduce(
                          (acc, item) =>
                            acc + parseFloat(item.itemPrice) * (regularCartItems[item.itemId] || 0),
                          0
                        )
                        .toFixed(2) || "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2 text-gray-700">
                    <span>Shipping</span>
                    <span className="font-semibold">₹0.00</span>
                  </div>
                  <div className="flex justify-between mb-4 text-gray-800 font-bold text-lg">
                    <span>Total</span>
                    <span>
                      ₹
                      {cartData
                        ?.filter((item) => item.status !== "FREE")
                        .reduce(
                          (acc, item) =>
                            acc + parseFloat(item.itemPrice) * (regularCartItems[item.itemId] || 0),
                          0
                        )
                        .toFixed(2) || "0.00"}
                    </span>
                  </div>

                  {cartData?.some((item) => item.quantity === 0) && (
                    <div className="mb-3 p-3 bg-red-100 text-red-700 rounded">
                      <p className="font-semibold">Some items in your cart are out of stock:</p>
                      <ul className="ml-4 mt-1 list-disc">
                        {cartData
                          .filter((item) => item.quantity === 0)
                          .map((item) => (
                            <li key={item.itemId}>{item.itemName} is out of stock</li>
                          ))}
                      </ul>
                      <p className="mt-2 text-sm">
                        Please remove these items to proceed with checkout.
                      </p>
                      <button
                        onClick={removeOutOfStockItems}
                        className="mt-2 w-full bg-red-600 text-white text-sm py-1 px-3 rounded"
                      >
                        Remove all out-of-stock items
                      </button>
                    </div>
                  )}

                  {cartData?.some((item) => item.cartQuantity > item.quantity && item.quantity > 0) && (
                    <div className="mb-3 p-3 bg-yellow-100 text-yellow-700 rounded">
                      <p className="font-semibold">Quantity adjustments needed:</p>
                      <ul className="ml-4 mt-1 list-disc">
                        {cartData
                          .filter((item) => item.cartQuantity > item.quantity && item.quantity > 0)
                          .map((item) => (
                            <li key={item.itemId}>
                              {item.itemName} - Only {item.quantity} in stock (you have{" "}
                              {item.cartQuantity})
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}

                  <button
                    className={`w-full py-3 px-6 rounded-lg transition ${
                      isCheckoutDisabled()
                        ? "bg-gray-400 cursor-not-allowed"
                        : " bg-gradient-to-r from-purple-700 to-purple-500 hover:bg-purple-800 text-white"
                    }`}
                    onClick={() => handleToProcess()}
                    disabled={isCheckoutDisabled()}
                  >
                    {isCheckoutDisabled() ? "Cannot Checkout - Stock Issues" : "Proceed to Checkout"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {isAddressModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">
                    {editingAddressId ? "Edit Address" : "Add New Address"}
                  </h2>
                  <button
                    onClick={handleAddressModalClose}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Flat/House No"
                    value={addressFormData.flatNo}
                    onChange={(e) =>
                      setAddressFormData((prev) => ({
                        ...prev,
                        flatNo: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {addressFormErrors.flatNo && (
                    <p className="text-red-500 text-sm">{addressFormErrors.flatNo}</p>
                  )}

                  <input
                    type="text"
                    placeholder="Landmark"
                    value={addressFormData.landMark}
                    onChange={(e) =>
                      setAddressFormData((prev) => ({
                        ...prev,
                        landMark: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {addressFormErrors.landmark && (
                    <p className="text-red-500 text-sm">{addressFormErrors.landmark}</p>
                  )}

                  <input
                    type="text"
                    placeholder="Address"
                    value={addressFormData.address}
                    onChange={(e) =>
                      setAddressFormData((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {addressFormErrors.address && (
                    <p className="text-red-500 text-sm">{addressFormErrors.address}</p>
                  )}

                  <input
                    type="text"
                    placeholder="PIN Code"
                    value={addressFormData.pincode}
                    onChange={(e) =>
                      setAddressFormData((prev) => ({
                        ...prev,
                        pincode: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {addressFormErrors.pincode && (
                    <p className="text-red-500 text-sm">{addressFormErrors.pincode}</p>
                  )}

                  <select
                    value={addressFormData.addressType}
                    onChange={(e) =>
                      setAddressFormData((prev) => ({
                        ...prev,
                        addressType: e.target.value as "Home" | "Work" | "Others",
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={handleAddressModalClose}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddressSubmit}
                    className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
                  >
                    {editingAddressId ? "Update Address" : "Save Address"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {isReferralModalVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Refer Friends</h2>
                  <button
                    onClick={() => setIsReferralModalVisible(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Add mobile numbers of friends you want to refer. They'll receive a special offer and
                  you'll get rewards!
                </p>

                <div className="mb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter mobile number"
                      value={currentNumber}
                      onChange={(e) => {
                        const input = e.target.value.replace(/\D/g, "");
                        if (input.length <= 10) {
                          setCurrentNumber(input);
                        }
                      }}
                      maxLength={10}
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      onClick={handleAddNumber}
                      className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {mobileNumbers.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold mb-2">Added numbers:</p>
                    <div className="flex flex-wrap gap-2">
                      {mobileNumbers.map((number, index) => (
                        <div
                          key={number}
                          className="flex items-center bg-purple-50 px-3 py-1 rounded-md"
                        >
                          <span className="text-sm text-gray-700">{number}</span>
                          <button
                            onClick={() => handleRemoveNumber(index)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-4 mt-4">
                  <button
                    onClick={() => setIsReferralModalVisible(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmReferrals}
                    disabled={mobileNumbers.length === 0}
                    className={`px-4 py-2 rounded-md ${
                      mobileNumbers.length === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-purple-500 text-white hover:bg-purple-600"
                    }`}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <Modal
          title="🎁 Special Offer: Free Rice Container!"
          open={isPlanModalVisible}
          onOk={handlePlanOk}
          onCancel={handlePlanCancel}
          okText={selectedPlan.length === 0 ? "Decline Offer" : "Continue"}
          cancelText="Cancel"
          centered
          width="90%"
          style={{ maxWidth: "600px" }}
          bodyStyle={{ maxHeight: "60vh", padding: "16px" }}
        >
          <div className="container-scroll-container" style={{ maxHeight: "50vh", overflowY: "auto" }}>
            <div className="text-center text-gray-800">
              <p className="text-lg font-medium mt-1">
                Your cart includes a rice bag that qualifies for a <strong>FREE rice container</strong>!
              </p>
              <p className="text-sm text-gray-600 italic">
                (Note: Container remains Oxy Group asset until ownership is earned.)
              </p>

              <div className="mt-4 text-left">
                <h3 className="text-md font-semibold mb-2">📋 How to Earn Ownership:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Option 1:</strong> Buy 9 bags of rice in 3 years
                  </li>
                  <li>
                    <strong>Option 2:</strong> Refer 9 friends who make purchases
                  </li>
                  <li>
                    <strong>Important:</strong> If you don't meet these conditions within 90 days, we'll
                    collect the container back
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-md font-semibold mb-2">Select an option to continue:</h3>
                <div className="space-y-3">
                  <div
                    className={`p-4 border rounded-lg cursor-pointer ${
                      selectedPlan.includes("planA") ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() =>
                      setSelectedPlan(
                        selectedPlan.includes("planA")
                          ? selectedPlan.filter((p) => p !== "planA")
                          : [...selectedPlan.filter((p) => p !== "planB"), "planA"]
                      )
                    }
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedPlan.includes("planA")}
                        onChange={() => {}}
                        className="mr-3"
                      />
                      <div>
                        <h4 className="font-medium">Standard Plan</h4>
                        <p className="text-sm text-gray-600">
                          Get container now, earn ownership by purchasing 9 bags
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 border rounded-lg cursor-pointer ${
                      selectedPlan.includes("planB") ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() =>
                      setSelectedPlan(
                        selectedPlan.includes("planB")
                          ? selectedPlan.filter((p) => p !== "planB")
                          : [...selectedPlan.filter((p) => p !== "planA"), "planB"]
                      )
                    }
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedPlan.includes("planB")}
                        onChange={() => {}}
                        className="mr-3"
                      />
                      <div>
                        <h4 className="font-medium">Referral Plan</h4>
                        <p className="text-sm text-gray-600">
                          Refer friends to earn ownership faster + get ₹50 cashback
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 italic mt-2">
                    Note: If you don't select any plan and click "Decline Offer", you won't receive the
                    free container.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;