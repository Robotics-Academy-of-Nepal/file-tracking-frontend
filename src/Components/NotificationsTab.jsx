import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdOutlineStar } from "react-icons/md";

const NotificationsTab = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotification();
  }, []);

  const fetchNotification = async () => {
    if (!baseUrl) {
      console.error("Base URL is not defined");
      return;
    }
    try {
      const response = await fetch(`${baseUrl}/notification/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch notifications");
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleNotificationClick = async (notification) => {
    console.log("Notification clicked:", notification);

    if (!notification.related_file || !notification.related_file.id) {
      console.error("Related file ID not found");
      return;
    }

    const fileId = notification.related_file.id;
    console.log("Related file ID:", fileId);

    try {
      // First, mark the notification as read
      const response = await fetch(
        `${baseUrl}/notification/${notification.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${token}`,
          },
          body: JSON.stringify({ is_read: true }),
        }
      );

      if (!response.ok) {
        console.error("Failed to update notification status:", response.status);
        throw new Error("Failed to update notification status");
      }

      // Update the UI to show the notification as read
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) =>
          n.id === notification.id ? { ...n, is_read: true } : n
        )
      );

      // Navigate to file details page
      console.log(`Navigating to: /file-details/${fileId}/`);
      navigate(`/file-details/${fileId}/`);
    } catch (error) {
      console.error("Error in handleNotificationClick:", error);
    }
  };

  const toggleStarred = async (notification, e) => {
    e.stopPropagation(); // Prevent triggering the parent click event

    try {
      const updatedStarredStatus = !notification.is_starred;

      const response = await fetch(
        `${baseUrl}/notification/${notification.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${token}`,
          },
          body: JSON.stringify({ is_starred: updatedStarredStatus }),
        }
      );

      if (!response.ok)
        throw new Error("Failed to update starred notification");

      setNotifications((prevNotifications) =>
        prevNotifications.map((n) =>
          n.id === notification.id
            ? { ...n, is_starred: updatedStarredStatus }
            : n
        )
      );
    } catch (error) {
      console.error("Error updating starred status:", error);
    }
  };

  const getUserColor = (username) => {
    // Create a simple hash from the user's name
    const name = `${username || ""}`;
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    // List of colors to choose from
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-orange-500",
      "bg-cyan-500",
    ];

    // Use the hash to select a color
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const getInitials = (username) => {
    if (username && username.length > 0) {
      return username[0].toUpperCase(); // Return the first character of the username as the initials
    }
    return "";
  };

  // Sort notifications by date (newest first)
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  return (
    <>
      <h2 className="text-lg font-normal border-b border-gray-200 text-gray-800">
        <p className="px-6 pt-2 mt-2">सूचना</p>
      </h2>
      {sortedNotifications.length > 0 ? (
        <ul className="list-none">
          {sortedNotifications.map((notification) => {
            const username =
              notification?.related_file?.present_by?.username || "N/A";
            const userColor = getUserColor(username);
            const initials = getInitials(username);

            return (
              <li
                key={notification.id}
                className={`p-3 px-6 py-6 hover:bg-[#e8e6e6] cursor-pointer border bg-white mb-3 rounded-md border-gray-100 shadow list-none text-nowrap items-center
                  ${
                    notification.is_read
                      ? "bg-white"
                      : "bg-[#F8F8F8] font-semibold"
                  }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex justify-between items-center border-gray-300 text-nowrap">
                  <div className="flex items-center justify-around gap-6">
                    <div>
                      <span className="relative">
                        <button
                          onClick={(e) => toggleStarred(notification, e)}
                        >
                          <MdOutlineStar
                            className={`text-xl ${
                              notification.is_starred
                                ? "text-yellow-500"
                                : "text-gray-400"
                            } hover:text-orange-300`}
                          />
                        </button>
                      </span>
                    </div>
                    <div className="flex gap-20 items-center justify-around">
                      <div className="flex items-center gap-3 justify-around">
                        <div
                          className={`w-8 h-8 rounded-full ${userColor} flex items-center justify-center text-white font-medium`}
                        >
                          {initials}
                        </div>
                        <h3>
                          {notification?.related_file?.present_by?.first_name}{" "}
                          {notification?.related_file?.present_by?.last_name}
                        </h3>
                      </div>
                      <div className="flex gap-20 items-center justify-around">
                        <h3>{notification?.related_file?.file_number ?? "N/A"}</h3>
                        <h3>{notification?.related_file?.subject ?? "N/A"}</h3>
                      </div>
                    </div>
                  </div>
                  <div>
                    {new Date(notification.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="mt-2 text-gray-600 text-sm">
                  {notification.message}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-md p-4 border-b border-gray-200 text-gray-900">
          No new notifications
        </p>
      )}
    </>
  );
};

export default NotificationsTab;
