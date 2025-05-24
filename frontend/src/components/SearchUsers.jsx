import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const SearchUsers = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchUsers = async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/v1/user/search?q=${query}`,
          { withCredentials: true }
        );
        if (res.data.success) {
          setSearchResults(res.data.users);
        }
      } catch (error) {
        console.error("Search error:", error);
        toast.error("Error searching for users");
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(() => {
      if (query.trim()) {
        searchUsers();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const toggleSearch = () => {
    setIsSearching(!isSearching);
    if (!isSearching) {
      setQuery("");
      setSearchResults([]);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {isSearching ? (
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2 w-full">
            <Input
              type="text"
              placeholder="Search users..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-none focus-visible:ring-0 bg-transparent flex-1"
            />
            <X
              onClick={toggleSearch}
              className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-800"
            />
          </div>
        ) : (
          <div
            onClick={toggleSearch}
            className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100"
          >
            <Search className="h-5 w-5" />
            <span>Search</span>
          </div>
        )}
      </div>

      {isSearching && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-md rounded-lg mt-2 z-10 max-h-80 overflow-y-auto">
          {searchResults.map((user) => (
            <Link
              to={`/profile/${user._id}`}
              key={user._id}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
              onClick={toggleSearch}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.profilePicture} alt={user.username} />
                <AvatarFallback>
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">{user.username}</span>
                {user.bio && (
                  <span className="text-xs text-gray-500 truncate max-w-[200px]">
                    {user.bio}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {isSearching && query && searchResults.length === 0 && !loading && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-md rounded-lg mt-2 p-3 text-center text-gray-500">
          No users found
        </div>
      )}
    </div>
  );
};

export default SearchUsers;
