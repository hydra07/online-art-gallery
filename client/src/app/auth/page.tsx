// 'use client';
// import { Button } from '@/components/ui/button';
// import { signIn, signOut } from 'next-auth/react';

import AuthForm from './components/auth-form';

// function Signin() {
//   const handleGoogleLogin = async () => {
//     await signIn('google');
//   };
//   const handlePhoneLogin = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     const phone = (event.target as any).phone.value;
//     const password = (event.target as any).password.value;
//     const name = (event.target as any).name.value;
//     await signIn('phone', { phone, password, name });
//   };
//   const handleSignOut = async () => {
//     await signOut();
//   };
//   return (
//     <div className="p-8">
//       <h1>Signin</h1>
//       <form className="flex flex-col space-y-4" onSubmit={handlePhoneLogin}>
//         <input
//           type="text"
//           name="phone"
//           placeholder="Phone"
//           autoComplete="off"
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           autoComplete="off"
//         />
//         <input type="text" name="name" placeholder="Name" autoComplete="off" />
//         <Button type="submit">Đăng nhập</Button>
//       </form>
//       <br />
//       <Button onClick={handleGoogleLogin}>Đăng nhập với Google</Button>
//       <Button onClick={handleSignOut}>SignOut</Button>
//     </div>
//   );
// }

// export default Signin;
async function AuthPage() {
	return (
		<>
			<AuthForm />
		</>
	);
}

export default AuthPage;
