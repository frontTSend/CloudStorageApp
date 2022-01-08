import type { UserStoreType } from '@/types/UserStoreType';
import type { ApiUserType } from '@/types/ApiUserType';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { auth } from '@/utils/aws';
import { createAxiosInstance } from '@/utils';

export const signIn = createAsyncThunk<UserStoreType, { username: string, password: string }>(
  'user/signin',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      await auth.signin(username, password);
      const user = await auth.getUser();

      if (!user) throw new Error();

      const axiosInstance = await createAxiosInstance();
      const res = await axiosInstance.post<ApiUserType>(`/user`, { name: ''});

      const { name, plan, storage} = res.data;

      return {
        isSignIn: true,
        email: username,
        name,
        plan,
        storage
      };
    } catch (e) {
      return rejectWithValue({
        errorMessage: 'ログインに失敗しました'
      })
    }
  }
);

export const guestSignIn = createAsyncThunk<UserStoreType>(
  'user/guestSignin',
  async (_, { rejectWithValue }) => {
    try {
      await auth.signin(process.env.NEXT_PUBLIC_GUEST_EMAIL ?? '', process.env.NEXT_PUBLIC_GUEST_PASSWORD ?? '');
      const user = await auth.getUser();

      if (!user) throw new Error();

      const axiosInstance = await createAxiosInstance();
      const res = await axiosInstance.post<ApiUserType>(`/user`, { name: ''});

      const { name, plan, storage} = res.data;

      return {
        isSignIn: true,
        email: '__guest__',
        name,
        plan,
        storage
      };
    } catch (e) {
      return rejectWithValue({
        errorMessage: 'ログインに失敗しました'
      })
    }
  }
);

export const checkAuth = createAsyncThunk<UserStoreType>(
  'user/check',
  async (_, { rejectWithValue }) => {
    try {
      const user = await auth.getUser();

      if (!user) throw new Error();

      const axiosInstance = await createAxiosInstance();
      const res = await axiosInstance.post<ApiUserType>(`/user`, { name: ''});

      const { name, plan, storage} = res.data;

      const { email } = await auth.getCognitoUserAttributes(user);

      return {
        isSignIn: true,
        email,
        name,
        plan,
        storage,
      }
    } catch (e) {
      return rejectWithValue({
        errorMessage: '認証していません'
      })
    }
  }
)

export const signOut = createAsyncThunk<boolean>(
  'user/signout',
  async (_, { rejectWithValue }) => {
    try {
      const res = await auth.signout();

      if (!res) throw new Error();

      return true;
    } catch (e) {
      return rejectWithValue({
        errorMessage: 'ログアウトに失敗しました'
      })
    }
  }
);