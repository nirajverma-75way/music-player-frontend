import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Grid,
} from "@mui/material";
import UserCard from "../../component/userCard";
import { useGetUsersQuery } from "../../services/user.api";
import { useDispatch, useSelector } from "react-redux";
import UserSkeleton from "../../component/userSkeleton";

// Define the interface for a user
interface User {
  id: number;
  name: string;
  username: string;
  followers: number;
  following: number;
  isFollowing: boolean;
}

const User: React.FC = () => {
  // Sample data for users
  
  const dispatch = useDispatch();

  const { data: users, error, isLoading, refetch } = useGetUsersQuery(undefined);
    console.log(users.data)
if(isLoading){
   return <UserSkeleton />
}
  return (
    <Box sx={{ padding: 4 }}>
      <Box>
        {users?.data.map((user) => (
          <UserCard user={user} key={user._id} />
        ))}
      </Box>
    </Box>
  );
};

export default User;
