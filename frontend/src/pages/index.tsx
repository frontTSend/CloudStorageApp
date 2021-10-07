import { useState } from 'react';
import type { NextPage } from 'next'
import Head from 'next/head'
import { Layout } from '@/components/templates';
import { auth } from '@/utils/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useDispatch, useSelector } from '@/hooks';
import { setSignInState } from '@/stores/user';

const Home: NextPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  const signUp = async () => {
    if (!email || !password) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user;

      if (user) {
        dispatch(setSignInState({
          uid: user.uid,
          email,
          isSignIn: true
        }))
      }

    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Layout>
      <div>
        <p>{user.email}</p>
        <p>{user.isSignIn ? 'sign in' : 'sign out'}</p>

        <input
          placeholder="email"
          type="text" value={email}
          onChange={e => { setEmail(e.target.value) }}
        />
      </div>
      <div>
        <input
          placeholder="password"
          type="text" value={password}
          onChange={e => { setPassword(e.target.value) }}
        />
      </div>
      <button
        type="button"
        onClick={signUp}
      >
        submit
      </button>
    </Layout>
  )
}

export default Home
