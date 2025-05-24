import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Save a user to recent searches
  const saveToRecentSearches = (user) => {
    const updatedSearches = [
      user,
      ...recentSearches.filter((item) => item._id !== user._id),
    ].slice(0, 5); // Keep only the 5 most recent searches

    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  // Clear all recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  // Remove a specific recent search
  const removeRecentSearch = (userId) => {
    const updatedSearches = recentSearches.filter(
      (user) => user._id !== userId
    );
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };
  // Search for users when query changes
  useEffect(() => {
    const searchUsers = async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        setLoading(true);
        // Add timestamp to prevent caching issues
        const timestamp = new Date().getTime();
        const res = await axios.get(
          `http://localhost:5000/api/v1/user/search?q=${query}&_t=${timestamp}`,
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

  // Render a user card (used for both search results and recent searches)
  const UserCard = ({ user, isRecent = false }) => (
    <div className="relative">
      <Link
        to={`/profile/${user._id}`}
        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg"
        onClick={() => saveToRecentSearches(user)}
      >
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.profilePicture} alt={user.username} />
          <AvatarFallback>
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{user.username}</span>
          {user.bio && (
            <span className="text-xs text-gray-500 truncate max-w-[300px]">
              {user.bio}
            </span>
          )}
        </div>
      </Link>

      {isRecent && (
        <button
          onClick={() => removeRecentSearch(user._id)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700"
        >
          ✕
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto my-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Search</h1>

      {/* Search input */}
      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-3 text-gray-400" size={20} />
        <Input
          type="text"
          placeholder="Search for users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 py-6"
        />
      </div>

      {/* Search results */}
      <div className="mt-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          </div>
        ) : query ? (
          <div>
            <h2 className="text-lg font-semibold mb-2">Search Results</h2>
            {searchResults.length > 0 ? (
              <div className="border rounded-lg">
                {searchResults.map((user) => (
                  <UserCard key={user._id} user={user} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No users found</p>
            )}
          </div>
        ) : recentSearches.length > 0 ? (
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Recent Searches</h2>
              <button
                onClick={clearRecentSearches}
                className="text-sm text-blue-500 hover:text-blue-700"
              >
                Clear all
              </button>
            </div>
            <div className="border rounded-lg">
              {recentSearches.map((user) => (
                <UserCard key={user._id} user={user} isRecent={true} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p>Search for users by username or bio</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
