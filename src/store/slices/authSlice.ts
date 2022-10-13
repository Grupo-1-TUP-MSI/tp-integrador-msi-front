import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { login, LoginRequest, LoginResponse } from '@app/api/auth.api';
import { deleteToken, deleteUser, persistRole, persistToken, readToken } from '@app/services/localStorage.service';

export interface AuthSlice {
  token: string | null;
}

const initialState: AuthSlice = {
  token: readToken(),
};

export const doLogin = createAsyncThunk('auth/doLogin', async (loginPayload: LoginRequest) =>
  login(loginPayload).then((res: LoginResponse) => {
    persistToken(res.token);
    persistRole(res.role);

    return res.token;
  }),
);

export const doLogout = createAsyncThunk('auth/doLogout', (payload) => {
  deleteToken();
  deleteUser();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(doLogin.fulfilled, (state, action) => {
      state.token = action.payload;
    });
    builder.addCase(doLogout.fulfilled, (state) => {
      state.token = '';
    });
  },
});

export default authSlice.reducer;
