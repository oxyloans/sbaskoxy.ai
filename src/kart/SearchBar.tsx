import React, { useEffect, useState, useCallback, useRef } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://meta.oxyglobal.tech/api";

interface SearchItem {
  itemId: string;
  itemName: string;
  itemMrp: number;
  units: string;
  itemImage: string;
  weight: number;
  saveAmount: number;
  itemDescription: string;
  savePercentage: number;
  itemPrice: number;
  quantity: number;
  categoryName: string;
}

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [allItems, setAllItems] = useState<SearchItem[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${BASE_URL}/product-service/showGroupItemsForCustomrs`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        // Flatten the nested structure: categoryType > categories > itemsResponseDtoList
        const items = response.data.flatMap((group: any) =>
          group.categories.flatMap((category: any) =>
            category.itemsResponseDtoList.map((item: any) => ({
              ...item,
              categoryName: category.categoryName,
            }))
          )
        );
        setAllItems(items);
        setIsDataLoaded(true);
      } catch (error) {
        console.error("Error fetching items:", error);
        setAllItems([]);
        setIsDataLoaded(true);
      }
    };

    fetchAllItems();
  }, []);

  const searchProducts = useCallback(
    (query: string) => {
      if (!query.trim() || !isDataLoaded || allItems.length === 0) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      const searchLower = query.toLowerCase();
      const isNumericQuery = !isNaN(Number(query)); // Check if query is a number
      const numericQuery = isNumericQuery ? Number(query) : null;

      const filteredItems = allItems.filter((item: SearchItem) => {
        const weightStr = `${item.weight}`.toLowerCase();
        const nameLower = item.itemName.toLowerCase();
        const categoryLower = item.categoryName.toLowerCase();

        // Match by name or category (string-based)
        const matchesNameOrCategory =
          nameLower.includes(searchLower) || categoryLower.includes(searchLower);

        // Match by weight (numeric or string-based)
        let matchesWeight = false;
        if (isNumericQuery && numericQuery !== null) {
          matchesWeight = item.weight === numericQuery; // Exact numeric match
        } else {
          matchesWeight = weightStr.includes(searchLower); // String match for "5 kg", etc.
        }

        return matchesNameOrCategory || matchesWeight;
      });

      console.log(`Query: "${query}", Results:`, filteredItems.length);
      setSearchResults(filteredItems.slice(0, 10));
      setIsSearching(false);
    },
    [allItems, isDataLoaded]
  );

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  
    if (searchValue.trim().length >= 1 && isDataLoaded) {
      debounceRef.current = setTimeout(() => {
        searchProducts(searchValue);
      }, 50); // Reduced debounce time for faster response
    } else {
      setSearchResults([]);
    }
  
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchValue, searchProducts, isDataLoaded]);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      // Ensure the latest search results are available by triggering search immediately
      searchProducts(searchValue);
      // Small delay to ensure searchResults is updated before navigation
      setTimeout(() => {
        navigate("search-main", { state: { searchResults: searchResults } });
        setSearchValue("");
        setIsFocused(false);
      }, 150); // Slightly longer than debounce to ensure results are ready
    }
  };

  const handleItemClick = (item: SearchItem) => {
    const mappedItem = {
      itemId: item.itemId,
      itemName: item.itemName,
      itemImage: item.itemImage,
      itemDescription: item.itemDescription,
      itemMrp: item.itemMrp,
      priceMrp: item.itemMrp,
      weight: item.weight.toString(),
      itemUrl: item.itemImage,
      itemPrice: item.itemPrice,
      itemWeight: item.weight,
      weightUnit: item.units,
      units: item.units,
      category: item.categoryName,
      image: item.itemImage,
      quantity: item.quantity,
    };

    navigate(`/main/itemsdisplay/${item.itemId}`, {
      state: { item: mappedItem },
    });
    setSearchValue("");
    setIsFocused(false);
  };

  return (
    <form onSubmit={handleSearchSubmit} className="relative w-full">
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 300)}
        className="w-full pl-4 pr-12 py-2 border-2 border-gray-200 rounded-full text-sm focus:ring-2 focus:ring-purple-500"
        placeholder="Search by name, category, or weight..."
        aria-label="Search"
      />
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center">
        {searchValue && (
          <button
            type="button"
            onClick={() => setSearchValue("")}
            className="p-1 text-gray-400 hover:text-red-500"
          >
            <FaTimes className="text-base" />
          </button>
        )}
        <button
          type="submit"
          className="ml-2 text-gray-400 hover:text-purple-500"
        >
          <FaSearch className="text-base" />
        </button>
      </div>
      {isFocused && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {!isDataLoaded ? (
            <p className="text-gray-500 text-sm p-2">Loading items...</p>
          ) : isSearching ? (
            <p className="text-gray-500 text-sm p-2">Searching...</p>
          ) : searchResults.length > 0 ? (
            searchResults.map((item) => (
              <div
                key={item.itemId}
                onClick={() => handleItemClick(item)}
                onMouseDown={(e) => e.preventDefault()}
                className="w-full text-left p-2 hover:bg-gray-100 cursor-pointer"
              >
                <div className="flex justify-between">
                  <span>{item.itemName}</span>
                  <span className="text-gray-500 text-sm">
                    {item.categoryName} - {item.weight} {item.units}
                  </span>
                </div>
              </div>
            ))
          ) : searchValue.length >= 1 ? (
            <p className="text-gray-500 text-sm p-2">No results found</p>
          ) : (
            <p className="text-gray-500 text-sm p-2">Type to search...</p>
          )}
        </div>
      )}
    </form>
  );
};

export default SearchBar;