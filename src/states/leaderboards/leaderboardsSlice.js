import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLeaderboards } from '../../utils/api';

const asyncPopulateLeaderboards = createAsyncThunk(
  'leaderboards/populate',
  async () => {
    const leaderboards = await getLeaderboards();
    return leaderboards;
  },
);

const leaderboardsSlice = createSlice({
  name: 'leaderboards',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(asyncPopulateLeaderboards.fulfilled, (state, action) => action.payload);
  },
});

export { asyncPopulateLeaderboards };
export default leaderboardsSlice.reducer;
