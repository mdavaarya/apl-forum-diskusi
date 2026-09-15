import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllUsers } from '../../utils/api';

const asyncPopulateUsers = createAsyncThunk(
  'users/populateUsers',
  async () => {
    const users = await getAllUsers();
    return users;
  },
);

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(asyncPopulateUsers.fulfilled, (state, action) => action.payload);
  },
});

export { asyncPopulateUsers };
export default usersSlice.reducer;
